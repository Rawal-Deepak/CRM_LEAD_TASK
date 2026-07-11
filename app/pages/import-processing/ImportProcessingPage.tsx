"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCsvState } from "@/app/providers/CsvProvider";
import { useImportProcessing } from "./hooks/useImportProcessing";
import HeroProgressCard from "./components/HeroProgressCard";
import SkippedRecords from "./components/SkippedRecords";
import LiveTable from "./components/LiveTable";
import ImportFooter from "./components/ImportFooter";
import { motion, AnimatePresence } from "framer-motion";

export default function ImportProcessingPage() {
  const router = useRouter();
  const { metadata, headers, rows } = useCsvState();
  const { state, startProcessing, retryProcessing } = useImportProcessing(
    metadata,
    headers,
    rows as Record<string, string>[]
  );

  useEffect(() => {
    if (!metadata) {
      router.push("/");
    } else if (state.phase === "idle") {
      startProcessing();
    }
  }, [metadata, router, state.phase, startProcessing]);

  if (!metadata) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  const totalBatches =
    state.totalBatches || Math.ceil(metadata.totalRows / 50);
  const showResults = state.phase === "results" || state.phase === "holding";
  const isError = state.phase === "error";

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex flex-col pb-24">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ── Hero: "AI Import" title + rotating AI status ────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
            AI Import
          </h1>
          <div className="relative h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={state.stage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={`text-sm font-medium ${
                  showResults
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {showResults ? "Import completed successfully." : state.stage}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Processing Card ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6"
        >
          <HeroProgressCard state={state} totalBatches={totalBatches} />
        </motion.div>

        {/* ── Skipped Records Accordion ──────────────────────────── */}
        {!isError && (
          <>
            <div className="mb-6">
              <SkippedRecords state={state} />
            </div>

            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <div className="flex items-baseline gap-3 mb-3 px-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Live Import Preview
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Showing CRM records as AI completes each batch.
                  </span>
                </div>
                <LiveTable state={state} />
              </motion.div>
            </div>
          </>
        )}
      </main>

      <ImportFooter
        state={state}
        onRetry={isError ? retryProcessing : undefined}
      />
    </div>
  );
}
