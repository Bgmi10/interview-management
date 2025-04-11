"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FlipWords } from "@/components/ui/flip-words";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="lg:min-h-screen lg:mt-0 sm:mt-20 relative flex flex-col items-center justify-center overflow-hidden">
        <Badge text="Revolutionizing Expert Evaluation" endLimit={100} />
        <h1 className="md:text-7xl relative dark:from-white dark:to-[#AAAAAA] mx-6 w-[300px] bg-gradient-to-b from-black/80 to-black bg-clip-text pb-4 text-center font-extrabold leading-tight text-transparent md:!w-full lg:text-6xl xl:leading-snug sm:text-2xl">
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
        <p className="sm:text-sm text-center mt-5 max-w-3xl mx-6 max-h-[112px] w-[315px] text-[#666666] md:max-h-[96px] md:w-[700px] md:text-xl dark:text-[#888888]">
          Our platform leverages advanced algorithms to analyze and match candidate expertise with the interview board's subject matter.
        </p>
        <div className="flex gap-4 mt-10">
          <button className="cursor-pointer px-6 py-2 bg-transparent border border-gray-600 dark:border-gray-600 dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 group flex justify-center items-center gap-2 group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 relative text-left p-3 text-base overflow-hidden after:absolute after:z-10 after:w-12 after:h-12 after:content[''] dark:after:bg-sky-900 after:bg-sky-500 after:-left-8 after:top-8 after:rounded-full after:blur-lg hover:after:animate-pulse" onClick={() => window.location.href = "/signup"}>
            Try It Now
          </button>
          <button className="px-6 py-2 cursor-pointer bg-transparent border border-black dark:border-gray-600 dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 relative text-left p-3 text-base overflow-hidden after:absolute after:z-10 after:w-12 after:h-12 after:content[''] after:bg-gray-700 after:left-44 after:top-8 after:rounded-full after:blur-lg hover:after:animate-pulse" onClick={() => window.location.href = "/signup"}>
            Learn How It Works
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black dark:text-gray-300">Streamline Your Hiring Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Role-Based Access</h3>
              <p className="text-gray-600 dark:text-gray-300">Tailored experiences for admins, recruiters, and candidates with custom dashboards and functionality.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Smart Matching</h3>
              <p className="text-gray-600 dark:text-gray-300">Automated candidate ranking based on experience and skills matching with job requirements.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Integrated Scheduling</h3>
              <p className="text-gray-600 dark:text-gray-300">Seamless interview scheduling with Google Calendar integration and automated notifications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-gray-300 text-black">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img src="https://media.istockphoto.com/id/2148703154/photo/business-persons-on-meeting-in-the-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=fVLJpgh_1qG4fB1jxhaGYPXJVK54UMky1wmaIngjqF0=" alt="Platform screenshot" className="rounded-lg shadow-lg" />
            </div>
            <div className="md:w-1/2">
              <div className="flex mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Create Your Profile</h3>
                  <p className="text-gray-600 dark:text-gray-400">Candidates build comprehensive profiles highlighting their skills and experience.</p>
                </div>
              </div>
              <div className="flex mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Match with Opportunities</h3>
                  <p className="text-gray-600 dark:text-gray-400">Our algorithm finds the perfect match between candidate expertise and job requirements.</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Streamlined Interviews</h3>
                  <p className="text-gray-600 dark:text-gray-400">Schedule, conduct, and provide feedback all within one integrated platform.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="py-16 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black dark:text-gray-300">For Every Role in the Hiring Process</h2>
          <div className="grid gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-center text-black dark:text-blue-500">For Candidates</h3>
              <ul className="space-y-3 text-black dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Create detailed professional profiles</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Search and apply for relevant positions</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Direct messaging with recruiters</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-center text-black dark:text-blue-500">For Recruiters</h3>
              <ul className="space-y-3 text-black dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Post and manage job listings</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Review ranked candidate applications</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Schedule and manage interviews</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Hiring Process?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">Join companies that are already making smarter hiring decisions with our advanced interview management system.</p>
          <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition duration-300" onClick={() => window.location.href = "/signup"}>Get Started Today</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HI - free</h3>
              <p className="mb-4">Revolutionizing the way organizations find and hire talent with precision matching and streamlined workflows.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="mb-2">Have questions? We're here to help.</p>
              <a href="mailto:info@ims.com" className="text-blue-400 hover:text-blue-300">info@hifree.com</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2025 Hi-Free. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}