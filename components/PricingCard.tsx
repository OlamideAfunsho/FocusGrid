"use client";

import React, { useState } from 'react'

import checkMarkGreen from "../public/images/landing_page_images/checkmark-green.svg";
import checkMarkWhite from "../public/images/landing_page_images/checkmark-white.svg";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PricingCard = () => {

    const [isYearly, setIsYearly] = useState(false);

  return (
    <>
    <div className="flex justify-between gap-0 sm:gap-4 p-1 sm:p-2 bg-[#F5F7FD] w-[250px] sm:w-[268px] mx-auto my-8 rounded-[12px]">
          <button
            onClick={() => setIsYearly(false)}
            className={
              !isYearly
                ? "text-[14px] sm:text-[16px] font-semibold text-[#FFFFFF] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] p-3 rounded-[8px]"
                : "bg-none text-[14px] sm:text-[16px] font-semibold text-[#6C7278] p-3 cursor-pointer"
            }
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={
              isYearly
                ? "text-[14px] sm:text-[16px] font-semibold text-[#FFFFFF] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] p-3 rounded-[8px]"
                : "bg-none text-[14px] sm:text-[16px] font-semibold text-[#6C7278] p-3 cursor-pointer"
            }
          >
            Yearly
            <span
              className={
                !isYearly
                  ? "bg-[#E2F0FF] rounded-[12px] px-2 py-1 text-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] text-[10px] font-medium ml-2"
                  : "bg-none text-[10px] font-medium ml-2"
              }
            >
              Save 10%
            </span>
          </button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="cards-con-mobile w-full max-w-md mx-auto xl:hidden relative"
        >
          <CarouselContent>
            <CarouselItem>
              <div className="card-1 flex flex-col w-[280px] sm:w-11/12 mx-auto h-[468px] border-2 border-[#F0F0F0] rounded-[20px] p-6">
                <h1
                  className={`text-[20px] text-center font-semibold text-[#000000]`}
                >
                  Free
                </h1>

                <p className="text-[#6C7278] text-center font-medium text-[14px] mt-2">
                  Perfect for getting started
                </p>
                <span className="text-4xl text-center font-bold text-[#000000] mt-4 mb-4">
                  $0
                  <span className="text-[14px] font-medium text-[#6C7278]">
                    {!isYearly ? "/month" : "/year"}
                  </span>
                </span>
                <button className="text-[#FFFFFF] text-[14px] p-3 bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] rounded-[8px] cursor-pointer">
                  Get started for free
                </button>

                <div className={`features-list flex flex-col gap-4 mt-8`}>
                  <div className="features-list-item flex gap-2 ">
                    <Image
                      src={checkMarkGreen}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#565758]">
                      Up to 3 courses
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkGreen}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#565758]">
                      Basic in-app reminders
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkGreen}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#565758]">
                      Dashboard view
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="card-2 flex flex-col w-[280px] sm:w-11/12 mx-auto h-[468px] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] rounded-[20px] p-6">
                <h1
                  className={`text-[20px] text-center font-bold text-[#FFFFFF] `}
                >
                  Pro
                </h1>
                <p className="text-[#FFFFFF] text-center text-[14px] font-medium mt-2">
                  For serious students
                </p>

                <span className="text-4xl font-bold text-center text-[#FFFFFF]  mt-4 mb-4">
                  {!isYearly ? "$20" : "$200"}
                  <span className="text-[14px] font-medium text-[#FFFFFF]">
                    {!isYearly ? "/month" : "/year"}
                  </span>
                </span>
                <button className="text-[#3399FF] text-[14px] p-3 bg-[#FFFFFF] rounded-[8px] cursor-pointer">
                  Go Pro
                </button>

                <div
                  className={`features-list flex flex-col gap-4 text-[#FFFFFF] mt-6`}
                >
                  <div className="features-list-item flex gap-2 ">
                    <Image
                      src={checkMarkWhite}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#FFFFFF]">
                      Unlimited courses
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkWhite}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#FFFFFF]">
                      Advanced task management
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkWhite}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#FFFFFF]">
                      Custom study timers
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkWhite}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#FFFFFF]">
                      Rich text notes
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkWhite}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#FFFFFF]">
                      Group collaboration
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkWhite}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#FFFFFF]">
                      Priority support
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="card-3 flex flex-col w-[280px] sm:w-11/12 mx-auto h-[526px] border-2 border-[#F0F0F0] rounded-[20px] p-6 mb-6">
                <h1
                  className={`text-[20px] text-center font-semibold text-[#000000]`}
                >
                  Team
                </h1>

                <p className="text-[#6C7278] text-center font-medium text-[14px] mt-2">
                  Perfect for study groups and tutors
                </p>
                <span className="text-4xl text-center font-bold text-[#000000] mt-4 mb-4">
                  {!isYearly ? "$29" : "$290"}
                  <span className="text-[14px] font-medium text-[#6C7278]">
                    {!isYearly ? "/month" : "/year"}
                  </span>
                </span>
                <button className="text-[#FFFFFF] text-[14px] p-3 bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] rounded-[8px] cursor-pointer">
                  Contact Sales
                </button>

                <div className={`features-list flex flex-col gap-4 mt-6`}>
                  <div className="features-list-item flex gap-2 ">
                    <Image
                      src={checkMarkGreen}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#565758]">
                      Everything in pro
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkGreen}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#565758]">
                      Up to 10 team members
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkGreen}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#565758]">
                      Shared workspace
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkGreen}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#565758]">
                      Team analytics
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkGreen}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#565758]">
                      Admin controls
                    </span>
                  </div>
                  <div className="features-list-item flex gap-3 ">
                    <Image
                      src={checkMarkGreen}
                      alt="check"
                      width={20}
                      height={20}
                    />
                    <span className="text-[14px] text-[#565758]">
                      Dedicated support
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className=" ml-10" />
          <CarouselNext className=" mr-10" />
        </Carousel>

        {/* Desktop view */}
        <div className="hidden cards-con-desktop xl:flex gap-[34px] justify-center items-center ">
          <div className="card-1 flex flex-col w-[384px] h-[536px] border-2 border-[#F0F0F0] rounded-[20px] p-9">
            <h1
              className={`text-[24px] text-center font-semibold text-[#000000]`}
            >
              Free
            </h1>

            <p className="text-[#6C7278] text-center font-medium text-[16px]">
              Perfect for getting started
            </p>
            <span className="text-5xl text-center font-bold text-[#000000] mt-6 mb-6">
              $0
              <span className="text-[16px] font-medium text-[#6C7278]">
                {!isYearly ? "/month" : "/year"}
              </span>
            </span>
            <button className="text-[#FFFFFF] p-3 bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] rounded-[8px] cursor-pointer">
              Get started for free
            </button>

            <div className={`features-list flex flex-col gap-4 mt-6`}>
              <div className="features-list-item flex gap-2 ">
                <Image
                  src={checkMarkGreen}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#565758]">
                  Up to 3 courses
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkGreen}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#565758]">
                  Basic in-app reminders
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkGreen}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#565758]">
                  Dashboard view
                </span>
              </div>
            </div>
          </div>

          <div className="card-2 flex flex-col w-[384px] h-[568px] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] rounded-[20px] p-9">
            <h1 className={`text-[24px] text-center font-bold text-[#FFFFFF] `}>
              Pro
            </h1>
            <p className="text-[#FFFFFF] text-center text-[16px] font-medium">
              For serious students
            </p>

            <span className="text-[48px] font-bold text-center text-[#FFFFFF]  mt-6 mb-6">
              {!isYearly ? "$20" : "$200"}
              <span className="text-[16px] font-medium text-[#FFFFFF]">
                {!isYearly ? "/month" : "/year"}
              </span>
            </span>
            <button className="text-[#3399FF] p-3 bg-[#FFFFFF] rounded-[8px] cursor-pointer">
              Go Pro
            </button>

            <div
              className={`features-list flex flex-col gap-4 text-[#FFFFFF] mt-6`}
            >
              <div className="features-list-item flex gap-2 ">
                <Image
                  src={checkMarkWhite}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#FFFFFF]">
                  Unlimited courses
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkWhite}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#FFFFFF]">
                  Advanced task management
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkWhite}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#FFFFFF]">
                  Custom study timers
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkWhite}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#FFFFFF]">
                  Rich text notes
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkWhite}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#FFFFFF]">
                  Group collaboration
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkWhite}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#FFFFFF]">
                  Priority support
                </span>
              </div>
            </div>
          </div>

          <div className="card-3 flex flex-col w-[384px] h-[526px] border-2 border-[#F0F0F0] rounded-[20px] p-9">
            <h1
              className={`text-[24px] text-center font-semibold text-[#000000]`}
            >
              Team
            </h1>

            <p className="text-[#6C7278] text-center font-medium text-[16px]">
              Perfect for study groups and tutors
            </p>
            <span className="text-5xl text-center font-bold text-[#000000] mt-6 mb-6">
              {!isYearly ? "$29" : "$290"}
              <span className="text-[16px] font-medium text-[#6C7278]">
                {!isYearly ? "/month" : "/year"}
              </span>
            </span>
            <button className="text-[#FFFFFF] p-3 bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)] rounded-[8px] cursor-pointer">
              Contact Sales
            </button>

            <div className={`features-list flex flex-col gap-4 mt-6`}>
              <div className="features-list-item flex gap-2 ">
                <Image
                  src={checkMarkGreen}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#565758]">
                  Everything in pro
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkGreen}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#565758]">
                  Up to 10 team members
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkGreen}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#565758]">
                  Shared workspace
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkGreen}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#565758]">
                  Team analytics
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkGreen}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#565758]">
                  Admin controls
                </span>
              </div>
              <div className="features-list-item flex gap-3 ">
                <Image
                  src={checkMarkGreen}
                  alt="check"
                  width={20}
                  height={20}
                />
                <span className="text-[16px] text-[#565758]">
                  Dedicated support
                </span>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default PricingCard