"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  BookOpenIcon,
  Maximize2Icon,
  Minimize2Icon,
  FlameIcon,
  ClockIcon,
  MinusIcon,
  PlusIcon
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';
import {
  useTimer,
  MODE_CONFIGS,
  TimerMode,
  MIN_SESSION_MINUTES,
  MAX_SESSION_MINUTES,
} from '@/context/TimerContext';

interface CourseOption {
  id: string;
  name: string;
  course_code: string;
}

const PRESET_MODES: TimerMode[] = ['pomodoro', 'deep_work', 'marathon'];
const STEP_MINUTES = 5;

function TimerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isLoaded } = useSession();
  const supabase = useMemo(() => createBrowserClient(session), [session]);

  const {
    mode,
    timeLeft,
    isRunning,
    selectedCourseId,
    customMinutes,
    sessionMinutes,
    todayStudyMinutes,
    todaySessionsCount,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setSelectedCourseId,
    setCustomMinutes,
  } = useTimer();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const appliedParamsRef = useRef<string | null>(null);

  // Apply the params QuickStart arrives with once, then clear them from the URL.
  // Without this the mode would be forced back every render, making the other modes look disabled.
  useEffect(() => {
    const paramsKey = searchParams.toString();

    if (!paramsKey) {
      appliedParamsRef.current = null;
      return;
    }
    if (appliedParamsRef.current === paramsKey) return;
    appliedParamsRef.current = paramsKey;

    const courseIdParam = searchParams.get('courseId');
    const durationParam = searchParams.get('duration');

    if (courseIdParam && selectedCourseId !== courseIdParam) {
      setSelectedCourseId(courseIdParam);
    }

    if (durationParam) {
      const targetMins = parseInt(durationParam, 10);
      const matchingPreset = PRESET_MODES.find(
        (m) => MODE_CONFIGS[m].defaultMinutes === targetMins
      );

      if (matchingPreset) {
        if (matchingPreset !== mode) switchMode(matchingPreset);
      } else if (!Number.isNaN(targetMins)) {
        // Any other length arrives as a custom session
        if (mode !== 'custom') switchMode('custom');
        setCustomMinutes(targetMins);
      }
    }

    router.replace('/dashboard/study-timer', { scroll: false });
  }, [searchParams, router, selectedCourseId, mode, setSelectedCourseId, switchMode, setCustomMinutes]);

  // Fetch courses list
  useEffect(() => {
    if (!isLoaded || !session?.user?.id) return;
    const loadCourses = async () => {
      const { data } = await supabase.from('courses').select('id, name, course_code');
      if (data) setCourses(data);
    };
    loadCourses();
  }, [isLoaded, session, supabase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = sessionMinutes * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-neutral-900 text-white flex flex-col items-center justify-center overflow-y-auto p-4 sm:p-6' : 'space-y-6'}`}>

      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl">Study <span className="text-[#3399FF]">Timer</span></h1>
            <p className="text-sm text-[#6C7278] mt-1">
              Track pomodoro intervals and log study time directly to your courses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <ClockIcon className="w-4 h-4 text-[#3399FF]" />
              <span className="text-xs font-semibold text-[#3E3A72]">{todayStudyMinutes}m Today</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <FlameIcon className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold text-[#3E3A72]">{todaySessionsCount} Sessions</span>
            </div>
          </div>
        </div>
      )}

      <div className={`mx-auto w-full max-w-xl bg-white border border-neutral-200 rounded-2xl p-5 pt-14 sm:p-8 shadow-sm flex flex-col items-center relative ${isFullscreen ? 'bg-neutral-800 border-neutral-700 text-white' : ''}`}>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute top-4 right-4 p-2 text-[#8F98A3] hover:text-[#6C7278] cursor-pointer rounded-lg transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Pomodoro'}
        >
          {isFullscreen ? <Minimize2Icon className="w-5 h-5" /> : <Maximize2Icon className="w-5 h-5" />}
        </button>

        <div className="flex flex-wrap items-center justify-center p-1 bg-neutral-100 rounded-xl mb-5 gap-1">
          {([...PRESET_MODES, 'custom'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                mode === m
                  ? 'bg-white text-[#3E3A72] shadow-sm'
                  : 'text-[#6C7278] hover:text-[#3E3A72]'
              }`}
            >
              {MODE_CONFIGS[m].label}
              {m !== 'custom' && (
                <span className="hidden sm:inline font-medium text-[#8F98A3]"> · {MODE_CONFIGS[m].defaultMinutes}m</span>
              )}
            </button>
          ))}
        </div>

        {/* Session length, only for the custom mode; presets keep their fixed lengths */}
        {mode === 'custom' && (
          <div className="w-full max-w-xs mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#6C7278]">Your session length</span>
              <span className="text-[11px] text-[#8F98A3]">
                {isRunning ? 'Pause to adjust' : `${MIN_SESSION_MINUTES}–${MAX_SESSION_MINUTES} min`}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-neutral-50 border border-neutral-200 rounded-lg p-1.5">
              <button
                type="button"
                onClick={() => setCustomMinutes(customMinutes - STEP_MINUTES)}
                disabled={isRunning || customMinutes <= MIN_SESSION_MINUTES}
                className="p-2 rounded-lg text-[#6C7278] hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition"
                title={`${STEP_MINUTES} minutes shorter`}
              >
                <MinusIcon className="w-4 h-4" />
              </button>

              <label className="flex items-baseline gap-1">
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN_SESSION_MINUTES}
                  max={MAX_SESSION_MINUTES}
                  value={customMinutes}
                  disabled={isRunning}
                  onChange={(e) => {
                    const next = parseInt(e.target.value, 10);
                    if (!Number.isNaN(next)) setCustomMinutes(next);
                  }}
                  className="w-12 bg-transparent text-center text-lg font-semibold text-[#3E3A72] focus:outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-xs font-medium text-[#8F98A3]">min</span>
              </label>

              <button
                type="button"
                onClick={() => setCustomMinutes(customMinutes + STEP_MINUTES)}
                disabled={isRunning || customMinutes >= MAX_SESSION_MINUTES}
                className="p-2 rounded-lg text-[#6C7278] hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition"
                title={`${STEP_MINUTES} minutes longer`}
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-5 w-full max-w-xs">
          <div className="relative">
            <BookOpenIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F98A3]" />
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-[#3E3A72] focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
            >
              <option value="">-- Tag a Course (Optional) --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_code} - {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-2 sm:my-4">
          <svg viewBox="0 0 256 256" className="w-52 h-52 sm:w-64 sm:h-64 transform -rotate-90">
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
            <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8F98A3] mt-2 text-center">
              {MODE_CONFIGS[mode].label} · {sessionMinutes}m
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className="flex items-center gap-2 shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] text-white px-6 sm:px-8 py-2.5 rounded-[8px] font-medium hover:opacity-90 transition cursor-pointer"
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
            className="p-3 bg-neutral-100 text-[#6C7278] hover:bg-neutral-200 rounded-xl transition cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcwIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudyTimer() {
  return (
    <Suspense fallback={<div className="p-6 text-[#8F98A3]">Loading study timer...</div>}>
      <TimerContent />
    </Suspense>
  );
}
