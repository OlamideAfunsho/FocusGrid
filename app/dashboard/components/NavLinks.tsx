"use client";

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { HomeIcon, NotepadText, TimerIcon, CalendarIcon, NotebookIcon } from 'lucide-react'


const NavLinks = () => {

  const navlinks = [
    {
      name: 'Dashboard',
      mobileName: 'Dashboard',
      path: '/dashboard',
      icon: HomeIcon
    },

    {
      name: 'All Tasks',
      mobileName: 'Tasks',
      path: '/dashboard/all-tasks',
      icon: NotepadText
    },

    {
      name: 'Study Timer',
      mobileName: 'Timer',
      path: '/dashboard/study-timer',
      icon: TimerIcon
    },

    {
      name: 'Calendar',
      mobileName: 'Calendar',
      path: '/dashboard/calendar',
      icon: CalendarIcon
    },

    {
      name: 'Notes',
      mobileName: 'Notes',
      path: '/dashboard/notes',
      icon: NotebookIcon
    }
  ]

  const pathname = usePathname()

  return (
    <>
    <section>
      <div className='flex flex-row md:flex-col'>
        {navlinks.map((navlink) => {
          return(
            <Link
              key={navlink.name}
              href={navlink.path}
              className={clsx(
              'flex flex-col md:flex-row grow items-center justify-center gap-2 mt-1 rounded-[8px] p-3 text-[12px] font-normal hover:bg-[#EEF2FF] text-[#8F98A3] hover:text-[#3399FF] md:flex-none md:justify-start',
              {
                'md:bg-[#EEF2FF] text-[#3399FF]': pathname === navlink.path,
              },
              )}


            >
              <navlink.icon className={clsx('w-6 h-6', pathname === navlink.path ? 'text-[#3399FF]' : 'text-[#8F98A3] ')} />
              <p className='hidden md:block text-[16px] '>{navlink.name}</p>
              <p className='text-[12px] md:hidden'>{navlink.mobileName}</p>
            </Link>
          );
        })}
      </div>
    </section>
    </>
  )
}

export default NavLinks