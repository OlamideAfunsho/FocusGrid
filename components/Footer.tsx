import React from 'react'
import Image from 'next/image'
import logo from '../public/images/landing_page_images/logo.svg'

const Footer = () => {
  return (
    <>
        <section className='flex flex-col gap-12 md:flex-row justify-between bg-[#111827] px-4 py-12 sm:p-12 lg:px-[120px] lg:py-16'>
            <div className='w-3/4 lg:w-2/5'>
                <div className="flex items-center gap-2">
                    <Image src={logo} alt="FocusGrid Logo" />
                    <h1 className={`font-semibold text-[18px] sm:text-[24px] text-[#FFFFFF] `}>FocusGrid</h1>
                </div>
                <p className='text-[16px] md:text-[20px] leading-[30px] md:leading-9 text-[#8795A3] mt-4'>The ultimate productivity platform built specifically for students. Organize your academic life, stay focused, and achieve your goals.</p>
            </div>

            <div className='flex flex-col gap-6'>
                <span className='text-[16px] sm:text-[20px] text-[#FFFFFF] font-semibold'>Product</span>
                <ul className='flex flex-col gap-4'>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Features</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Pricing</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Roadmap</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Changelog</span></li>
                </ul>
            </div>
            
            <div className='flex flex-col gap-6'>
                <span className='text-[16px] sm:text-[20px] text-[#FFFFFF] font-semibold'>Company</span>
                <ul className='flex flex-col gap-4'>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>About</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Blog</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Careers</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Contact</span></li>
                </ul>
            </div>

            <div className='flex flex-col gap-6'>
                <span className='text-[16px] sm:text-[20px] text-[#FFFFFF] font-semibold'>Support</span>
                <ul className='flex flex-col gap-4'>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Help Center</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Documentation</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>API</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Status</span></li>
                </ul>
            </div>
        </section>
    </>
  )
}

export default Footer