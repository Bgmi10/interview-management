"use client";
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { GoCodescan } from "react-icons/go";
import { FaCodeBranch } from "react-icons/fa6";
import { TbUserSearch } from "react-icons/tb";
import { usePathname } from 'next/navigation';
import { Toggle } from './Toggle';
import FloatIcons from '../FloatIcons';
import logo from "../../../public/logo.png";
import whiteThemeLogo from "../../../public/logo-black.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { useAuth } from '../../../context/AuthContext';
import { Bell, Search, LogOut, Home, X, MapPin, Briefcase, TrendingUp, ChartBar, MessageCircle, Power, Code, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User } from '../../types/user';
import { ThemeContext } from '../../../context/ThemeContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [themepreference, setThemePreference] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [jobLocation, setJobLocation] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [error, setError] = useState("");
    //@ts-ignore
    const { user, isauthenticated, Logout, profileCompletion, loader }: { loader: boolean, user: User, isauthenticated: boolean, Logout: () => {}, porfileCompletion: number } = useAuth();
    const navigate = useRouter();
    const [jobQueryResults, setJobQueryResults] = useState<any>(null);
    const [jobTitleResults, setJobTitleResults] = useState(null);
    const { setIsChatOpen } = useContext(ThemeContext);
    const [userSkillsQuery, setUserSkillsQuery] = useState("");
    const [skillsSuggestions, setSkillsSuggestions] = useState(null); 
    const [userSelectedSkills, setUserSelectedSkills] = useState([]);

    const navItems = [
        {
            name: "Home",
            path: "/",
            icon: <Home size={18} />
        },
        {
            name: "Features",
            path: "/features",
            icon: <TbUserSearch size={18} />
        },
        {
            name: "Solutions",
            path: "/solutions",
            icon: <FaCodeBranch size={18} />
        },
        {
            name: "Pricing",
            path: "/pricing",
            icon: <GoCodescan size={18} />
        },
        {
            name: "Logout",
            click: Logout,
            path: "/login",
            icon: <LogOut size={18} />
        }
    ];

    const pathname = usePathname();
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            setThemePreference(localStorage.getItem("theme") as string);
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    // Calculate profile completion percentage
    const completionPercentage = profileCompletion || 65;

    // Drawer animation variants
    const drawerVariants = {
        open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
    };

    // Menu item animation variants
    const menuItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: any) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        })
    };

    // Profile section animation variants
    const profileVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2,
                duration: 0.5
            }
        }
    };

    // Search bar animation variants
    const searchBarVariants = {
        hidden: { opacity: 0, y: -10, height: 0 },
        visible: { 
            opacity: 1, 
            y: 0, 
            height: "auto",
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                staggerChildren: 0.1
            }
        }
    };

    const searchInputVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                type: "spring", 
                stiffness: 500, 
                damping: 30
            }
        }
    };
 
    const handleSearch = () => {
       setIsSearchOpen(false);
       if (user.role === "Candidate") {
        if (typeof window !== "undefined") {
         window.location.href = (`/dashboard/candidate/search?jobtitle=${jobTitle}&joblocation=${jobLocation}`)};
       } else {
        if (typeof window !== "undefined") {
        window.location.href = (`/dashboard/recruiter/search?jobrole=${jobTitle}&skills=${userSelectedSkills}`)};
       }
    }

    const fetchJobtitle = useCallback(async () => {
        try {
          const response = await fetch("/api/job-title-suggestion", {
            method: "POST",
            body: JSON.stringify({ query: jobTitle }),
          });
          const json = await response.json();
          setJobTitleResults(json);
        } catch (e) {
          console.log(e);
        }
      }, [jobTitle]); // 👈 depends only on jobTitle
      

    useEffect(() => {
      const isExist = jobTitleResults?.suggestions?.find((item) => {
        return item === jobTitle 
      });

        if (isExist === jobTitle) {
         setJobTitleResults(null);
         return; 
        }
      const timeOut = setTimeout(() => {
         fetchJobtitle();
      }, 500)

      return () => clearTimeout(timeOut);
    }, [jobTitle, fetchJobtitle, jobTitleResults?.suggestions]);

    const handleJobTitleChange = (e: any) => {
      setJobTitle(e.target.value);
    }

    const handleJobLocationChange = (e: any) => {
        setJobLocation(e.target.value);
    }

    const fetchLocation = useCallback(async () => {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${jobLocation}&apiKey=464ed0df1c0342c6a959b07bdcad59a5`);
        const json = await response.json();
        setJobQueryResults(json);
      }, [jobLocation]);
      

    useEffect(() => {
        if (jobLocation === "") {
            setJobQueryResults(null);
            return;
        };

      const isExist = jobQueryResults?.features?.find((item: any) => {
        return item?.properties?.formatted === jobLocation
      }); 

      if (isExist) {
        setJobQueryResults(null);
        return;
      }

      const timeout = setTimeout(() => {
        fetchLocation();
      }, 500);

      return () => clearTimeout(timeout);
    }, [jobLocation, fetchLocation, jobQueryResults?.features]);

    const handleSkillsChange = (e) => {
      setUserSkillsQuery(e.target.value);
    }

    const fetchSkillsSuggestion = useCallback(async () => {
        try {
          const response = await fetch("/api/skills-suggestions", {
            method: "POST",
            body: JSON.stringify({ query: userSkillsQuery }),
          });
          const json = await response.json();
          console.log(json);
          setSkillsSuggestions(json);
        } catch (e) {
          console.log(e);
        }
      }, [userSkillsQuery]);
      

    useEffect(() => {
        if (!userSkillsQuery) {
            return;
        }
        const timer = setTimeout(() => {
          fetchSkillsSuggestion();
        }, 400);

        return () => clearTimeout(timer);
    }, [userSkillsQuery, fetchSkillsSuggestion]);


    return (
        <header className="mt-[-40px] p-5 text-center">
            { typeof window !== "undefined" &&  window.location.pathname === "/" && <FloatIcons />}
            <div className={`top-4 left-3 right-3 z-40 md:hidden fixed flex ${!isauthenticated ? "justify-center" : "justify-between"} backdrop-blur-md border-gray-800 border p-2 rounded-xl bg-secondary/30`}>
                {isauthenticated && <motion.button 
                    onClick={toggleMenu} 
                    className="p-2 text-gray-700 dark:text-gray-300 px-0"
                    whileTap={{ scale: 0.9 }}
                >
                    {isMenuOpen ? <IoClose className="h-6 w-6" /> : <RxHamburgerMenu className="h-6 w-6" />}
                </motion.button>}
                <Link href="/" className="flex gap-2">
                    {themepreference === "dark" ? <Image src={logo} width={50} height={20} alt="Hi-Free" className="object-cover" /> :<Image src={whiteThemeLogo} width={50} height={20} alt="Hi-Free" className="object-cover" />}
                    <span className="self-center text-lg font-bold whitespace-nowrap dark:text-white text-black">
                        Hi-Free
                    </span>
                </Link>
               {isauthenticated &&  <div className='flex items-center gap-3'>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={toggleSearch}>
                        <Search size={20} className='dark:text-white text-black'/>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }}>
                        <Bell size={20} className='dark:text-white text-black' />
                    </motion.button>
                </div>}
            </div>

            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div 
                        className="fixed top-16 left-3 right-3 z-50 backdrop-blur-md border-gray-800 border p-4 rounded-xl bg-secondary/80 md:hidden"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={searchBarVariants}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium text-sm dark:text-white text-black">{user.role === "Candidate" ? "Search Jobs" : "Search Candidates"}</h3>
                            <motion.button 
                                onClick={toggleSearch}
                                whileTap={{ scale: 0.9 }}
                                className="p-1"
                            >
                                <X size={18} className="text-gray-700 dark:text-gray-300" />
                            </motion.button>
                        </div>
                        
                        <div className="space-y-3">
                            <motion.div variants={searchInputVariants} className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-2">
                                <Briefcase size={16} className="text-gray-500 mr-2" />
                                <input 
                                    type="text" 
                                    placeholder={user.role === "Candidate" ? "Job title or keyword" : "Enter a job role"} 
                                    className="w-full bg-transparent border-none outline-none text-sm dark:text-white text-black"
                                    onChange={handleJobTitleChange}
                                    value={jobTitle}
                                />
                            </motion.div>

                            { jobTitleResults?.suggestions?.length > 0 &&
                            <div className='flex flex-col bg-white items-start gap-3 absolute rounded-xl p-4 overflow-y-scroll'>
                                {
                                    jobTitleResults?.suggestions?.map((item: any) => (
                                        <div key={item} className='flex gap-1' onClick={() => setJobTitle(item)}>
                                            <Search size={20} />
                                            <span className='line-clamp-1' >{item}</span>
                                        </div>
                                    ))
                                }
                            </div>}
                            
                            <motion.div variants={searchInputVariants} className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-2">
                                <MapPin size={16} className="text-gray-500 mr-2" />
                                <input 
                                    type="text" 
                                    placeholder={user.role === "Candidate" ? "Location" : "Enter a skills"} 
                                    value={user.role === "Candidate" ? jobLocation : userSkillsQuery}
                                    className="w-full bg-transparent border-none outline-none text-sm dark:text-white text-black"
                                    onChange={user.role === "Candidate" ? handleJobLocationChange : handleSkillsChange}
                                    onBlur={() => {
                                        setJobQueryResults(null);
                                        setSkillsSuggestions(null);
                                    }}
                                />
                            </motion.div>

                           { jobQueryResults?.features?.length > 0 &&
                            <div className='flex flex-col bg-white items-start gap-3 absolute rounded-xl p-4 overflow-y-scroll'>
                                {
                                    jobQueryResults?.features?.map((item: any) => (
                                        <div key={item} className='flex gap-1' onClick={() => setJobLocation(item.properties.formatted)}>
                                            <Search size={20} />
                                            <span className='line-clamp-1'>{item.properties.formatted}</span>
                                        </div>
                                    ))
                                }
                            </div>}

                            { user.role === "Recruiter" && skillsSuggestions?.suggestions.length > 0 &&
                                <div className='flex flex-col bg-white items-start gap-3 absolute rounded-xl p-4 overflow-y-scroll'>
                                    {
                                        skillsSuggestions?.suggestions?.map((item: any) => (
                                            <div key={item} className='flex gap-1  cursor-pointer' onClick={() => {      
                                                setUserSelectedSkills((prev: any) => [...prev, item]);
                                                 setSkillsSuggestions(null);
                                            }}>
                                                <Search size={20} />
                                                <span className='line-clamp-1'>{item}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                             {userSelectedSkills.length > 0 && <div className="flex flex-wrap mt-2 gap-2">
                                    <span>Selected Skills: </span>
                                     {
                                        userSelectedSkills?.map((item) => (
                                            <div key={item} className="flex items-center gap-1">
                                                <Delete onClick={() => {
                                                    const filtered = userSelectedSkills.filter(i => i !== item);
                                                    setUserSelectedSkills(filtered);
                                                }} className='text-red-500' />
                                                <span>{item}</span>
                                            </div>
                                        ) )
                                    }
                               </div>}
                            <motion.button
                                variants={searchInputVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-2 text-white bg-blue-600 rounded-lg text-sm font-medium"
                            >
                                Search Jobs
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        className="fixed inset-y-0 left-0 z-50 w-72 bg-secondary/95 backdrop-blur-3xl shadow-xl md:hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={drawerVariants}
                    >
                        <div className="flex justify-end p-4">
                            <motion.button 
                                onClick={toggleMenu}
                                whileTap={{ scale: 0.9 }}
                                className="p-2"
                            >
                                <IoClose className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            </motion.button>
                        </div>
                        
                        <div className="flex flex-col p-4">
                            <motion.div 
                                className="flex flex-col items-center mb-8"
                                variants={profileVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                                        <Image 
                                            src={user?.profilePic ? user?.profilePic : `https://ui-avatars.com/api/?name=${user?.firstName}&background=4F46E5&color=fff`} 
                                            className="w-full h-full object-cover"
                                            alt={user?.firstName || "User"}
                                        />
                                    </div>
                                    
                                    {/* Circular progress indicator */}
                                    <svg className="absolute top-0 left-0 w-24 h-24 -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="46"
                                            fill="none"
                                            stroke="rgba(200, 200, 200, 0.2)"
                                            strokeWidth="4"
                                        />
                                        <motion.circle
                                            cx="48"
                                            cy="48"
                                            r="46"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeDasharray="289.02652413"
                                            initial={{ strokeDashoffset: 289.02652413 }}
                                            animate={{ 
                                                strokeDashoffset: 289.02652413 - (289.02652413 * completionPercentage / 100),
                                                transition: { duration: 1.5, ease: "easeInOut" }
                                            }}
                                            className="text-blue-500"
                                        />
                                    </svg>
                                    
                                    {/* Percentage display */}
                                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center border-2 border-secondary">
                                        {completionPercentage}%
                                    </div>
                                </div>
                                
                                <div className="mt-4 text-center">
                                    <h3 className="font-bold text-lg dark:text-white text-gray-900">{user?.firstName} {user?.lastName}</h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300" onClick={() => navigate.push("/profile")}>Complete your profile</p>
                                </div>
                            </motion.div>
                            
                            <div className="mb-6">
                                <Toggle />
                            </div>
                            
                            <nav>
                                <ul className="space-y-1">
                                    {navItems.map((item, index) => (
                                        <motion.li 
                                            key={index}
                                            custom={index}
                                            variants={menuItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <Link 
                                                href={item.path} 
                                                className={`flex items-center dark:text-white text-black gap-3 p-3 rounded-lg text-sm transition-all ${
                                                    pathname === item.path 
                                                        ? "bg-primary/10 text-primary font-medium" 
                                                        : "hover:bg-secondary-foreground/10"
                                                }`}
                                                onClick={item.click}
                                            >
                                                <span className="text-current">{item.icon}</span>
                                                {item.name}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="sm: hidden lg:block fixed lg:w-11/12 top-4 start-12 border-b z-50 border-gray-300 dark:border-gray-600 mx-auto bg-secondary/15 shadow-lg shadow-neutral-600/5  border border-primary/10 p-2 rounded-2xl px-4 sm:px-6 lg:px-8 max-w-7xl header-height w-full items-center gap-4 bg-gradient-to-b from-white/[0.75] to-gray-100/[0.75] ring-1 ring-gray-300 backdrop-blur-xl dark:from-gray-900/[0.75] dark:to-black dark:ring-gray-800 rounded-t-xl">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href={"/"} className="flex items-center space-x-1 rtl:space-x-reverse">
                        <div className='grid place-items-center p-1'>
                        {themepreference === "dark" ? <Image src={logo} width={50} height={20} alt="Hi-Free" className="object-cover" /> :<Image src={whiteThemeLogo} width={50} height={20} alt="Hi-Free" className="object-cover" />}
                        </div>
                        <span className="self-center text-lg lg:text-2xl font-bold whitespace-nowrap dark:text-white text-black">Hi-Free</span>
                    </Link>
                    
                    <div className="hidden md:flex justify-between gap-2 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <div className={`flex justify-center items-center gap-2 ${isauthenticated && "hidden"}`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 lg:px-4 lg:py-2 text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 transition-all duration-300 ease-in-out rounded-lg"
                            >
                                <Link href="/signup">
                                   <span className="lg:text-text text-sm font-semibold">Get Started</span>
                                </Link>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="rounded-lg lg:px-4 lg:py-2 text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 transition-all duration-300 ease-in-out"
                            >
                                <Link href="/login">
                                    <span className="lg:text-text text-sm font-semibold">Login</span>
                                </Link>
                            </motion.button>
                            <Toggle />
                        </div>
                        
                         {isauthenticated && 
                         
                         <div className='flex justify-center items-center gap-2'>
                            <div className="flex gap-6 mr-5">
                                <span onClick={() => {
                                    if (user.role === "Candidate") {
                                        navigate.push("/dashboard/candidate");
                                    } else {
                                        navigate.push("/dashboard/recruiter");
                                    }
                                }} className="flex gap-1 items-center text-black dark:text-white cursor-pointer"><TrendingUp /> Dashboard</span>
                                <span className='flex gap-1 items-center text-black dark:text-white cursor-pointer' onClick={() => setIsChatOpen(true)}><MessageCircle size={18}/> Messages</span>
                            </div>
                            
                            {!isSearchOpen && 
                               <div>
                                <button className='rounded-4xl flex justify-between w-60 gap-2 border dark:border-gray-700 p-2 text-gray-400 items-center cursor-pointer' onClick={toggleSearch}>
                                    <span>{user.role === "Candidate" ? "Search for jobs" : "Looking for candidate"}</span>
                                    <div className='bg-blue-600 rounded-full p-1'>
                                     <Search className='text-white' size={18}/>
                                    </div>
                                </button>
                               </div>
                            }

                         {loader ? <div className='w-9 h-9 rounded-full animate-pulse dark:bg-gray-600 bg-gray-300'/> : <Image src={user?.profilePic ? user?.profilePic : `https://ui-avatars.com/api/?name=${user?.firstName}&background=4F46E5&color=fff`} className='w-9 h-9 rounded-full cursor-pointer'  alt="user" onClick={() => {
                                navigate.push("/profile")
                            }}/>}
                            
                            <Toggle />
                            {!loader ? <motion.button
                                className="rounded-lg lg:px-4 lg:py-2 cursor-pointer text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700"
                                onClick={() => {
                                    setIsMenuOpen(false)
                                    Logout()
                                }}
                            >
                              <span className="lg:text-text text-sm font-semibold">Logout</span>
                            </motion.button> : <motion.button
                                className="rounded-lg lg:px-11 lg:py-5 cursor-pointer text-white dark:bg-gray-600 bg-gray-300 animate-pulse"
                            >
                            </motion.button>}
                        </div>}
                    </div>
                </div>
                
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div 
                            className="mx-auto max-w-screen-xl px-4 pb-4"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={searchBarVariants}
                        >
                            <div className="dark:bg-transparent p-10 rounded-xl shadow-lg border border-gray-400 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-lg dark:text-white text-black">{user.role === "Candidate" ? "Find Your Perfect Job" : "Find a perfect candidate"}</h3>
                                    <motion.button 
                                        onClick={toggleSearch}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                                    >
                                        <X size={20} />
                                    </motion.button>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-3">
                                    <motion.div 
                                        variants={searchInputVariants} 
                                        className="flex items-center dark:bg-transparent border border-gray-500 dark:border-gray-500 rounded-lg px-4 py-3 flex-1"
                                    >
                                        <Briefcase size={18} className="text-gray-500 dark:text-gray-400 mr-3" />
                                        <input 
                                            type="text" 
                                            placeholder={user.role === "Candidate" ? "Job title or keyword" : "Enter a job role"}
                                            className="w-full bg-transparent border-none outline-none text-black dark:text-white"
                                            onChange={handleJobTitleChange}
                                            value={jobTitle}
                                        />
                                    </motion.div>

                                    { jobTitleResults?.suggestions?.length > 0 &&
                                        <div className='flex flex-col bg-white items-start gap-3 mt-14 absolute rounded-xl p-4 overflow-y-scroll '>
                                            {
                                                jobTitleResults?.suggestions?.map((item: any) => (
                                                    <div key={item} className='flex gap-1 cursor-pointer'>
                                                        <Search size={20} />
                                                        <span className='line-clamp-1' onClick={() => setJobTitle(item)}>{item}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                    
                                    <motion.div 
                                        variants={searchInputVariants} 
                                        className="flex items-center border-gray-500 dark:bg-transparent rounded-lg px-4 py-3 flex-1 dark:border-gray-500 border"
                                    >
                                        {user.role === "Candidate" ? <MapPin size={18} className="text-gray-500 dark:text-gray-400 mr-3" /> : <Code size={18} className="text-gray-500 dark:text-gray-400 mr-3" />}
                                        <input 
                                            type="text" 
                                            placeholder={user.role === "Candidate" ? "Location" : "Enter a Skills"} 
                                            value={user.role === "Candidate" ? jobLocation : userSkillsQuery}
                                            className="w-full bg-transparent border-none outline-none text-black dark:text-white"
                                            onChange={user.role === "Candidate" ? handleJobLocationChange : handleSkillsChange}
                                        />
                                    </motion.div>

                                    { jobQueryResults?.features?.length > 0 &&
                                        <div className='flex flex-col backdrop-blur-xl bg-white items-start gap-3 absolute right-52 top-57 rounded-xl p-3 overflow-y-scroll w-[450px]'>
                                            {
                                                jobQueryResults?.features?.map((item: any) => (
                                                    <div key={item} className='flex gap-1  cursor-pointer' onClick={() => setJobLocation(item.properties.formatted)}>
                                                        <Search size={20} />
                                                        <span className='line-clamp-1'>{item.properties.formatted}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                
                                   { user.role === "Recruiter" && skillsSuggestions?.suggestions.length > 0 &&
                                        <div className='flex flex-col backdrop-blur-xl bg-white items-start gap-3 absolute right-52 top-57 rounded-xl p-3 overflow-y-scroll w-[450px]'>
                                            {
                                                skillsSuggestions?.suggestions?.map((item: any) => (
                                                    <div key={item} className='flex gap-1  cursor-pointer' onClick={() => {      
                                                        setUserSelectedSkills((prev: any) => [...prev, item]);
                                                         setSkillsSuggestions(null);
                                                    }}>
                                                        <Search size={20} />
                                                        <span className='line-clamp-1'>{item}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                    
                                    <motion.button
                                        variants={searchInputVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium cursor-pointer"
                                        onClick={handleSearch}
                                    >
                                        Search
                                    </motion.button>
                                </div>
                               { userSelectedSkills.length > 0 && <div className="flex flex-wrap mt-2 gap-2">
                                    <span>Selected Skills: </span>
                                     {
                                        userSelectedSkills?.map((item) => (
                                            <div key={item} className="flex items-center gap-1">
                                                <Delete onClick={() => {
                                                    const filtered = userSelectedSkills.filter(i => i !== item);
                                                    setUserSelectedSkills(filtered);
                                                }} className='text-red-500' />
                                                <span>{item}</span>
                                            </div>
                                        ) )
                                    }
                               </div>}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;