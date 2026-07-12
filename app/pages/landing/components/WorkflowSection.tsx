import { motion, useReducedMotion } from "framer-motion";
import { Upload, Eye, Cpu, CheckCircle } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import Section from "./Section";
import { getFadeUp, stagger } from "./animations";

const STEPS = [
  {
    num: 1,
    title: "Upload CSV",
    desc: "Drag and drop any CSV file. Facebook Ads, Google Ads, Excel — any format works.",
    Icon: Upload,
    colors: {
      bg: "bg-blue-50 dark:bg-blue-500/[0.12]",
      text: "text-blue-500 dark:text-blue-400",
      hoverBg: "group-hover:bg-blue-500 dark:group-hover:bg-blue-500",
      hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      gradient: "from-blue-50/50 dark:from-blue-500/5",
    }
  },
  {
    num: 2,
    title: "Preview",
    desc: "Verify parsed records in a clean table before AI processing begins.",
    Icon: Eye,
    colors: {
      bg: "bg-purple-50 dark:bg-purple-500/[0.12]",
      text: "text-purple-500 dark:text-purple-400",
      hoverBg: "group-hover:bg-purple-500 dark:group-hover:bg-purple-500",
      hoverText: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
      gradient: "from-purple-50/50 dark:from-purple-500/5",
    }
  },
  {
    num: 3,
    title: "AI Processing",
    desc: "AI maps columns, extracts CRM fields, validates data, and skips invalid entries.",
    Icon: Cpu,
    colors: {
      bg: "bg-indigo-50 dark:bg-indigo-500/[0.12]",
      text: "text-indigo-500 dark:text-indigo-400",
      hoverBg: "group-hover:bg-indigo-500 dark:group-hover:bg-indigo-500",
      hoverText: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
      gradient: "from-indigo-50/50 dark:from-indigo-500/5",
    }
  },
  {
    num: 4,
    title: "CRM Ready",
    desc: "Standardized records are generated and ready for import in one click.",
    Icon: CheckCircle,
    colors: {
      bg: "bg-emerald-50 dark:bg-emerald-500/[0.12]",
      text: "text-emerald-500 dark:text-emerald-400",
      hoverBg: "group-hover:bg-emerald-500 dark:group-hover:bg-emerald-500",
      hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
      gradient: "from-emerald-50/50 dark:from-emerald-500/5",
    }
  },
];

export default function WorkflowSection() {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = getFadeUp(shouldReduceMotion);

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
            How It Works
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            Four steps from raw CSV to CRM-ready data
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="relative max-w-2xl mx-auto"
        >
          {/* Vertical connecting line for the timeline */}
          <div className="absolute left-[27px] top-[24px] bottom-[24px] w-0.5 bg-gray-200 dark:bg-gray-800 hidden sm:block" />
          
          <div className="space-y-6 sm:space-y-12">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="relative sm:pl-20"
              >
                {/* Circular timeline node with step number */}
                <div className="hidden sm:flex absolute left-0 top-6 w-14 h-14 rounded-2xl bg-[#FAFBFC] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm items-center justify-center z-0 transition-colors duration-300">
                  <span className="text-lg font-bold text-gray-400 dark:text-gray-600">{step.num}</span>
                </div>

                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
                  className="group w-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 sm:p-7 transition-colors duration-300 hover:shadow-theme-xl relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.colors.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                  <div className="relative flex items-start gap-4">
                    <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200 ${step.colors.bg} ${step.colors.hoverBg}`}>
                      <step.Icon
                        size={24}
                        className={`${step.colors.text} transition-all duration-200 group-hover:text-white group-hover:rotate-3`}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-2.5 mb-1.5 sm:hidden">
                        <Badge variant="solid" color="primary" size="sm">
                          {step.num}
                        </Badge>
                      </div>
                      <h3 className={`text-lg font-semibold text-gray-800 dark:text-white/90 mb-1.5 transition-colors ${step.colors.hoverText}`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
