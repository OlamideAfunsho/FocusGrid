"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayIcon, FlameIcon, ClockIcon, BookOpenIcon } from "lucide-react";

interface CourseOption {
  id: string;
  name: string;
}

interface QuickStartTimerProps {
  courses: CourseOption[];
}

const PRESETS = [
  { label: "25m", minutes: 25, tag: "Pomodoro" },
  { label: "45m", minutes: 45, tag: "Deep Work" },
  { label: "60m", minutes: 60, tag: "Marathon" },
];

const QuickStartTimer = ({ courses }: QuickStartTimerProps) => {
  const router = useRouter();
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const handleStartSession = () => {
        const params = new URLSearchParams({
            duration: selectedMinutes.toString(),
            ...(selectedCourseId && { courseId: selectedCourseId }),
        });
        router.push(`/dashboard/study-timer?${params.toString()}`);
  };

  return (
    <div className="flex flex-col justify-between rounded-[8px] p-5 bg-[#3399FF] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]" >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <FlameIcon className="w-4 h-4 text-amber-400" /> Quick Start Focus
            </h3>
            <p className="text-xs text-white mt-0.5">
              Launch a timed session directly from your dashboard
            </p>
          </div>
        </div>

        {/* Duration Presets */}
        <div className="mb-5">
          <label className="text-xs font-medium text-white mb-2 block flex items-center gap-1.5">
            <ClockIcon className="w-3.5 h-3.5" /> Target Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.minutes}
                type="button"
                onClick={() => setSelectedMinutes(preset.minutes)}
                className={`flex flex-col items-center justify-center rounded-[8px] p-3 transition-all ${
                  selectedMinutes === preset.minutes
                    ? " bg-white text-[#3399FF] shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : " bg-slate-800/40 text-white hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <span className="text-lg font-bold">{preset.label}</span>
                <span className="text-[10px] opacity-75">{preset.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Course Select Dropdown */}
        <div className="mb-5">
          <label className="text-xs font-medium text-white mb-2 block flex items-center gap-1.5">
            <BookOpenIcon className="w-3.5 h-3.5" /> Select Course (Optional)
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full rounded-[8px] bg-slate-800/60 p-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-white"
          >
            <option value="">General Focus (No course tagged)</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Start Action Button */}
      <button
        type="button"
        onClick={handleStartSession}
        className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-white py-3 text-sm font-semibold text-[#3399FF] transition-all hover:bg-[#3399FF] hover:text-white active:scale-[0.99] shadow-md shadow-indigo-600/20"
      >
        <PlayIcon className="w-4 h-4 fill-current" /> Start {selectedMinutes}-Min Session
      </button>
    </div>
  );
}

export default QuickStartTimer