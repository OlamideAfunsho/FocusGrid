"use client"

import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import logo from '../public/images/landing_page_images/logo.svg'
import hamburgerMenu from '../public/images/landing_page_images/hamburger-menu.png'
import closeMenu from '../public/images/landing_page_images/close-menu.svg'

// const Navbar = () => {
//   return (
//     <div className='flex bg-[#0066ff]'>
//         <div className='app-logo flex items-center gap-1'>
//             <Image src={logo} alt='FocusGrid Logo' width={20} height={20} className=' ' />
//             <h1 className='font-bold'>FocusGrid</h1>
//         </div>
//     </div>
//   )
// }

const Navbar = () => {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '#features' },
        { name: 'How it works', href: '/' },
        { name: 'Testimonials', href: '/' },
        { name: 'Pricing', href: '/' },
        { name: 'FAQs', href: '/' },
    ];

    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    

    return (
        <div className="">
            
            <div className={`h-[69px] md:h-[88px] bg-[#FFFFFF] fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 lg:px-12 xl:px-[120px] z-50 shadow-[0px_17px_29.7px_0px_#D1D8DF]`}>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logo} alt="FocusGrid Logo" />
                        <h1 className={`font-semibold text-[18px] sm:text-[24px] text-[#000000] `}>FocusGrid</h1>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                            <Link key={i} href={link.href} className={`group flex flex-col gap-0.5 lg:text-[14px] xl:text-[16px] text-[#6C7278] font-medium`}>
                            {link.name}
                            <div className={` h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </Link>
                    ))}
                    
                </div>

                {/* Desktop Right */}
                <div className="flex items-center gap-8">
                    
                    <button className={`hidden lg:block text-[#6C7278] text-[16px] font-medium rounded-full ml-4 transition-all duration-500 cursor-pointer `}>
                        Sign in
                    </button>

                    <button className={`hidden lg:block p-3 text-[16px] text-[#FFFFFF] font-semibold rounded-[8px] cursor-pointer shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] `}>
                        Get started for free
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-8 lg:hidden">
                    <button className={`hidden sm:block text-[#6C7278] text-[16px] font-medium rounded-full ml-4 transition-all duration-500 cursor-pointer `}>
                        Sign in
                    </button>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}className='cursor-pointer'>
                        <Image src={hamburgerMenu} alt="Hamburger Menu" width={20} height={20} />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white/10 backdrop-blur-sm text-base flex flex-col lg:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-5 sm:top-8 right-4 md:right-8 cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                        <Image src={closeMenu} alt="Close Menu" width={20} height={20} />
                    </button>

                    {navLinks.map((link, i) => (
                        <Link key={i} href={link.href} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </Link>
                    ))}

                    <button className="bg-black text-white px-6 py-2.5 rounded-full transition-all duration-500">
                        Login
                    </button>

                    <button className="border px-6 py-2.5 text-sm font-light rounded-full cursor-pointer transition-all">
                        Get started
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar