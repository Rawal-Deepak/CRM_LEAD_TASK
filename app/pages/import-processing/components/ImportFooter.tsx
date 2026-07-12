import React from "react";
import { Download, RefreshCw, XCircle, RotateCcw } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { ImportState } from "../types";
import { useRouter } from "next/navigation";
import { useCsvState } from "@/app/providers/CsvProvider";
import { motion, AnimatePresence } from "framer-motion";
import { exportRecordsAsCsv } from "../utils/exportCsv";

type ImportFooterProps = {
  state: ImportState;
  onRetry?: () => void;
};

export default function ImportFooter({ state, onRetry }: ImportFooterProps) {
  const router = useRouter();
  const { clearCsvData } = useCsvState();
  const isCompleted = state.phase === "results" || state.phase === "holding";
  const isError = state.phase === "error";
  const isProcessing = state.phase === "processing";

  const handleImportAnother = () => {
    clearCsvData();
    router.push("/");
  };

  const handleCancel = () => {
    clearCsvData();
    router.push("/");
  };

  const handleDownload = () => {
    const records =
      state.finalRecords.length > 0 ? state.finalRecords : state.liveRows;
    if (records.length === 0) return;
    exportRecordsAsCsv(records);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* ── Left: Connection Status ──────────────────────────── */}
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
          {isError ? (
            <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Import failed
            </span>
          ) : isCompleted ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Import completed successfully.
            </span>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Connected · Receiving live updates...
            </>
          )}
        </div>

        {/* ── Right: Actions ──────────────────────────────────── */}
        <div className="flex items-center gap-3 w-full sm:w-auto relative min-h-[40px]">
          <AnimatePresence mode="wait">
            {isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex w-full gap-3"
              >
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                  onClick={onRetry}
                >
                  <RotateCcw size={16} />
                  Try Again
                </Button>
              </motion.div>
            ) : isProcessing ? (
              <motion.div
                key="cancel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/50"
                  onClick={handleCancel}
                >
                  <XCircle size={16} />
                  Cancel Import
                </Button>
              </motion.div>
            ) : isCompleted ? (
              <motion.div
                key="actions"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex w-full items-center gap-3"
              >
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                  onClick={handleDownload}
                  disabled={state.progress < 100}
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Download CSV</span>
                  <span className="sm:hidden">Download</span>
                </Button>

                <Button
                  variant="primary"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                  onClick={handleImportAnother}
                  disabled={state.progress < 100}
                >
                  <RefreshCw size={16} />
                  <span className="hidden sm:inline">Import Another CSV</span>
                  <span className="sm:hidden">Import Another</span>
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
