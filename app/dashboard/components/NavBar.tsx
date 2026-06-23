import React from 'react'
import { BellIcon, SearchIcon } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image';


const NavBar = async () => {

  const user = await currentUser();

  if (!user) return <div>Not signed in</div>;

  return (
    <>
    <section>
      <div className='flex justify-between items-center'>
        <h1 className='text-[18px] font-semibold'>Dashboard</h1>
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