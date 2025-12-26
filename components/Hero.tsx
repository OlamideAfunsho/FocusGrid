import { inter } from "@/app/font";
import Image from "next/image";
import React from "react";
// import heroImage from "../public/images/landing_page_images/hero-image.jpg";
import arrowRight from '../public/images/landing_page_images/arrow-right.svg'
import playIcon from "../public/images/landing_page_images/play-icon.svg";
import avatars from '../public/images/landing_page_images/avatars-group.svg'
import stars from '../public/images/landing_page_images/stars-group.svg'
import dashboardImage from '../public/images/landing_page_images/dashboard-image.svg'

const Hero = () => {
  return (
    <>
      <div className="hero-section bg-[linear-gradient(109.51deg,_#EAF5FF_2.27%,_#F9FAFF_100%)] flex flex-col xl:flex-row mt-10 md:mt-20 pt-20 pb-20 items-center justify-around px-4 sm:px-16 lg:px-32 ">
        <div>
          <div className="flex items-center gap-2.5 w-[311px] mx-auto md:mx-0 bg-[#FFFFFF] rounded-[30px] p-2.5 mb-6 shadow-[0px_17px_29.7px_0px_#D1D8DF]">
            <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
            <span className="text-[#6C7278] text-[14px] font-medium">Trusted by 50,000+ students worldwide</span>
          </div>
          <h1
            className={` text-4xl/10 sm:text-5xl font-bold mb-6 leading-12 md:leading-[60px] text-center md:text-left`}
          >
            Your Academic Life, <br />{" "}
            <span className="text-[#3399ff]">Organized</span>
          </h1>
          <p className="w-full mt-2 text-[20px] text-[#6C7278] leading-9 text-center md:text-left">
            Stop juggling multiple apps and scatterd notes. FocusGrid brings your tasks, assignments, deadlines, and study sessions into one powerful platform designed specifiaclly for students.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button className="flex gap-3 items-center justify-center bg-[#3399ff] text-white p-3 rounded-[8px] cursor-pointer shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]">
              <span className="text-[16px] font-semibold ">Start Free trial</span>
              <Image src={arrowRight} alt="arrow-right" width={24} />
            </button>
            <button className="flex gap-2 items-center justify-center text-[#3399ff] p-3 rounded-[8px] cursor-pointer shadow-[0px_17px_29.7px_0px_#D1D8DF]">
              <Image src={playIcon} alt="play-button-icon" width={24} /> 
              <span className="text-[16px] font-semibold ">Watch Demo</span>
            </button>
          </div>

          {/* Reviews */}
          <div className="flex gap-1 mt-12 md:mt-[54px]">
            <Image src={avatars} alt="group of avatars" />
            <div>
              <Image src={stars} alt="5 stars" />
              <span className="text-[14px] text-[#6C7278] font-medium">4.9/5 from 2500+ reviews</span>
            </div>
          </div>
        </div>

        {/* <Image src={heroImage} alt="hero-image" className="sm:w-full md:w-1/2 h-[400px] sm:h-[500px] rounded-lg" /> */}
        <Image src={dashboardImage} alt="image-of-the-dashboard-mockup" />
      </div>
    </>
  );
};

export default Hero;
