import Problems from '@/components/Problems'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import React from 'react'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import Pricing from '@/components/Pricing'
import FAQs from '@/components/FAQs'
import SubFooter from '@/components/SubFooter'
import Footer from '@/components/Footer'

const HomePage = () => {
  return (
    <>
    <Navbar />
    <Hero />
    <Problems />
    <Features />
    <HowItWorks />
    <Testimonials />
    <Pricing />
    <FAQs />
    <SubFooter />
    <Footer />
    </>
  )
}

export default HomePage