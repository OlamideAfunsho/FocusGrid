import Problems from '@/components/Problems'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import React from 'react'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'

const HomePage = () => {
  return (
    <>
    <Navbar />
    <Hero />
    <Problems />
    <Features />
    <HowItWorks />
    <Testimonials />
    </>
  )
}

export default HomePage