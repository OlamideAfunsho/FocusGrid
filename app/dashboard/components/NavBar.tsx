import React from 'react'
import { BellIcon, SearchIcon } from 'lucide-react'

const NavBar = () => {
  return (
    <>
    <section>
      <div className='flex justify-between items-center'>
        <h1 className='text-[18px] font-semibold'>Dashboard</h1>
        
        <div className='flex items-center gap-6'>
          <div className='hidden md:flex items-center gap-2.5 bg-[#F9FAFB] rounded-[12px] p-4'>
            <SearchIcon className='w-4 h-4 text-[#A1A1A1]' />
            <input className='text-[14px] outline-none' type='text' placeholder='Search tasks, notes...' />
          </div>

          <BellIcon className='w-4 h-4 text-[#000000]' />
        </div>
      </div>
    </section>
    </>
  )
}

export default NavBar