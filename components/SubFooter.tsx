import React from 'react'
import Image from 'next/image'
import arrowIcon from "../public/images/landing_page_images/arrow-right-02.svg";
import playIcon from "../public/images/landing_page_images/play-icon-02.svg";
import dashboardImage from "../public/images/landing_page_images/dashboard-image.png";

const SubFooter = () => {
  return (
    <>
    <section className='flex flex-col md:flex-row bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]'>
        <div className='px-4 py-8 sm:p-12 lg:px-[120px] self-center text-center md:text-left'>
            <h1 className='text-2xl sm:text-4xl leading-10 sm:leading-[60px] font-bold text-white mb-4'>Ready to Transform Your Academic Life?</h1>
            <p className='text-[18px] sm:text-[20px] text-white mb-6'>Join 50, 000+ students who are staying organized and achieving their goals with FocusGrid</p>

            <div className='flex gap-4 w-full justify-center md:justify-start'>
                <button className='flex items-center gap-2 rounded-[8px] p-3 bg-[#FFFFFF] cursor-pointer hover:gap-3 transition duration-500'>
                    <span className='text-[14px] sm:text-[16px] text-[#3399FF] font-semibold'>Start Free Trial</span>
                    <Image src={arrowIcon} alt="Arrow" className='w-4 h-4 sm:w-6 sm:h-6'/>
                </button>
                <button className='flex items-center gap-2 rounded-[8px] p-3 border-2 border-[#FFFFFF] cursor-pointer hover:gap-3 transition duration-500'>
                    <Image src={playIcon} alt="Play" className='w-4 h-4 sm:w-6 sm:h-6'/>
                    <span className='text-[14px] sm:text-[16px] text-[#FFFFFF] font-semibold'>Watch Demo</span>
                </button>
            </div>
        </div>
        
        <div>
            <Image src={dashboardImage} alt="Dashboard" className='w-full h-full md:w-[700px] object-contain lg:mt-16'/>
        </div>

    </section>
    </>
  )
}

export default SubFooter
