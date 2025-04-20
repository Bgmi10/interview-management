"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import { motion } from "framer-motion"
import {
  Edit2,
  Upload,
  Save,
  X,
  Download,
  ChevronRight,
  Briefcase,
  School,
  Code,
  MapPin,
  Globe,
  Linkedin,
  Phone,
  Mail,
  Loader,
  MapPinCheck,
} from "lucide-react"
import { uploadToS3 } from "../../../src/utils/s3"
import axios from "axios"
import { User } from "../../types/user"
import Image from "next/image"

export default function Profile() {
    //@ts-ignore
  const { user, setUser, profileCompletion }: { user: User, setUser: (User: any) => {}, profileCompletion: number } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [resumeLoader, setResumeLoader] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [formData, setFormData] = useState<User>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    profilePic: user?.profilePic || "",
    email: user?.email || "",
    linkedIn: user?.linkedIn || "",

    // Candidate specific fields
    resume: user?.resume || "",
    portfolioUrl: user?.portfolioUrl || "",
    collageName: user?.collageName || "",
    skills: user?.skills || [],
    experience: user?.experience || "",
    specilization: user?.specilization || "",

    // Recruiter specific fields
    companyName: user?.companyName || "",
    companyWebsiteUrl: user?.companyWebsiteUrl || "",
    companyLocation: user?.companyLocation || "",
    companyLogo: user?.companyLogo || "",
    industry: user?.industry || "",
    role: user?.role || "",
    createdAt: ""
  })

  const [skillInput, setSkillInput] = useState("")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
   
  useEffect(() => {
    setFormData({ ...formData, ...user })
  }, [user, formData])

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
         if (formData.profilePic) {
          const fileKey = user?.profilePic.split("/").pop()
          await axios.post("/api/delete-file", { fileKey })
        }

        const uploadedUrl = await uploadToS3(file)
        setFormData((prev) => ({ ...prev, profilePic: uploadedUrl }))

        setNotification({
          show: true,
          message: "Profile picture updated successfully!",
          type: "success",
        })

        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      setNotification({
        show: true,
        message: "Failed to upload profile picture",
        type: "error",
      })
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setResumeLoader(true);
        
        const formData = new FormData();
        formData.append('resume', file);

        const response = await fetch("/api/extract-resume", {
          method: "POST",
          body: formData,
        });
        
        const result = await response.json();

        setFormData(p => ({...p, firstName: result.firstName, lastName: result.lastName, skills: [...result.skills], portfolioUrl: result.portfolioUrl, linkedIn: result.linkedIn, collageName: result.collageName, experience: result.experience, specilization: result.specilization, phoneNumber: result.phoneNumber }))
        
        if (user?.resume) {
          const fileKey = user.resume.split("/").pop();
          await axios.post("/api/delete-file", { fileKey }, { withCredentials: true });
        }
        
        const uploadedUrl = await uploadToS3(file);
        setFormData((prev) => ({ ...prev, resume: uploadedUrl }));
        
        setResumeLoader(false);
        setNotification({
          show: true,
          message: "Resume updated successfully!",
          type: "success",
        });
        
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      setResumeLoader(false);
      setNotification({
        show: true,
        message: "Failed to upload resume",
        type: "error",
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Prepare data based on role
      const dataToUpdate =
        user?.role === "Candidate"
          ? {
              phoneNumber: formData.phoneNumber,
              profilePic: formData.profilePic,
              linkedIn: formData.linkedIn,
              resume: formData.resume,
              portfolioUrl: formData.portfolioUrl,
              skills: formData.skills,
              experience: formData.experience,
              collageName: formData.collageName,
              specilization: formData.specilization,
              firstName: formData.firstName,
              lastName: formData.lastName
            }
          : {
              phoneNumber: formData.phoneNumber,
              profilePic: formData.profilePic,
              companyName: formData.companyName,
              companyWebsiteUrl: formData.companyWebsiteUrl,
              companyLocation: formData.companyLocation,
              companyLogo: formData.companyLogo,
              industry: formData.industry,
              linkedIn: formData.linkedIn,
              experience: formData.experience,
              firstName: formData.firstName,
              lastName: formData.lastName
            }

      // Send update request
      const response = await axios.put("/api/user", dataToUpdate, { withCredentials: true })

      if (response.status === 200) {
        setUser((p: User) => ({...p, ...dataToUpdate}))
        setIsEditing(false)
        setNotification({
          show: true,
          message: "Profile updated successfully!",
          type: "success",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setNotification({
        show: true,
        message: "Failed to update profile",
        type: "error",
      })
    } finally {
      setSaving(false)
      setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
    }
  }

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

  const progressVariants = {
    hidden: { width: "0%" },
    visible: {
      width: `${profileCompletion}%`,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  }

  async function fetchUserLocation() {
    const response = await fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=464ed0df1c0342c6a959b07bdcad59a5");
    const json = await response.json();
    setUserLocation(json);

  } 

  useEffect(() => {
    fetchUserLocation();
  }, []);


  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black">
      {/* Notification */}
      {notification.show && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </motion.div>
      )}

      <motion.div className="max-w-[1200px] mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        {/* Profile Header Section */}
        <motion.div
          className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 p-6 pt-16 text-white"
          variants={itemVariants}
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900 to-transparent opacity-40"></div>
           
          <div className="flex flex-col md:flex-row items-center gap-6 z-10 relative">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-gray-200 dark:bg-gray-700">
                <Image
                  src={
                    formData.profilePic ||
                    `https://ui-avatars.com/api/?name=${user?.firstName}&background=4F46E5&color=fff`
                  }
                  alt={user?.firstName}
                  className="w-full h-full object-cover"
                />
              </div>

              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-2 rounded-full text-white shadow-lg transition-all duration-300"
                >
                  <Edit2 size={16} />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePicUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
             {!isEditing && <h1 className="text-2xl md:text-3xl font-bold">
                {formData.firstName ?? user?.firstName} {formData.lastName ?? user?.lastName}
              </h1>}
              { 
                isEditing && 
                <div className="flex gap-2 mb-2">
                  <input type="text" name="firstName" placeholder="first Name" value={formData.firstName} className="p-3 rounded-lg border outline-none" onChange={handleChange} />
                  <input type="text" name="lastName" placeholder="last Name" value={formData.lastName} className="p-3 rounded-lg border outline-none" onChange={handleChange} />
                </div>
              }
              <p className="text-blue-100">{user?.role}</p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Profile Completion</span>
                  <span>{profileCompletion}%</span>
                </div>
                <div className="h-2 bg-blue-300 bg-opacity-30 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-white" variants={progressVariants}></motion.div>
                </div>
              </div>
            </div>
            

            <div>
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-blue-700 rounded-lg cursor-pointer font-medium flex items-center gap-2 shadow-lg hover:bg-blue-50 transition-all duration-300"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsEditing(false)
                     }}
                    className="p-2 bg-gray-200 text-gray-700 cursor-pointer rounded-lg flex items-center gap-2 shadow-lg hover:bg-gray-300 transition-all duration-300"
                  >
                    <X size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 cursor-pointer py-2 bg-white text-blue-700 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:bg-blue-50 transition-all duration-300"
                  >
                    {saving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save size={16} />
                        Save
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <motion.div className="md:col-span-1" variants={itemVariants}>
            <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Personal Information</h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-800 dark:text-white w-10">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-lg dark:border-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white">{user?.phoneNumber || "Not provided"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Linkedin className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="linkedIn"
                          value={formData.linkedIn}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-lg dark:border-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-800 dark:text-white">
                          {user?.linkedIn ? (
                            <a
                              href={user?.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {user?.linkedIn.replace(/^https?:\/\/(www\.)?linkedin\.com\//i, "")}
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPinCheck className="text-blue-500" size={18}/>
                    <div>
                     <span>{userLocation?.city?.name}</span>,
                     <span>{userLocation?.state?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Role Specific Fields */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  {user?.role === "Candidate" ? "Candidate Profile" : "Recruiter Profile"}
                </h2>

                {/* Candidate Fields */}
                {user?.role === "Candidate" && (
                  <div className="space-y-6">
                    {/* Resume Section */}
                    <div className="p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Resume</h3>
                       
                        {isEditing ? (
                          <div className="flex flex-col items-center justify-center gap-2">
                          <label htmlFor="resumeUpload" className="relative cursor-pointer">
                            <span 
                              className="relative gap-1 flex px-6 py-3 text-white font-normal bg-blue-600 rounded-lg shadow-lg transition-all duration-300 
                                       hover:bg-blue-700 hover:shadow-blue-500/50
                                       focus:ring-4 focus:ring-blue-400 focus:outline-none items-center"
                            >
                              {resumeLoader ? <Loader className="animate-spin" size={15}/> : <Upload size={18}/>}  
                              <span>{resumeLoader ? "Extracting Details..." : "Upload Resume"}</span>  
                            </span>
                            <div className="absolute -inset-1 blur-xl bg-blue-500 opacity-40 rounded-lg"></div>
                          </label>
                        
                          {/* Hidden File Input */}
                          <input 
                            type="file" 
                            id="resumeUpload" 
                            className="hidden" 
                            onChange={handleResumeUpload} 
                            accept="application/pdf"
                          />
                        
                          <p className="text-sm text-gray-400 italic">AI will extract details automatically</p>
                        </div>
                        
                        ) : (
                          user.resume && (
                            <a
                              href={user.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center gap-2"
                            >
                              <Download size={14} />
                              Download
                            </a>
                          )
                        )}

                        <input
                          type="file"
                          ref={resumeInputRef}
                          onChange={handleResumeUpload}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                        />
                      </div>

                      {formData.resume ? (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <div className="h-24 bg-gray-100 dark:bg-black flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Resume uploaded</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {formData.resume.split("/").pop()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                          <p className="text-gray-500 dark:text-gray-400">No resume uploaded yet</p>
                          {isEditing && (
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                              Click upload to add your resume
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Education */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <School className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-gray-800 dark:text-white">Education</h3>
                      </div>

                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            name="collageName"
                            placeholder="College/University Name"
                            value={formData.collageName}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded-lg  dark:border-gray-700 dark:text-white"
                          />
                          <input
                            type="text"
                            name="specilization"
                            placeholder="Specialization"
                            value={formData.specilization}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg dark:border-gray-700 dark:text-white"
                          />
                        </>
                      ) : (
                        <div className="bg-gray-50 dark:bg-black p-3 rounded-lg">
                          <p className="font-medium text-gray-800 dark:text-white">
                            {user?.collageName || "No education details provided"}
                          </p>
                          {user?.specilization && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{user?.specilization}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Code className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-gray-800 dark:text-white">Skills</h3>
                      </div>

                      {isEditing && (
                        <div className="flex mb-2">
                          <input
                            type="text"
                            placeholder="Add a skill"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillInputKeyDown}
                            className="flex-1 p-2 border rounded-l-lg  dark:border-gray-700 dark:text-white"
                          />
                          <button
                            onClick={handleAddSkill}
                            className="px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg"
                          >
                            Add
                          </button>
                        </div>
                      )}

                      {user?.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user?.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm flex items-center"
                            >
                              {skill}
                              {isEditing && (
                                <button
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No skills added yet</p>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-gray-800 dark:text-white">Experience</h3>
                      </div>

                      {isEditing ? (
                        <textarea
                          name="experience"
                          placeholder="Describe your work experience"
                          value={formData.experience}
                          onChange={handleChange}
                          rows={4}
                          className="w-full p-2 border rounded-lg dark:border-gray-700 dark:text-white"
                        />
                      ) : (
                        <div className="bg-gray-50 dark:bg-black p-3 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300">
                            {user?.experience || "No experience details provided"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Portfolio */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-gray-800 dark:text-white">Portfolio</h3>
                      </div>

                      {isEditing ? (
                        <input
                          type="text"
                          name="portfolioUrl"
                          placeholder="Your portfolio website URL"
                          value={formData.portfolioUrl}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-lg dark:border-gray-700 dark:text-white"
                        />
                      ) : (
                        <div className="bg-gray-50 dark:bg-black p-3 rounded-lg">
                          {user?.portfolioUrl ? (
                            <a
                              href={user?.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                            >
                              {user?.portfolioUrl}
                              <ChevronRight size={16} className="ml-1" />
                            </a>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">No portfolio URL provided</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recruiter Fields */}
                {user?.role === "Recruiter" && (
                  <div className="space-y-6">
                    {/* Company Information */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-900 overflow-hidden">
                          {user?.companyLogo ? (
                            <Image
                              src={user?.companyLogo || "/placeholder.svg"}
                              alt={user?.companyName}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Briefcase className="text-gray-400" size={24} />
                          )}
                        </div>

                        <div className="flex-1">
                          {isEditing ? (
                            <input
                              type="text"
                              name="companyName"
                              placeholder="Company Name"
                              value={formData.companyName}
                              onChange={handleChange}
                              className="w-full p-2 mb-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                          ) : (
                            <h3 className="font-bold text-gray-800 dark:text-white">
                              {user?.companyName || "Company Name Not Provided"}
                            </h3>
                          )}

                          {isEditing ? (
                            <input
                              type="text"
                              name="industry"
                              placeholder="Industry"
                              value={formData.industry}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                          ) : (
                            <p className="text-gray-600 dark:text-gray-400">
                              {user?.industry || "Industry Not Specified"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-blue-500 flex-shrink-0" size={16} />
                          {isEditing ? (
                            <input
                              type="text"
                              name="companyLocation"
                              placeholder="Company Location"
                              value={formData.companyLocation}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300">
                              {user?.companyLocation || "Location Not Provided"}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Globe className="text-blue-500 flex-shrink-0" size={16} />
                          {isEditing ? (
                            <input
                              type="text"
                              name="companyWebsiteUrl"
                              placeholder="Company Website"
                              value={formData.companyWebsiteUrl}
                              onChange={handleChange}
                              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                          ) : user?.companyWebsiteUrl ? (
                            <a
                              href={user?.companyWebsiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {user?.companyWebsiteUrl}
                            </a>
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300">Website Not Provided</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-gray-800 dark:text-white">Experience</h3>
                      </div>

                      {isEditing ? (
                        <textarea
                          name="experience"
                          placeholder="Describe your recruiting experience"
                          value={formData.experience}
                          onChange={handleChange}
                          rows={4}
                          className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300">
                            {user?.experience || "No experience details provided"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

