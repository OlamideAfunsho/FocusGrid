import React from 'react'
import Image from 'next/image'
import calendarIcon from '../public/images/landing_page_images/calendar-icon.svg'
import folderIcon from '../public/images/landing_page_images/folder-icon.svg'
import userGroupIcon from '../public/images/landing_page_images/user-group-icon.svg'


const Problems = () => {
  return (
    <>
    <div className='grid grid-flow-col grid-rows-2 sm:grid-rows-1 gap-2.5 px-4 py-12 sm:p-12 md:px-[50px] md:py-16 lg:px-[120px]'>
        <div className='flex gap-0.5 flex-col items-center'>
            <h1 className='text-4xl font-bold lg:text-5xl text-[linear-gradient(109.51deg,#3399FF_2.27%,#3864F5_100%)]'>50k+</h1>
            <span className='text-[#6C7278] text-[16px] md:text-[20px] font-medium'>Active Students</span>
        </div>

        <div className='flex gap-0.5 flex-col items-center'>
            <h1 className='text-4xl font-bold lg:text-5xl text-[linear-gradient(109.51deg,#3399FF_2.27%,#3864F5_100%)]'>2M+</h1>
            <span className='text-[#6C7278] text-[16px] md:text-[20px] font-medium'>Tasks Completed</span>
        </div>

        <div className='flex gap-0.5 flex-col items-center'>
            <h1 className='text-4xl font-bold lg:text-5xl text-[linear-gradient(109.51deg,#3399FF_2.27%,#3864F5_100%)]'>98%</h1>
            <span className='text-[#6C7278] text-[16px] md:text-[20px] font-medium'>Satisfaction Rate</span>
        </div>

        <div className='flex gap-0.5 flex-col items-center'>
            <h1 className='text-4xl font-bold lg:text-5xl text-[linear-gradient(109.51deg,#3399FF_2.27%,#3864F5_100%)]'>150+</h1>
            <span className='text-[#6C7278] text-[16px] md:text-[20px] font-medium'>Universities</span>
        </div>
    </div>


    {/* Problems */}
    <div className='bg-[#F9FAFB] px-4 py-12 sm:p-12 lg:px-[120px] '>
        <div className="flex items-center gap-2.5 w-[141px] mx-auto bg-[#FFFFFF] rounded-[30px] p-2.5 shadow-[0px_17px_29.7px_0px_#D1D8DF]">
            <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
            <span className="text-[#6C7278] text-[14px] font-medium">THE PROBLEM</span>
        </div>

        <h1 className='text-2xl sm:text-[32px] lg:text-4xl font-bold text-[#000000] leading-[60px] mt-8 text-center'>Drowning in Academic Chaos?</h1>
        <p className='text-[#6C7278] text-[16px] lg:text-[20px] leading-9 w-full xl:w-1/2 mx-auto text-center'>Generic task app weren’t built for students. They, don’t understand semesters, courses, group projects, or the unique challenges of academic life.</p>

        {/* Problems cons */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 lg:mt-16">
            <div className='bg-[#FFFFFF] rounded-[12px] p-6 w-[354px] lg:[384px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <div className='bg-[#FEE2E2] rounded-[12px] p-4 w-16 mb-4'>
                    <Image src={calendarIcon} alt="calendar-icon" />
                </div>
                <h1 className='text-[20px] lg:text-2xl font-semibold mb-4'>Missed Deadlines</h1>
                <p className='text-[16px] lg:text-[20px] leading-7 lg:leading-9 text-[#6C7278]'>Juggling assignments across multiple courses leads to forgotten deadlines and last-minute panic. You need a system that tracks everything in one place.</p>
            </div>

            <div className='bg-[#FFFFFF] rounded-[12px] p-6 w-[354px] lg:[384px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <div className='bg-[#FFFFC8] rounded-[12px] p-4 w-16 mb-4'>
                    <Image src={folderIcon} alt="folder-icon" />
                </div>
                <h1 className='text-[20px] lg:text-2xl font-semibold mb-4'>Scattered Notes</h1>
                <p className='text-[16px] lg:text-[20px] leading-7 lg:leading-9 text-[#6C7278]'>Notes in one app, tasks in another, study materials somewhere else. Finding what you need becomes a treasure hunt when you should be studying.</p>
            </div>

            <div className='bg-[#FFFFFF] rounded-[12px] p-6 w-[354px] lg:[384px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <div className='bg-[#E0FFEC] rounded-[12px] p-4 w-16 mb-4'>
                    <Image src={userGroupIcon} alt="user-group-icon" />
                </div>
                <h1 className='text-[20px] lg:text-2xl font-semibold mb-4'>Group Project Nightmares</h1>
                <p className='text-[16px] lg:text-[20px] leading-7 lg:leading-9 text-[#6C7278]'>Coordinating group projects across different platforms and tools creates confusion. You need seamless collaboration built for student teams.</p>
            </div>
            
        </div>
    </div>
    </>
  )
}

export default Problems