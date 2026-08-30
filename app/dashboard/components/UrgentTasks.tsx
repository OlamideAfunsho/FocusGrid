"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2Icon, 
  CircleIcon, 
  AlertTriangleIcon, 
  ClockIcon, 
  ArrowRightIcon,
  CheckSquareIcon
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';

interface UrgentTask {
  id: string;
  title: string;
  due_date: string | null;
  priority: 'high' | 'medium' | 'low';
  is_completed: boolean;
  course_id: string | null;
  courses: {
    course_code: string;
  } | null;
}

const PRIORITY_STYLES: Record<UrgentTask['priority'], string> = {
  high: 'bg-red-50 text-red-600 border-red-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low: 'bg-neutral-100 text-neutral-600 border-neutral-200',
};

export default function UrgentTasks() {
  const { session, isLoaded } = useSession();
  const supabase = useMemo(() => createBrowserClient(session), [session]);

  const [tasks, setTasks] = useState<UrgentTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !session?.user?.id) return;

    const fetchUrgentTasks = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          task_title,
          due_date,
          is_completed,
          course_id,
          courses:tasks_course_id_fkey (
            course_code
          )
        `)
        .eq('user_id', session.user.id)
        .eq('is_completed', false)
        .order('due_date', { ascending: true, nullsFirst: false })
        .limit(5);

      if (error) {
        console.error("Supabase Query Error:", error.message, error.details);
      } else if (data) {
        setTasks(data as unknown as UrgentTask[]);
      }

      setIsLoading(false);
    };

    fetchUrgentTasks();
  }, [isLoaded, session, supabase]);

  // Handle instant completion checkmark
  const toggleTaskCompletion = async (taskId: string) => {
    // Optimistic removal from UI list
    setTasks(prev => prev.filter(t => t.id !== taskId));

    await supabase
      .from('tasks')
      .update({ is_completed: true, completed_at: new Date().toISOString() })
      .eq('id', taskId);
  };

  // Dynamic urgency badge calculation based on date proximity
  const getUrgencyBadge = (dueDateString: string | null) => {
    if (!dueDateString) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(dueDateString);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
          <AlertTriangleIcon className="w-3 h-3" /> Overdue
        </span>
      );
    }

    if (diffDays === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
          <ClockIcon className="w-3 h-3" /> Due Today
        </span>
      );
    }

    if (diffDays === 1) {
      return (
        <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
          Due Tomorrow
        </span>
      );
    }

    return (
      <span className="text-[11px] font-medium text-neutral-500">
        In {diffDays} days
      </span>
    );
  };

  return (
    <div className="bg-white rounded-[8px] p-5 shadow-[0_0_40px_5px_rgba(0,0,0,0.1)] flex flex-col justify-between h-full">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-[#3399FF] rounded-xl">
            <CheckSquareIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-neutral-900">Urgent Tasks</h3>
            <p className="text-xs text-neutral-500">Prioritized by upcoming deadlines</p>
          </div>
        </div>

        <Link
          href="/dashboard/all-tasks"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3399FF] hover:text-blue-700 transition"
        >
          View All <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Task List */}
      <div className="py-2 flex-1 divide-y divide-neutral-100">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-neutral-400">
            Fetching urgent task list...
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <CheckCircle2Icon className="w-9 h-9 text-emerald-500/80 mb-2" />
            <p className="text-xs font-semibold text-neutral-800">All caught up!</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              No pending urgent tasks right now.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="py-3 flex items-center justify-between gap-3 group transition hover:bg-neutral-50/60 px-2 rounded-xl"
            >
              {/* Checkbox + Title */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="text-neutral-300 hover:text-[#3399FF] transition shrink-0"
                  title="Mark as Complete"
                >
                  <CircleIcon className="w-5 h-5 group-hover:scale-105 transition-transform" />
                </button>

                <div className="truncate">
                  <p className="text-xs font-semibold text-neutral-800 truncate">
                    {task.title}
                  </p>
                  
                  {task.courses?.course_code && (
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                      {task.courses.course_code}
                    </span>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Urgency status */}
                {getUrgencyBadge(task.due_date)}

                {/* Priority Pill */}
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                    PRIORITY_STYLES[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}