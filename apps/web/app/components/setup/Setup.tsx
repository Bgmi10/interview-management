"use client";

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios";
import { useAuth } from "../../../context/AuthContext"
import { MdEdit } from "react-icons/md";
import { FaSearchengin } from "react-icons/fa6";
import ResumeUpload from "./ResumeUpload";
import { useRouter } from "next/navigation";
import { uploadToS3 } from "../../../src/utils/s3";
import Image from "next/image";

enum IndustryEnum {
  IT = "IT",
  Finance = "Finance", 
  Healthcare = "Healthcare",
  Education = "Education",
  Marketing = "Marketing",
  Others = "Others"
}

export default function Setup() {
    const { user }:{ user: any} = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [userCollageQuery, setUserCollageQuery] = useState("");
    const [collageResponse, setCollageresponse] = useState([]);
    const navigate = useRouter()

    const fetchCollageName = async () => { 
        try {
            const response: any = await axios.post("/api/collage", { query: userCollageQuery }, { withCredentials: true});
            setCollageresponse(response.data.result.data.solrResults);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
         fetchCollageName()
        }, 500)

        return () => clearTimeout(timer);
       
    }, [userCollageQuery, fetchCollageName]);

    const [form, setForm] = useState({ 
        profilePicture: {
            file: null,
            localUrl: ""
        },
        phoneNumber: "",
        companyName: "",
        companyWebsiteUrl: "",
        companyLocation: "",
        companyLogo: "",
        industry: IndustryEnum.Others,
        linkedIn: "",
        resume: "",
        portfolioUrl: "",
        skills: [] as string[],
        experience: "",
        collage: ""
    });
    const [skillInput, setSkillInput] = useState("");
    const [error, setError] = useState("");
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({...prev, [name]: value }));
        setError("")
        if (name === "phoneNumber") {
            const isValidMobileNumber = /^\d{10}$/.test(value);

            if (!isValidMobileNumber) {
                setError("Phone Number is not valid");
            } else { 
                setError("")
            }
        }
    }

    const handleAddSkill = () => {
        if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
            setForm(prev => ({
                ...prev, 
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput("");
        }
    }

    const handleRemoveSkill = (skillToRemove: string) => {
        setForm(prev => ({
            ...prev, 
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const uploadPromises: Promise<{ key: string; url: string }>[] = [];
    
            if (form.profilePicture?.file) {
                uploadPromises.push(
                    uploadToS3(form.profilePicture.file).then((url) => ({
                        key: "profilePicture",
                        url,
                    }))
                );
            }
    
            if (form.resume) {
                uploadPromises.push(
                    uploadToS3(form.resume).then((url) => ({
                        key: "resume",
                        url,
                    }))
                );
            }
    
            const uploadedFiles = await Promise.all(uploadPromises);
    
            // Create a new form state object
            const updatedForm = { ...form };
            uploadedFiles.forEach(({ key, url }: { key: any, url: any }) => {
                if (key === "profilePicture") {
                    updatedForm.profilePicture = { file: url, localUrl: url };
                } else if (key === "resume") {
                    updatedForm.resume = url;
                }
            });
    
            // Update the form state
            setForm(updatedForm);
    
            // Ensure `axios.put` is called after the form is updated
            const response = await axios.put(
                "/api/user",
                {
                    phoneNumber: updatedForm.phoneNumber,
                    profilePic: updatedForm.profilePicture.file
                        ? updatedForm.profilePicture.file
                        : `https://ui-avatars.com/api/?name=${user?.firstName}&background=4F46E5&color=fff`,
                    companyName: updatedForm.companyName,
                    skills: updatedForm.skills,
                    experience: updatedForm.experience,
                    collageName: updatedForm.collage,
                    linkedIn: updatedForm.linkedIn,
                    resume: updatedForm.resume,
                    companyWebsiteUrl: updatedForm.companyWebsiteUrl,
                    comapanyLocation: updatedForm.companyLocation,
                    industry: updatedForm.industry,
                    portfolioUrl: updatedForm.portfolioUrl,
                },
            );

            if (response.status === 200) {
                navigate.push("/dashboard/recruiter");
            }
        } catch (error) {
            console.error("❌ Error uploading files:", error);
        }
    };
    
    const handleProfileUpload = (e: any) => {
       const file = e.target.files[0];
       setForm(p => ({...p, profilePicture: {file: file, localUrl: URL.createObjectURL(file)}}));
    }

    const candidateSteps = [
        {
            title: "Basic Information",
            fields: (
                <div className="space-y-4">
            <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center space-y-4"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Picture
            </label>
            <div className="relative w-24 h-24">
              <MdEdit className="dark:text-white text-gray-800 top-14 absolute left-20 lg:text-3xl" />
                <Image 
                    src={ form.profilePicture.localUrl ? form.profilePicture.localUrl : `https://ui-avatars.com/api/?name=${user?.firstName}&background=4F46E5&color=fff`} 
                    alt="Profile" 
                    className="w-full h-full rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                />                
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </motion.div>
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number
                        </label>
                        <div className="flex items-center">
                            <span className="absolute lg:left-124 text-gray-500 dark:text-gray-400">+91</span>
                            <input 
                                type="number" 
                                name="phoneNumber" 
                                value={form.phoneNumber} 
                                placeholder="Enter phone number"
                                onChange={handleFormChange}
                                maxLength={10}
                                onKeyDown={(e) => {
                                    if (["e", ".", "+", "-"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full pl-12 p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </div>
                    </motion.div>
                </div>
            )
        },
        {
            title: "Professional Details",
            fields: (
                <div className="space-y-4">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            LinkedIn Profile
                        </label>
                        <input 
                            type="url" 
                            name="linkedIn" 
                            value={form.linkedIn} 
                            placeholder="Enter LinkedIn profile URL"
                            onChange={handleFormChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </motion.div>

                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Portfolio URL
                        </label>
                        <input 
                            type="url" 
                            name="portfolioUrl" 
                            value={form.portfolioUrl} 
                            placeholder="Enter portfolio website"
                            onChange={handleFormChange}
                            className="w-full p-3 border focus:outline-none border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                    </motion.div>

                     <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Skills
                        </label>
                        <div className="flex">
                            <input 
                                type="text" 
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add a skill"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2"
                            />
                            <button 
                                type="button"
                                onClick={handleAddSkill}
                                className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {form.skills.map((skill) => (
                                <span 
                                    key={skill} 
                                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                    <button 
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )
        },
        {
            title: "Experience & Education",
            fields: (
                <div className="space-y-4">
                 <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Experience
                        </label>
                        <textarea 
                            name="experience" 
                            value={form.experience} 
                            placeholder="Describe your work experience"
                            //@ts-ignore
                            onChange={handleFormChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white focus:ring-blue-500 focus:border-blue-500 min-h-[100px] outline-none"
                        />
                    </motion.div>

                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >{<FaSearchengin className="dark:text-white text-gray-700  absolute lg:top-83 mx-2 sm: mt-10 lg:mt-[110px]"/>}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Collage
                        </label>
                        {form.collage ? <><input 
                            name="education" 
                            type="text"
                            value={form.collage} 
                            onChange={(e) => setUserCollageQuery(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white outline-none focus:ring-blue-500 focus:border-blue-500 px-7"
                        /> <button className="bg-red-500 absolute lg:right-124 ml-[-80px] text-white font-bold rounded-md px-2 cursor-pointer mt-3" onClick={() => setForm(p => ({...p, collage: ""}))}>Change</button></>: <input 
                        name="education" 
                        type="text"
                        value={userCollageQuery} 
                        placeholder="Search for your collage"
                        onChange={(e) => setUserCollageQuery(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white outline-none focus:ring-blue-500 focus:border-blue-500 px-7"
                    />}
                        {collageResponse.length > 2 && form.collage === "" && 
                        <div className="border lg:w-[376px] w-[270px] ml-1 border-gray-500 h-44 absolute dark:border-gray-600 rounded-xl mt-1 overflow-y-auto dark:backdrop-blur-2xl bg-white dark:bg-black">
                              {
                                collageResponse?.map((collage: any, idx) => (
                                    <div key={idx} className="flex m-2 mb-4 gap-5 items-center cursor-pointer hover:border-b border-gray-600" onClick={() => setForm(p => ({...p, collage: collage.name}))}>
                                        <Image src={collage.logoUrl} alt="collage logo" className="w-7 h-7 rounded-full"/>
                                        <span className="dark:text-white text-gray-800 font-bold text-sm">{collage.name}<span className="dark:text-gray-300 text-gray-500 ml-2">({collage.type})</span></span> 
                                    </div>
                                ))
                              }
                        </div>}
                    </motion.div>
                   <ResumeUpload setForm={setForm} />
                </div>
            )
        }
    ];

    const recuriterSteps = [
        {
            title: "Basic Information",
            fields: (
                <div className="space-y-4">
                    <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center space-y-4"
        >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Picture
            </label>
            <div className="relative w-24 h-24">
              <MdEdit className="dark:text-white text-gray-800 top-14 absolute left-20 lg:text-3xl" />
                <Image 
                    src={ form.profilePicture.localUrl ? form.profilePicture.localUrl : `https://ui-avatars.com/api/?name=${user?.firstName}&background=4F46E5&color=fff`} 
                    alt="Profile" 
                    className="w-full h-full rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                />                
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfileUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </motion.div>
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number
                        </label>
                        <div className="flex items-center">
                            <span className="absolute lg:left-124 text-gray-500 dark:text-gray-400">+91</span>
                            <input 
                                type="number" 
                                name="phoneNumber" 
                                value={form.phoneNumber} 
                                placeholder="Enter phone number"
                                onChange={handleFormChange}
                                maxLength={10}
                                onKeyDown={(e) => {
                                    if (["e", ".", "+", "-"].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full pl-12 p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </div>
                    </motion.div>
                        <>
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Company Name
                                </label>
                                <input 
                                    type="text" 
                                    name="companyName" 
                                    value={form.companyName} 
                                    placeholder="Enter company name"
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </motion.div>

                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Company Website
                                </label>
                                <input 
                                    type="url" 
                                    name="companyWebsiteUrl" 
                                    value={form.companyWebsiteUrl} 
                                    placeholder="Enter company website URL"
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </motion.div>

                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Company Location
                                </label>
                                <input 
                                    type="text" 
                                    name="companyLocation" 
                                    value={form.companyLocation} 
                                    placeholder="Enter company location"
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </motion.div>

                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Industry
                                </label>
                                <select
                                    name="industry"
                                    value={form.industry}
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {Object.values(IndustryEnum).map(industry => (
                                        <option key={industry} value={industry} className="dark:bg-black">
                                            {industry}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
                        </>
                </div>
            )
        },
        {
            title: "Professional Details",
            fields: (
                <div className="space-y-4">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            LinkedIn Profile
                        </label>
                        <input 
                            type="url" 
                            name="linkedIn" 
                            value={form.linkedIn} 
                            placeholder="Enter LinkedIn profile URL"
                            onChange={handleFormChange}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </motion.div>

                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Portfolio URL
                        </label>
                        <input 
                            type="url" 
                            name="portfolioUrl" 
                            value={form.portfolioUrl} 
                            placeholder="Enter portfolio website"
                            onChange={handleFormChange}
                            className="w-full p-3 border focus:outline-none border-gray-300 dark:border-gray-600 rounded-xl text-black dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                    </motion.div>
                </div>
            )
        }
    ];

    const handleNextStep = () => {
       if (user?.role === "Candidate" && currentStep < candidateSteps.length) {
         setCurrentStep(prev => prev + 1);
       } else if (user?.role === "Recruiter" && currentStep < recuriterSteps.length) {
         setCurrentStep(prev => prev + 1);
       }
    }

    const handleSkip = (e: any) => {
        e.preventDefault();
        setCurrentStep(p => p + 1);
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
            <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5 }}
             className="w-full max-w-md p-8 m-5 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 mt-32"
            >
                <motion.div 
                 initial={{ y: -20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="text-center mb-6"
                >
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Complete Your Profile
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Step {currentStep} of {user?.role === "Candidate" ?  candidateSteps.length : recuriterSteps.length}
                    </p>
                    {error && <span className="text-red-500 border">{error}</span>}
                </motion.div>

                <form className="space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            >
                                
                            {user?.role === "Candidate" ?
                             //@ts-ignore
                            candidateSteps[currentStep - 1].fields : recuriterSteps[currentStep - 1].fields}
                        </motion.div>
                    </AnimatePresence>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="flex justify-between items-center pt-4"
                    >
                       {currentStep !== candidateSteps.length &&  <button onClick={handleSkip} className="cursor-pointer">
                            Skip
                        </button>}
                        
                        {user?.role === "Candidate" && currentStep < candidateSteps.length ? (
                            <button 
                                type="button"
                                onClick={handleNextStep}
                                className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 ease-in-out cursor-pointer"
                            >
                                Next
                            </button>
                        ) : (
                            <div className="flex space-x-2 ml-auto">
                               {user?.role === "Candidate" &&  <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 ease-in-out cursor-pointer"
                                    onClick={handleSubmit}
                                >
                                    Complete Profile
                                </button>}
                            </div>
                        )}
                        {user?.role === "Recruiter" && currentStep < recuriterSteps.length ? (
                            <button 
                                type="button"
                                onClick={handleNextStep}
                                className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 ease-in-out cursor-pointer"
                            >
                                Next
                            </button>
                        ) : (
                            <div className="flex space-x-2 ml-auto">
                                {user?.role === "Recruiter" && <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 ease-in-out cursor-pointer"
                                    onClick={handleSubmit}
                                >
                                    Complete Profile
                                </button>}
                            </div>
                        )}
                    </motion.div>
                </form>
            </motion.div>
        </div>
    )
}