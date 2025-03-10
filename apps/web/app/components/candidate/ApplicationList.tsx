"use client";
import React from "react";
import ApplicationCard from "./ApplicationCard";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function ApplicationList() {
  const { user, loader } = useAuth();
  
  const applications = user?.jobApplications;
  
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
          className="text-purple-600 dark:text-purple-400"
        >
          <Loader size={32} />
        </motion.div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading your applications...</span>
      </div>
    );
  }
  
  if (!applications?.length && !loader) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12 px-6 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">No applications yet</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Start applying to jobs to track your progress here</p>
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
      {applications?.map((application: any) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </motion.div>
  );
}