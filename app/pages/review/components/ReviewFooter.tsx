import React from "react";
import Button from "@/components/ui/button/Button";

export default function ReviewFooter({ totalRows, totalColumns, disabled, onCancel, onConfirm }: { totalRows: number, totalColumns: number, disabled?: boolean, onCancel: () => void, onConfirm: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-3 flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-8">
        
        {/* Record and field counts display */}
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          <span className="text-gray-900 dark:text-white font-bold">{totalRows.toLocaleString()}</span> Records &bull; <span className="text-gray-900 dark:text-white font-bold">{totalColumns.toLocaleString()}</span> Fields
        </div>
        
        {/* Footer action buttons */}
        <div className="grid grid-cols-2 sm:flex items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="w-full h-full" onClick={onCancel}>
            Back
          </Button>
          <Button variant="primary" className="w-full shadow-lg shadow-brand-500/20 py-2.5 sm:py-2 flex flex-col sm:flex-row items-center justify-center text-center leading-tight" onClick={onConfirm} disabled={disabled}>
            <span className="block sm:inline">Start <span className="hidden min-[400px]:inline">Processing</span></span>
          </Button>
        </div>

      </div>
    </div>
  );
}
