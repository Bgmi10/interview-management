"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getCandidateById } from "../../dashboard/candidate/candidateapi"
import {
  School,
  Code,
  Briefcase,
  Globe,
  Linkedin,
  Phone,
  Mail,
  Download,
  ExternalLink,
  Loader,
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "../../../context/AuthContext"
import { logview } from "../../lib/commonapi"
import { User } from "../../types/user"

export default function CandidateProfile() {
  const params = useParams()
  const [candidate, setCandidate] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null);
  const { user }: { user: any } = useAuth();

  useEffect(() => {
    setLoading(true)
    getCandidateById({ candidateId: params.applicantId })
      .then(response => {
        setCandidate(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching candidate:", err)
        setError("Failed to load candidate profile")
        setLoading(false)
    });

  }, [params.applicantId])

  useEffect(() => {
    if (user) {
      logview({ viewedId: Number(params.applicantId), viewerId: user?.id }).then(data => console.log(data)).catch(e => console.log(e))
    }
  }, [user])

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
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black flex justify-center items-center text-blue-600 dark:text-blue-400">
          <Loader size={32} className="animate-spin"/>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
          <div className="text-yellow-500 text-5xl mb-4">?</div>
          <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Candidate Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">The candidate profile you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black">
      <motion.div className="max-w-[1200px] mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        {/* Profile Header Section */}
        <motion.div
          className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 p-6 pt-16 text-white"
          variants={itemVariants}
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900 to-transparent opacity-40"></div>

          <div className="flex flex-col md:flex-row items-center gap-6 z-10 relative">
            {/* Profile Picture */}
            <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src={candidate.profilePic || `https://ui-avatars.com/api/?name=${candidate.firstName}&background=4F46E5&color=fff`}
                alt={candidate.firstName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <p className="text-blue-100">Candidate</p>
              
              {/* Joined date */}
              <p className="text-blue-100 text-sm mt-2">
                Member since {new Date(candidate.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <motion.div className="md:col-span-1" variants={itemVariants}>
            <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Contact Information</h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-800 dark:text-white break-all">{candidate.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-800 dark:text-white">{candidate.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Linkedin className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
                      <p className="text-gray-800 dark:text-white">
                        {candidate.linkedIn ? (
                          <a
                            href={candidate.linkedIn.startsWith('http') ? candidate.linkedIn : `https://${candidate.linkedIn}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                          >
                            {candidate.linkedIn.replace(/^https?:\/\/(www\.)?/i, "")}
                            <ExternalLink size={14} className="ml-1" />
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resume Section for Mobile */}
            <motion.div className="mt-6 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 md:hidden" variants={itemVariants}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Resume</h3>
                  
                  {candidate.resume && (
                    <a
                      href={candidate.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center gap-2"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  )}
                </div>
                
                {candidate.resume ? (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="h-24 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Resume available</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {candidate.resume.split("/").pop()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No resume uploaded</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Profile Details */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Professional Information</h2>

                <div className="space-y-6">
                  {/* Resume Section for Desktop */}
                  <div className="p-4 rounded-lg hidden md:block">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Resume</h3>
                      
                      {candidate.resume && (
                        <a
                          href={candidate.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center gap-2"
                        >
                          <Download size={14} />
                          Download
                        </a>
                      )}
                    </div>
                    
                    {candidate.resume ? (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Resume available</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {candidate.resume.split("/").pop()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No resume uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <School className="text-blue-500" size={18} />
                      <h3 className="font-semibold text-gray-800 dark:text-white">Education</h3>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {candidate.collageName ? (
                        <>
                          <p className="font-medium text-gray-800 dark:text-white">{candidate.collageName}</p>
                          {candidate.specilization && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{candidate.specilization}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No education details provided</p>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Code className="text-blue-500" size={18} />
                      <h3 className="font-semibold text-gray-800 dark:text-white">Skills</h3>
                    </div>

                    {candidate.skills && candidate.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No skills listed</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="text-blue-500" size={18} />
                      <h3 className="font-semibold text-gray-800 dark:text-white">Experience</h3>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {candidate.experience ? (
                        <p className="text-gray-700 dark:text-gray-300">{candidate.experience}</p>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No experience details provided</p>
                      )}
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="text-blue-500" size={18} />
                      <h3 className="font-semibold text-gray-800 dark:text-white">Portfolio</h3>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {candidate.portfolioUrl ? (
                        <a
                          href={candidate.portfolioUrl.startsWith('http') ? candidate.portfolioUrl : `https://${candidate.portfolioUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                        >
                          {candidate.portfolioUrl}
                          <ExternalLink size={16} className="ml-1" />
                        </a>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No portfolio URL provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

