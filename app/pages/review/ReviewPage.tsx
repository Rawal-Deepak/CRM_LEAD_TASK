"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileType2, Table2, Columns3, HardDrive, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useCsvState } from "@/app/providers/CsvProvider";
import MetadataCard from "./components/MetadataCard";
import SearchToolbar from "./components/SearchToolbar";
import PreviewTable from "./components/PreviewTable";
import ReviewFooter from "./components/ReviewFooter";

export default function ReviewPage() {
  const router = useRouter();
  const { metadata, headers, rows, clearCsvData } = useCsvState();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // If accessed directly without data, redirect to home
    if (!metadata && isMounted) {
      router.push("/");
    }
  }, [metadata, router, isMounted]);

  if (!isMounted || !metadata) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  const handleCancel = () => {
    clearCsvData();
    router.push("/");
  };

  const handleConfirm = () => {
    router.push("/import-processing");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-36 sm:pb-28 pt-4 sm:pt-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-8">
          <div>
            <div className="mb-4">
              <button 
                onClick={handleCancel}
                className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Upload New CSV
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Review Your Data
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Verify your CSV before AI processing begins.
            </p>
          </div>
        </div>

        {/* Metadata Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8"
        >
          <MetadataCard 
            title="Records" 
            value={metadata.totalRows.toLocaleString()} 
            subtitle="Total records detected"
            icon={Table2}
            color="blue"
          />
          <MetadataCard 
            title="Fields" 
            value={metadata.totalColumns.toLocaleString()} 
            subtitle="Columns detected"
            icon={Columns3}
            color="purple"
          />
          <MetadataCard 
            title="Import Size" 
            value={metadata.size} 
            subtitle="CSV file size"
            icon={HardDrive}
            color="amber"
          />
          <MetadataCard 
            title="AI Processing" 
            value="Ready"
            subtitle="Waiting to Start" 
            icon={Zap}
            color="indigo"
          />
        </motion.div>

        {/* Table Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <SearchToolbar onSearch={setGlobalFilter} />
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Showing <span className="text-gray-900 dark:text-white">{rows.length}</span> preview rows of <span className="text-gray-900 dark:text-white">{metadata.totalRows.toLocaleString()}</span> total
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <PreviewTable 
              data={rows} 
              columns={headers} 
              globalFilter={globalFilter} 
            />
          </div>
        </motion.div>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <ReviewFooter 
          totalRows={metadata.totalRows} 
          totalColumns={metadata.totalColumns}
          onCancel={handleCancel} 
          onConfirm={handleConfirm} 
          disabled={false}
        />
      </motion.div>
    </div>
  );
}
