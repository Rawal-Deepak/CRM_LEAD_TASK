"use client";

import React, { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { Search } from "lucide-react";

export default function SearchToolbar({ onSearch }: { onSearch: (value: string) => void }) {
  const [val, setVal] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  useDebounce(
    () => {
      onSearch(val);
    },
    300,
    [val]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full sm:w-[55%] lg:w-[60%] relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl leading-5 bg-white dark:bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors duration-200"
        placeholder="Search by name, email, company..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setVal("");
            inputRef.current?.blur();
          }
        }}
      />
      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
        <span className="text-[11px] font-medium text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 shadow-sm">⌘F</span>
      </div>
    </div>
  );
}
