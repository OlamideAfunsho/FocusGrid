// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   CheckCircle2Icon, 
//   CircleIcon, 
//   PlusIcon, 
//   AlertCircleIcon, 
//   CalendarIcon,
//   SparklesIcon,
//   Trash2Icon
// } from 'lucide-react';
// import { createBrowserClient } from '@/lib/supabaseClient';
// import { useSession } from '@clerk/nextjs';

// interface Task {
//   id: string;
//   title: string;
//   course_code?: string;
//   due_date?: string;
//   is_completed: boolean;
//   priority: 'high' | 'medium' | 'low';
// }

// const TopPriorityTasks = () => {
//   const { session, isLoaded } = useSession();
//   const supabase = useMemo(() => createBrowserClient(session), [session]);

//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [newTaskTitle, setNewTaskTitle] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAdding, setIsAdding] = useState(false);

//   // Fetch initial high-priority tasks
//   useEffect(() => {
//     if (!isLoaded || !session?.user?.id) return;

//     const fetchPriorityTasks = async () => {
//       setIsLoading(true);
//       const { data, error } = await supabase
//         .from('tasks')
//         .select('id, title, course_code, due_date, is_completed, priority')
//         .eq('user_id', session.user.id)
//         .eq('priority', 'high')
//         .order('is_completed', { ascending: true })
//         .order('due_date', { ascending: true })
//         .limit(5);

//       if (!error && data) {
//         setTasks(data as Task[]);
//       }
//       setIsLoading(false);
//     };

//     fetchPriorityTasks();
//   }, [isLoaded, session, supabase]);

//   // Optimistic Toggle Handler
//   const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
//     const nextStatus = !currentStatus;

//     // 1. Optimistic UI update
//     setTasks(prev =>
//       prev.map(task =>
//         task.id === taskId ? { ...task, is_completed: nextStatus } : task
//       )
//     );

//     // 2. Background Supabase sync
//     const { error } = await supabase
//       .from('tasks')
//       .update({ is_completed: nextStatus })
//       .eq('id', taskId)
//       .eq('user_id', session?.user?.id);

//     // Rollback if sync fails
//     if (error) {
//       setTasks(prev =>
//         prev.map(task =>
//           task.id === taskId ? { ...task, is_completed: currentStatus } : task
//         )
//       );
//     }
//   };

//   // Add Priority Task Handler
//   const handleAddTask = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newTaskTitle.trim() || !session?.user?.id) return;

//     const tempId = `temp-${Date.now()}`;
//     const newTaskObj: Task = {
//       id: tempId,
//       title: newTaskTitle.trim(),
//       is_completed: false,
//       priority: 'high',
//     };

//     // Optimistic insert
//     setTasks(prev => [newTaskObj, ...prev]);
//     setNewTaskTitle('');
//     setIsAdding(false);

//     const { data, error } = await supabase
//       .from('tasks')
//       .insert({
//         user_id: session.user.id,
//         title: newTaskObj.title,
//         priority: 'high',
//         is_completed: false,
//       })
//       .select('id')
//       .single();

//     if (error) {
//       setTasks(prev => prev.filter(t => t.id !== tempId));
//     } else if (data) {
//       setTasks(prev =>
//         prev.map(t => (t.id === tempId ? { ...t, id: data.id } : t))
//       );
//     }
//   };

//   // Delete Task Handler
//   const deleteTask = async (taskId: string) => {
//     setTasks(prev => prev.filter(t => t.id !== taskId));

//     await supabase
//       .from('tasks')
//       .delete()
//       .eq('id', taskId)
//       .eq('user_id', session?.user?.id);
//   };

//   const completedCount = tasks.filter(t => t.is_completed).length;

//   return (
//     <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[380px]">
//       <div>
//         {/* Widget Header */}
//         <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
//           <div className="flex items-center gap-2.5">
//             <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
//               <AlertCircleIcon className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="text-base font-semibold text-neutral-900">Top Priority Tasks</h3>
//               <p className="text-xs text-neutral-500">Urgent action items for this week</p>
//             </div>
//           </div>
//           <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-lg font-mono">
//             {completedCount}/{tasks.length} Done
//           </span>
//         </div>

