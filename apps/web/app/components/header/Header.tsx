"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { GoCodescan } from "react-icons/go";
import { FaCodeBranch } from "react-icons/fa6";
import { TbUserSearch } from "react-icons/tb";
import { usePathname } from 'next/navigation';
import { Toggle } from './Toggle';
import FloatIcons from '../FloatIcons';
import logo from "../../../public/logo.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { useAuth } from '../../../context/AuthContext';
import { Bell, Search, LogOut, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User } from '../../types/user';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    //@ts-ignore
    const { user, isauthenticated, Logout, profileCompletion }: { user: User, isauthenticated: boolean, Logout: () => {}, porfileCompletion: number } = useAuth();
    const navigate = useRouter();

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Calculate profile completion percentage
    const completionPercentage = profileCompletion || 65; // Default to 65% if not provided

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

    return (
        <header className="mt-[-40px] p-5 text-center">
            
            {window.location.pathname === "/" && <FloatIcons />}
            
            <div className={`top-4 left-3 right-3 z-40 md:hidden fixed flex ${!isauthenticated ? "justify-center" : "justify-between"} backdrop-blur-md border-gray-800 border p-2 rounded-xl bg-secondary/30`}>
                {isauthenticated && <motion.button 
                    onClick={toggleMenu} 
                    className="p-2 text-gray-700 dark:text-gray-300 px-0"
                    whileTap={{ scale: 0.9 }}
                >
                    {isMenuOpen ? <IoClose className="h-6 w-6" /> : <RxHamburgerMenu className="h-6 w-6" />}
                </motion.button>}
                <Link href="/" className="flex gap-2">
                    <Image src={logo} width={20} height={20} alt="Hi-Free" className="object-cover" />
                    <span className="self-center text-lg font-bold whitespace-nowrap dark:text-white text-black">
                        Hi-Free
                    </span>
                </Link>
               {isauthenticated &&  <div className='flex items-center gap-3'>
                    <motion.button whileTap={{ scale: 0.9 }}>
                        <Search size={20} className='dark:text-white text-black'/>
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }}>
                        <Bell size={20} className='dark:text-white text-black' />
                    </motion.button>
                </div>}
            </div>

            {/* Mobile Menu */}
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
                                        <img 
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

            {/* Desktop Header */}
            <div className="sm: hidden lg:block fixed lg:w-11/12 z-30 top-4 start-12 border-b border-gray-700 dark:border-gray-600 mx-auto bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-primary/10 p-2 rounded-2xl">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href={"/"} className="flex items-center space-x-1 rtl:space-x-reverse">
                        <div className='grid place-items-center p-1'>
                            <Image src={logo} width={40} height={40} alt="logo" className='w-full h-full object-cover sm:hidden lg:block' />
                        </div>
                        <span className="self-center text-lg lg:text-2xl font-bold whitespace-nowrap dark:text-white text-black">Hi-Free</span>
                    </Link>
                    
                    <div className="hidden md:flex justify-between gap-2 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        {!isauthenticated && <div className='flex justify-center items-center gap-2'>
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
                        </div>}
                        {isauthenticated && <div className='flex justify-center items-center gap-2'>
                            <img src={user?.profilePic ? user?.profilePic : `https://ui-avatars.com/api/?name=${user?.firstName}&background=4F46E5&color=fff`} className='w-9 h-9 rounded-full cursor-pointer' onClick={() => {
                                navigate.push("/profile")
                            }}/>
                            
                            <Toggle />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="rounded-lg lg:px-4 lg:py-2 cursor-pointer text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out"
                                onClick={() => {
                                    setIsMenuOpen(false)
                                    Logout}}
                            >
                              <span className="lg:text-text text-sm font-semibold">Logout</span>
                            </motion.button>
                        </div>}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;