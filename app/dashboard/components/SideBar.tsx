import logo from '../../../public/images/landing_page_images/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavLinks from './NavLinks'
import { PlusIcon } from 'lucide-react'

const SideBar = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Link href='/' className='hidden md:flex items-center gap-1.5'>
        <Image src={logo} alt='focusgrid-logo' />
        <h1 className='font-semibold text-[16px] sm:text-[20px] text-[#000000]'>FocusGrid</h1>
      </Link>

      <button className="hidden md:flex gap-3 items-center w-fit bg-[#3399ff] text-white py-3 pl-3 pr-10 rounded-[8px] cursor-pointer shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]">
        <PlusIcon className="w-4 h-4 text-[#FFFFFF]" />
        <span className="text-[16px] font-semibold ">New Task</span>
      </button>

      <NavLinks />
    </div>
  )
}

export default SideBar