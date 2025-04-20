"use client";

import { createContext, useEffect, useState, ReactNode } from "react";

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean) => void;
  setSelectedCandidate: (value: any) => any;
  selectedCandidate: any;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  isChatOpen: false,
  setIsChatOpen: () => {},
  setSelectedCandidate: () => {},
  selectedCandidate: null,
});

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // ✅ Only run this on the client
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        setTheme("dark");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isChatOpen,
        setIsChatOpen,
        setSelectedCandidate,
        selectedCandidate,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
