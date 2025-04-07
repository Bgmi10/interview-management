"use client";
import { useEffect, useState } from "react";
import { applyjob, findJob } from "../../dashboard/candidate/candidateapi";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, Clock, ArrowLeft, Search, Loader, IndianRupee } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { JobPost } from "../../types/job";

export default function CandidateSearch() {
  const [job, setJob] = useState({ title: null, location: null });
  const [searchResults, setSearchResults] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyLoader, setApplyLoader] = useState(false);
  const router = useRouter();
  const [filters, setFilters] = useState({
    jobType: "",
    experienceLevel: "",
    salary: ""
  });
  
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setJob({ 
        title: searchParams.get("jobtitle"), 
        location: searchParams.get("joblocation")
      });
    }
  }, []);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      try {
        const response = await findJob(job.title, job.location);
        if (response.message === "Success" && response.jobs) {
          setSearchResults(response.jobs);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }

    if (job.title === "browser") {
      return;
    }

    if (job.title || job.location) {
      fetchJob();
    }
  }, [job.location, job.title]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuickApply = async (id: string) => {
    setApplyLoader(true);
    const response = await applyjob(id);
    if (response.message === "Job application submitted successfully") {
      toast("Applied Success");
      setApplyLoader(false);
    } else if (response.message === "You have already applied for this job") {
      toast("Already Applied");
      setApplyLoader(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black">
      <ToastContainer theme="dark" />
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
            <div className="flex-1">
              <Link href="/dashboard/candidate" className="flex items-center text-blue-200 hover:text-white mb-3">
                <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">Job Search Results</h1>
              <p className="text-purple-100 mt-2">
                {job.title && job.location
                  ? `Showing results for "${job.title}" in "${job.location}"`
                  : job.title
                  ? `Showing results for "${job.title}"`
                  : job.location
                  ? `Showing results for jobs in "${job.location}"`
                  : "Showing all available jobs"}
              </p>
            </div>
          </div>
        </motion.div>

        {searchResults.length > 0 && <motion.div 
          className="mb-6 p-4 bg-gray-50 dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
              <select 
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-white outline-none"
              >
                <option value="">Job Type: All</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
              
              <select 
                name="experienceLevel"
                value={filters.experienceLevel}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-white outline-none"
              >
                <option value="">Experience: Any</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
              
              <select 
                name="salary"
                value={filters.salary}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-white outline-none"
              >
                <option value="all">Salary: Any</option>
                <option value="0-500000">Under 0 - 5 lpa</option>
                <option value="500000-1000000">5 - 10 lpa</option>
                <option value="1000000-2000000">10 - 20 lpa</option>
                <option value="3000000-5000000"> 30 - 50 lpa</option>
              </select>
            </div>
          </div>
        </motion.div>}

        {/* Results Count */}
        <motion.div className="mb-4 text-gray-600 dark:text-gray-400" variants={itemVariants}>
          {loading ? (
            <div className="flex items-center">
              <Loader size={16} className="animate-spin mr-2" />
              Searching for jobs...
            </div>
          ) : (
            <p>{searchResults.length} jobs found</p>
          )}
        </motion.div>

        {/* Job Results */}
        {loading ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-12"
            variants={itemVariants}
          >
            <Loader size={40} className="animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Searching for the perfect opportunities...</p>
          </motion.div>
        ) : searchResults.length > 0 ? (
          <motion.div 
            className="space-y-4" 
            variants={containerVariants}
          >
            {searchResults.map((job: any) => (
              <motion.div
                key={job.id}
                className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5"
                variants={itemVariants}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} className="w-8 h-8 object-contain" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.title}</h3>
                      <span className="inline-flex items-center px-2.5 py-1 mt-2 md:mt-0 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{job.companyName}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Posted {formatDate(job.postedAt)}
                      </div>
                      {job.salary && (
                        <div className="flex items-center font-medium text-black dark:text-white">
                          <IndianRupee size={13} className="text-white"/>{job.salary} lpa
                        </div>
                      )}
                      {job.experience && (
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {job.experience} years exp.
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.requriedSkills && job.requriedSkills.map((skill: any, index: number) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2">
                      <button onClick={() => router.push(`/dashboard/candidate/job/${job.id}`)} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                        View Details
                      </button>
                    <button className="w-full px-4 py-2 bg-white dark:bg-black border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg font-medium transition-colors" onClick={() => handleQuickApply(job.id)}>
                    {applyLoader ? "Applying..." : "Quick Apply"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12 bg-gray-50 dark:bg-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full inline-flex mb-4">
              <Search size={24} className="text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No jobs found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <Link href="/dashboard">
              <button className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                Back to Dashboard
              </button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}