"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GoCodescan } from "react-icons/go";
import { FaCodeBranch } from "react-icons/fa6";
import { TbUserSearch } from "react-icons/tb";
import { usePathname } from 'next/navigation';
import { Toggle } from './Toggle';
import { signOut } from 'next-auth/react';
import FloatIcons from '../FloatIcons';
import logo from "../../../public/logo.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const status = 'Authenticated';
    const unauth = 'unauthenticated';

    const navLinks = [
        {
            title: 'Features',
            icon: <TbUserSearch className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />,
            link: '/features'
        },
        {
            title: 'Solutions',
            icon: <FaCodeBranch className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />,
            link: '/solutions'
        },
        {
            title: 'Pricing',
            icon: <GoCodescan className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />,
            link: '/pricing'
        }
    ] as const;

    const navItems = [
        {
            name: "Features",
            path: "/features",
        },
        {
            name: "Solutions",
            path: "/solutions",
        },
        {
            name: "Pricing",
            path: "/pricing",
        },
    ];

    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="relative p-5 text-center">
             <FloatIcons />  
             <div className="top-4 left-3 right-3 z-40 md:hidden fixed flex justify-between backdrop-blur-md border-gray-800 border p-2 rounded-xl">
                <div className="flex gap-2">
                    <Image src={logo} width={40} height={40} alt="talent sync" className="w-full h-full object-cover" />
                    <span className="self-center text-lg font-bold whitespace-nowrap text-transparent bg-gradient-to-l bg-transparent from-gray-400 to-gray-900 dark:from-gray-500 dark:to-white bg-clip-text">
                        Talent Sync
                    </span>
                </div>
                <div>
                    <button onClick={toggleMenu} className="p-2 text-gray-700 dark:text-gray-300">
                        {isMenuOpen ? <IoClose className="h-6 w-6" /> : <RxHamburgerMenu className="h-6 w-6" />}
                    </button>
                </div>
          </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                <div className="flex flex-col p-4">
                    <ul className="flex flex-col space-y-4">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <Link href={item.path} className={`block py-2 px-3 text-text rounded text-sm hover:text-accent dark:text-white`} aria-current="page"
                                    style={{ color: pathname === item.path ? "var(--accent)" : "" }}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6">
                        <Toggle />
                    </div>
                    
                </div>
            </div>

            {/* Desktop Header */}
            <div className="sm: hidden lg:block fixed lg:w-11/12 z-30 top-4 start-12 border-b border-gray-700 dark:border-gray-600 mx-auto bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-primary/10 p-2 rounded-2xl">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href={"/"} className="flex items-center space-x-1 rtl:space-x-reverse">
                        <div className='grid place-items-center p-1'>
                            <Image src={logo} width={40} height={40} alt="Dev Matchups" className='w-full h-full object-cover sm: hidden lg:block' />
                        </div>
                        <span className="self-center text-lg lg:text-2xl font-bold whitespace-nowrap text-transparent bg-gradient-to-l bg-transparent from-gray-400 to-gray-900 dark:from-gray-500 dark:to-white bg-clip-text">Talent Sync</span>
                    </Link>
                    
                    <div className="hidden md:flex justify-between gap-2 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <div className='flex justify-center items-center gap-2'>
                            <button
                                className="p-2 lg:px-4 lg:py-2 text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 transition-all duration-300 ease-in-out"
                                style={{ borderRadius: '10px' }}
                            >
                                <Link href="/signup">
                                    <span className="lg:text-text text-sm font-semibold">Get Started</span>
                                </Link>
                            </button>
                            <button
                                className="rounded-lg lg:px-4 lg:py-2 text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 transition-all duration-300 ease-in-out"
                                style={{ borderRadius: '10px' }}
                            >
                                <Link href="/login">
                                    <span className="lg:text-text text-sm font-semibold">Login</span>
                                </Link>
                            </button>
                            <Toggle />
                        </div>
                    </div>
                    
                </div>
            </div>
        </header>
        
    );
};

export default Header;