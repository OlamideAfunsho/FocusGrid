"use client";

import arrowIcon from '../public/images/landing_page_images/arrow-icon.svg';
import Image from 'next/image';
import React from 'react'

const FAQs = () => {

    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    const faqData = [
        {
            question: "Is FocusGrid really free?", 
            answer: "Yes! Our free plan includes core features like task management for up to 3 courses, study timer, and basic notes. You can upgrade to Pro anytime for advanced features."
        },
        {
            question: "How does the study timer work?", 
            answer: "Our study timer uses the Pomodoro technique, allowing you to set focused study intervals (e.g., 25 minutes) followed by short breaks. You can customize the durations to fit your workflow."
        },
        {
            question: "Can I collaborate with classmates?", 
            answer: "Yes, FocusGrid allows you to create shared study groups and collaborate on tasks and notes with your peers."
        },
        {
            question: "Can I use FocusGrid on my phone?", 
            answer: "Absolutely! FocusGrid works perfectly on desktop, tablet and mobile. Our responsive design ensures a seamless experience across all devices. Native mobile apps coming soon!"
        },
        {
            question: "What  happens to my data if I cancel?",
            answer: "If you cancel your subscription, you will still have access to your data and can continue using the free features. However, you will lose access to any Pro features and your account will be downgraded to the free plan."
        }

    ]

  return (
    <>
        <section className="px-4 py-12 sm:p-12 lg:px-[120px] lg:py-16 bg-[#F9FAFB]" id="FAQs">
            <div className="flex items-center gap-2.5 w-[77px] mx-auto bg-[#FFFFFF] rounded-[30px] p-2.5 shadow-[0px_17px_29.7px_0px_#D1D8DF]">
                <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
                <span className="text-[#6C7278] text-[14px] font-medium">
                    FAQs
                </span>
            </div>

            <h1 className="text-2xl leading-[38px] sm:text-4xl sm:leading-[60px]  font-bold text-center mt-8 mb-1">
            Frequently Asked Questions
            </h1>
            <p className="text[16px] lg:text-[20px] leading-9 text-[#6C7278] text-center">
            Here are some of the most common questions about FocusGrid and our features.
            </p>

            <div className='w-full mt-12 flex flex-col gap-4 items-start text-left'>
                {faqData.map((faq, index) => (
                    <div key={index} className='flex flex-col items-start w-full bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-4 sm:p-6 rounded cursor-pointer'>
                        <div className='flex items-center justify-between w-full' onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                            <h2 className="text-[16px] md:text-[20px] font-semibold text-[#000000]">{faq.question}</h2>
                            <Image src={arrowIcon} alt="Arrow" className={`${openIndex === index ? "rotate-90" : ""} transition-all duration-500 ease-in-out`}/>
                        </div>
                        <p className={`text-sm text-[#6C7278] transition-all duration-500 ease-in-out ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`}>
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    </>
  )
}

export default FAQs