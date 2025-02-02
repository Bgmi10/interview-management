'use client'
import React, { useContext, useEffect, useState } from 'react'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { ThemeContext } from '../../../context/ThemeContext'

export const Toggle = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);

  return (
    <div>
      <button  
        onClick={toggleTheme} 
        className="p-[9px] cursor-pointer border rounded-lg border-gray-700"
      >
        {theme === "dark" ? <MdDarkMode color='white'/> : <MdLightMode color='black'/>}
      </button>
    </div>
  )
}
