import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import logo from '../../public/images/landing_page_images/logo.svg'

export const metadata: Metadata = {
  title: 'Coming soon',
  description: 'This part of FocusGrid is still being built.',
}

const ComingSoonPage = () => {
  return (
    <main className='min-h-dvh flex flex-col items-center justify-center text-center px-6 bg-[linear-gradient(109.51deg,_#EAF5FF_2.27%,_#F9FAFF_100%)]'>
      <Link href='/' className='flex items-center gap-2 mb-10'>
        <Image src={logo} alt='FocusGrid Logo' />
        <span className='font-semibold text-[20px] sm:text-[24px] text-[#000000]'>FocusGrid</span>
      </Link>

      <h1 className='text-3xl sm:text-4xl font-bold mb-4'>
        Work in <span className='text-[#3399ff]'>progress</span>
      </h1>
      <p className='text-[16px] sm:text-[20px] text-[#6C7278] max-w-[520px] leading-8'>
        This page is still being built. Everything else in FocusGrid works as normal, so head back and keep organizing your semester.
      </p>

      <div className='flex flex-col sm:flex-row gap-4 mt-8'>
        <Link
          href='/'
          className='p-3 px-6 text-[16px] text-white font-semibold rounded-[8px] shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]'
        >
          Back to home
        </Link>
        <Link
          href='/dashboard'
          className='p-3 px-6 text-[16px] text-[#3399ff] font-semibold rounded-[8px] bg-white shadow-[0px_17px_29.7px_0px_#D1D8DF]'
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  )
}

export default ComingSoonPage
