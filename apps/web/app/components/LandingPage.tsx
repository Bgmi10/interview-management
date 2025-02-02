"use client";
import { Badge } from "@/components/ui/badge";
import { FlipWords } from "@/components/ui/flip-words";
import React from "react";

export function LandingPage() {
  return (
    <> 
      <div className="lg:min-h-screen lg:mt-0 sm: mt-20 relative flex flex-col items-center justify-center overflow-hidden">
        <Badge text="Revolutionizing Expert Evaluation" endLimit={100} />
        <h1 className="md:text-7xl relative dark:from-white dark:to-[#AAAAAA] mx-6 w-[300px] bg-gradient-to-b from-black/80 to-black bg-clip-text pb-4 text-center font-extrabold leading-tight text-transparent md:!w-full lg:text-6xl xl:leading-snug sm: text-2xl">
          Match Expertise with Precision{" "}
          <span className="inline-block">
            for Smarter Hiring Decisions
          </span>
          <FlipWords
            words={[
              { word: "Accuracy", color: "#ff3b3b" },
              { word: "Relevance", color: "#ff9f0a" }, 
              { word: "Efficiency", color: "#00a3ff" },
            ]}
          />
        </h1>
        <p className="sm: text-sm text-center mt-5 max-w-3xl mx-6 max-h-[112px] w-[315px] text-[#666666] md:max-h-[96px] md:w-[700px] md:text-xl dark:text-[#888888]">
          Our platform leverages advanced algorithms to analyze and match candidate expertise with the interview board's subject matter.
        </p>
        <div className="flex gap-4 mt-10">
          <button className="cursor-pointer px-6 py-2 bg-transparent border border-gray-600 dark:border-gray-600 dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 group flex justify-center items-center gap-2 group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 relative text-left p-3 text-base overflow-hidden after:absolute after:z-10 after:w-12 after:h-12 after:content[''] dark:after:bg-sky-900 after:bg-sky-500 after:-left-8 after:top-8 after:rounded-full after:blur-lg hover:after:animate-pulse">
            Try It Now
          </button>
          <button className="px-6 py-2 cursor-pointer bg-transparent border border-black dark:border-gray-600 dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 relative text-left p-3 text-base overflow-hidden after:absolute after:z-10 after:w-12 after:h-12 after:content[''] after:bg-gray-700 after:left-44 after:top-8 after:rounded-full after:blur-lg hover:after:animate-pulse">
            Learn How It Works
          </button>
        </div>
      </div>
    </>
  );
}