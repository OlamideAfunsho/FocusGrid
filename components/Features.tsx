import React from "react";
import Image from "next/image";
import featuresImage1 from "../public/images/landing_page_images/features-image-1.svg";
import featuresImage2 from "../public/images/landing_page_images/features-image-2.svg";
import featuresImage3 from "../public/images/landing_page_images/features-image-3.svg";
import checkMark from "../public/images/landing_page_images/check-mark.svg";

const Features = () => {
  return (
    <>
      <div className="px-4 py-12 sm:p-12 lg:px-[120px] lg:py-16" id="features">
        <div className="flex items-center gap-2.5 w-[114px] mx-auto bg-[#FFFFFF] rounded-[30px] p-2.5 shadow-[0px_17px_29.7px_0px_#D1D8DF]">
          <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
          <span className="text-[#6C7278] text-[14px] font-medium">
            FEATURES
          </span>
        </div>

        <h1 className="text-2xl sm:text-[32px] lg:text-4xl font-bold text-[#000000] leading-9 sm:leading-[60px] mt-8 mb-1 text-center">
          Everything You Need To Excel
        </h1>
        <p className="text-[#6C7278] text-[16px] lg:text-[20px] leading-9 w-full xl:w-1/2 mx-auto text-center">
          Built specifically for students, with features that understand your
          academic workflow.
        </p>

        {/* features-con */}
        <div className="flex flex-col gap-8 md:gap-12">
          {/* feature 1 */}
          <div className="flex flex-col lg:flex-row gap-10 md:gap-14 mt-12 md:mt-16">
              <Image
                src={featuresImage1}
                alt="features-image-1"
                className="bg-[#F0FDF4] rounded-[12px] w-full pt-6 lg:pt-8 mx-auto"
              />
            <div className="">
              <div className="flex items-center gap-2.5 w-[165px] bg-[#F0FDF4] rounded-[30px] p-2.5">
                <span className="bg-[#08BD4D] w-3 h-3 rounded-full"></span>
                <span className="text-[#08BD4D] text-[14px] font-medium">
                  Task management
                </span>
              </div>

              <h1 className="text-[20px] sm:text-[24px] lg:text-[32px] mt-6 mb-2">
                Course-Organized Tasks
              </h1>
              <p className="text-[16px] sm:text-[20px] text-[#6C7278] leading-7 sm:leading-9 mb-4">
                Say goodbye to generic to-do lists. Organize your assignments,
                readings and projects by course. See everything at a glance with
                priority indicators, deadline countdowns, and completion
                tracking.
              </p>

              <div className="flex items-start gap-2 mb-[18px]">
                <Image src={checkMark} alt="check-mark" className="" />
                <h1>
                  <span className="text-[16px] font-medium text-[#565758] mb-2">
                    Smart Course Grouping
                  </span>{" "}
                  <br />
                  <span className="text-[16px] text-[#6C7278]">
                    Automatically organize tasks by course with color coding
                  </span>
                </h1>
              </div>

              <div className="flex items-start gap-2 mb-[18px]">
                <Image src={checkMark} alt="check-mark" className="" />
                <h1>
                  <span className="text-[16px] font-medium text-[#565758] mb-2">
                    Priority Management
                  </span>{" "}
                  <br />
                  <span className="text-[16px] text-[#6C7278]">
                    Tag tags as urgent, important, or routine.
                  </span>
                </h1>
              </div>

              <div className="flex items-start gap-2">
                <Image src={checkMark} alt="check-mark" className="" />
                <h1>
                  <span className="text-[16px] font-medium text-[#565758] mb-2">
                    Deadline Reminders
                  </span>{" "}
                  <br />
                  <span className="text-[16px] text-[#6C7278]">
                    Never miss an assignment with smart notifications.
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* feature 2 */}
          <div className="flex flex-col-reverse lg:flex-row gap-14 mt-16">
            <div className="">
              <div className="flex items-center gap-2.5 w-[124px] bg-[#F0F7FF] rounded-[30px] p-2.5">
                <span className="bg-[#3399FF] w-3 h-3 rounded-full"></span>
                <span className="text-[#3399FF] text-[14px] font-medium">
                  Study Timer
                </span>
              </div>

              <h1 className="text-[20px] sm:text-[24px] lg:text-[32px] mt-6 mb-2">
                Built-in Pomodoro Timer
              </h1>
              <p className="text-[16px] sm:text-[20px] text-[#6C7278] leading-7 sm:leading-9 mb-4">
                Maximize your focus with our integrated study timer. USe the proven Pomodoro technique or customize you own study intervals. Track your productive hours and build consistent study habits.
              </p>

              <div className="flex items-start gap-2 mb-[18px]">
                <Image src={checkMark} alt="check-mark" className="" />
                <h1>
                  <span className="text-[16px] font-medium text-[#565758] mb-2">
                    Customizable Sessions
                  </span>{" "}
                  <br />
                  <span className="text-[16px] text-[#6C7278]">
                    Set your own focus and break durations
                  </span>
                </h1>
              </div>

              <div className="flex items-start gap-2 mb-[18px]">
                <Image src={checkMark} alt="check-mark" className="" />
                <h1>
                  <span className="text-[16px] font-medium text-[#565758] mb-2">
                    Study Statistics
                  </span>{" "}
                  <br />
                  <span className="text-[16px] text-[#6C7278]">
                    Track total study hours per course and week
                  </span>
                </h1>
              </div>

              <div className="flex items-start gap-2">
                <Image src={checkMark} alt="check-mark" className="" />
                <h1>
                  <span className="text-[16px] font-medium text-[#565758] mb-2">
                    Break Reminders
                  </span>{" "}
                  <br />
                  <span className="text-[16px] text-[#6C7278]">
                    Gentle nudges to take breaks and stay fresh
                  </span>
                </h1>
              </div>
            </div>

            <Image
                src={featuresImage2}
                alt="features-image-2"
                className="bg-[#F0F6FF] rounded-[12px] w-full p-8 sm:p-14 mx-auto"
              />
          </div>

          {/* feature 3 */}
          <div className="flex flex-col lg:flex-row gap-14 mt-16">
              <Image
                src={featuresImage3}
                alt="features-image-3"
                className="bg-[#FCE7F3] rounded-[12px] w-full mx-auto pt-8 sm:pt-14 lg:pt-10"
              />

            <div className="">
              <div className="flex items-center gap-2.5 w-[126px] bg-[#FCE7F3] rounded-[30px] p-2.5">
                <span className="bg-[#FF4DB3] w-3 h-3 rounded-full"></span>
                <span className="text-[#FF4DB3] text-[14px] font-medium">
                  Smart Notes
                </span>
              </div>

              <h1 className="text-[20px] sm:text-[24px] lg:text-[32px] mt-6 mb-2">
                Course-Linked Notes
              </h1>
              <p className="text-[16px] sm:text-[20px] text-[#6C7278] leading-7 sm:leading-9 mb-4">
                Keep all your lecture note, study materials, and quick thoughts organized by course. Rich text-formatting, tagging and powerful search make finding information effortless
              </p>

              <div className="flex items-start gap-2 mb-[18px]">
                <Image src={checkMark} alt="check-mark" className="" />
                <h1>
                  <span className="text-[16px] font-medium text-[#565758] mb-2">
                    Rich Text Editor
                  </span>{" "}
                  <br />
                  <span className="text-[16px] text-[#6C7278]">
                    Format notes with headers , lists, and highlights
                  </span>
                </h1>
              </div>

              <div className="flex items-start gap-2 mb-[18px]">
                <Image src={checkMark} alt="check-mark" className="" />
                <h1>
                  <span className="text-[16px] font-medium text-[#565758] mb-2">
                    Quick Capture
                  </span>{" "}
                  <br />
                  <span className="text-[16px] text-[#6C7278]">
                    Jot down ideas instantly during lectures
                  </span>
                </h1>
              </div>

              <div className="flex items-start gap-2">
                <Image src={checkMark} alt="check-mark" className="" />
                <h1>
                  <span className="text-[16px] font-medium text-[#565758] mb-2">
                    Powerful search
                  </span>{" "}
                  <br />
                  <span className="text-[16px] text-[#6C7278]">
                    Find any note across all course instantly
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
