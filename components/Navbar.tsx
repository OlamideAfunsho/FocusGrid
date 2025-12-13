"use client"

import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import logo from '../public/images/landing-page-images/focus-grid-logo.png'
import hamburgerMenu from '../public/images/landing-page-images/fries-menu-icon.png'
import closeMenu from '../public/images/landing-page-images/close-menu-icon.svg'

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
        { name: 'Features', href: '/' },
        { name: 'How it works', href: '/' },
        { name: 'Testimonials', href: '/' },
    ];

    const ref = useRef<HTMLDivElement>(null)

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                setIsScrolled(ref.current.scrollTop > 10);
            }
        };
        ref.current?.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div ref={ref} className="h-full overflow-y-scroll">
            
            <div className={`fixed top-0 left-0 bg-[#3399ff]  w-full flex items-center justify-between px-4 md:px-8 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logo} alt="FocusGrid Logo" className='w-[30px] h-[30px] sm:w-[50px] sm:h-[50px]' />
                    <h1 className={`font-bold text-[18px] sm:text-[24px] ${isScrolled ? "text-gray-700" : "text-white"}`}>FocusGrid</h1>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <Link key={i} href={link.href} className={`group flex flex-col gap-0.5 md:text-[12px] lg:text-[16px] ${isScrolled ? "text-gray-700" : "text-white"}`}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </Link>
                    ))}
                    
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">
                    
                    <button className={`px-6 py-2.5 text-sm rounded-full ml-4 transition-all duration-500 cursor-pointer ${isScrolled ? "text-white bg-black" : "bg-white text-black"} hover:bg-transparent hover:text-white hover:outline`}>
                        Login
                    </button>

                    <button className={`outline px-6 py-2.5 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all hover:bg-white hover:text-black hover:outline-transparent`}>
                        Get started
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Image src={hamburgerMenu} alt="Hamburger Menu" width={20} height={20} />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white/10 backdrop-blur-sm text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-5 sm:top-8 right-4" onClick={() => setIsMenuOpen(false)}>
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