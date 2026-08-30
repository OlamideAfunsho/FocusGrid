"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  PlayIcon, 
  PauseIcon, 
  RotateCcwIcon, 
  BookOpenIcon, 
  Maximize2Icon, 
  Minimize2Icon, 
  FlameIcon,
  ClockIcon
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';
import { useTimer, MODE_CONFIGS, TimerMode } from '@/context/TimerContext';

interface CourseOption {
  id: string;
  name: string;
  course_code: string;
}

function TimerContent() {
  const searchParams = useSearchParams();
  const { session, isLoaded } = useSession();
  const supabase = useMemo(() => createBrowserClient(session), [session]);

  const {
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
  } = useTimer();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  // Sync incoming URL params if passed from QuickStart
  useEffect(() => {
    const courseIdParam = searchParams.get('courseId');
    if (courseIdParam && !selectedCourseId) {
      setSelectedCourseId(courseIdParam);
    }
  }, [searchParams, selectedCourseId, setSelectedCourseId]);

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

  const totalSeconds = MODE_CONFIGS[mode].defaultMinutes * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-neutral-900 text-white flex flex-col items-center justify-center p-6' : 'space-y-6'}`}>
      
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl">Study <span className="text-[#3399FF]">Timer</span></h1>
            <p className="text-sm text-neutral-500 mt-1">
              Track pomodoro intervals and log study time directly to your courses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <ClockIcon className="w-4 h-4 text-[#3399FF]" />
              <span className="text-xs font-semibold text-neutral-700">{todayPomodoroMinutes}m Today</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <FlameIcon className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold text-neutral-700">{completedSessionsCount} Sessions</span>
            </div>
          </div>
        </div>
      )}

      <div className={`mx-auto w-full max-w-xl bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center relative ${isFullscreen ? 'bg-neutral-800 border-neutral-700 text-white' : ''}`}>
        
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 rounded-lg transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Pomodoro'}
        >
          {isFullscreen ? <Minimize2Icon className="w-5 h-5" /> : <Maximize2Icon className="w-5 h-5" />}
        </button>

        <div className="flex items-center p-1 bg-neutral-100 rounded-xl mb-6 gap-1">
          {(['pomodoro', 'deep_work', 'marathon'] as TimerMode[]).map((m) => (
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

        <div className="mb-6 w-full max-w-xs">
          <div className="relative">
            <BookOpenIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
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

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
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

export default function StudyTimer() {
  return (
    <Suspense fallback={<div className="p-6 text-neutral-400">Loading study timer...</div>}>
      <TimerContent />
    </Suspense>
  );
}