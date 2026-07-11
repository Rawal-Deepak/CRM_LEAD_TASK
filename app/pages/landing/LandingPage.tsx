"use client";

import { useState } from "react";
import HeroSection from "./components/HeroSection";
import WorkflowSection from "./components/WorkflowSection";
import FeatureSection from "./components/FeatureSection";
import BenefitsSection from "./components/BenefitsSection";
import AIMappingSection from "./components/AIMappingSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import UploadModal from "./components/UploadModal";

export default function LandingPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <>
      <HeroSection onGetStarted={() => setShowUploadModal(true)} />
      <WorkflowSection />
      <FeatureSection />
      <BenefitsSection />
      <AIMappingSection />
      <CTASection onGetStarted={() => setShowUploadModal(true)} />
      <Footer />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </>
  );
}
