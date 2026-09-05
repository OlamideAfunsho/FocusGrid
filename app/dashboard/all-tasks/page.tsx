"use client";

import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { PlusIcon, TrashIcon } from 'lucide-react';
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
  courses: CourseOption | null; // Supabase returns related rows as an array
}

const page = () => {

  const { session, isLoaded } = useSession();
  const supabase = createBrowserClient(session);

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<CourseOption[]>([]); // Dropdown options list
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form field states
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Editing state
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editSelectedCourseId, setEditSelectedCourseId] = useState('');
  const [editDueDate, setEditDueDate] = useState('');


  useEffect(() => {
    if(!isLoaded || !session) return;

    const loadPageData = async () => {
      setIsLoading(true);
      try {
        const [tasksRes, coursesRes] = await Promise.all([
          supabase
            .from("tasks")
            .select(`
              *,
              courses (id, name, course_code)
            `),
          supabase.from("courses").select("id, name, course_code")
        ]);

        console.log("Raw tasks payload:", tasksRes.data),
        console.log("Raw courses payload:", coursesRes.data)

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
  }, [session, isLoaded]);

  // // Fetch tasks and courses when the component mounts or when the session changes
  // useEffect(() => {

  //   if (!isLoaded || !session) return;

  //   async function loadPageData() {
  //     // Fetch both active tasks and available course options
  //     const [tasksRes, coursesRes] = await Promise.all([
  //       supabase.from('tasks')
  //               .select(`
  //                 id, task_title, due_date, is_completed, course_id,
  //                 courses (id, name, course_code)
  //                 `),
  //       supabase.from('courses').select('id, name, course_code')
  //     ]);

  //     if (tasksRes.data) setTasks(tasksRes.data as unknown as TaskItem[]);
  //     if (coursesRes.data) setCourses(coursesRes.data);
  //   }

  //   loadPageData();

  // }, [session, isLoaded]);

  // Submit new task with foreign key reference to the selected course
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !session?.user?.id) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        task_title: taskTitle,
        due_date: dueDate,
        course_id: selectedCourseId, // Anchoring child record to parent UUID
        user_id: session.user.id // Pass Clerk user ID
      })
      .select()
      .single();

    if (error) {
      toast.error("Error creating task, try again");
      console.error("Supabase Error Message:", error.message);
      console.error("Supabase Error Details:", error.details);
      console.error("Supabase Error Hint:", error.hint);
      console.error('Failed to create task:', error.message);
      return;
    }

    if (data) {
      setTasks([...tasks, data]); // Append new item to screen
      toast.success("Task created successfully!");
      setIsModalOpen(false); // Close modal
      // Reset the form fields after submission
      setTaskTitle('');
      setSelectedCourseId('');
      setDueDate('');
    }
  };

  // Completion toggle handler
  const handleToggleCompletion = async (taskId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;

    // Update local state immediately for instant visual feedback
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, is_completed: nextStatus } : t))
    );

    // Sync update with the Supabase
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: nextStatus })
      .eq('id', taskId)

    // Revert state if the server request fails
    if (error) {
      console.error('Failed to toggle completion:', error.message);
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, is_completed: currentStatus } : t))
      );
    }
  };

  // Delete Task Handler
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Failed to delete task:', error.message);
      return;
    }

    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Edit Task Handlers
  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setEditTaskTitle(task.task_title);
    setEditDueDate(task.due_date);
    setEditSelectedCourseId(task.course_id);
  };

  const closeEditModal = () => {
    setEditingTask(null);
    setEditTaskTitle('');
    setEditDueDate('');
    setEditSelectedCourseId('');
  };

  // Submit updated task details to Supabase
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
      console.error('Failed to update task:', error.message);
      return;
    }

    if (data) {
      setTasks(prev =>
        prev.map(t => (t.id === editingTask.id ? (data as unknown as TaskItem) : t))
      );
      closeEditModal();
    }
  };


  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="">
        <h1 className='text-center md:text-left text-2xl'>
            View <span className="text-[#3399FF]">All</span> Your <span className="text-[#3399FF]">Tasks</span>
        </h1>
        {tasks.length > 0 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex justify-center items-center gap-1 mt-4 mb-4 bg-[#3399ff] text-white px-4 py-2 rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity ease-in-out shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]"
          >
            <PlusIcon className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>

      {/* Empty state and data grid */}
      {isLoading ? (
        <TaskSkeleton />
      ) :tasks.length === 0 ? (
        <TaskEmptyState onAddTask={() => setIsModalOpen(true)} />
      ) : (
        <div className='w-full md:w-3/5'>
          {tasks.map((task) => (
            <div key={task.id} onClick={() => handleToggleCompletion(task.id, task.is_completed)} className={`w-full flex items-center justify-between gap-4 bg-[#EEF2FF] border-l-4 border-[#3399FF] rounded-[8px] p-4 mb-4 cursor-pointer
              ${
                task.is_completed ? 'opacity-60 bg-neutral-100' : ''
              }
            `}>
              <div className='flex items-center gap-4'>
                <input
                  type="checkbox"
                  checked={task.is_completed ?? false}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleToggleCompletion(task.id, Boolean(task.is_completed))}
                  className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              
                <div>
                  <h2 className="text-[16px] md:text-lg font-semibold">{task.task_title}</h2>
                  <p className="text-[12px] md:text-sm text-[#8F98A3]">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                  <p className="text-[12px] md:text-sm text-[#8F98A3]">Course: {task.courses?.name ?? 'Unassigned'}</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                className="cursor-pointer"
              >
                <TrashIcon className='w-3 h-3 md:w-4 md:h-4' />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding a new task */}
      {isModalOpen && (
        <div className="fixed px-2 inset-0 flex items-center justify-center z-50">

          {/* Backdrop layer */}
          <div 
            onClick={() => setIsModalOpen(false)} 
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />

          {/* Modal content */}
          <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

            <form onSubmit={handleCreateTask}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Task Title</label>
                <input 
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 mt-4">Select Course</label>
                <select 
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
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3399FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                type="submit"
                className=" bg-[#3399ff] px-4 py-2 text-white rounded-lg transition bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] cursor-pointer shadow-sm "
                >
                Submit Task
                </button>

                <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="bg-[#FF3333] text-white px-4 py-2 rounded-[8px] cursor-pointer shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#FF3333_2.27%,_#FF0000_100%)]"
                >
                Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default page