"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';

export type TimerMode = 'pomodoro' | 'deep_work' | 'marathon' | 'custom';

export const MODE_CONFIGS: Record<TimerMode, { label: string; defaultMinutes: number }> = {
  pomodoro: { label: 'Pomodoro', defaultMinutes: 25 },
  deep_work: { label: 'Deep Work', defaultMinutes: 45 },
  marathon: { label: 'Marathon', defaultMinutes: 60 },
  custom: { label: 'Custom', defaultMinutes: 30 },
};

export const MIN_SESSION_MINUTES = 1;
export const MAX_SESSION_MINUTES = 180;

// Whole minutes inside the allowed range, or null when the value is unusable
const clampMinutes = (value: unknown): number | null => {
  const minutes = Math.round(Number(value));
  if (!Number.isFinite(minutes)) return null;
  return Math.min(MAX_SESSION_MINUTES, Math.max(MIN_SESSION_MINUTES, minutes));
};

// Presets keep their fixed lengths; only the custom mode uses the user's own value
const minutesForMode = (timerMode: TimerMode, customMinutes: number) =>
  timerMode === 'custom' ? customMinutes : MODE_CONFIGS[timerMode].defaultMinutes;

interface TimerContextType {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  selectedCourseId: string;
  customMinutes: number;
  sessionMinutes: number;
  todayStudyMinutes: number;
  todaySessionsCount: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchMode: (newMode: TimerMode) => void;
  setSelectedCourseId: (courseId: string) => void;
  setCustomMinutes: (minutes: number) => void;
}

// A finished session waiting to be saved (the Clerk session may not be ready yet)
interface PendingSession {
  mode: TimerMode;
  courseId: string;
  minutes: number;
  completedAt: number;
}

