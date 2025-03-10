"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { updateApplicantStatus } from "../../dashboard/candidate/candidateapi";
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
  Calendar, 
  CheckCircle,
  ChevronDown,
  Download,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Trophy,
  Eye,
  X,
  Award,
  User,
  Send
} from "lucide-react";
import Link from "next/link";

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
const formatDate = (dateString: number) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function JobApplicants() {
  const { user }: { user: any } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<any>(null);
  const [rankedApplicants, setRankedApplicants] = useState<any>([]);
  const [expandedApplicant, setExpandedApplicant] = useState<any>(null);
  const [statusUpdating, setStatusUpdating] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  console.log(params)

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        // Find the job post that matches the ID
        const filteredJob = user?.jobPosts?.filter((item: any) => item.id === Number(params.id))[0];
        
        if (!filteredJob) {
          setError("Job not found");
          setLoading(false);
          return;
        }
        
        setJobData(filteredJob);
        
        // Calculate match score for each applicant
        const applicantsWithScore = calculateMatchScores(filteredJob);
        setRankedApplicants(applicantsWithScore);
      } catch (err) {
        console.error("Error loading applicants:", err);
        setError("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    if (user?.jobPosts) {
      fetchData();
    }
  }, [user, params.id]);

  // Calculate match scores for all applicants
  const calculateMatchScores = (job: any) => {
    if (!job.applications || job.applications.length === 0) {
      return [];
    }

    const scoredApplicants = job.applications.map((applicant: any) => {
      // Initialize score components
      let skillMatch = 0;
      let experienceMatch = 0;
      let educationMatch = 0;
      let totalScore = 0;
      
      // Check required skills match
      if (job.requriedSkills && job.requriedSkills.length > 0 && applicant.candidate.skills && applicant.candidate.skills.length > 0) {
        const matchedSkills = job.requriedSkills.filter((skill: any) => 
          applicant.candidate.skills.some((candidateSkill: any) => 
            candidateSkill.toLowerCase().includes(skill.toLowerCase()) || 
            skill.toLowerCase().includes(candidateSkill.toLowerCase())
          )
        );
        skillMatch = matchedSkills.length / job.requriedSkills.length * 100;
      }
      
      // Check experience match (simple string comparison for now)
      if (job.experience && applicant.candidate.experience) {
        // Simple heuristic - if both contain years or similar terms
        if (
          (job.experience.includes("year") && applicant.candidate.experience.includes("year")) ||
          (job.experience.includes("yr") && applicant.candidate.experience.includes("yr"))
        ) {
          // Extract numbers from experience strings
          const jobYears = parseInt(job.experience.match(/\d+/)?.[0] || "0");
          const candidateYears = parseInt(applicant.candidate.experience.match(/\d+/)?.[0] || "0");
          
          if (candidateYears >= jobYears) {
            experienceMatch = 100;
          } else if (candidateYears > 0) {
            experienceMatch = (candidateYears / jobYears) * 100;
          }
        }
      }
      
      // Check education match
      if (job.education && job.education.length > 0 && applicant.candidate.collageName) {
        // Simple check if college name appears in education requirements
        const hasEducationMatch = job.education.some((edu: any) => 
          applicant.candidate.collageName.toLowerCase().includes(edu.toLowerCase()) ||
          edu.toLowerCase().includes(applicant.candidate.collageName.toLowerCase()) ||
          edu.toLowerCase().includes("degree") && applicant.candidate.collageName.toLowerCase().includes("university")
        );
        
        if (hasEducationMatch) {
          educationMatch = 100;
        } else if (applicant.candidate.collageName) {
          educationMatch = 50; // Some education is better than none
        }
      }
      
      // Calculate total score with different weights
      totalScore = (skillMatch * 0.5) + (experienceMatch * 0.3) + (educationMatch * 0.2);
      
      // Round to nearest integer
      totalScore = Math.round(totalScore);
      
      return {
        ...applicant,
        matchDetails: {
          skillMatch: Math.round(skillMatch),
          experienceMatch: Math.round(experienceMatch),
          educationMatch: Math.round(educationMatch),
          totalScore
        }
      };
    });
    
    // Sort by total score (descending)
    return scoredApplicants.sort((a: any, b: any) => b.matchDetails.totalScore - a.matchDetails.totalScore);
  };

  // Handle status update
  const handleStatusUpdate = async (applicantId: string, newStatus: string) => {
    try {
      setStatusUpdating((prev: any) => ({ ...prev, [applicantId]: true }));
      await updateApplicantStatus({ status: newStatus, applicantId: applicantId });
      
      // Update the local state
      setRankedApplicants((prev: any) => 
        prev.map((applicant: any) => 
          applicant.id === applicantId 
            ? { ...applicant, status: newStatus } 
            : applicant
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update applicant status");
    } finally {
      setStatusUpdating((prev: any)=> ({ ...prev, [applicantId]: false }));
    }
  };

  // Toggle expanded applicant
  const toggleExpandApplicant = (id: number) => {
    setExpandedApplicant(expandedApplicant === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black flex justify-center items-center">
        <Loader size={32} className="animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (error || !jobData) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black flex flex-col justify-center items-center">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg max-w-md text-center">
          <p className="font-medium">{error || "Job not found"}</p>
          <button 
            onClick={() => router.push("/dashboard/recruiter")}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If no applicants yet
  if (!rankedApplicants || rankedApplicants.length === 0) {
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
                <Link href={`/dashboard/recruiter/${jobData.id}`}>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Applicants</h1>
              </div>
            </motion.div>

            {/* Job Info Bar */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <div className="flex items-center gap-4">
                {jobData.companyLogo ? (
                  <img src={jobData.companyLogo} alt={jobData.companyName} className="w-12 h-12 object-cover rounded-lg bg-white p-2" />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg">
                    <Building size={24} className="text-blue-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{jobData.title}</h2>
                  <div className="flex flex-wrap items-center text-blue-100 mt-1 gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1">
                      <Building size={14} />
                      <span>{jobData.companyName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{jobData.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* No Applicants Message */}
            <div className="p-16 text-center">
              <User size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Applicants Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                There are no applications for this job posting yet. Applications will appear here once candidates apply.
              </p>
              <Link href={`/dashboard/recruiter/${jobData.id}`}>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Return to Job Details
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
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
              <Link href={`/dashboard/recruiter/${jobData.id}`}>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Applicants</h1>
            </div>
            <div className="flex items-center">
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                {rankedApplicants.length} Applicant{rankedApplicants.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>

          {/* Job Info Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex items-center gap-4">
              {jobData.companyLogo ? (
                <img src={jobData.companyLogo} alt={jobData.companyName} className="w-12 h-12 object-cover rounded-lg bg-white p-2" />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg">
                  <Building size={24} className="text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{jobData.title}</h2>
                <div className="flex flex-wrap items-center text-blue-100 mt-1 gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1">
                    <Building size={14} />
                    <span>{jobData.companyName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{jobData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applicants Leaderboard */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-6 flex items-center gap-2 sm: justify-center lg:justify-start">
              <Trophy size={18} className="text-amber-500" />
              Applicant Leaderboard
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2 sm: hidden lg:block">
                (Ranked by best match)
              </span>
            </h3>

            <div className="space-y-4">
              {rankedApplicants.map((applicant: any, index: number) => (
                <div 
                  key={applicant.id}
                  className={`border ${expandedApplicant === applicant.id ? 'border-blue-300 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg overflow-hidden bg-white dark:bg-black transition-all`}
                >
                  {/* Main applicant row (always visible) */}
                  <div className="p-4 md:p-6 grid grid-cols-12 gap-4 items-center">
                    {/* Rank badge - Medal for top 3 */}
                    <div className="col-span-1 flex justify-center">
                      {index === 0 ? (
                        <div className="w-10 h-10 rounded-full lg:bg-amber-100 lg:dark:bg-amber-900 flex items-center justify-center">
                          <Trophy size={20} className="text-amber-500" />
                        </div>
                      ) : index === 1 ? (
                        <div className="w-10 h-10 rounded-full lg:bg-gray-100 lg:dark:bg-gray-800 flex items-center justify-center">
                          <Award size={20} className="text-gray-500" />
                        </div>
                      ) : index === 2 ? (
                        <div className="w-10 h-10 rounded-full lg:bg-amber-50 lg:dark:bg-amber-950 flex items-center justify-center">
                          <Award size={20} className="text-amber-700 dark:text-amber-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full lg:bg-gray-50 lg:dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    
                    {/* Profile pic and name */}
                    <div className="col-span-7 md:col-span-5 flex items-center gap-3">
                      <img 
                        src={applicant.candidate.profilePic || `https://ui-avatars.com/api/?name=${applicant.candidate.firstName}&background=4F46E5&color=fff`} 
                        alt={applicant.candidate.firstName} 
                        className="lg:w-12 lg:h-12 sm: w-8 sm: h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white lg:text-md sm: text-sm">
                          {applicant.candidate.firstName} {applicant.candidate.lastName}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 lg:flex items-center gap-1 sm: hidden">
                          <Mail size={12} />
                          {applicant.candidate.email}
                        </p>
                      </div>
                    </div>
                    
                    {/* Match score */}
                    <div className="col-span-4 md:col-span-2">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {applicant.matchDetails.totalScore}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Match Score
                        </div>
                      </div>
                    </div>
                    
                    {/* Status badge */}
                    <div className="hidden md:block md:col-span-2 text-center">
                      <span className={`px-3 py-1 text-xs inline-block rounded-full font-medium
                        ${applicant.status === 'Approved' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : 
                          applicant.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300' :
                          'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300'}`}>
                        {applicant.status}
                      </span>
                    </div>
                    
                    {/* Expand/collapse button */}
                    
                    <div className="hidden md:flex md:col-span-2 justify-end items-center gap-10">
                      <button className="dark:text-white text-white bg-blue-600 text-sm p-1 cursor-pointer rounded-full hover:bg-blue-700 dark:hover:bg-blue-700 w-40" onClick={() => router.push(`/dashboard/recruiter/${params.id}/applications/${applicant.candidateId}`)}>
                        View Profile
                      </button>
                      <button 
                        onClick={() => toggleExpandApplicant(applicant.id)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChevronDown 
                          size={20} 
                          className={`text-gray-600 dark:text-gray-300 transition-transform ${expandedApplicant === applicant.id ? 'transform rotate-180' : ''}`} 
                        />
                      </button>
                    </div>
                    
                    {/* Mobile view controls */}
                    <div className="col-span-12 md:hidden mt-2 flex justify-between items-center">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium
                        ${applicant.status === 'Approved' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : 
                          applicant.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300' :
                          'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300'}`}>
                        {applicant.status}
                      </span>
                      
                      <button 
                        onClick={() => toggleExpandApplicant(applicant.id)}
                        className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1"
                      >
                        {expandedApplicant === applicant.id ? 'Show Less' : 'View Details'}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${expandedApplicant === applicant.id ? 'transform rotate-180' : ''}`} 
                        />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expandable detail section */}
                  {expandedApplicant === applicant.id && (
                    <div className="px-4 md:px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column: Contact & Details */}
                        <div className="space-y-4">
                          <h5 className="font-medium text-gray-800 dark:text-white">Contact Information</h5>
                          
                          <div className="space-y-2">
                            {applicant.candidate.email && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Mail size={16} className="text-blue-500" />
                                <a href={`mailto:${applicant.candidate.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                  {applicant.candidate.email}
                                </a>
                              </div>
                            )}
                            
                            {applicant.candidate.phoneNumber && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Phone size={16} className="text-blue-500" />
                                <a href={`tel:${applicant.candidate.phoneNumber}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                  {applicant.candidate.phoneNumber}
                                </a>
                              </div>
                            )}
                            
                            {applicant.candidate.linkedIn && (
                             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Linkedin size={16} className="text-blue-500" />
                                <a
                                  href={
                                    applicant.candidate.linkedIn.startsWith("http")
                                      ? applicant.candidate.linkedIn
                                      : `https://${applicant.candidate.linkedIn}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  LinkedIn Profile
                                </a>
                              </div>
                            )}
                            {applicant.candidate.portfolioUrl && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Globe size={16} className="text-blue-500" />
                                <a href={applicant.candidate.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                                  Portfolio
                                </a>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-800 dark:text-white mb-2">Experience</h5>
                            <p className="text-gray-600 dark:text-gray-300">
                              {applicant.candidate.experience || "Not specified"}
                            </p>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-800 dark:text-white mb-2">Education</h5>
                            <p className="text-gray-600 dark:text-gray-300">
                              {applicant.candidate.collageName || "Not specified"}
                            </p>
                            {applicant.candidate.specilization && (
                              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                Specialization: {applicant.candidate.specilization}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Middle column: Skills & Match Score */}
                        <div className="space-y-4">
                          <h5 className="font-medium text-gray-800 dark:text-white">Skills</h5>
                          {applicant.candidate.skills && applicant.candidate.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {applicant.candidate.skills.map((skill: any, i: number) => (
                                <span 
                                  key={i}
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    jobData.requriedSkills && jobData.requriedSkills.some((reqSkill: any) => 
                                      reqSkill.toLowerCase().includes(skill.toLowerCase()) || 
                                      skill.toLowerCase().includes(reqSkill.toLowerCase())
                                    )
                                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                                  }`}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">No skills listed</p>
                          )}
                          
                          <div className="pt-4">
                            <h5 className="font-medium text-gray-800 dark:text-white mb-3">Match Analysis</h5>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">Skills Match</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {applicant.matchDetails.skillMatch}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${applicant.matchDetails.skillMatch}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">Experience Match</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {applicant.matchDetails.experienceMatch}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-purple-600 h-2 rounded-full" 
                                    style={{ width: `${applicant.matchDetails.experienceMatch}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">Education Match</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {applicant.matchDetails.educationMatch}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${applicant.matchDetails.educationMatch}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="pt-2">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Overall Match</span>
                                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                    {applicant.matchDetails.totalScore}%
                                  </span>
                                </div>
                                <div className ="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${applicant.matchDetails.totalScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right column: Application Details & Actions */}
                        <div className="space-y-4">
                          <h5 className="font-medium text-gray-800 dark:text-white">Application Details</h5>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Calendar size={16} className="text-blue-500" />
                              <span>Applied on: {formatDate(applicant.appliedAt)}</span>
                            </div>
                            
                            {applicant.candidate.resume && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <FileText size={16} className="text-blue-500" />
                                <a 
                                  href={applicant.candidate.resume} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  View Resume
                                  <Eye size={14} />
                                </a>
                              </div>
                            )}
                            
                            {applicant.coverLetter && (
                              <div className="mt-3">
                                <h6 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Cover Letter:</h6>
                                <p className="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                  {applicant.coverLetter}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-4">
                            <h5 className="font-medium text-gray-800 dark:text-white mb-3">Actions</h5>
                            <div className="flex flex-wrap gap-2">
                              {applicant.status !== 'Approved' && (
                                <button
                                  onClick={() => handleStatusUpdate(applicant.id, 'Approved')}
                                  disabled={statusUpdating[applicant.id]}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1 disabled:opacity-50"
                                >
                                  {statusUpdating[applicant.id] ? (
                                    <Loader size={14} className="animate-spin" />
                                  ) : (
                                    <CheckCircle size={14} />
                                  )}
                                  Approve
                                </button>
                              )}
                              
                              {applicant.status !== 'Rejected' && (
                                <button
                                  onClick={() => handleStatusUpdate(applicant.id, 'Rejected')}
                                  disabled={statusUpdating[applicant.id]}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1 disabled:opacity-50"
                                >
                                  {statusUpdating[applicant.id] ? (
                                    <Loader size={14} className="animate-spin" />
                                  ) : (
                                    <X size={14} />
                                  )}
                                  Reject
                                </button>
                              )}
                              
                              <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1"
                              >
                                <Send size={14} />
                                Contact
                              </button>
                              {applicant.candidate.resume && (
                                <button
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1"
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(applicant.candidate.resume);
                                      const blob = await response.blob();
                                      const url = window.URL.createObjectURL(blob);
                                      
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = "resume.pdf"; // Custom filename
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      
                                      window.URL.revokeObjectURL(url);
                                    } catch (error) {
                                      console.error("Error downloading the file:", error);
                                    }
                                  }}
                                >
                                  <Download size={14} />
                                  Download Resume
                                </button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}