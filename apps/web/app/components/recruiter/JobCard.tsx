"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, Users, ChevronRight, IndianRupee } from "lucide-react";
import Link from "next/link";
import { updateJob } from "../../dashboard/recruiter/recruiterapi";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";

export default function JobCard({ job }: { job: any }) {
  const { setUser } = useAuth();

  const toggleStatus = async (id: any) => {
    try {
      const response = await updateJob(id, { 
        status: job?.status === "Active" ? "Inactive" : "Active" 
      });
  
      if (response?.updateExistingJobPost) {
        setUser((prevUser: any) => ({
          ...prevUser,
          jobPosts: prevUser.jobPosts.map((jobPost: any) => 
            jobPost.id === id ? { ...jobPost, ...response.updateExistingJobPost } : jobPost
          )
        }));
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };
  
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const postedDate = formatDate(job.postedAt);
  const applicants = job?.applications?.length
  const jobType = job.jobType;

  const isValidImageUrl = (url: string) => {
    return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i.test(url);
  };

  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
        borderColor: "rgba(59, 130, 246, 0.5)",
      }}
      className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-black shadow-lg transition-all duration-300"
    >
      {/* Status Toggle */}
      <div className="relative flex justify-between items-center p-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {job.status === "Active" ? "Active" : "Inactive"}
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={job.status === "Active" ? true : false} 
            onChange={() => toggleStatus(job.id)}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 transition"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white border border-gray-300 rounded-full transition peer-checked:translate-x-5 dark:border-gray-600"></div>
        </label>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            {job.companyLogo && isValidImageUrl(job.companyLogo) ? (
              <Image
                src={job.companyLogo}
                alt={job.companyName}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <Briefcase className="text-blue-500" size={20} />
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{job.companyName}</p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{job.title}</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin size={14} className="mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} className="mr-1" />
            {jobType}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users size={14} className="mr-1" />
            {applicants} applicants
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500 dark:text-gray-400 font-bold text-lg flex items-center">
            <IndianRupee size={16} />
            {job.salary}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Posted {postedDate}</p>
        </div>

        <Link href={`/dashboard/recruiter/${job.id}`}>
          <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
            View Details
            <ChevronRight size={16} />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
