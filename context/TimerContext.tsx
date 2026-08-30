"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';

export type TimerMode = 'pomodoro' | 'deep_work' | 'marathon';

export const MODE_CONFIGS: Record<TimerMode, { label: string; defaultMinutes: number }> = {
  pomodoro: { label: 'Pomodoro', defaultMinutes: 25 },
  deep_work: { label: 'Deep Work', defaultMinutes: 45 },
  marathon: { label: 'Marathon', defaultMinutes: 60 },
};

interface TimerContextType {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  selectedCourseId: string;
  todayPomodoroMinutes: number;
  completedSessionsCount: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchMode: (newMode: TimerMode) => void;
  setSelectedCourseId: (courseId: string) => void;
}

const STORAGE_KEY = 'focusgrid_timer_state';

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoaded } = useSession();
  const supabase = useMemo(() => createBrowserClient(session), [session]);

  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  const [todayPomodoroMinutes, setTodayPomodoroMinutes] = useState(0);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Hydrate state from localStorage on initial mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setMode(parsed.mode || 'pomodoro');
      setSelectedCourseId(parsed.selectedCourseId || '');

      if (parsed.isRunning && parsed.endTime) {
        const remaining = Math.max(0, Math.ceil((parsed.endTime - Date.now()) / 1000));
        if (remaining > 0) {
          setTimeLeft(remaining);
          setEndTime(parsed.endTime);
          setIsRunning(true);
        } else {
          // Timer finished while user was away
          setTimeLeft(0);
          setIsRunning(false);
        }
      } else {
        setTimeLeft(parsed.timeLeft ?? MODE_CONFIGS[parsed.mode as TimerMode]?.defaultMinutes * 60);
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
      })
    );
  }, [mode, timeLeft, isRunning, endTime, selectedCourseId]);

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

  // Log session to Supabase
  const logCompletedSession = async () => {
    if (!session?.user?.id) return;
    const duration = MODE_CONFIGS[mode].defaultMinutes;

    await supabase.from('study_sessions').insert({
      user_id: session.user.id,
      course_id: selectedCourseId || null,
      duration_minutes: duration,
      session_type: mode,
    });

    if (mode === 'pomodoro') {
      setTodayPomodoroMinutes((prev) => prev + duration);
      setCompletedSessionsCount((prev) => prev + 1);
    }
  };

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
          logCompletedSession();
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
    const targetEndTime = Date.now() + timeLeft * 1000;
    setEndTime(targetEndTime);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setEndTime(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setEndTime(null);
    setTimeLeft(MODE_CONFIGS[mode].defaultMinutes * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setEndTime(null);
    setMode(newMode);
    setTimeLeft(MODE_CONFIGS[newMode].defaultMinutes * 60);
  };

  return (
    <TimerContext.Provider
      value={{
        mode,
        timeLeft,
        isRunning,
        selectedCourseId,
        todayPomodoroMinutes,
        completedSessionsCount,
        startTimer,
        pauseTimer,
        resetTimer,
        switchMode,
        setSelectedCourseId,
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