const STORAGE_KEY = 'focusgrid_timer_state';

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const supabase = useMemo(() => createBrowserClient(session), [session]);

  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [customMinutes, setCustomMinutesState] = useState(MODE_CONFIGS.custom.defaultMinutes);
  const [timeLeft, setTimeLeft] = useState(MODE_CONFIGS.pomodoro.defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);
  const [todaySessionsCount, setTodaySessionsCount] = useState(0);
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  // The countdown interval only restarts on start/stop, so it reads current values from here
  const latestRef = useRef({ mode, selectedCourseId, customMinutes });
  useEffect(() => {
    latestRef.current = { mode, selectedCourseId, customMinutes };
  }, [mode, selectedCourseId, customMinutes]);

  // 1. Hydrate state from localStorage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const savedMode: TimerMode = parsed.mode in MODE_CONFIGS ? parsed.mode : 'pomodoro';
      const savedCustom = clampMinutes(parsed.customMinutes) ?? MODE_CONFIGS.custom.defaultMinutes;

      setMode(savedMode);
      setSelectedCourseId(parsed.selectedCourseId || '');
      setCustomMinutesState(savedCustom);

      if (parsed.isRunning && parsed.endTime) {
        const remaining = Math.max(0, Math.ceil((parsed.endTime - Date.now()) / 1000));
        if (remaining > 0) {
          setTimeLeft(remaining);
          setEndTime(parsed.endTime);
          setIsRunning(true);
        } else {
          // Timer finished while user was away: save it once the session is available
          setTimeLeft(0);
          setIsRunning(false);
          setPendingSession({
            mode: savedMode,
            courseId: parsed.selectedCourseId || '',
            minutes: clampMinutes(parsed.sessionMinutes) ?? minutesForMode(savedMode, savedCustom),
            completedAt: parsed.endTime,
          });
        }
      } else {
        setTimeLeft(parsed.timeLeft ?? minutesForMode(savedMode, savedCustom) * 60);
        setIsRunning(false);
      }
    } catch (e) {
      console.error('Failed to parse saved timer state', e);
    }
  }, []);

  // 2. Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode,
        timeLeft,
        isRunning,
        endTime,
        selectedCourseId,
        customMinutes,
        // The length of the session currently running, so a finish while away is logged correctly
        sessionMinutes: minutesForMode(mode, customMinutes),
      })
    );
  }, [mode, timeLeft, isRunning, endTime, selectedCourseId, customMinutes]);

  // Audio trigger
  const playCompletionSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  };

  // Today's totals from Supabase, so they survive page reloads
  const fetchTodayStats = useCallback(async () => {
    if (!session?.user?.id) return null;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', session.user.id)
      .gte('completed_at', startOfToday.toISOString());

    if (error) {
      console.error("Failed to load today's study sessions:", error);
      return null;
    }

    return {
      minutes: data.reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
      count: data.length,
    };
  }, [session, supabase]);

  useEffect(() => {
    fetchTodayStats().then((stats) => {
      if (!stats) return;
      setTodayStudyMinutes(stats.minutes);
      setTodaySessionsCount(stats.count);
    });
  }, [fetchTodayStats]);

  // Log finished sessions to Supabase
  useEffect(() => {
    if (!pendingSession || !session?.user?.id || isSavingRef.current) return;
    isSavingRef.current = true;
    const userId = session.user.id;

    const saveSession = async () => {
      const { error } = await supabase.from('study_sessions').insert({
        user_id: userId,
        course_id: pendingSession.courseId || null,
        duration_minutes: pendingSession.minutes,
        session_type: pendingSession.mode,
        completed_at: new Date(pendingSession.completedAt).toISOString(),
      });

      if (error) {
        console.error('Failed to save study session:', error);
      } else {
        const stats = await fetchTodayStats();
        if (stats) {
          setTodayStudyMinutes(stats.minutes);
          setTodaySessionsCount(stats.count);
        }
      }

      isSavingRef.current = false;
      setPendingSession(null);
    };

    saveSession();
  }, [pendingSession, session, supabase, fetchTodayStats]);

  // 3. Countdown loop using delta calculation
  useEffect(() => {
    if (isRunning && endTime) {
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          setEndTime(null);
          playCompletionSound();
          setPendingSession({
            mode: latestRef.current.mode,
            courseId: latestRef.current.selectedCourseId,
            minutes: minutesForMode(latestRef.current.mode, latestRef.current.customMinutes),
            completedAt: Date.now(),
          });
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, endTime]);

  const startTimer = () => {
    // A finished timer (00:00) starts a fresh session instead of completing again instantly
    const seconds = timeLeft > 0 ? timeLeft : minutesForMode(mode, customMinutes) * 60;
    setTimeLeft(seconds);
    setEndTime(Date.now() + seconds * 1000);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setEndTime(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setEndTime(null);
    setTimeLeft(minutesForMode(mode, customMinutes) * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    if (isRunning) {
      const confirmed = window.confirm(
        `A ${MODE_CONFIGS[mode].label} timer is currently running. Switching modes will reset your current session. Do you want to proceed?`
      );
      if (!confirmed) return; // Stop if user cancels
    }

    setIsRunning(false);
    setEndTime(null);
    setMode(newMode);
    setTimeLeft(minutesForMode(newMode, customMinutes) * 60);
  };

  // Only the custom mode's length is editable; a running timer is left alone
  const setCustomMinutes = (minutes: number) => {
    const clamped = clampMinutes(minutes);
    if (!clamped || clamped === customMinutes) return;

    setCustomMinutesState(clamped);

    if (!isRunning && mode === 'custom') {
      setTimeLeft(clamped * 60);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        mode,
        timeLeft,
        isRunning,
        selectedCourseId,
        customMinutes,
        sessionMinutes: minutesForMode(mode, customMinutes),
        todayStudyMinutes,
        todaySessionsCount,
        startTimer,
        pauseTimer,
        resetTimer,
        switchMode,
        setSelectedCourseId,
        setCustomMinutes,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
