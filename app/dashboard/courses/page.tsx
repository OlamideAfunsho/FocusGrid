"use client"
import { div } from 'motion/react-client';
import React, { useState } from 'react'


interface CourseItem {
    id: string;
    course_name: string;
    course_code: string;
}

const page = () => {

    const [courses, setCourses] = useState<CourseItem[]>([]);

    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');

    const handleCourseSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create a structured object matching our blueprint
        const newCourse: CourseItem = {
            id: Math.random().toString(),
            course_name: courseName,
            course_code: courseCode.toUpperCase().trim()
        }

        // Append the new object to our local array state
        setCourses([...courses, newCourse]);

        // Reset the form fields after submission
        setCourseName('');
        setCourseCode('');
    };

  return (
    <>
    <div>
        <h1 className='text-center md:text-left text-2xl'>
            View <span className="text-[#3399FF]">All</span> Your <span className="text-[#3399FF]">Courses</span>
        </h1>

        <form onSubmit={handleCourseSubmit} className='mt-2 mb-2'>
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
                <div className='flex flex-col gap-2 '>
                    {courses.map((course) => (
                        <div key={course.id}>
                            <h2>{course.course_name}</h2>
                            <p>{course.course_code}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
    </>
  )
}

export default page