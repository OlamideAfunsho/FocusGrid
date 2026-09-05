"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { BookOpenIcon, PieChartIcon } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';

interface CourseDistribution {
  id: string;
  courseCode: string;
  name: string;
  minutes: number;
  percentage: number;
  color: string;
}

// Preset color palette for course identification
const COURSE_COLORS = [
  '#3399FF', // Primary Brand Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
];

const FocusDistribution = () => {
  const { session, isLoaded } = useSession();
  const supabase = useMemo(() => createBrowserClient(session), [session]);

  const [distribution, setDistribution] = useState<CourseDistribution[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !session?.user?.id) return;

    const fetchDistributionData = async () => {
      setIsLoading(true);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // 1. Fetch sessions completed in the last 7 days with a tagged course
      const { data: sessions, error: sessionsErr } = await supabase
        .from('study_sessions')
        .select('duration_minutes, course_id')
        .eq('user_id', session.user.id)
        .gte('completed_at', sevenDaysAgo.toISOString())
        .not('course_id', 'is', null);

      if (sessionsErr || !sessions) {
        setIsLoading(false);
        return;
      }

      // 2. Aggregate total minutes per course
      const minuteMap: Record<string, number> = {};
      let grandTotal = 0;

      sessions.forEach(s => {
        if (s.course_id) {
          minuteMap[s.course_id] = (minuteMap[s.course_id] || 0) + s.duration_minutes;
          grandTotal += s.duration_minutes;
        }
      });

      setTotalMinutes(grandTotal);

      if (grandTotal === 0 || Object.keys(minuteMap).length === 0) {
        setDistribution([]);
        setIsLoading(false);
        return;
      }

      // 3. Fetch course details for mapped course IDs
      const courseIds = Object.keys(minuteMap);
      const { data: courses } = await supabase
        .from('courses')
        .select('id, name, course_code')
        .in('id', courseIds);

      if (courses) {
        const formattedData: CourseDistribution[] = courses.map((course, idx) => {
          const mins = minuteMap[course.id] || 0;
          return {
            id: course.id,
            courseCode: course.course_code,
            name: course.name,
            minutes: mins,
            percentage: Math.round((mins / grandTotal) * 100),
            color: COURSE_COLORS[idx % COURSE_COLORS.length],
          };
        }).sort((a, b) => b.minutes - a.minutes);

        setDistribution(formattedData);
      }

      setIsLoading(false);
    };

    fetchDistributionData();
  }, [isLoaded, session, supabase]);

  // Calculate SVG Donut stroke offsets
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const formatHours = (mins: number) => {
    const hrs = (mins / 60).toFixed(1);
    return `${hrs}h`;
  };

  return (
    <div className="rounded-[8px] p-3 lg:p-6 shadow-[0_0_40px_5px_rgba(0,0,0,0.1)] flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-[#3399FF] rounded-xl">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#3E3A72]">Focus Distribution</h3>
            <p className="text-xs text-[#6C7278]">Time split per course (Last 7 Days)</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 text-[#6C7278] rounded-lg">
          {formatHours(totalMinutes)} Total
        </span>
      </div>

      {/* Content State Handling */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-12 text-xs text-[#6C7278]">
          Calculating course metrics...
        </div>
      ) : distribution.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <BookOpenIcon className="w-10 h-10 text-neutral-300 mb-2" />
          <p className="text-xs font-medium text-[#6C7278]">No tagged study time yet</p>
          <p className="text-[11px] text-[#8F98A3] max-w-[200px] mt-1">
            Tag your timer sessions to a course to see your focus distribution.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-4 flex-1">
          {/* Donut Visual */}
          <div className="sm:col-span-5 flex items-center justify-center relative">
            <svg className="w-44 h-44 transform -rotate-90">
              {/* Background Ring */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="#F3F4F6"
                strokeWidth="16"
                fill="transparent"
              />
              {/* Segmented Rings */}
              {distribution.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += item.percentage;

                return (
                  <circle
                    key={item.id}
                    cx="88"
                    cy="88"
                    r={radius}
                    stroke={item.color}
                    strokeWidth="16"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700 ease-out"
                    fill="transparent"
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-xl font-bold text-[#3E3A72] font-mono">
                {distribution[0]?.percentage || 0}%
              </span>
              <span className="text-[10px] font-semibold text-[#8F98A3] uppercase tracking-wider">
                Top Focus
              </span>
            </div>
          </div>

          {/* Legend & List Breakdown */}
          <div className="sm:col-span-7 space-y-3">
            {distribution.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate max-w-[170px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="truncate">
                    <p className="font-semibold text-neutral-800 leading-tight truncate">
                      {item.courseCode}
                    </p>
                    <p className="text-[10px] text-[#8F98A3] truncate">{item.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[#8F98A3] text-[11px]">
                    {formatHours(item.minutes)}
                  </span>
                  <span className="font-semibold text-[#8F98A3] w-8 text-right font-mono">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FocusDistribution