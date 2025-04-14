"use client";
import { useContext, useEffect, useState } from "react";
import { fetchCandidates } from "../../dashboard/recruiter/recruiterapi";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Calendar, Briefcase, ArrowLeft, Search, Loader, Award } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { User } from "../../types/user";
import { ThemeContext } from "../../../context/ThemeContext";
import ChatWidget from "../chat/ChatWidget";

export default function RecruiterSearch() {
  const [searchParams, setSearchParams] = useState<{ jobRole: null | string , skills: string |null}>({ jobRole: null, skills: null });
  const [candidates, setCandidates] = useState<User>([]);
  const [loading, setLoading] = useState(true);
  const { setIsChatOpen, setSelectedCandidate } = useContext(ThemeContext);
  const router = useRouter();
  const [filters, setFilters] = useState({
    industry: "",
    experience: ""
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
      const params = new URLSearchParams(window.location.search);
      setSearchParams({ 
        jobRole: params.get("jobrole"), 
        skills: params.get("skills")
      });
    }
  }, []);

  useEffect(() => {
    async function fetchMatchingCandidates() {
      setLoading(true);
      try {
        if (searchParams.jobRole && searchParams.skills) {
          const response = await fetchCandidates(searchParams.jobRole, searchParams.skills);
          if (response.message === "Success" && response.data) {
            setCandidates(response.data);
          } else {
            setCandidates([]);
            toast.error("Failed to fetch candidates");
          }
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setCandidates([]);
        toast.error("Error fetching candidates");
      } finally {
        setLoading(false);
      }
    }

    if (searchParams.jobRole || searchParams.skills) {
      fetchMatchingCandidates();
    }
  }, [searchParams.jobRole, searchParams.skills]);

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

  // Filter candidates based on selected filters
  const filteredCandidates = candidates.filter(candidate => {
    if (filters.industry && candidate.industry !== filters.industry) return false;
    if (filters.experience) {
      // Basic experience filtering logic
      const candidateExp = parseInt(candidate.experience) || 0;
      if (filters.experience === "0-2" && (candidateExp > 2 || candidateExp < 0)) return false;
      if (filters.experience === "3-5" && (candidateExp < 3 || candidateExp > 5)) return false;
      if (filters.experience === "5+" && candidateExp < 5) return false;
    }
    return true;
  });

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
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900 to-transparent opacity-40"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 z-10 relative">
            <div className="flex-1">
              <Link href="/dashboard/recruiter" className="flex items-center text-purple-200 hover:text-white mb-3">
                <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">Candidate Search Results</h1>
              <p className="text-blue-100 mt-2">
                {searchParams.jobRole && searchParams.skills
                  ? `Showing candidates for "${searchParams.jobRole}" with skills in "${searchParams.skills}"`
                  : searchParams.jobRole
                  ? `Showing candidates for "${searchParams.jobRole}"`
                  : searchParams.skills
                  ? `Showing candidates with skills in "${searchParams.skills}"`
                  : "Showing all available candidates"}
              </p>
            </div>
          </div>
        </motion.div>

        {candidates?.length > 0 && <motion.div 
          className="mb-6 p-4 bg-gray-50 dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
              <select 
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-white outline-none"
              >
                <option value="">Industry: All</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Others">Others</option>
              </select>
              
              <select 
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-800 dark:text-white outline-none"
              >
                <option value="">Experience: Any</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
          </div>
        </motion.div>}

        {/* Results Count */}
        <motion.div className="mb-4 text-gray-600 dark:text-gray-400" variants={itemVariants}>
          {loading ? (
            <div className="flex items-center">
              <Loader size={16} className="animate-spin mr-2" />
              Searching for candidates...
            </div>
          ) : (
            <p>{filteredCandidates.length} candidates found</p>
          )}
        </motion.div>

        {/* Candidate Results */}
        {loading ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-12"
            variants={itemVariants}
          >
            <Loader size={40} className="animate-spin text-purple-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Finding the best candidates for your position...</p>
          </motion.div>
        ) : filteredCandidates.length > 0 ? (
          <motion.div 
            className="space-y-4" 
            variants={containerVariants}
          >
            {filteredCandidates.map((candidate, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5"
                variants={itemVariants}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <img src={candidate.profilePic} className="h-6 w-6 rounded-full" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-1 mt-2 md:mt-0 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        Match Score: {candidate.matchDetails.score}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                      {candidate.industry && (
                        <div className="flex items-center">
                          <Briefcase size={14} className="mr-1" />
                          {candidate.industry}
                        </div>
                      )}
                      {candidate.experience && (
                        <div className="flex items-center">
                          <Award size={14} className="mr-1" />
                          {candidate.experience} years exp.
                        </div>
                      )}
                      {candidate.createdAt && (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          Joined {formatDate(candidate.createdAt)}
                        </div>
                      )}
                      {candidate.specilization && (
                        <div className="flex items-center">
                          <Award size={14} className="mr-1" />
                          {candidate.specilization}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {candidate.skills && candidate.skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className={`px-2 py-1 text-xs rounded-full ${
                                candidate.matchDetails.exactMatches.includes(skill.toLowerCase()) 
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" 
                                  : candidate.matchDetails.relatedMatches.includes(skill.toLowerCase())
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Details:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                          <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                            <p className="text-xs text-green-800 dark:text-green-300">
                              <span className="font-medium">Exact Matches ({candidate.matchDetails.totalExactMatches}):</span>{" "}
                              {candidate.matchDetails.exactMatches.join(", ") || "None"}
                            </p>
                          </div>
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <p className="text-xs text-blue-800 dark:text-blue-300">
                              <span className="font-medium">Related Matches ({candidate.matchDetails.totalRelatedMatches}):</span>{" "}
                              {candidate.matchDetails.relatedMatches.join(", ") || "None"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2">
                    <button 
                      onClick={() => router.push(`/dashboard/recruiter/${candidate.id}/applications/${candidate.id}`)} 
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      View Profile
                    </button>
                    <button 
                      className="w-full px-4 py-2 bg-white dark:bg-black border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-lg font-medium transition-colors"
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setIsChatOpen(true);
                      }}
                    >
                      Message
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
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No candidates found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any candidates matching your search criteria. Try adjusting your search terms or exploring different skills.
            </p>
            <Link href="/dashboard/recruiter">
              <button className="mt-6 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                Back to Dashboard
              </button>
            </Link>
          </motion.div>
        )}
      </motion.div>
      <ChatWidget />
    </div>
  );
}