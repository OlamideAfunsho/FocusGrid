"use client"
import { div } from 'motion/react-client';
import React, { useEffect, useState } from 'react'
// Import configured browser-side Supabase client utility
import { createBrowserClient } from '@/lib/supabaseClient';
import { useSession } from '@clerk/nextjs';
import { toast, ToastContainer } from 'react-toastify';
import { Edit2Icon, Trash2Icon } from 'lucide-react'


interface CourseItem {
    id: string;
    name: string;
    course_code: string;
}

const page = () => {

    const [courses, setCourses] = useState<CourseItem[]>([]);

    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');

    const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

    // Form input holding states for the modal panel
    const [editCourseName, setEditCourseName] = useState('');
    const [editCourseCode, setEditCourseCode] = useState('');

    const { session, isLoaded } = useSession();
    const supabase = createBrowserClient(session);

    // Triggered when the user clicks the edit button for a specific course. This sets the state to the course being edited and pre-fills the form fields with its current values.
    const openEditModal = (course: CourseItem) => {
        setEditingCourse(course);
        setEditCourseName(course.name);
        setEditCourseCode(course.course_code);
    }

    // Closes the panel and resets the editing state
    const closeEditModal = () => {
        setEditingCourse(null);
        setEditCourseName('');
        setEditCourseCode('');
    }



    // Read existing rows from the database on page load
    useEffect(() => {

        if(!isLoaded || !session ) return;

        async function loadInitialCourses() {
            const { data, error } = await supabase
                .from('courses') // Target the courses table
                .select('id, name, course_code') // Requests only the specific columns needed

            if (error) {
                console.error("Error retrieving data:", error.message);
                return;
            }
            if (data) {
                setCourses(data); // Feed the fetched database array into the state
            }
        }

        loadInitialCourses();
    }, [isLoaded, session]);

    // Submitting data to the database
    const handleCourseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedCourseCode = courseCode.toUpperCase().trim();

        // Push the raw entry payload up to the live table
        // Specifying .select() tells the database to return the newly created row immediately
        const { data, error } = await supabase
            .from('courses')
            .insert({
                name: courseName,
                course_code: normalizedCourseCode
            })
            .select()
            .single() // Tell the client wrapper to return a single object instead of an array

        if (error) {
            toast.error("Error, try again");
            console.error("Fail to register database entry:", error.message);
            return;
        }
        if (data) {
            // Append database object
            setCourses([...courses, data]);
        }


        toast.success("Course added successfully!");
        // Reset the form fields after submission
        setCourseName('');
        setCourseCode('');
    };

    // Deleting courses
    const handleCourseDelete = async (id: string) => {
        // Confrim before deleting course
        if(!confirm("Are you sure you want to delete this course?")) return;

        // Execute the delete query on supabase
        const {error} = await supabase
            .from ("courses")
            .delete()
            .eq('id', id); // This targets ONLY the row matching this specific UUID

        if (error) {
            toast.error("Error deleting course, try again");
            console.error('Deletion failed:', error.message);
            return;
        }

        toast.success("Course deleted successfully!");
        // Filter out the removed course from local state
        setCourses(prev => prev.filter(course => course.id !== id));
        

    };

    // Updating courses
    const handleCourseUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCourse) return;

        const normalizedCourseCode = editCourseCode.toUpperCase().trim();

        // Send the updated properties to the database
        const { data, error } = await supabase
            .from("courses")
            .update({
                name: editCourseName,
                course_code: normalizedCourseCode
            })
            .eq('id', editingCourse.id)
            .select()
            .single();

        if (error) {
            toast.error("Error updating course, try again");
            console.error("Update failure:", error.message);
            return;
        }

        if (data) {
            // Swap the old info for the new data
            setCourses(prev => prev.map(course => course.id === editingCourse.id ? data : course));
            toast.success("Course updated successfully!");
            
            // Close the modal and reset the editing state
            closeEditModal();
        }
        
    };

    
  return (
    <>
    <div>
        <ToastContainer position="top-right" autoClose={2000} />
        <h1 className='text-center md:text-left text-2xl'>
            View <span className="text-[#3399FF]">All</span> Your <span className="text-[#3399FF]">Courses</span>
        </h1>

        <form onSubmit={handleCourseSubmit} className='mt-2 mb-4'>
           <div className='flex flex-col gap-2 mb-6'>
                <div className='flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-2'>
                    <label className='text-[#8F98A3]'>Course Name:</label>
                    <input
                        type="text"
                        className="h-12 w-full md:w-1/2 p-2 mt-2 border border-gray-500/30 rounded outline-none focus:border-indigo-300"
                        placeholder='e.g., Real Analysis I'
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                    />
                </div>
                <div className='flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-3'>
                    <label className='text-[#8F98A3]'>Course Code:</label>
                    <input
                        type="text"
                        className="h-12 w-full md:w-1/2 p-2 mt-2 border border-gray-500/30 rounded outline-none focus:border-indigo-300"
                        placeholder='e.g., MAT 201'
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        required
                    />
                </div>
           </div>

            <button type="submit" className='bg-[#3399ff] text-white px-4 py-2 rounded-[8px] cursor-pointer shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]'>Add Course</button>
        </form>

        <div>
            {courses.length === 0 ? (
                <p className='italic'>No courses added yet. Add a new course above.</p>

            ) : (
                <div className='bg-[#EEF2FF] rounded-[8px] md:p-4 w-full md:w-3/5 overflow-x-auto'>

                    {/* <div className='flex flex-row justify-between'>
                        <div className='flex flex-col justify-center'>
                            <h1>Course Name</h1>
                            {courses.map((course) => (
                                <span key={course.id}>{course.name}</span>
                            ))}
                        </div>
                        <div className='flex flex-col justify-center'>
                            <h1>Course Code</h1>
                            {courses.map((course) => (
                                <span key={course.id}>{course.course_code}</span>
                            ))}
                        </div>
                        <div className='flex flex-col justify-center'>

                        </div>
                    </div> */}

                    <table className='text-left'>
                            <thead>
                                <tr>
                                    <th className='text-[14px] md:text-[16px] px-4 py-2'>Course Name</th>
                                    <th className='text-[14px] md:text-[16px] px-4 py-2'>Course Code</th>
                                    <th className='text-[14px] md:text-[16px] px-4 py-2'>Action</th>
                                </tr>
                            </thead>

                            <tbody className='text-[12px] md:text-[14px]'>
                                {courses.map((course) => (
                                        <tr key={course.id} className=''>
                                            <td className='px-4 py-1'>{course.name}</td>
                                            <td className='px-4 py-1'>{course.course_code}</td>
                                            <td className='px-4 py-1'>
                                                <button onClick={() => openEditModal(course)} className='mr-2 cursor-pointer'>
                                                    <Edit2Icon className='w-3 h-3 md:w-4 md:h-4' />
                                                </button>
                                                <button onClick={() => handleCourseDelete(course.id)} className='cursor-pointer'>
                                                    <Trash2Icon className='w-3 h-3 md:w-4 md:h-4 ' />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                    
                                )}
                            </tbody>
                    </table>

                    {editingCourse && (
                        <div className="fixed px-2 inset-0 z-50 flex items-center justify-center">
          
                            {/* DARK BACKDROP LAYER (Dims out the background workspace) */}
                            <div 
                                onClick={closeEditModal} 
                                className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
                            />

                            {/* THE INTERACTIVE MODAL BOX PANEL */}
                            <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-150">
                                <h3 className="text-base font-bold text-neutral-900 mb-1">Modify Course Details</h3>
                                <p className="text-xs text-neutral-400 mb-4">Adjust information for this course.</p>

                                <form onSubmit={handleCourseUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Course Code</label>
                                        <input 
                                        type="text" 
                                        required
                                        value={editCourseCode}
                                        onChange={(e) => setEditCourseCode(e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm uppercase outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1">Course Name</label>
                                        <input 
                                        type="text" 
                                        required
                                        value={editCourseName}
                                        onChange={(e) => setEditCourseName(e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    {/* ACTION TOGGLE BUTTONS */}
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button 
                                        type="submit"
                                        className=" bg-[#3399ff] px-4 py-2 text-white rounded-lg transition bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] cursor-pointer shadow-sm "
                                        >
                                        Save Changes
                                        </button>

                                        <button 
                                        type="button" 
                                        onClick={closeEditModal}
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
            )}
        </div>
    </div>
    </>
  )
}

export default page