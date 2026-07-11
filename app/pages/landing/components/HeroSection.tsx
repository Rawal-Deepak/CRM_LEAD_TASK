import { motion, useReducedMotion } from "framer-motion";
import { Download, ArrowRight, CheckCircle, Database, TrendingUp, Cpu } from "lucide-react";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Section from "./Section";
import { getFadeUp, stagger } from "./animations";

const HERO_SOURCES = [
  "Facebook Ads",
  "Google Ads",
  "Excel",
  "Real Estate CRM",
  "Marketing Agency",
  "Sales Reports",
  "Custom CSV",
];

export default function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = getFadeUp(shouldReduceMotion);

  return (
    <Section className="overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-20">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Label */}
          <motion.div variants={fadeUp} className="mb-6">
            <Badge variant="light" color="primary" size="md">
              AI-Powered CSV Import
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-title-md sm:text-title-lg font-bold text-gray-800 dark:text-white/90 tracking-tight leading-tight"
          >
            Upload Any CSV.{" "}
            <br className="hidden sm:block" />
            <span className="text-brand-500">
              AI Maps It to Your CRM.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-5 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            GrowEasy understands CSV exports from Facebook Ads, Google Ads,
            Excel, Real Estate CRMs, and marketing platforms — then
            intelligently maps every column into standardized CRM fields
            without manual configuration.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="primary"
                size="md"
                onClick={onGetStarted}
                endIcon={<ArrowRight size={18} />}
              >
                Get Started
              </Button>
            </motion.div>
            <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="md"
                startIcon={<Download size={18} />}
              >
                Download Sample CSV
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          className="mt-14 sm:mt-20 max-w-4xl mx-auto relative"
        >
          {/* Soft radial blue glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/15 dark:bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div
            className="relative rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-lg overflow-hidden bg-white dark:bg-gray-950"
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-sm mx-auto h-6 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-theme-xs text-gray-400 dark:text-gray-500">
                    app.groweasy.io/import
                  </span>
                </div>
              </div>
            </div>

            {/* Fake table content */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                    CRM Import Preview
                  </h4>
                  <p className="text-theme-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    24 records processed • 22 valid • 2 skipped
                  </p>
                </div>
                <Badge variant="light" color="success" size="sm">
                  AI Mapped
                </Badge>
              </div>

              {/* Table header */}
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-5 gap-px bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                    <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2.5">Name</div>
                    <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2.5">Email</div>
                    <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2.5">Mobile</div>
                    <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2.5">Lead Owner</div>
                    <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2.5">Source</div>
                  </div>

                  {/* Table rows */}
                  {[
                    ["Rahul Sharma", "rahul@email.com", "+91 98765 43210", "Priya M.", "Facebook Ads"],
                    ["Anita Desai", "anita.d@mail.in", "+91 87654 32109", "Vikram S.", "Google Ads"],
                    ["Karan Patel", "karan.p@corp.co", "+91 76543 21098", "Priya M.", "Excel Import"],
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-5 text-theme-xs text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      {row.map((cell, j) => (
                        <div key={j} className="px-3 py-2.5 truncate">
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Statistic Chips */}
          <div className="absolute inset-0 pointer-events-none z-[1] hidden md:block">
            <motion.div 
              className="absolute -left-12 top-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-theme-md rounded-xl px-4 py-3 flex items-center gap-3"
              animate={shouldReduceMotion ? {} : { y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <div className="w-8 h-8 rounded-full bg-success-50 dark:bg-success-500/10 flex items-center justify-center">
                 <CheckCircle size={16} className="text-success-500" />
              </div>
              <div>
                <p className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">CRM Ready</p>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -left-8 bottom-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-theme-md rounded-xl px-4 py-3 flex items-center gap-3"
              animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                 <Database size={16} className="text-brand-500" />
              </div>
              <div>
                <p className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">Volume</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">14,592 Records</p>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -right-8 top-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-theme-md rounded-xl px-4 py-3 flex items-center gap-3"
              animate={shouldReduceMotion ? {} : { y: [0, -14, 0] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                 <TrendingUp size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">Success Rate</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">99.8%</p>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -right-12 bottom-24 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-theme-md rounded-xl px-4 py-3 flex items-center gap-3"
              animate={shouldReduceMotion ? {} : { y: [0, -12, 0] }}
              transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 2.1 }}
            >
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                 <Cpu size={16} className="text-purple-500" />
              </div>
              <div>
                <p className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">Intelligence</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">AI Mapped</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
