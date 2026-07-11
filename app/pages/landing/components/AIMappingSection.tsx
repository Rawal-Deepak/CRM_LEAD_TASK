import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Section from "./Section";
import { getFadeUp, stagger } from "./animations";

const MAPPINGS = [
  { from: "Customer Name", to: "Name" },
  { from: "Applicant", to: "Name" },
  { from: "Contact Number", to: "Mobile" },
  { from: "Mobile No", to: "Mobile" },
  { from: "Email Address", to: "Email" },
  { from: "Assigned Agent", to: "Lead Owner" },
  { from: "Campaign Source", to: "Data Source" },
];

export default function AIMappingSection() {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = getFadeUp(shouldReduceMotion);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  
  useEffect(() => {
    if (hoveredIdx !== null) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % MAPPINGS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [hoveredIdx]);

  return (
    <Section gray className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeUp}
            className="text-xl font-semibold text-gray-800 dark:text-white/90"
          >
            Semantic Column Mapping
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            AI understands intent, not just column names
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1fr_40px_1fr] items-center px-5 sm:px-6 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <span className="text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              CSV Column
            </span>
            <span />
            <span className="text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              CRM Field
            </span>
          </div>

          {/* Mapping rows */}
          {MAPPINGS.map((m, idx) => {
            const isActive = hoveredIdx !== null ? hoveredIdx === idx : activeIdx === idx;

            return (
              <motion.div
                key={m.from}
                variants={fadeUp}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`grid grid-cols-[1fr_40px_1fr] items-center px-5 sm:px-6 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors duration-150 cursor-default ${
                  isActive
                    ? "bg-brand-25 dark:bg-brand-500/[0.06]"
                    : "hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                }`}
              >
                {/* Source */}
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400"
                      : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80"
                  }`}
                >
                  {m.from}
                </span>

                {/* Arrow */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{ 
                      x: isActive && !shouldReduceMotion ? 4 : 0,
                      scale: isActive && !shouldReduceMotion ? 1.1 : 1 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight
                      size={16}
                      className={`transition-colors duration-200 ${
                        isActive
                          ? "text-brand-500 dark:text-brand-400"
                          : "text-gray-300 dark:text-gray-700"
                      }`}
                    />
                  </motion.div>
                </div>

                {/* Target */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/30"
                      : "bg-gray-100 text-gray-500 border border-transparent dark:bg-white/5 dark:text-gray-400"
                  }`}
                >
                  {m.to}
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle size={14} className="text-brand-500 dark:text-brand-400" />
                    </motion.span>
                  )}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}
