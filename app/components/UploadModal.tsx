"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, FileUp, Loader2, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/modal/Modal";
import { useCsvParser } from "@/app/hooks/useCsvParser";

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  progress: number;
  size?: string;
  status: "uploading" | "completed" | "failed";
  timeLeft?: string;
};

export default function UploadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { status, progress, parsedRowsCount, parseFile, resetParser } = useCsvParser();

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert("Please upload a CSV file.");
      return;
    }
    setSelectedFile(file);
    parseFile(file, () => {
      setTimeout(() => {
        router.push('/review');
      }, 600);
    });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleModalClose = () => {
    if (status !== 'idle' && status !== 'completed') return; // Prevent closing while processing
    setSelectedFile(null);
    resetParser();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      className="max-w-xl mx-4 sm:mx-auto p-6 sm:p-8"
    >
      <div className="text-left">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Upload file
        </h3>
        
        {/* Modal description text */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Upload your CSV document and GrowEasy AI will automatically map your columns and handle the rest.
        </p>

        {/* Drag and drop file zone */}
        <label 
          className={`flex flex-col items-center justify-center rounded-[20px] border border-dashed p-12 mb-3 transition-all duration-200 cursor-pointer group relative min-h-[240px] ${
            isDragging 
              ? "border-brand-500 bg-brand-500/10 scale-[1.01]" 
              : "border-brand-300 dark:border-brand-700 bg-brand-50/10 dark:bg-brand-500/5 hover:border-brand-400 dark:hover:border-brand-600"
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={status !== 'idle'} />
          
          {status === 'idle' ? (
            <>
              <div className="mb-4">
                <FileUp size={46} className="text-brand-500 dark:text-brand-400" strokeWidth={1.5} />
              </div>
              
              <p className="text-[15px] font-medium text-gray-800 dark:text-gray-200">
                Drag and Drop file here or <span className="underline underline-offset-2 hover:text-brand-600 transition-colors">Choose here</span>
              </p>
            </>
          ) : (
            <div 
              className="flex flex-col items-center justify-center w-full max-w-xs text-center"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {/* Upload state icon */}
              <div className="mb-4 text-brand-600 dark:text-brand-400">
                {status === 'completed' ? (
                  <CheckCircle2 size={42} strokeWidth={1.5} className="text-green-500" />
                ) : (
                  <FileText size={42} strokeWidth={1.5} className={status === 'parsing' || status === 'extracting' ? "animate-pulse" : ""} />
                )}
              </div>
              
              {/* Selected file details */}
              <p className="text-base font-bold text-gray-900 dark:text-white truncate w-full mb-1">
                {selectedFile?.name}
              </p>
              
              <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-5 min-h-[20px]">
                {status === 'uploading' && `${formatFileSize(selectedFile?.size || 0)} • Uploading...`}
                {status === 'parsing' && `Parsing CSV... • ${parsedRowsCount.toLocaleString()} rows`}
                {status === 'extracting' && `Extracting Metadata...`}
                {status === 'completed' && `Ready!`}
              </p>
              
              {/* Upload progress indicator */}
              <div className="w-full flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${status === 'completed' ? 'bg-green-500' : 'bg-brand-600 dark:bg-brand-500'}`}
                    style={{ width: status === 'parsing' || status === 'extracting' || status === 'completed' ? '100%' : `${progress}%` }}
                  />
                </div>
                {(status === 'uploading' || status === 'completed') && (
                  <span className={`text-[13px] font-bold ${status === 'completed' ? 'text-green-500' : 'text-brand-600 dark:text-brand-400'}`}>
                    {status === 'completed' ? '100%' : `${progress}%`}
                  </span>
                )}
                {(status === 'parsing' || status === 'extracting') && (
                   <Loader2 size={14} className="animate-spin text-brand-600 dark:text-brand-400" />
                )}
              </div>
            </div>
          )}
        </label>
        
        <div className="flex justify-center items-center text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 px-1">
          <span>Supported format: CSV</span>
        </div>
      </div>
    </Modal>
  );
}
