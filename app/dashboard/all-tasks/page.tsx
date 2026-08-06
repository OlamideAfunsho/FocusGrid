"use client";

import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { PlusIcon } from 'lucide-react';



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
  courses: CourseOption | null; // Supabase returns related rows as an array
}

const page = () => {

  const { session, isLoaded } = useSession();
  const supabase = createBrowserClient(session);

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]); // Dropdown options list
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form field states
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Fetch tasks and courses when the component mounts or when the session changes
  useEffect(() => {

    if (!isLoaded || !session) return;

    async function loadPageData() {
      // Fetch both active tasks and available course options
      const [tasksRes, coursesRes] = await Promise.all([
        supabase.from('tasks')
                .select(`
                  id, task_title, due_date, course_id,
                  courses (id, name, course_code)
                  `),
        supabase.from('courses').select('id, name, course_code')
      ]);

      if (tasksRes.data) setTasks(tasksRes.data as unknown as TaskItem[]);
      if (coursesRes.data) setCourses(coursesRes.data);
    }

    loadPageData();

  }, [session, isLoaded]);

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
            className="flex justify-center items-center gap-1 mt-4 mb-4 bg-[#3399ff] text-white px-4 py-2 rounded-[8px] cursor-pointer shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]"
          >
            <PlusIcon className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>

      {/* Empty state and data grid */}
      {tasks.length === 0 ? (
        <div>
          <p className='italic text-[#8F98A3] mt-4 mb-4'>You have no tasks yet. Start by adding a new task.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex justify-center items-center gap-1 bg-[#3399ff] text-white px-4 py-2 rounded-[8px] cursor-pointer shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]"
          >
            <PlusIcon className="w-4 h-4" />
            Add Task
          </button>
        </div>
      ) : (
        <div className='w-full md:w-3/5'>
          {tasks.map((task) => (
            <div key={task.id} className="bg-[#EEF2FF] border-l-4 border-[#3399FF] rounded-[8px] p-4 mb-4">
              <h2 className="text-[16px] md:text-lg font-semibold">{task.task_title}</h2>
              <p className="text-[12px] md:text-sm text-[#8F98A3]">Due: {new Date(task.due_date).toLocaleDateString()}</p>
              <p className="text-[12px] md:text-sm text-[#8F98A3]">Course: {task.courses?.name}</p>
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