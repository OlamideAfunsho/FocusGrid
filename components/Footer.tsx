import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../public/images/landing_page_images/logo.svg'

// The address shown publicly on the site — change this to whichever inbox should receive support mail
const CONTACT_EMAIL = 'abolamide77@gmail.com'

const linkClass = 'text-[14px] sm:text-[16px] text-[#8795A3] hover:text-[#3399FF] cursor-pointer'

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
                    <li><a href='#features' className={linkClass}>Features</a></li>
                    <li><a href='#how-it-works' className={linkClass}>How it works</a></li>
                    <li><a href='#testimonials' className={linkClass}>Testimonials</a></li>
                    <li><a href='#FAQs' className={linkClass}>FAQs</a></li>
                </ul>
            </div>

            <div className='flex flex-col gap-4 md:gap-6'>
                <span className='text-[16px] sm:text-[20px] text-[#FFFFFF] font-semibold'>Support</span>
                <ul className='flex flex-col gap-4'>
                    <li><a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>Contact</a></li>
                    <li><Link href='/coming-soon' className={linkClass}>Help Center</Link></li>
                    <li><Link href='/coming-soon' className={linkClass}>Documentation</Link></li>
                </ul>
            </div>
        </section>

        <div className='flex gap-1 flex-col sm:flex-row justify-between sm:items-center border-t-2 pt-4 border-[#D9D8D80D] mt-8 md:mt-12'>
            <p className='text-[14px] text-[#8795A3]'>&copy; 2026 FocusGrid. All rights reserved.</p>
            <div>
                <Link href='/privacy' className='text-[14px] text-[#8795A3] hover:text-[#3399FF] cursor-pointer'>Privacy Policy</Link>
                <span className='mx-1 text-[14px] text-[#8795A3]'>|</span>
                <Link href='/coming-soon' className='text-[14px] text-[#8795A3] hover:text-[#3399FF] cursor-pointer'>Terms of Service</Link>
            </div>
        </div>
    </section>

    </>
  )
}

export default Footer
