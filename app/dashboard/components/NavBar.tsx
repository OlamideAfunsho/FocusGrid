"use client";

import React from 'react'
import logo from '../../../public/images/landing_page_images/logo.svg'
import { BellIcon, SearchIcon } from 'lucide-react'
// import { currentUser } from '@clerk/nextjs/server' // This package won't work because it's guarded by server-only and we've used "use client" at the top of the page
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';


const NavBar = () => {

  const pathname = usePathname();

  const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/all-tasks': 'Tasks',
    '/dashboard/study-timer': 'Timer',
    '/dashboard/settings': 'Settings',
    '/dashboard/courses': 'Courses',
  };

  const currentTitle = routeTitles[pathname];

  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>
  }

  return (
    <>
    <section>
      <div className='flex justify-between items-center'>
        <Link href='/' className='flex md:hidden items-center gap-1.5'>
          <Image src={logo} alt='focusgrid-logo' />
          <h1 className='font-semibold text-[16px] sm:text-[20px] text-[#000000]'>FocusGrid</h1>
        </Link>
        <h1 className='hidden md:block text-[18px] font-semibold'>{currentTitle}</h1>
        {/* <h1 className='text-[18px] font-semibold'>Hey, {user.firstName || 'User'}</h1> */}
        {/* <p className="text-xs text-neutral-500">
          Logged in as: {user.emailAddresses[0]?.emailAddress}
        </p> */}
        
        <div className='flex items-center gap-6'>
          <div className='hidden md:flex items-center gap-2.5 bg-[#F9FAFB] rounded-[12px] p-4'>
            <SearchIcon className='w-4 h-4 text-[#A1A1A1]' />
            <input className='text-[14px] outline-none' type='text' placeholder='Search tasks, notes...' />
          </div>

          <BellIcon className='w-4 h-4 text-[#000000]' />
          <Image src={user.imageUrl} alt='User avatar' width={40} height={40} className='rounded-full' />
        </div>
      </div>
    </section>
    </>
  )
}

export default NavBar