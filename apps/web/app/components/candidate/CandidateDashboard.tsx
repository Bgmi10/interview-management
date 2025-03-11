"use client";
import React from "react";
import ApplicationList from "../../components/candidate/ApplicationList";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Briefcase, FileText, Loader } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function CandidateDashboard() {
  const { user, loader, profileCompletion } = useAuth();
  
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
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900 to-transparent opacity-40"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 z-10 relative">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">Your Career Dashboard</h1>
              <p className="text-purple-100 mt-2">Track your applications and find new opportunities</p>
            </div>

            <Link href="/jobs">
              <motion.button
                className="cursor-pointer px-4 py-2 bg-white text-purple-700 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:bg-purple-50 transition-all duration-300"
              >
                <Search size={18} />
                Browse Jobs
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Profile Completion Card */}
        {profileCompletion < 100 && (
          <motion.div 
            className="mb-8 p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-400">Complete Your Profile</h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">A complete profile increases your chances of getting hired by 85%</p>
                <div className="mt-3 w-full md:w-64 h-2 bg-yellow-200 dark:bg-yellow-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{profileCompletion}% Complete</p>
              </div>
              <Link href="/profile">
                <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium">Complete Profile</button>
              </Link>
            </div>
          </motion.div>
        )}

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
                <p className="text-sm text-gray-500 dark:text-gray-400">Applications</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{loader ? <Loader size={20} className="animate-spin"/> : user?.jobApplications?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl shadow-sm border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {loader ? 
                    <Loader size={20} className="animate-spin"/> : 
                    user?.jobApplications?.filter((app: any) => app.status === "Pending")?.length || 0
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl shadow-sm border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Interviews</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {loader ? 
                    <Loader size={20} className="animate-spin"/> : 
                    user?.jobApplications?.filter((app: any) => app.status === "Interview")?.length || 0
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resume Section */}
        {!user?.resume && <motion.div 
          className="mb-8 p-6 rounded-xl bg-white dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-100 dark:bg-black rounded-lg">
                <FileText className="text-gray-600 dark:text-gray-300" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Your Resume</h3>
                {user?.resume ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
                ) : (
                  <p className="text-sm text-red-500 mt-1">No resume uploaded yet</p>
                )}
              </div>
            </div>
            <Link href="/profile">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                {user?.resume ? "Update Resume" : "Upload Resume"}
              </button>
            </Link>
          </div>
        </motion.div>}

        {/* Filter Section */}
        <motion.div 
          className="mb-6 p-4 bg-gray-50 dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search applications..." 
                className="w-full p-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg outline-none f bg-white dark:bg-black text-gray-800 dark:text-white"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-white outline-none">
                <option value="">Status: All</option>
                <option value="pending">Pending</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="offered">Offered</option>
              </select>
              
              <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none  bg-white dark:bg-black text-gray-800 dark:text-white">
                <option value="">Sort by: Newest</option>
                <option value="oldest">Oldest</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <ApplicationList />
      </motion.div>
    </div>
  );
}