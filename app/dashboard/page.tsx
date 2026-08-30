import React from 'react';
import { ListTodoIcon, TimerIcon, CheckCircle2Icon, BookCopyIcon } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getWeeklyStudyFocus } from '@/lib/supabase/queries';
import WeeklyStudyCharts from './components/WeeklyStudyCharts';
import QuickStartTimer from './components/QuickStartTimer';
import FocusDistribution from './components/FocusDistribution';
import UrgentTasks from './components/UrgentTasks';
// import TopPriorityTasks from './components/TopPriorityTasks';

export default async function DashboardPage() {
  // 1. Get authenticated user ID (async in Clerk v5)
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  //2. Fetch all dashboard data concurrently on the server
  const [weeklyData, tasksRes, sessionsRes, coursesRes, activeCoursesList] = await Promise.all([
    getWeeklyStudyFocus(userId),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_completed', false),
    supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', userId),
    supabase
      .from('courses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('courses')
      .select('id, name')
      .eq('user_id', userId)
      .order('name', { ascending: true }),
  ]);

  // 3. Aggregate stats metrics
  const activeTasksCount = tasksRes.count ?? 0;
  const totalMinutes = (sessionsRes.data || []).reduce(
    (acc, curr) => acc + (curr.duration_minutes || 0),
    0
  );
  const studyHours = (totalMinutes / 60).toFixed(1);
  const completedSessions = sessionsRes.data?.length ?? 0;
  const coursesCount = coursesRes.count ?? 0;

  const courses = activeCoursesList.data || [];

  const stats = [
    {
      title: 'Active tasks',
      value: `${activeTasksCount}`,
      icon: ListTodoIcon,
    },
    {
      title: 'Study Hours',
      value: `${studyHours}hrs`,
      icon: TimerIcon,
    },
    {
      title: 'Completed Sessions',
      value: `${completedSessions}`,
      icon: CheckCircle2Icon,
    },
    {
      title: 'Courses',
      value: `${coursesCount}`,
      icon: BookCopyIcon,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="flex flex-col rounded-[8px] lg:rounded-[12px] p-4 w-full shadow-[0_0_40px_5px_rgba(0,0,0,0.1)]"
          >
            <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#3399FF] bg-[#EFF6FF] p-2 rounded-[6px] mb-4" />
            <h1 className="font-semibold text-2xl sm:text-4xl mb-1">{stat.value}</h1>
            <span className="text-[#8F98A3] font-light lg:font-medium text-[12px] sm:text-base">{stat.title}</span>
          </div>
        ))}
      </div>

      {/* Weekly Study Focus Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <QuickStartTimer courses={courses} />
        </div>

        <div className="lg:col-span-2 mt-6 lg:mt-0 ml-0 lg:ml-6">
          <UrgentTasks />
        </div>

        {/* <TopPriorityTasks /> */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:col-span-3 mt-6">
          <div className='lg:col-span-2'>
            <WeeklyStudyCharts data={weeklyData} />
          </div>
          <FocusDistribution />
        </div>
      </div>
    </div>
  );
}