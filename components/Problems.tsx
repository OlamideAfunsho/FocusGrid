import React from 'react'
import Image from 'next/image'
import { TimerIcon } from 'lucide-react'
import calendarIcon from '../public/images/landing_page_images/calendar-icon.svg'
import folderIcon from '../public/images/landing_page_images/folder-icon.svg'


const Problems = () => {
  return (
    <>
    {/* Problems */}
    <div className='bg-[#F9FAFB] px-4 py-12 sm:p-12 lg:px-[120px] '>
        <div className="flex items-center gap-2.5 w-[141px] mx-auto bg-[#FFFFFF] rounded-[30px] p-2.5 shadow-[0px_17px_29.7px_0px_#D1D8DF]">
            <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
            <span className="text-[#6C7278] text-[14px] font-medium">THE PROBLEM</span>
        </div>

        <h1 className='text-2xl sm:text-[32px] lg:text-4xl font-bold text-[#000000] leading-9 sm:leading-[60px] mt-8 mb-1 text-center'>Drowning in Academic Chaos?</h1>
        <p className='text-[#6C7278] text-[16px] lg:text-[20px] leading-9 w-full xl:w-1/2 mx-auto text-center'>Generic task apps weren’t built for students. They don’t understand semesters, courses, group projects, or the unique challenges of academic life.</p>

        {/* Problems cons */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 lg:mt-16">
            <div className='bg-[#FFFFFF] rounded-[12px] p-6 w-[354px] lg:w-[384px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <div className='bg-[#FEE2E2] rounded-[12px] p-4 w-16 mb-4'>
                    <Image src={calendarIcon} alt="calendar-icon" />
                </div>
                <h1 className='text-[20px] lg:text-2xl font-semibold mb-4'>Missed Deadlines</h1>
                <p className='text-[16px] lg:text-[20px] leading-7 lg:leading-9 text-[#6C7278]'>Juggling assignments across multiple courses leads to forgotten deadlines and last-minute panic. You need a system that tracks everything in one place.</p>
            </div>

            <div className='bg-[#FFFFFF] rounded-[12px] p-6 w-[354px] lg:w-[384px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <div className='bg-[#FFFFC8] rounded-[12px] p-4 w-16 mb-4'>
                    <Image src={folderIcon} alt="folder-icon" />
                </div>
                <h1 className='text-[20px] lg:text-2xl font-semibold mb-4'>Scattered Notes</h1>
                <p className='text-[16px] lg:text-[20px] leading-7 lg:leading-9 text-[#6C7278]'>Notes in one app, tasks in another, study materials somewhere else. Finding what you need becomes a treasure hunt when you should be studying.</p>
            </div>

            <div className='bg-[#FFFFFF] rounded-[12px] p-6 w-[354px] lg:w-[384px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <div className='bg-[#E0FFEC] rounded-[12px] p-4 w-16 mb-4'>
                    <TimerIcon className='w-8 h-8 text-[#08BD4D]' />
                </div>
                <h1 className='text-[20px] lg:text-2xl font-semibold mb-4'>Study Time You Can&apos;t Account For</h1>
                <p className='text-[16px] lg:text-[20px] leading-7 lg:leading-9 text-[#6C7278]'>You put in the hours, but by Friday you cannot say where they went or which course got the least attention. Without a record, planning next week is guesswork.</p>
            </div>
            
        </div>
    </div>
    </>
  )
}

export default Problems