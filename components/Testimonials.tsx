"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import quoteIcon from '../public/images/landing_page_images/quote-icon.svg';

const Testimonials = () => {

    const testimonials = [
        { id: 1, date: "Jun 10, 2025", text: 'FocusGrid completely changed how I manage my coursework. I went from constantly missing deadlines to being ahead on all my assignments, The course organization is genius', name: "Daniel Gbesimowo", role: "Mathematics, Unilag.", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" },
        { id: 2, date: "Nov 22, 2025", text: "The Pomodoro timer integration is perfect. I’ve doubled my productive study hours and my grades have never been better. This app is a game-changer for any serious student.", name: "Jessica Taylor", role: "Psychology, Yale", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" },
        { id: 3, date: "Jan 10, 2026", text: 'Finally, a productivity app that understands student life! The group project features make collaboration so much easier.My team loves it.', name: "James Ogunsemore", role: "Digital Marketing, Princeton", img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" },
        { id: 4, date: "Apr 14, 2025", text: 'I was drowning in scattered notes and missed assignments before FocusGrid. Now everything is organized by course, and I can actually focus on learning instead of scrambling to remember what’s due.', name: "Dayo Omojuola", role: "Data Science, Harvard", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" },
        { id: 5, date: "Feb 27, 2026", text: 'The analytics feature helps me see where I’m spending my time. I’ve optimized my study schedule and have more free time than ever. Plus, the interface is gorgeous!', name: "Afunsho Olamide", role: "Software Engineering, MIT", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => prev + 3 >= testimonials.length ? 0 : prev + 3);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => prev - 3 < 0 ? Math.max(testimonials.length - 3, 0) : prev - 3);
    };

    useEffect(() => {
        if (!isMobile) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev + 1 >= testimonials.length ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [isMobile, testimonials.length]);


    return (
        <>
            
            <section className='bg-[#F7FAFF] p-12 lg:px-[120px] py-16' id='testimonials'>
               <div className="flex items-center gap-2.5 w-[146px] mx-auto bg-[#FFFFFF] rounded-[30px] p-2.5 shadow-[0px_17px_29.7px_0px_#D1D8DF]">
             <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
             <span className="text-[#6C7278] text-[14px] font-medium">TESTIMONIALS</span>
         </div>

         <h1 className="text-2xl leading-[38px] sm:text-4xl sm:leading-[60px]  font-bold text-center mt-8 mb-1">
           Loved and Used by Students Everywhere
         </h1>
         <p className="text[16px] lg:text-[20px] leading-9 text-[#6C7278] text-center">
           See how FocusGrid is transforming academic life
         </p>

  
                <div className='w-full max-w-6xl mx-auto'>

                    <div className='hidden md:flex justify-end gap-2'>
                        <div onClick={handlePrev} className='h-10 w-10 rounded-lg  border flex items-center justify-center cursor-pointer bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] text-white'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                        </div>
                        <div onClick={handleNext} className='h-10 w-10 rounded-lg  border flex items-center justify-center cursor-pointer bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] text-white'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </div>
                    </div>

                    <div className='mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 md:mt-6'>

                        {testimonials.slice(currentIndex, isMobile ? currentIndex + 1 : currentIndex + 3).map((item) => (
                            <div key={item.id} className='bg-[#FFFFFF] hover:-translate-y-1 transition duration-300 shadow-[0px_17px_29.7px_0px_#D1D8DF] rounded-2xl p-6 space-y-6'>
                                <div className='flex items-start justify-between'>
                                    <div className="flex">
                                        {Array(5).fill(0).map((_, i) => (
                                            <Image src={quoteIcon} alt='quotes' />
                                        ))}
                                    </div>
                                    <p className='text-xs text-[#6C7278]'>{item.date}</p>
                                </div>

                                <p className='text-sm/6 text-[#6C7278]'>{item.text}</p>
                                <div className='flex items-center gap-4 mt-4'>
                                    <img src={item.img} alt="User Avatar" className='w-13 h-13 rounded-full object-cover' />
                                    <div>
                                        <p className='text-[16px] text-[#36404A] font-semibold'>{item.name}</p>
                                        <p className='text-xs font-medium text-[#6C7278]'>{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden max-md:flex items-center justify-center mt-5 space-x-2">
                        {testimonials.map((_, index) => (
                            <span onClick={() => setCurrentIndex(index)} key={index}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                    ? "bg-white"
                                    : "bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]"
                                    }`}
                            ></span>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

// const Testimonials = () => {
//   return (
//     <>
//     <div className='bg-[#F7FAFF] p-12 lg:px-[120px] py-16' id='testimonials'>
//         <div className="flex items-center gap-2.5 w-[146px] mx-auto bg-[#FFFFFF] rounded-[30px] p-2.5 shadow-[0px_17px_29.7px_0px_#D1D8DF]">
//             <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
//             <span className="text-[#6C7278] text-[14px] font-medium">TESTIMONIALS</span>
//         </div>

//         <h1 className="text-2xl leading-[38px] sm:text-4xl sm:leading-[60px]  font-bold text-center mt-8 mb-1">
//           Loved and Used by Students Everywhere
//         </h1>
//         <p className="text[16px] lg:text-[20px] leading-9 text-[#6C7278] text-center">
//           See how FocusGrid is transforming academic life
//         </p>

//         {/* Testimonials containers */}
//         <div className='flex flex-wrap justify-center gap-6'>
//           <div className='bg-[#FFFFFF] rounded-[12px] gap-6 w-[]'></div>
//         </div>
//     </div>
//     </>
//   )
// }

export default Testimonials