import React from "react";
import { LucideIcon } from "lucide-react";

export default function MetadataCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "brand" | "blue" | "purple" | "emerald" | "amber" | "indigo" | "pink";
}) {
  const colorMap = {
    brand: "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400",
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    emerald: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    pink: "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  };

  const selectedColor = colorMap[color || "brand"];

  return (
    <div className="flex flex-row items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl shrink-0 ${selectedColor}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1 truncate">{title}</p>
        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate" title={String(value)}>
          {value}
        </p>
        {subtitle && (
          <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0 sm:mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
