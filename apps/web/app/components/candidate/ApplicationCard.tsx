"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Clock, ChevronRight, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ApplicationCard({ application }: { application: any }) {
  const router = useRouter();
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const job = application.job;
  const appliedDate = formatDate(application.appliedAt);

  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50";
      case "Interview":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50";
      case "Offered":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const isValidImageUrl = (url: string) => {
    return url && /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i.test(url);
  };

  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
        borderColor: "rgba(147, 51, 234, 0.5)",
      }}
      className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-black shadow-lg transition-all duration-300"
    >
      {/* Status Badge */}
      <div className="p-4 flex justify-between items-center">
        <span className={`text-xs font-medium py-1 px-3 rounded-full border ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Applied {appliedDate}</span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            {job?.companyLogo && isValidImageUrl(job.companyLogo) ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <Briefcase className="text-purple-500" size={20} />
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{job?.companyName}</p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{job?.title}</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin size={14} className="mr-1" />
            {job?.location}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} className="mr-1" />
            {job?.jobType}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 dark:text-gray-400 font-bold text-lg flex items-center">
            <IndianRupee size={16} />
            {job?.salary}
          </p>
        </div>

          <button onClick={() => router.push(`/dashboard/candidate/job/${job.id}`)} className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
            View Application
            <ChevronRight size={16} />
          </button>
      </div>
    </motion.div>
  );
}