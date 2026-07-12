import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Database, ShieldCheck, Clock3, Layers, Layers3, LucideIcon } from "lucide-react";
import { ImportState } from "../types";
import { useAnimatedCounter } from "../hooks/useAnimatedCounter";

// Fallback if Layers3 is not in the installed lucide-react version
const BatchIcon = Layers3 || Layers;

/* ── AI Pulse Icon ─────────────────────────────────────────────── */
function AIPulseIcon({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
      <div
        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
          isCompleted
            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500"
            : "bg-brand-50 dark:bg-brand-900/30 text-brand-500 dark:text-brand-400"
        }`}
      >
        <Sparkles className="w-6 h-6" strokeWidth={2} />
      </div>
    </div>
  );
}

/* ── Inline Metric Block ───────────────────────────────────────── */
function MetricBlock({
  label,
  value,
  helperText,
  icon: Icon,
  showDivider = true,
}: {
  label: string;
  value: React.ReactNode;
  helperText: string;
  icon: LucideIcon;
  showDivider?: boolean;
}) {
  return (
    <div className={`flex flex-col flex-1 min-w-0 ${showDivider ? 'sm:border-l border-gray-200 dark:border-gray-700/60 sm:pl-6' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
        <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
      <div className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-gray-900 dark:text-white tabular-nums truncate leading-none mb-1.5">
        {value}
      </div>
      <p className="text-[13px] font-medium text-gray-400 dark:text-gray-500 truncate">
        {helperText}
      </p>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────── */
export default function HeroProgressCard({
  state,
  totalBatches,
}: {
  state: ImportState;
  totalBatches: number;
}) {
  const isCompleted = state.phase === "holding" || state.phase === "results";
  const isIdle = state.phase === "idle";
  const animatedPercent = useAnimatedCounter(state.progress);
  const importedAnimated = useAnimatedCounter(state.processedRecords);

  // Time Elapsed Logic
  const [localElapsed, setLocalElapsed] = useState(state.elapsedSeconds || 0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.phase === "processing") {
      const startTime = Date.now() - ((state.elapsedSeconds || 0) * 1000);
      timer = setInterval(() => {
        setLocalElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setLocalElapsed(state.elapsedSeconds || 0);
    }
    return () => clearInterval(timer);
  }, [state.phase, state.elapsedSeconds]);

  /* ── Skeleton ──────────────────────────────────────────────── */
  if (isIdle) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
          </div>
          <div className="h-12 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 sm:gap-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`flex-1 ${i > 1 ? 'sm:border-l border-gray-200 dark:border-gray-800 sm:pl-6' : ''}`}>
              <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800/60 rounded mb-2" />
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
              <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Derived values ────────────────────────────────────────── */
  const validRecords = state.processedRecords - (state.skippedRecords?.length || 0);
  const validationPercentage = state.processedRecords === 0 
    ? 0 
    : (validRecords / state.processedRecords) * 100;
  
  const totalRecordsDisplay = state.totalRecords || 0;
  const currentBatchDisplay = state.batchIndex || 0;
  const totalBatchesDisplay = totalBatches || state.totalBatches || 0;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden relative p-6 sm:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/0 dark:from-gray-800/20 dark:to-gray-900/0 pointer-events-none" />
      
      <div className="relative z-10">
        {/* ── Row 1: AI icon + title + percentage ────── */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <AIPulseIcon isCompleted={isCompleted} />

          <div className="flex-1 min-w-0">
            <h2 className="text-[22px] sm:text-[26px] font-black text-gray-900 dark:text-white tracking-tight">
              AI Import Processing
            </h2>
          </div>

          {/* Large percentage */}
          <div className="text-[40px] sm:text-[48px] font-black text-gray-900 dark:text-white tracking-tighter tabular-nums leading-none shrink-0">
            {animatedPercent}
            <span className="text-xl sm:text-2xl text-gray-400 dark:text-gray-500 ml-1">
              %
            </span>
          </div>
        </div>

        {/* ── Progress Bar ────────────────────────────────── */}
        <div className="h-3 sm:h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative mb-8 shadow-inner">
          <motion.div
            className={`absolute top-0 left-0 bottom-0 rounded-full ${
              isCompleted ? "bg-emerald-500" : "bg-brand-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${state.progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* ── Inline Metrics Row ──────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 sm:gap-0">
          <MetricBlock
            label="Processed"
            value={
              <div className="flex items-baseline">
                <span className="text-gray-900 dark:text-white">{importedAnimated}</span>
                <span className="text-[16px] sm:text-[18px] text-gray-400 dark:text-gray-500 font-medium ml-1.5">
                  / {totalRecordsDisplay}
                </span>
              </div>
            }
            helperText="Records imported"
            icon={Database}
            showDivider={false}
          />

          <MetricBlock
            label="Validation"
            value={
              <span className="text-gray-900 dark:text-white">
                {`${validationPercentage.toFixed(1).replace('.0', '')}%`}
              </span>
            }
            helperText={`${validRecords} Valid • ${state.skippedRecords?.length || 0} Skipped`}
            icon={ShieldCheck}
            showDivider={true}
          />

          <MetricBlock
            label="Current Batch"
            value={
              <div className="flex items-baseline">
                <span className="text-gray-900 dark:text-white relative inline-flex items-baseline">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={currentBatchDisplay}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentBatchDisplay}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-[16px] sm:text-[18px] text-gray-400 dark:text-gray-500 font-medium ml-1.5">
                  / {totalBatchesDisplay}
                </span>
              </div>
            }
            helperText={isCompleted ? "Completed" : "Currently processing"}
            icon={BatchIcon}
            showDivider={true}
          />

          <MetricBlock
            label={isCompleted ? "Time" : "Elapsed"}
            value={
              <span className="text-gray-900 dark:text-white">{localElapsed}s</span>
            }
            helperText={isCompleted ? "Completed" : "Running"}
            icon={Clock3}
            showDivider={true}
          />
        </div>
      </div>
    </div>
  );
}