//         {/* Quick Add Toggle Form */}
//         {isAdding ? (
//           <form onSubmit={handleAddTask} className="mt-4 flex items-center gap-2">
//             <input
//               type="text"
//               value={newTaskTitle}
//               onChange={e => setNewTaskTitle(e.target.value)}
//               placeholder="Enter high-priority task..."
//               autoFocus
//               className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 outline-none focus:ring-2 focus:ring-[#3399FF]"
//             />
//             <button
//               type="submit"
//               className="px-3 py-2 bg-[#3399FF] text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition"
//             >
//               Add
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsAdding(false)}
//               className="px-2.5 py-2 text-neutral-400 hover:text-neutral-600 text-xs"
//             >
//               Cancel
//             </button>
//           </form>
//         ) : (
//           <button
//             onClick={() => setIsAdding(true)}
//             className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-neutral-200 rounded-xl text-xs font-semibold text-neutral-600 hover:border-[#3399FF] hover:text-[#3399FF] transition"
//           >
//             <PlusIcon className="w-4 h-4" /> Quick Add Priority Task
//           </button>
//         )}

//         {/* Task List Section */}
//         {isLoading ? (
//           <div className="py-12 text-center text-xs text-neutral-400">Loading priority items...</div>
//         ) : tasks.length === 0 ? (
//           <div className="py-10 text-center flex flex-col items-center">
//             <SparklesIcon className="w-8 h-8 text-neutral-300 mb-2" />
//             <p className="text-xs font-medium text-neutral-600">All high-priority tasks completed!</p>
//             <p className="text-[11px] text-neutral-400 mt-1">Add a new item to keep your momentum going.</p>
//           </div>
//         ) : (
//           <div className="space-y-2 mt-4">
//             {tasks.map(task => (
//               <div
//                 key={task.id}
//                 className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
//                   task.is_completed
//                     ? 'bg-neutral-50 border-neutral-100 opacity-60'
//                     : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-2xs'
//                 }`}
//               >
//                 <div className="flex items-center gap-3 min-w-0 flex-1">
//                   <button
//                     onClick={() => toggleTaskCompletion(task.id, task.is_completed)}
//                     className="shrink-0 transition-transform active:scale-90"
//                     title={task.is_completed ? 'Mark pending' : 'Mark completed'}
//                   >
//                     {task.is_completed ? (
//                       <CheckCircle2Icon className="w-5 h-5 text-emerald-500 fill-emerald-50" />
//                     ) : (
//                       <CircleIcon className="w-5 h-5 text-neutral-300 hover:text-[#3399FF]" />
//                     )}
//                   </button>

//                   <div className="min-w-0 flex-1">
//                     <p
//                       className={`text-xs font-semibold leading-tight truncate ${
//                         task.is_completed ? 'line-through text-neutral-400' : 'text-neutral-800'
//                       }`}
//                     >
//                       {task.title}
//                     </p>
//                     {(task.course_code || task.due_date) && (
//                       <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
//                         {task.course_code && (
//                           <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded font-mono font-medium">
//                             {task.course_code}
//                           </span>
//                         )}
//                         {task.due_date && (
//                           <span className="flex items-center gap-1">
//                             <CalendarIcon className="w-3 h-3" />
//                             {new Date(task.due_date).toLocaleDateString(undefined, {
//                               month: 'short',
//                               day: 'numeric',
//                             })}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => deleteTask(task.id)}
//                   className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-300 hover:text-rose-500 rounded-lg transition"
//                   title="Delete task"
//                 >
//                   <Trash2Icon className="w-4 h-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Completion Progress Bar */}
//       {tasks.length > 0 && (
//         <div className="pt-4 border-t border-neutral-100 mt-4">
//           <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
//             <div
//               className="bg-[#3399FF] h-full transition-all duration-500 ease-out"
//               style={{ width: `${(completedCount / tasks.length) * 100}%` }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default TopPriorityTasks