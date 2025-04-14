"use client";
import { createContext, useEffect, useState, ReactNode } from "react";

// Define the context type
type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean) => void;
  setSelectedCandidate: (value: any) => any,
  selectedCandidate: any
};

// Create the context with a default placeholder
export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isChatOpen: false,
  setIsChatOpen: () => {},
  setSelectedCandidate: () => {},
  selectedCandidate: null
});

// Define the props type for ThemeProvider
type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light";
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isChatOpen, setIsChatOpen, setSelectedCandidate, selectedCandidate }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
