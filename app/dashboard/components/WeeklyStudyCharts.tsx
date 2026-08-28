"use client";


import React from 'react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DailyStudyTime } from "@/lib/supabase/queries";

interface WeeklyStudyChartsProps {
  data: DailyStudyTime[];
}

const WeeklyStudyCharts = ({ data }: WeeklyStudyChartsProps) => {
  return (
    <>
    <div className="w-full rounded-[8px] p-5 shadow-[0_0_40px_5px_rgba(0,0,0,0.1)]">
      <div className="mb-4">
        <h3 className="text-base font-semibold ">
          Study Analytics
        </h3>
        <p className="text-xs text-slate-400">
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
              tick={{ fill: "#000", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#000", fontSize: 12 }}
              unit="h"
            />
            <Tooltip
              cursor={{ fill: "#EFF6FF" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg shadow-[0_0_40px_5px_rgba(0,0,0,0.1)] p-2.5">
                      <p className="text-xs font-medium">
                        {payload[0].payload.day}
                      </p>
                      <p className="text-sm font-bold text-[#3399FF]">
                        {payload[0].value} hrs
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