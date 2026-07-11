"use client";

import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-[60] lg:px-10 flex w-full items-center justify-between bg-white dark:bg-gray-900 px-4 py-4 border-b border-gray-200 dark:border-gray-800 shadow-theme-sm">
      {/* Left: Logo and Title */}
      <div className="flex items-center gap-2">
        <div className="rounded-lg">
          <Image 
            src="/groweasy.svg" 
            alt="GrowEasy Logo" 
            width={24} 
            height={24} 
            className="w-7 h-7 object-contain"
          />
        </div>
        <span className="text-xl font-bold text-gray-800 dark:text-white/90">
          GrowEasy
        </span>
      </div>

      {/* Right: Github and Theme Toggle */}
      <div className="flex items-center justify-end gap-3">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-10 w-10 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white shadow-theme-xs"
          aria-label="GitHub Repository"
        >
          <GithubIcon size={20} />
        </a>
        
        {mounted ? (
          <button 
            onClick={toggleTheme}
            className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-10 w-10 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white shadow-theme-xs"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        ) : (
          <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-xs"></div> // Placeholder to prevent layout shift
        )}
      </div>
    </header>
  );
}
