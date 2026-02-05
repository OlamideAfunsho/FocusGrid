import Image from 'next/image'
import React from 'react'
import icon1 from '../public/images/landing_page_images/user-icon.svg'
import icon2 from '../public/images/landing_page_images/bookmark-icon.svg'
import icon3 from '../public/images/landing_page_images/task-icon.svg'
import icon4 from '../public/images/landing_page_images/rocket-icon.svg'
import number1Icon from '../public/images/landing_page_images/number1-icon.svg'
import number2Icon from '../public/images/landing_page_images/number2-icon.svg'
import number3Icon from '../public/images/landing_page_images/number3-icon.svg'
import number4Icon from '../public/images/landing_page_images/number4-icon.svg'


const HowItWorks = () => {
  return (
    <>
    <div className='bg-[#F9F7FD] px-4 py-12 sm:p-12 lg:px-[120px] lg:py-16' id='how-it-works'>

        <div className="flex items-center gap-2.5 w-[150px] mx-auto bg-[#FFFFFF] rounded-[30px] p-2.5 shadow-[0px_17px_29.7px_0px_#D1D8DF]">
            <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
            <span className="text-[#6C7278] text-[14px] font-medium">HOW IT WORKS</span>
        </div>
        <h1 className='text-2xl leading-[38px] sm:text-4xl sm:leading-[60px]  font-bold text-center mt-8 mb-1'>Get Started in Minutes</h1>
        <p className='text[16px] lg:text-[20px] leading-9 text-[#6C7278] text-center'>Simple setup, powerful results. Start organizing your academic life today.</p>

        {/* How-it-works cons */}
        <div className='flex flex-wrap justify-center gap-6 mt-12 lg:mt-16'>
            <div className='flex flex-col items-center gap-2.5'>
                <Image src={number1Icon} alt='number1-icon' />
                <div className='flex flex-col gap-4 bg-[#FFFFFF] w-[320px] lg:w-[282px] p-6 rounded-[12px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <Image src={icon1} alt='user-icon' width={64} className=' bg-[#FEE2E2] rounded-[12px] p-5' />
                <h1 className='text-[24px] font-semibold'>Create Account</h1>
                <p className='text[16px] lg:text-[20px] text-[#6C7278] leading-8'>Sign up with your email or university account. Takes less than 30 seconds.</p>
                </div>
            </div>

            <div className='flex flex-col items-center gap-2.5'>
                <Image src={number2Icon} alt='number2-icon' />
                <div className='flex flex-col gap-4 bg-[#FFFFFF] w-[320px] lg:w-[282px] p-6 rounded-[12px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <Image src={icon2} alt='bookmark-icon' width={64} className=' bg-[#DBEAFE] rounded-[12px] p-5' />
                <h1 className='text-[24px] font-semibold'>Add Courses</h1>
                <p className='text[16px] lg:text-[20px] text-[#6C7278] leading-8'>Input your course schedule for the semester. We’ll create organized space for each class.</p>
                </div>
            </div>

            <div className='flex flex-col items-center gap-2.5'>
                <Image src={number3Icon} alt='number3-icon' />
                <div className='flex flex-col gap-4 bg-[#FFFFFF] w-[320px] lg:w-[282px] p-6 rounded-[12px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <Image src={icon3} alt='tasks-icon' width={64} className=' bg-[#FCE7F3] rounded-[12px] p-5' />
                <h1 className='text-[24px] font-semibold'>Add Tasks</h1>
                <p className='text[16px] lg:text-[20px] text-[#6C7278] leading-8'>Start adding assignment , readings, and project. Set priorities and deadlines.</p>
                </div>
            </div>

            <div className='flex flex-col items-center gap-2.5'>
                <Image src={number4Icon} alt='number4-icon' />
                <div className='flex flex-col gap-4 bg-[#FFFFFF] w-[320px] lg:w-[282px] p-6 rounded-[12px] shadow-[0px_17px_29.7px_0px_#D1D8DF66]'>
                <Image src={icon4} alt='rocket-icon' width={64} className=' bg-[#F0FDF4] rounded-[12px] p-5' />
                <h1 className='text-[24px] font-semibold'>Stay Organized</h1>
                <p className='text[16px] lg:text-[20px] text-[#6C7278] leading-8'>Track progress, use the study timer, and watch your productivity soar.</p>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default HowItWorks