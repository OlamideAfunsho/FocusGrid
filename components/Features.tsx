"use client"

import React from 'react'
import Image from 'next/image';
import booksIcon from '../public/images/landing-page-images/books-icon.png';
import timerIcon from '../public/images/landing-page-images/timer-icon.png';
import notesIcon from '../public/images/landing-page-images/notes-icon.png';
import calendarIcon from '../public/images/landing-page-images/calendar-icon.png';

const Features = () => {


    const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

    // Adjust the threshold value to control the tilt effect
    const threshold = 12;

    interface TiltState {
        x: number;
        y: number;
    }

    interface DOMRect {
        left: number;
        top: number;
        width: number;
        height: number;
    }

    const handleMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setTilt({ x: y * -threshold, y: x * threshold });
    };


  return (
    <div id='features' className='text-center pt-40 md:pt-20 pb-30 md:pb-20 px-8 bg-[#e6f2ff] mask-fade-top-and-bottom'>
        <span className='text-[#3399ff] font-bold border border-[#3399ff] px-6 py-2.5 rounded-full'>Features</span>

        <p className='mt-4 text-[20px] text-[#4a5565] w-full sm:w-2/3 mx-auto'>
           Boost your productivity and focus with <span className='font-semibold'>FocusGrid</span> - the ultimate study companion.
            {/* <span className='font-semibold'>FocusGrid</span> helps you create a distraction-free study environment by breaking your tasks into manageable intervals,
            allowing you to stay focused and achieve your academic goals with ease. */}
        </p>

        <div className="cols flex flex-col gap-2 md:flex-row md:flex-wrap justify-between mt-10">
            <div className="feature-card w-11/12 sm:w-2/4 md:w-2/6 lg:w-1/5 mx-auto border px-8 py-4 border-[#3399ff] hover:bg-[#3399ff]/10 cursor-pointer rounded-md">
                <div className='flex justify-evenly gap-1 sm:gap-0 items-start mb-2'>
                    <h3 className='font-semibold text-xl '>Course-Specific Tasks</h3>
                    <Image src={booksIcon} alt="books-icon" width={20} height={20} className=' w-5 h-5 mt-1'/>
                </div>
                <p className='text-gray-600'><span className='font-semibold'>Never Miss a Deadline.</span> Organize assignments, exams, and readings under the courses they belong to, not just a generic to-do list.</p>
            </div>

            <div className="feature-card w-11/12 sm:w-2/4 md:w-2/6 lg:w-1/5 mx-auto border px-8 py-4 border-[#3399ff] hover:bg-[#3399ff]/10 cursor-pointer rounded-md">
                <div className='flex justify-evenly gap-1 sm:gap-0 items-start mb-2'>
                    <h3 className='font-semibold text-xl '>Integrated Study Timer</h3>
                    <Image src={timerIcon} alt="timer-icon" width={20} height={20} className=' w-5 h-5 mt-1'/>
                </div>
                <p className='text-gray-600'><span className='font-semibold'>Beat Procrastination.</span> Use the built-in Pomodoro timer to manage focused study sessions and automatically log your progress.</p>
            </div>

            <div className="feature-card w-11/12 sm:w-2/4 md:w-2/6 lg:w-1/5 mx-auto border px-8 py-4 border-[#3399ff] hover:bg-[#3399ff]/10 cursor-pointer rounded-md">
                <div className='flex justify-evenly gap-2 items-start mb-2'>
                    <h3 className='font-semibold text-xl '>Academic Notes Hub</h3>
                    <Image src={notesIcon} alt="notes-icon" width={20} height={20} className=' w-5 h-5 mt-1'/>
                </div>
                <p className='text-gray-600'><span className='font-semibold'>Capture Ideas Instantly.</span> Keep lecture notes, research links, and key concepts stored right alongside your courses for easy access.</p>
            </div>

            <div className="feature-card w-11/12 sm:w-2/4 md:w-2/6 lg:w-1/5 mx-auto border px-8 py-4 border-[#3399ff] hover:bg-[#3399ff]/10 cursor-pointer rounded-md">
                <div className='flex justify-evenly gap-2 items-start mb-2'>
                    <h3 className='font-semibold text-xl '>Structured Overview</h3>
                    <Image src={calendarIcon} alt="calendar-icon" className=' w-5 h-5 mt-1'/>
                </div>
                <p className='text-gray-600'><span className='font-semibold'>Clarity on Demand</span> View your entire academic load on one dashboard, prioritized by due date and effort level.</p>
            </div>

            

            {/* <div className="feature-card w-[200px]  bg-white/10 backdrop-blur-sm">
                <h3 className='font-semibold text-xl '>Course Organization</h3>
                <p className='text-gray-600'>Keep all your course materials and notes in one place for easy access and reference.</p>
            </div>

            <div className="feature-card w-[200px]  bg-white/10 backdrop-blur-sm">
                <h3 className='font-semibold text-xl '>Study Timer</h3>
                <p className='text-gray-600'>Utilize our built-in study timer to implement the Pomodoro technique and enhance your focus.</p>
            </div>

            <div className="feature-card w-[200px]  bg-white/10 backdrop-blur-sm">
                <h3 className='font-semibold text-xl '>Progress Tracking</h3>
                <p className='text-gray-600'>Monitor your study habits and track your progress over time to stay motivated.</p>
            </div> */}

        </div>
    </div>
  )
}

export default Features