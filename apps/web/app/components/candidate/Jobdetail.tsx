"use client";
import React, { useEffect, useState } from "react";
import { fetchJobById } from "../../dashboard/recruiter/recruiterapi";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  FileText, 
  Building, 
  GraduationCap, 
  ArrowLeft, 
  Loader, 
  Tag, 
  IndianRupee, 
  Calendar, 
  CheckCircle,
  Shield,
  Users,
  Send
} from "lucide-react";
import Link from "next/link";
import { JobPost } from "../../types/job";
import { useAuth } from "../../../context/AuthContext";
import { applyjob } from "../../dashboard/candidate/candidateapi";

export default function JobDetail() {
  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        //@ts-ignore
        const jobData = await fetchJobById(params.id);
        setJob(jobData);
        
        // Check if current user has already applied
        if (jobData.applications && user) {
          const alreadyApplied = jobData.applications.some(
            //@ts-ignore
            (application: any) => application.candidateId === user.id
          );
          setHasApplied(alreadyApplied);
        }
      } catch (err) {
        setError("Failed to load job details");
        console.error("Error loading job:", err);
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [params.id, user]);

  // Animation variants
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

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle job application
  const handleApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      setSubmitting(true);
      //@ts-ignore
      const response = await applyjob(params.id);
      
      if (response.message === "Job application submitted successfully") {
        setHasApplied(true);
        router.push("/dashboard/candidate");
      } else {
        throw new Error('Failed to apply');
      }
    } catch (err) {
      console.error('Error applying to job:', err);
      // Show error message
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black flex justify-center items-center">
        <Loader size={32} className="animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black flex flex-col justify-center items-center">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg max-w-md text-center">
          <p className="font-medium">{error || "Job not found"}</p>
          <button 
            onClick={() => router.push("/dashboard/candidate")}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black">
      <motion.div 
        className="lg:max-w-[1200px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3">
              <Link href="/dashboard/candidate">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Job Details</h1>
            </div>
          </motion.div>

          {/* Job Title Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex items-center gap-4">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 object-cover rounded-lg bg-white p-2" />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg">
                  <Building size={32} className="text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold">{job.title}</h2>
                <div className="flex flex-wrap items-center text-blue-100 mt-1 gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1">
                    <Building size={16} />
                    <span>{job.companyName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{job.jobType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee size={16} />
                    <span className="font-medium">{job.salary}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`px-3 py-1 text-xs rounded-full font-medium flex items-center gap-1
                ${job.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                <CheckCircle size={12} />
                {job.status}
              </span>
              <span className="px-3 py-1 bg-blue-700 text-white text-xs rounded-full font-medium flex items-center gap-1">
                <Calendar size={12} />
                Posted: {formatDate(job.postedAt)}
              </span>
              {hasApplied && (
                <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-medium flex items-center gap-1">
                  <CheckCircle size={12} />
                  Applied
                </span>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <section>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-blue-500" />
                  Job Description
                </h3>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                  <p>{job.description}</p>
                </div>
              </section>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <section>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-500" />
                    Responsibilities
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1 min-w-5 text-blue-500">•</div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Required Skills */}
              {job.requriedSkills && job.requriedSkills.length > 0 && (
                <section>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-blue-500" />
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">    
                    {job.requriedSkills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Preferred Skills */}
              {job.preferredSkills && job.preferredSkills.length > 0 && (
                <section>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Tag size={18} className="text-blue-500" />
                    Preferred Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferredSkills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <section>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle size={18} className="text-blue-500" />
                    Qualifications
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {job.qualifications.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1 min-w-5 text-blue-500">•</div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Education */}
              {job.education && job.education.length > 0 && (
                <section>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <GraduationCap size={18} className="text-blue-500" />
                    Education Requirements
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {job.education.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1 min-w-5 text-blue-500">•</div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-black border dark:border-gray-800 border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Building size={18} className="text-blue-500" />
                  Company Details
                </h3>

                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                    <p className="font-medium">{job.companyName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                    <p className="font-medium">{job.industryType}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-black border dark:border-gray-800 border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-500" />
                  Job Details
                </h3>

                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-medium">{job.role}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Job Type</p>
                    <p className="font-medium">{job.jobType.replace('_', ' ')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                  
                  {job.experience && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Experience Required</p>
                      <p className="font-medium">{job.experience}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Salary</p>
                    <p className="font-medium text-green-600 dark:text-green-400 flex items-center"><IndianRupee size={15}/><span>{job.salary}</span></p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50 dark:bg-black border dark:border-gray-800 border-gray-200 rounded-lg p-6">
                {job.status === 'Active' && !hasApplied ? (
                  <button 
                    onClick={handleApply}
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Apply Now
                      </>
                    )}
                  </button>
                ) : hasApplied ? (
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
                    <CheckCircle size={24} className="mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <p className="text-green-700 dark:text-green-300 font-medium">You've already applied for this job</p>
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-300">This job is no longer accepting applications</p>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 text-sm text-center">
                    Make sure your profile is up to date before applying!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}