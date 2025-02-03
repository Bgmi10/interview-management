"use client";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
    theme: "light",
    toggleTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: any}) => {
    const [theme, setTheme] = useState(() => {
      const theme = localStorage.getItem('theme');
      return theme ? theme : "light"
    });

    const toggleTheme = () => {
      setTheme(prev => prev === "light" ? "dark" : "light");
    }

    useEffect(() => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }, [theme]);

    return (
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        {children}
      </ThemeContext.Provider>
    )
}