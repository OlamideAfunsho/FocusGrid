import React from 'react'

const Features1 = () => {
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
    </>
  )
}

export default Features1