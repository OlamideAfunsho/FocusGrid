"use client";

import React, { useState } from "react";
import PricingCard from "./PricingCard";


const Pricing = () => {

  return (
    <>
      <section
        className="px-4 py-12 sm:p-12 lg:px-[120px] lg:py-16"
        id="pricing"
      >
        <div className="flex items-center gap-2.5 w-[99px] mx-auto bg-[#FFFFFF] rounded-[30px] p-2.5 shadow-[0px_17px_29.7px_0px_#D1D8DF]">
          <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
          <span className="text-[#6C7278] text-[14px] font-medium">
            PRICING
          </span>
        </div>

        <h1 className="text-2xl leading-[38px] sm:text-4xl sm:leading-[60px]  font-bold text-center mt-8 mb-1">
          Simple, Transparent Pricing
        </h1>
        <p className="text[16px] lg:text-[20px] leading-9 text-[#6C7278] text-center">
          Choose the plan that fits your academic journey.
        </p>

        <PricingCard />

        <p className="text-[14px] sm:text-[20px] text-[#6C7278] text-center sm:mb-2 sm:mt-6">
          All plans included 14-day free trial. No credit card required.
        </p>
        <p className="text-[14px] sm:text-[20px] text-[#000000] text-center">
          Student Discount: <span className="text-[#6C7278]">Get 50% off with via .edu email</span>
        </p>
      </section>
    </>
  );
};

export default Pricing;
