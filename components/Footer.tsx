import React from 'react'
import Image from 'next/image'
import logo from '../public/images/landing_page_images/logo.svg'
import twitterIcon from '../public/images/landing_page_images/twitter-icon.svg'
import facebookIcon from '../public/images/landing_page_images/facebook-icon.svg'
import linkedinIcon from '../public/images/landing_page_images/linkedIn-icon.svg'
import instagramIcon from '../public/images/landing_page_images/instagram-icon.svg'

const Footer = () => {
  return (
    <>
    <section className='bg-[#111827] px-4 py-8 sm:p-12 lg:px-[120px] lg:py-16'>
        <section className='flex flex-col gap-8 md:gap-12 md:flex-row justify-between'>
            <div className='w-full lg:w-2/5'>
                <div className="flex items-center gap-2">
                    <Image src={logo} alt="FocusGrid Logo" />
                    <h1 className={`font-semibold text-[18px] sm:text-[24px] text-[#FFFFFF] `}>FocusGrid</h1>
                </div>
                <p className='text-[16px] md:text-[20px] leading-[30px] md:leading-9 text-[#8795A3] mt-4'>The ultimate productivity platform built specifically for students. Organize your academic life, stay focused, and achieve your goals.</p>
            </div>

            <div className='hidden md:flex flex-col gap-6'>
                <span className='text-[16px] sm:text-[20px] text-[#FFFFFF] font-semibold'>Product</span>
                <ul className='flex flex-col gap-4'>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Features</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Pricing</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Roadmap</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Changelog</span></li>
                </ul>
            </div>
            
            <div className='hidden md:flex flex-col gap-6'>
                <span className='text-[16px] sm:text-[20px] text-[#FFFFFF] font-semibold'>Company</span>
                <ul className='flex flex-col gap-4'>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>About</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Blog</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Careers</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Contact</span></li>
                </ul>
            </div>

            <div className='flex flex-col gap-4 md:gap-6'>
                <span className='text-[16px] sm:text-[20px] text-[#FFFFFF] font-semibold'>Support</span>
                <ul className='flex flex-col gap-4'>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Help Center</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Documentation</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>API</span></li>
                    <li><span className='text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Status</span></li>
                </ul>
            </div>
        </section>

        <div className='flex gap-4 mt-6'>
            <Image src={twitterIcon} alt="Twitter" className='cursor-pointer' />
            <Image src={instagramIcon} alt="Instagram" className='cursor-pointer' />
            <Image src={linkedinIcon} alt="LinkedIn" className='cursor-pointer' />
            <Image src={facebookIcon} alt="Facebook" className='cursor-pointer' />
        </div>

        <div className='flex gap-1 flex-col sm:flex-row justify-between sm:items-center border-t-2 pt-4 border-[#D9D8D80D] mt-8 md:mt-12'>
            <p className='text-[14px] text-[#8795A3]'>&copy; 2026 FocusGrid. All rights reserved.</p>
            <div>
                <span className='text-[14px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Privacy Policy</span>
                <span className='mx-1 text-[14px] text-[#8795A3]'>|</span>
                <span className='text-[14px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Terms of Service</span>
                <span className='mx-1 text-[14px] text-[#8795A3]'>|</span>
                <span className='text-[14px] text-[#8795A3] hover:text-[#3399FF] cursor-grab'>Cookies Policy</span>
            </div>
        </div>
    </section>
        
    </>
  )
}

export default Footer