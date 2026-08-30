"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlayIcon, PauseIcon, Maximize2Icon } from 'lucide-react';
import { useTimer, MODE_CONFIGS } from '@/context/TimerContext';

export default function FloatingTimer() {
  const pathname = usePathname();
  const { isRunning, timeLeft, mode, startTimer, pauseTimer } = useTimer();

  // Hide component if timer is inactive or if the user is already on the timer page
  if (!isRunning || pathname === '/dashboard/study-timer') {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#EEF2FF] text-white backdrop-blur-md px-4 py-3 rounded-2xl  animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Timer Display */}
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-[#000] uppercase tracking-wider">
          {MODE_CONFIGS[mode].label}
        </span>
        <span className="text-xl font-mono font-bold text-[#000] tracking-tight">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="h-8 w-[1px] bg-neutral-800 mx-1" />

      {/* Quick Play/Pause Control */}
      <button
        onClick={isRunning ? pauseTimer : startTimer}
        className="p-2 bg-[#3864F5] hover:bg-blue-600 text-white rounded-xl transition"
        title={isRunning ? "Pause Timer" : "Start Timer"}
      >
        {isRunning ? (
          <PauseIcon className="w-4 h-4 fill-current" />
        ) : (
          <PlayIcon className="w-4 h-4 fill-current animate-pulse" />
        )}
      </button>

      {/* Expand/Return to Full Page */}
      <Link
        href="/dashboard/study-timer"
        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl transition"
        title="Open Full Timer"
      >
        <Maximize2Icon className="w-4 h-4" />
      </Link>
    </div>
  );
}