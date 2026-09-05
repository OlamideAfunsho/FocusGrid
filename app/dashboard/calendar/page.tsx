"use client";

import React from 'react'
import { motion } from 'framer-motion'

const page = () => {
  return (
    <div className="flex flex-col h-full">
    <h1 className="text-2xl">
        Academic <span className="text-[#3399FF]">Schedule</span>
    </h1>
    <p className="text-sm text-[#6C7278] mt-1">
        Visualize upcoming assignment deadlines, exam milestones, and planned study blocks in one central timeline.
    </p>
    
    <div className='flex h-full justify-center items-center'>
      <motion.h1
      initial={{ opacity: 0, scale: 0.8 }} // fade and slight shrink at start
        animate={{
          opacity: [0, 1, 1],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{
          opacity: { duration: 1, ease: 'easeInOut' }, // fade-in duration
          scale: {
            duration: 1.5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 0.5,
          },
        }}
      
      className='text-[#3399FF] text-5xl italic drop-shadow-[0_0_10px_rgba(51, 153, 255, 0.5)]'>
        Coming soon!!!
      </motion.h1>
    </div>
    </div>
  )
}

export default page