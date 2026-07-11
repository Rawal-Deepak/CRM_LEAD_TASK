import { motion, useReducedMotion } from "framer-motion";
import { Columns, Shield, Database } from "lucide-react";
import Section from "./Section";
import { getFadeUp, getScaleIn, stagger } from "./animations";

const FEATURES = [
  {
    title: "AI Column Mapping",
    desc: "Automatically identifies and maps fields like Customer Name, Mobile, and Email to the correct CRM schema.",
    Icon: Columns,
  },
  {
    title: "Smart Validation",
    desc: "Detects invalid emails and missing contacts instantly, keeping your CRM data clean and reliable.",
    Icon: Shield,
  },
  {
    title: "CRM Standardization",
    desc: "Transforms any messy CSV layout into a consistent, production-ready format for one-click import.",
    Icon: Database,
  },
];

export default function FeatureSection() {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = getFadeUp(shouldReduceMotion);
  const scaleIn = getScaleIn(shouldReduceMotion);

  return (
    <Section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
            Built for Real-World Data
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            Three capabilities that make CSV imports effortless
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {FEATURES.map((f, idx) => {
            const isMiddle = idx === 1;
            return (
              <motion.div
                key={f.title}
                variants={scaleIn}
                whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
                className={`group rounded-2xl border bg-white dark:bg-white/[0.03] transition-all duration-300 hover:shadow-theme-xl hover:border-brand-300 dark:hover:border-brand-700 relative flex flex-col ${
                  isMiddle 
                    ? "p-8 border-gray-200 dark:border-gray-700 shadow-theme-lg z-[1] sm:-my-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 hover:to-brand-50/30 dark:hover:to-brand-900/20" 
                    : "p-6 border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900/50"
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/[0.12] mb-5 transition-colors duration-200 group-hover:bg-brand-500 dark:group-hover:bg-brand-500">
                  <f.Icon
                    size={24}
                    className="text-brand-500 dark:text-brand-400 transition-all duration-200 group-hover:text-white group-hover:rotate-3"
                  />
                </div>
                <h3 className={`font-semibold text-gray-800 dark:text-white/90 mb-2 ${isMiddle ? "text-lg" : "text-base"}`}>
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}
