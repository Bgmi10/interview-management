"use client";
import React, { useEffect, useState } from "react";
import { createJob, updateJob } from "../../dashboard/recruiter/recruiterapi";
import { useParams, usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, FileText, Building, CheckCircle, Plus, ArrowLeft, Loader, IndianRupee } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { JobPost } from "../../types/job";

export default function CreateJob({ data, title, subTitle }: { data: JobPost, title: string, subTitle: string }) {
  const [job, setJob] = useState<any>(data);
  const { setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [currentField, setCurrentField] = useState("");
  const router = useRouter();
  const pathName = usePathname();
  const params = useParams();

  useEffect(() => {
   setJob(data);
  }, [data])
  
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
  
  const addItemToArray = (e: any) => {
    e.preventDefault();
    if (newItem.trim() === "") return;
    
    setJob({
      ...job,
      [currentField]: [...job[currentField], newItem.trim()]
    });
    setNewItem("");
  };
  
  const removeItemFromArray = (field: any, index: number) => {
    const updatedArray = [...job[field]];
    updatedArray.splice(index, 1);
    setJob({
      ...job,
      [field]: updatedArray
    });
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (pathName !== `/dashboard/recruiter/${params.id}/edit`) {
      const response = await createJob(job).then(i => i).catch(e => console.log(e));
      setUser((p: any) => ({...p, jobPosts: [...p.jobPosts, response.data ]}))
      router.push("/dashboard/recruiter");
    } else {
      await updateJob(params.id, job);
      router.push(`/dashboard/recruiter/${params.id}`);
    }
    } catch (error) {
      console.error("Error creating job:", error);
      setIsSubmitting(false);
    }
  };
  
  const jobTypeOptions = ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP", "REMOTE"];

  if (!data) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-10 px-4 bg-white dark:bg-black flex justify-center items-center text-blue-600 dark:text-blue-400">
          <Loader size={32} className="animate-spin"/>
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
             <motion.div 
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 mt-5">
            <Link href="/dashboard/recruiter">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </Link>
            <h1 className="text-2xl text-center md:text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
          </div>
        </motion.div>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex items-center gap-3">
              <Briefcase size={24} />
              <h2 className="text-xl font-semibold">Job Details</h2>
            </div>
            <p className="mt-2 text-blue-100">{subTitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-blue-500" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Senior Frontend Developer" 
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                      value={job?.title}
                      onChange={(e) => setJob({ ...job, title: e.target.value })} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description</label>
                    <textarea 
                      placeholder="Provide a detailed description of the job..." 
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white min-h-[120px]"
                      value={job?.description}
                      onChange={(e) => setJob({ ...job, description: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
              </div>
              
              {/* Company Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Building size={18} className="text-blue-500" />
                  Company Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Acme Inc." 
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                        value={job?.companyName}
                        onChange={(e) => setJob({ ...job, companyName: e.target.value })} 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry Type</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Technology, Healthcare, Finance" 
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                        value={job?.industryType}
                        onChange={(e) => setJob({ ...job, industryType: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Logo URL (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/logo.png" 
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                      value={job?.companyLogo}
                      onChange={(e) => setJob({ ...job, companyLogo: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Job Details */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-500" />
                  Job Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Developer, Designer, Manager" 
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                      value={job?.role}
                      onChange={(e) => setJob({ ...job, role: e.target.value })} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. New York, Remote" 
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                        value={job?.location}
                        onChange={(e) => setJob({ ...job, location: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary</label>
                    <div className="relative">
                      <IndianRupee size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. 80,000 - 100,000" 
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                        value={job?.salary}
                        onChange={(e) => setJob({ ...job, salary: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white appearance-none"
                        value={job?.jobType}
                        onChange={(e) => setJob({ ...job, jobType: e.target.value })} 
                        required
                      >
                        {jobTypeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 3-5 years" 
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                      value={job?.experience}
                      onChange={(e) => setJob({ ...job, experience: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Array Fields */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-500" />
                  Job Requirements
                </h3>
                
                {/* Responsibilities */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Responsibilities</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      placeholder="Add a responsibility" 
                      className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                      value={currentField === "responsibilities" ? newItem : ""}
                      onChange={(e) => {
                        setCurrentField("responsibilities");
                        setNewItem(e.target.value);
                      }}
                      onFocus={() => setCurrentField("responsibilities")}
                    />
                    <button
                      onClick={addItemToArray}
                      type="button"
                      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {job?.responsibilities.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-950 rounded-lg">
                        <span className="flex-1 text-gray-800 dark:text-gray-200">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItemFromArray("responsibilities", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Required Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      placeholder="Add a required skill" 
                      className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                      value={currentField === "requriedSkills" ? newItem : ""}
                      onChange={(e) => {
                        setCurrentField("requriedSkills");
                        setNewItem(e.target.value);
                      }}
                      onFocus={() => setCurrentField("requriedSkills")}
                    />
                    <button
                      onClick={addItemToArray}
                      type="button"
                      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {job?.requriedSkills.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-950 rounded-lg">
                        <span className="flex-1 text-gray-800 dark:text-gray-200">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItemFromArray("requriedSkills", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Preferred Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Skills</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      placeholder="Add a preferred skill" 
                      className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                      value={currentField === "preferredSkills" ? newItem : ""}
                      onChange={(e) => {
                        setCurrentField("preferredSkills");
                        setNewItem(e.target.value);
                      }}
                      onFocus={() => setCurrentField("preferredSkills")}
                    />
                    <button
                      onClick={addItemToArray}
                      type="button"
                      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {job?.preferredSkills.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-950 rounded-lg">
                        <span className="flex-1 text-gray-800 dark:text-gray-200">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItemFromArray("preferredSkills", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Qualifications */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qualifications</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      placeholder="Add a qualification" 
                      className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                      value={currentField === "qualifications" ? newItem : ""}
                      onChange={(e) => {
                        setCurrentField("qualifications");
                        setNewItem(e.target.value);
                      }}
                      onFocus={() => setCurrentField("qualifications")}
                    />
                    <button
                      onClick={addItemToArray}
                      type="button"
                      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {job?.qualifications.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-950 rounded-lg">
                        <span className="flex-1 text-gray-800 dark:text-gray-200">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItemFromArray("qualifications", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Education */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Education Requirements</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      placeholder="Add an education requirement" 
                      className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-black text-gray-800 dark:text-white"
                      value={currentField === "education" ? newItem : ""}
                      onChange={(e) => {
                        setCurrentField("education");
                        setNewItem(e.target.value);
                      }}
                      onFocus={() => setCurrentField("education")}
                    />
                    <button
                      onClick={addItemToArray}
                      type="button"
                      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    {job?.education.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-950 rounded-lg">
                        <span className="flex-1 text-gray-800 dark:text-gray-200">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItemFromArray("education", index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8 flex gap-4 justify-end">
              <Link href="/dashboard/recruiter">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-950 cursor-pointer font-medium transition-colors"
                >
                  Cancel
                </button>
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Loader size={20} />
                    </motion.div>
                   {  pathName !== `/dashboard/recruiter/${params.id}/edit`  ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>
                    { pathName !== `/dashboard/recruiter/${params.id}/edit` ? 
                   <div className="flex gap-2">
                    <Plus size={20} />
                    Create Job
                    </div> : "Update Job"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}