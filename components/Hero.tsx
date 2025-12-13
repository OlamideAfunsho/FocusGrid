import { inter } from '@/app/font'
import Image from 'next/image'
import React from 'react'
// import heroImage from '../public/images/landing-page-images/he'
import playIcon from '../public/images/landing-page-images/play-button-icon.png'

const Hero = () => {
  return (
    <>
    <div className="hero-section mt-30 px-8 text-center py-16 sm:py-24 lg:py-32">
        <h1 className={`${inter.className} text-4xl/10 sm:text-6xl/18 font-semibold text-center`}>Your Space <br /> <span className='text-[#3399ff]'>To Study Smarter</span></h1>
        <p className='text-center  w-full sm:w-1/2 mx-auto mt-2 text-lg text-[#4a5565]'>
            Boost your productivity and focus with <span className='font-semibold'>FocusGrid</span> - the ultimate study companion.
            {/* FocusGrid helps you create a distraction-free study environment by breaking your tasks into manageable intervals,
            allowing you to stay focused and achieve your academic goals with ease. */}
        </p>

        <div className='flex flex-col sm:flex-row gap-2 justify-center mt-8'>
            <button className='bg-[#3399ff] text-white px-10 py-3 sm:py-2.5 rounded-full shadow-[inset_0px_4px_11.2px_0px_#FAFAFAA1]'>Get Started</button>
            <button className='flex gap-1 items-center justify-center border border-[#3399ff] text-[#3399ff] px-6 py-2.5 rounded-full'><Image src={playIcon} alt='play-button-icon' width={30}/> Watch Demo</button>
        </div>
        
    </div>
    </>
  )
}

export default Hero