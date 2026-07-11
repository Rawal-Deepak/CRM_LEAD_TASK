import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Database, Layers, Timer, Clock, LucideIcon } from "lucide-react";
import { ImportState } from "../types";
import { useAnimatedCounter } from "../hooks/useAnimatedCounter";

/* ── AI Pulse Icon ─────────────────────────────────────────────── */
function AIPulseIcon({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 shrink-0">
      {!isCompleted && (
        <>
          <span className="absolute inset-0 rounded-full bg-brand-400/20 animate-[ai-pulse_2.4s_ease-in-out_infinite]" />
          <span className="absolute inset-1 rounded-full bg-brand-400/10 animate-[ai-pulse_2.4s_ease-in-out_0.4s_infinite]" />
        </>
      )}
      <div
        className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
          isCompleted
            ? "bg-emerald-100 dark:bg-emerald-900/40"
            : "bg-brand-100 dark:bg-brand-900/40"
        }`}
      >
        <Sparkles
          className={`w-5 h-5 ${
            isCompleted
              ? "text-emerald-500"
              : "text-brand-500 dark:text-brand-400"
          }`}
          strokeWidth={2}
        />
      </div>
      <style>{`
        @keyframes ai-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
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
  value: string;
  helperText: string;
  icon: LucideIcon;
  showDivider?: boolean;
}) {
  return (
    <div className={`flex items-start gap-4 flex-1 min-w-0 ${showDivider ? 'sm:border-l border-gray-200 dark:border-gray-700/60 sm:pl-6' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
          <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {label}
          </p>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tabular-nums truncate leading-none mb-1">
          {value}
        </p>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 truncate">
          {helperText}
        </p>
      </div>
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
  const isCompleted =
    state.phase === "holding" || state.phase === "results";
  const isIdle = state.phase === "idle";
  const animatedPercent = useAnimatedCounter(state.progress);

  /* ── Skeleton ──────────────────────────────────────────────── */
  if (isIdle) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sm:p-8 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1">
            <div className="h-5 w-44 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="h-12 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 sm:gap-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`flex-1 ${i > 1 ? 'sm:border-l border-gray-200 dark:border-gray-800 sm:pl-6' : ''}`}>
              <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800/60 rounded mb-2" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
              <div className="h-2 w-24 bg-gray-100 dark:bg-gray-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Derived values ────────────────────────────────────────── */
  const remaining = Math.max(0, state.totalRecords - state.processedRecords);
  const etaDisplay =
    isCompleted
      ? `${state.elapsedSeconds}s`
      : state.etaSeconds !== null
        ? `${state.etaSeconds}s`
        : "—";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/0 dark:from-gray-800/20 dark:to-gray-900/0 pointer-events-none" />
      
      <div className="p-6 sm:p-8 relative z-10">
        {/* ── Row 1: AI icon + title + percentage ────── */}
        <div className="flex items-center gap-4 mb-6">
          <AIPulseIcon isCompleted={isCompleted} />

          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              AI Import Processing
            </h2>
          </div>

          {/* Large percentage */}
          <div className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums leading-none shrink-0">
            {animatedPercent}
            <span className="text-lg sm:text-xl text-gray-400 dark:text-gray-600 ml-0.5">
              %
            </span>
          </div>
        </div>

        {/* ── Progress Bar ────────────────────────────────── */}
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative mb-8 shadow-inner">
          <motion.div
            className={`absolute top-0 left-0 bottom-0 rounded-full overflow-hidden ${
              isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-brand-600 to-brand-400"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${state.progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Shimmer effect */}
            {!isCompleted && (
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] -skew-x-12" />
            )}
          </motion.div>
        </div>

        {/* ── Inline Metrics Row ──────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 sm:gap-0">
          <MetricBlock
            label="Processed"
            value={`${state.processedRecords.toLocaleString()} / ${state.totalRecords.toLocaleString()}`}
            helperText="Records imported"
            icon={Database}
            showDivider={false}
          />
          <MetricBlock
            label="Current Batch"
            value={`${state.batchIndex || 0} / ${totalBatches || state.totalBatches}`}
            helperText="Currently processing"
            icon={Layers}
            showDivider={true}
          />
          <MetricBlock
            label="Remaining"
            value={remaining.toLocaleString()}
            helperText="Waiting"
            icon={Timer}
            showDivider={true}
          />
          <MetricBlock
            label={isCompleted ? "Time" : "ETA"}
            value={isCompleted ? `Completed in ${state.elapsedSeconds}s` : etaDisplay}
            helperText={isCompleted ? "Total time taken" : "Estimated remaining"}
            icon={Clock}
            showDivider={true}
          />
        </div>
      </div>
    </div>
  );
}
