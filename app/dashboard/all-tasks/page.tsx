"use client";

import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';
import React, { useEffect, useState, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { PlusIcon, TrashIcon, Edit2Icon } from 'lucide-react';
import TaskEmptyState from '../components/TaskEmptyState';
import TaskSkeleton from '../components/TaskSkeleton';

interface CourseOption {
  id: string;
  name: string;
  course_code: string;
}

interface TaskItem {
  id: string;
  task_title: string;
  course_id: string;
  due_date: string; 
  is_completed: boolean;
  courses: CourseOption | null;
}

const TasksPage = () => {
  const { session, isLoaded } = useSession();
  const supabase = useMemo(() => createBrowserClient(session), [session]);

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  
  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Edit Modal State
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editSelectedCourseId, setEditSelectedCourseId] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // Format YYYY-MM-DD safely without timezone shifts
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString();
  };

  useEffect(() => {
    if (!isLoaded || !session?.user?.id) return;

    const loadPageData = async () => {
      setIsLoading(true);
      try {
        const [tasksRes, coursesRes] = await Promise.all([
          supabase
            .from("tasks")
            .select(`
              id, task_title, due_date, is_completed, course_id,
              courses (id, name, course_code)
            `)
            .eq("user_id", session.user.id),
          supabase.from("courses").select("id, name, course_code")
        ]);

        if (tasksRes.error) throw tasksRes.error;
        if (coursesRes.error) throw coursesRes.error;

        setTasks((tasksRes.data as unknown as TaskItem[]) || []);
        setCourses(coursesRes.data || []);
      } catch (error) {
        toast.error("Failed to load task data");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, [session, isLoaded, supabase]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !session?.user?.id || !taskTitle || !dueDate) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        task_title: taskTitle,
        due_date: dueDate,
        course_id: selectedCourseId,
        user_id: session.user.id
      })
      .select(`
        id, task_title, due_date, is_completed, course_id,
        courses (id, name, course_code)
      `)
      .single();

    if (error) {
      toast.error("Error creating task, try again");
      console.error('Failed to create task:', error.message);
      return;
    }

    if (data) {
      setTasks(prev => [...prev, data as unknown as TaskItem]);
      toast.success("Task created successfully!");
      setIsModalOpen(false);
      setTaskTitle('');
      setSelectedCourseId('');
      setDueDate('');
    }
  };

  const handleToggleCompletion = async (taskId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, is_completed: nextStatus } : t)));

    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: nextStatus })
      .eq('id', taskId);

    if (error) {
      console.error('Failed to toggle completion:', error.message);
      setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, is_completed: currentStatus } : t)));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      toast.error("Failed to delete task");
      console.error('Failed to delete task:', error.message);
      return;
    }

    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.success("Task deleted");
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setEditTaskTitle(task.task_title);
    setEditDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    setEditSelectedCourseId(task.course_id);
  };

  const closeEditModal = () => {
    setEditingTask(null);
    setEditTaskTitle('');
    setEditDueDate('');
    setEditSelectedCourseId('');
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    const { data, error } = await supabase
      .from('tasks')
      .update({
        task_title: editTaskTitle,
        due_date: editDueDate,
        course_id: editSelectedCourseId,
      })
      .eq('id', editingTask.id)
      .select(`
        id, task_title, due_date, is_completed, course_id,
        courses (id, name, course_code)
      `)
      .single();

    if (error) {
      toast.error("Failed to update task");
      console.error('Failed to update task:', error.message);
      return;
    }

    if (data) {
      setTasks(prev => prev.map(t => (t.id === editingTask.id ? (data as unknown as TaskItem) : t)));
      toast.success("Task updated successfully");
      closeEditModal();
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      <div>
          <h1 className='text-center md:text-left text-2xl'>
            View <span className="text-[#3399FF]">All</span> Your <span className="text-[#3399FF]">Tasks</span>
          </h1>
        {tasks.length > 0 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex justify-center items-center gap-1 mt-4 mb-4 bg-[#3399ff] text-white px-4 py-2 rounded-[8px] cursor-pointer hover:opacity-90 transition shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]"
          >
            <PlusIcon className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>

      {isLoading ? (
        <TaskSkeleton />
      ) : tasks.length === 0 ? (
        <TaskEmptyState onAddTask={() => setIsModalOpen(true)} />
      ) : (
        <div className='w-full md:w-3/5'>
          {tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => handleToggleCompletion(task.id, task.is_completed)} 
              className={`w-full flex items-center justify-between gap-4 bg-[#EEF2FF] border-l-4 border-[#3399FF] rounded-[8px] p-4 mb-4 cursor-pointer transition ${
                task.is_completed ? 'opacity-60 bg-neutral-100' : ''
              }`}
            >
              <div className='flex items-center gap-4'>
                <input
                  type="checkbox"
                  checked={task.is_completed ?? false}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleToggleCompletion(task.id, Boolean(task.is_completed))}
                  className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                
                <div>
                  <h2 className={`text-base md:text-lg font-semibold text-[#3E3A72] ${task.is_completed ? 'line-through' : ''}`}>
                    {task.task_title}
                  </h2>
                  <p className="text-xs md:text-sm text-[#8F98A3]">Due: {formatDateString(task.due_date)}</p>
                  <p className="text-xs md:text-sm text-[#8F98A3]">Course: {task.courses?.name ?? 'Unassigned'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(task);
                  }}
                  className="p-1 hover:text-[#3399FF] text-neutral-500 transition cursor-pointer"
                  title="Edit Task"
                >
                  <Edit2Icon className='w-4 h-4' />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                  className="p-1 hover:text-red-600 text-neutral-500 transition cursor-pointer"
                  title="Delete Task"
                >
                  <TrashIcon className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding a new task */}
      {isModalOpen && (
        <div className="fixed px-2 inset-0 flex items-center justify-center z-50">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-neutral-100">
            <h2 className="text-xl font-semibold mb-4 text-[#3E3A72]">Add New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Task Title</label>
                <input 
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">Select Course</label>
                <select 
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                >
                  <option value="" disabled>-- Choose a course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} - ({course.course_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">Due Date</label>
                <input 
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#3399ff] px-4 py-2 text-white rounded-lg transition bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] shadow-sm"
                >
                  Submit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for editing a task */}
      {editingTask && (
        <div className="fixed px-2 inset-0 flex items-center justify-center z-50">
          <div onClick={closeEditModal} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-neutral-100">
            <h2 className="text-xl font-semibold mb-4 text-[#3E3A72]">Edit Task</h2>
            <form onSubmit={handleUpdateTask}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Task Title</label>
                <input 
                  type="text"
                  required
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">Select Course</label>
                <select 
                  required
                  value={editSelectedCourseId}
                  onChange={(e) => setEditSelectedCourseId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                >
                  <option value="" disabled>-- Choose a course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} - ({course.course_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">Due Date</label>
                <input 
                  type="date"
                  required
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-6">
                <button 
                  type="button" 
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#3399ff] px-4 py-2 text-white rounded-lg transition bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;