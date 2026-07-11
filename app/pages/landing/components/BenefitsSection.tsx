import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import Section from "./Section";
import { getFadeUp, stagger } from "./animations";

const BENEFITS = [
  "No manual mapping",
  "Supports messy CSVs",
  "AI field detection",
  "Automatic validation",
  "Batch AI processing",
  "CRM-ready output",
  "Built for large datasets",
];

export default function BenefitsSection() {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = getFadeUp(shouldReduceMotion);

  return (
    <Section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 items-start"
        >
          {/* Left column */}
          <motion.div variants={fadeUp}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-3">
              Why GrowEasy AI
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Stop spending hours manually mapping CSV columns. GrowEasy
              uses AI to understand your data structure, validate every record,
              and produce clean CRM-ready output — regardless of source format
              or column naming conventions.
            </p>
          </motion.div>

          {/* Right column — benefits list */}
          <motion.div
            variants={stagger}
            className="space-y-3"
          >
            {BENEFITS.map((b) => (
              <motion.div
                key={b}
                variants={fadeUp}
                className="flex items-center gap-3"
              >
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-success-50 dark:bg-success-500/15">
                  <Check size={13} className="text-success-500" />
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {b}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
