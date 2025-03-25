"use client";
import React from "react";
import JobCard from "./JobCard";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function JobList() {
 const { user, loader } = useAuth();
 //@ts-ignore
 const jobs = user?.jobPosts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loader) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-600 dark:text-blue-400"
        >
          <Loader size={32} />
        </motion.div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading job listings...</span>
      </div>
    );
  }

  if (jobs?.length === 0 && !loader) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 px-6 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">No job listings yet</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Create your first job posting to get started</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {jobs?.map((job: any) => (
        <JobCard key={job.id} job={job} />
      ))}
    </motion.div>
  );
}