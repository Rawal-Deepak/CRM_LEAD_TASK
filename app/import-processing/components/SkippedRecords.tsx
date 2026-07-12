import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { ImportState } from "../types";
import { motion, AnimatePresence } from "framer-motion";

function formatRowRef(row: number | Record<string, unknown>): string {
  if (typeof row === "number") return `#${row}`;
  const name = row.name ?? row.Name ?? row.email ?? row.Email;
  if (name) return String(name);
  return JSON.stringify(row).slice(0, 60);
}

export default function SkippedRecords({ state }: { state: ImportState }) {
  const [isOpen, setIsOpen] = useState(false);

  // Initial skeleton loader
  if (state.phase === "idle") {
    return (
      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm p-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  /* Hide entirely when zero skipped */
  if (state.skippedRecords.length === 0) return null;

  const count = state.skippedRecords.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-amber-200 dark:border-amber-900/50 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 overflow-hidden"
    >
      {/* Accordion Header */}
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse skipped records" : "Expand skipped records"}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0" />
          <span className="font-bold text-amber-900 dark:text-amber-400 text-sm sm:text-base">
            Skipped Records
          </span>
          <span className="text-sm text-amber-700 dark:text-amber-500/80 font-medium">
            {count} {count === 1 ? "Record" : "Records"} Skipped
          </span>
        </div>

        <span className="text-amber-500 shrink-0 ml-2">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>
      </button>

      {/* Accordion Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-amber-200 dark:border-amber-900/50"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-amber-100/60 dark:bg-amber-900/20 text-amber-900 dark:text-amber-400 font-medium">
                  <tr>
                    <th className="px-5 py-3 whitespace-nowrap">Row Number</th>
                    <th className="px-5 py-3">Reason</th>
                    <th className="px-5 py-3">Original Value</th>
                    <th className="px-5 py-3 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200/50 dark:divide-amber-900/40">
                  {state.skippedRecords.map((rec, i) => (
                    <tr
                      key={i}
                      className="text-amber-800 dark:text-amber-500/90"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap font-medium">
                        {formatRowRef(rec.row)}
                      </td>
                      <td className="px-5 py-3.5">{rec.reason}</td>
                      <td className="px-5 py-3.5 font-mono text-xs">
                        {rec.originalValue || "—"}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-200/60 dark:bg-amber-800/30 text-amber-800 dark:text-amber-400">
                          Skipped
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
