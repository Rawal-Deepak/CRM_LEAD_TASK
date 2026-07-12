import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/button/Button";
import Section from "./Section";
import { getFadeUp } from "./animations";

export default function CTASection({ onGetStarted }: { onGetStarted: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const fadeUp = getFadeUp(shouldReduceMotion);

  return (
    <Section className="py-20 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="relative rounded-[2.5rem] bg-gradient-to-b from-white to-brand-50/30 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 overflow-hidden px-6 py-16 sm:px-16 sm:py-24 text-center"
        >
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Ready to Import Your CSV?
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
              Upload any CSV and let GrowEasy AI automatically transform it into CRM-ready data.
            </p>
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button
                variant="primary"
                size="md"
                onClick={onGetStarted}
                className="!px-8 !py-4"
                endIcon={<ArrowRight size={18} />}
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
