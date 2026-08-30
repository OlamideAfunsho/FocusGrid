"use client";

import logo from '../../../public/images/landing_page_images/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavLinks from './NavLinks'
import { PlusIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

const SideBar = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>
  }

  return (
    <div className='flex flex-col gap-4 h-full'>
      <Link href='/' className='hidden md:flex items-center gap-1.5'>
        <Image src={logo} alt='focusgrid-logo' />
        <h1 className='font-semibold text-[16px] sm:text-[20px] text-[#000000]'>FocusGrid</h1>
      </Link>

      <button className="hidden md:flex gap-3 items-center w-fit bg-[#3399ff] text-white py-3 pl-3 pr-10 rounded-[8px] cursor-pointer shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]">
        <PlusIcon className="w-4 h-4 text-[#FFFFFF]" />
        <span className="text-[16px] font-semibold ">New Task</span>
      </button>

      <NavLinks />
      
      <div className='hidden md:flex items-center gap-3 bg-[#F9FAFB] p-3 rounded-[8px]'>
        <Image src={user?.imageUrl} alt='User avatar' width={32} height={32} className='rounded-full' />
        <div>
          <h1 className='font-semibold text-[#3E3A72]'>{user?.fullName}</h1>
          <span className='text-[12px] text-[#3E3A72]'>{user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? 'No email'}</span>
        </div>
      </div>
    </div>
  )
}

export default SideBar