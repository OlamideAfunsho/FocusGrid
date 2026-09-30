"use client";


import React, { useMemo } from 'react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { StudySessionRow } from "@/lib/supabase/queries";

interface WeeklyStudyChartsProps {
  sessions: StudySessionRow[];
}

interface DailyStudyTime {
  day: string;
  hours: number;
  minutes: number;
  isToday: boolean;
}

// Whole-hour gridlines that stay put, so a short session shows against a familiar
// scale instead of rescaling the axis to fractions of an hour
const BASE_AXIS_HOURS = 4;
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatDuration = (minutes: number) => {
  if (minutes <= 0) return "No study time";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
};

const WeeklyStudyCharts = ({ sessions }: WeeklyStudyChartsProps) => {
  // Grouped here rather than on the server, so "Today" matches the student's own clock
  const data = useMemo<DailyStudyTime[]>(() => {
    const today = new Date();
    const completions = sessions.map((session) => ({
      date: new Date(session.completed_at),
      minutes: session.duration_minutes || 0,
    }));

    // Oldest day first, ending with today
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - index));

      const minutes = completions.reduce(
        (sum, completion) => (isSameDay(completion.date, day) ? sum + completion.minutes : sum),
        0
      );

      const todayColumn = isSameDay(day, today);
      return {
        day: todayColumn ? "Today" : DAY_LABELS[day.getDay()],
        minutes,
        hours: Number((minutes / 60).toFixed(2)),
        isToday: todayColumn,
      };
    });
  }, [sessions]);

  const maxHours = data.reduce((max, day) => Math.max(max, day.hours), 0);
  const axisMax = Math.max(BASE_AXIS_HOURS, Math.ceil(maxHours));
  const step = axisMax > 8 ? 2 : 1;
  const ticks = Array.from({ length: Math.floor(axisMax / step) + 1 }, (_, i) => i * step);

  return (
    <>
    <div className="w-full rounded-[8px] p-5 shadow-[0_0_40px_5px_rgba(0,0,0,0.1)]">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[#3E3A72]">
          Study Analytics
        </h3>
        <p className="text-xs text-[#6C7278]">
          Your productive insights for this week
        </p>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#3399FF"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fill: "#000", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#000", fontSize: 12 }}
              domain={[0, axisMax]}
              ticks={ticks}
              allowDecimals={false}
              unit="h"
            />
            <Tooltip
              cursor={{ fill: "#EFF6FF" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const day = payload[0].payload as DailyStudyTime;
                  return (
                    <div className="rounded-lg bg-white shadow-[0_0_40px_5px_rgba(0,0,0,0.1)] p-2.5">
                      <p className="text-xs font-medium">
                        {day.day}
                      </p>
                      <p className="text-sm font-bold text-[#3399FF]">
                        {formatDuration(day.minutes)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="hours"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </>
  )
}

export default WeeklyStudyCharts
