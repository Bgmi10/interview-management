"use client";
import React from "react";
import JobList from "../../components/recruiter/JobList";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Briefcase, Loader } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function RecruiterDashboard() {
  const { user, loader } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black">
      <motion.div 
        className="max-w-[1200px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 p-6 pt-16 text-white"
          variants={itemVariants}
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900 to-transparent opacity-40"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 z-10 relative">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">Your Job Listings</h1>
              <p className="text-blue-100 mt-2">Manage and track all your active job postings</p>
            </div>

            <Link href="/dashboard/recruiter/create">
              <motion.button
                className="cursor-pointer px-4 py-2 bg-white text-blue-700 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:bg-blue-50 transition-all duration-300"
              >
                <Plus size={18} />
                Create New Job
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          variants={itemVariants}
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg text-white">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{loader ? <Loader size={20} className="animate-spin"/> : user?.jobPosts?.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl shadow-sm border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">48</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl shadow-sm border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path d="M12 11h4"></path>
                  <path d="M12 16h4"></path>
                  <path d="M8 11h.01"></path>
                  <path d="M8 16h.01"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">8</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Filter Section */}
        <motion.div 
          className="mb-6 p-4 bg-gray-50 dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search jobs..." 
                className="w-full p-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg outline-none bg-white dark:bg-black text-gray-800 dark:text-white"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none bg-white dark:bg-black text-gray-800 dark:text-white">
                <option value="">Status: All</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
              
              <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-nonebg-white dark:bg-black text-gray-800 dark:text-white">
                <option value="">Sort by: Newest</option>
                <option value="oldest">Oldest</option>
                <option value="applications">Most Applications</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Job Listings */}
        <JobList />
      </motion.div>
    </div>
  );
}