"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  RotateCcwIcon, 
  BookOpenIcon, 
  Maximize2Icon, 
  Minimize2Icon, 
  CheckCircle2Icon,
  FlameIcon,
  ClockIcon
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';

type TimerMode = 'focus' | 'short_break' | 'long_break';

interface CourseOption {
  id: string;
  name: string;
  course_code: string;
}

const MODE_CONFIGS: Record<TimerMode, { label: string; defaultMinutes: number }> = {
  focus: { label: 'Focus Session', defaultMinutes: 25 },
  short_break: { label: 'Short Break', defaultMinutes: 5 },
  long_break: { label: 'Long Break', defaultMinutes: 15 },
};

export default function TimerPage() {
  const { session, isLoaded } = useSession();
  const supabase = useMemo(() => createBrowserClient(session), [session]);

  // Timer & Control State
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Data State
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(0);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch courses and today's session stats
  useEffect(() => {
    if (!isLoaded || !session?.user?.id) return;

    const loadData = async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [coursesRes, sessionsRes] = await Promise.all([
        supabase.from('courses').select('id, name, course_code'),
        supabase
          .from('study_sessions')
          .select('duration_minutes, session_type')
          .eq('user_id', session.user.id)
          .gte('completed_at', todayStart.toISOString())
      ]);

      if (coursesRes.data) setCourses(coursesRes.data);
      if (sessionsRes.data) {
        const focusSessions = sessionsRes.data.filter(s => s.session_type === 'focus');
        const totalMins = focusSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
        setTodayFocusMinutes(totalMins);
        setCompletedSessionsCount(focusSessions.length);
      }
    };

    loadData();
  }, [isLoaded, session, supabase]);

  // Audio trigger using Web Audio API
  const playCompletionSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  };

  // Log session to Supabase
  const logCompletedSession = async () => {
    if (!session?.user?.id) return;
    const duration = MODE_CONFIGS[mode].defaultMinutes;

    await supabase.from('study_sessions').insert({
      user_id: session.user.id,
      course_id: selectedCourseId || null,
      duration_minutes: duration,
      session_type: mode
    });

    if (mode === 'focus') {
      setTodayFocusMinutes(prev => prev + duration);
      setCompletedSessionsCount(prev => prev + 1);
    }
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playCompletionSound();
            logCompletedSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedCourseId, session]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_CONFIGS[newMode].defaultMinutes * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIGS[mode].defaultMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = MODE_CONFIGS[mode].defaultMinutes * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-neutral-900 text-white flex flex-col items-center justify-center p-6' : 'space-y-6'}`}>
      
      {/* Header & Stats Bar */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl">Study <span className="text-[#3399FF]">Timer</span></h1>
            <p className="text-sm text-neutral-500 mt-1">
              Track focus intervals and log study time directly to your courses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <ClockIcon className="w-4 h-4 text-[#3399FF]" />
              <span className="text-xs font-semibold text-neutral-700">{todayFocusMinutes}m Today</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <FlameIcon className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold text-neutral-700">{completedSessionsCount} Sessions</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Timer Container */}
      <div className={`mx-auto w-full max-w-xl bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center relative ${isFullscreen ? 'bg-neutral-800 border-neutral-700 text-white' : ''}`}>
        
        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 rounded-lg transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Focus'}
        >
          {isFullscreen ? <Minimize2Icon className="w-5 h-5" /> : <Maximize2Icon className="w-5 h-5" />}
        </button>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-neutral-100 rounded-xl mb-6 gap-1">
          {(['focus', 'short_break', 'long_break'] as TimerMode[]).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === m 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {MODE_CONFIGS[m].label}
            </button>
          ))}
        </div>

        {/* Course Assignment Dropdown */}
        {mode === 'focus' && (
          <div className="mb-6 w-full max-w-xs">
            <div className="relative">
              <BookOpenIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
              >
                <option value="">-- Tag a Course (Optional) --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.course_code} - {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Circular Progress Display */}
        <div className="relative flex items-center justify-center my-4">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="8"
              className="text-neutral-100"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              className="text-[#3399FF] transition-all duration-1000 ease-linear"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-mono font-bold tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mt-2">
              {MODE_CONFIGS[mode].label}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] text-white px-8 py-2.5 rounded-[8px] font-medium hover:opacity-90 transition cursor-pointer"
          >
            {isRunning ? (
              <>
                <PauseIcon className="w-5 h-5 fill-current" /> Pause
              </>
            ) : (
              <>
                <PlayIcon className="w-5 h-5 fill-current" /> Start
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-xl transition"
            title="Reset Timer"
          >
            <RotateCcwIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}