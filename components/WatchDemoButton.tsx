"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import playIcon from "../public/images/landing_page_images/play-icon.svg";

const WatchDemoButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape and lock page scroll while the modal is open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    videoRef.current?.play().catch(() => {});
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex gap-2 items-center justify-center text-[#3399ff] p-3 rounded-[8px] cursor-pointer shadow-[0px_17px_29.7px_0px_#D1D8DF]"
      >
        <Image src={playIcon} alt="play-button-icon" width={24} />
        <span className="text-[16px] font-semibold ">Watch Demo</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="FocusGrid demo video"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 backdrop-blur-sm p-4"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[1100px]">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close demo video"
              className="absolute -top-12 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
            >
              <XIcon className="w-5 h-5 text-white" />
            </button>
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster="/videos/focusgrid-demo-poster.jpg"
              className="w-full rounded-[12px] shadow-[0px_17px_29.7px_0px_#00000055] bg-black"
            >
              <source src="/videos/focusgrid-demo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default WatchDemoButton;
