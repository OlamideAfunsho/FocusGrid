"use client";

import React, { useEffect, useMemo, useState } from 'react'
import { ListTodoIcon, TimerIcon, CheckCircle2Icon, BookCopyIcon } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';

const page = () => {
  const { session, isLoaded } = useSession();
  const supabase = useMemo(() => createBrowserClient(session), [isLoaded]);

  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    activeTasksCount: 0,
    studyHours: '0',
    completedSessions: 0,
    coursesCount: 0
  });

  useEffect(() => {
    if (!isLoaded || !session?.user?.id) return;

    const fetchDashboardStats = async () => {
      setLoading(true);

      const [tasksRes, sessionsRes, coursesRes] = await Promise.all([
        supabase.from('tasks').select('id').eq('user_id', session.user.id).eq('is_completed', false),
        supabase.from('study_sessions').select('duration_minutes').eq('user_id', session.user.id),
        supabase.from('courses').select('id', { count: 'exact', head: true })
      ]);

      const activeTasksCount = tasksRes.data?.length || 0;
      const totalMinutes = (sessionsRes.data || []).reduce(
        (acc, curr) => acc + (curr.duration_minutes || 0),
        0
      );
      const studyHours = (totalMinutes / 60).toFixed(1);
      const completedSessions = sessionsRes.data?.length ?? 0;
      const coursesCount = coursesRes.count ?? 0;

      setStatsData({
        activeTasksCount,
        studyHours,
        completedSessions,
        coursesCount
      });


      setLoading(false);
    }; 

    fetchDashboardStats();

  }, [isLoaded, session, supabase]);
  


  const stats = [
    {
      title: 'Active tasks',
      value: loading ? '...' : `${statsData.activeTasksCount}`,
      icon: ListTodoIcon
    },
    {
      title: 'Study Hours',
      value: loading ? '...' : `${statsData.studyHours}hrs`,
      icon: TimerIcon
    },
    {
      title: 'Completed Sessions',
      value: loading ? '...' : `${statsData.completedSessions}`,
      icon: CheckCircle2Icon
    },
    {
      title: 'Courses',
      value: loading ? '...' : `${statsData.coursesCount}`,
      icon: BookCopyIcon

    }
  ]

  return (
    <>
    <div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        {stats.map((stat, index) => {
          return (
            <div 
              key={index}
              className="flex flex-col rounded-[8px] lg:rounded-[12px] p-4 w-full shadow-[0_0_40px_5px_rgba(0,0,0,0.1)]"
            >
              <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#3399FF] bg-[#EFF6FF] p-2 rounded-[6px] mb-4" />
              <h1 className="font-semibold text-2xl sm:text-4xl mb-1">{stat.value}</h1>
              <span className="text-[#8F98A3] font-light lg:font-medium text-[12px] sm:text-base">{stat.title}</span>
            </div>
          );
        })}
      </div>

    </div>
    </>
  )
}

export default page