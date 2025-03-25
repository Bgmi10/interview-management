'use client'
import React, { useContext } from 'react'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { ThemeContext } from '../../../context/ThemeContext'

export const Toggle = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);

  return (
    <div>
      <button  
        onClick={toggleTheme} 
        className="p-[9px] cursor-pointer border rounded-lg dark:border-gray-700 border-gray-400"
      >
        {theme === "dark" ? <MdDarkMode color='white'/> : <MdLightMode color='black'/>}
      </button>
    </div>
  )
}
