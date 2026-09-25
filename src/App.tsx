import React, { useState, useEffect } from 'react';
import { CyberBackground } from './components/CyberBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AiInHealthSection } from './components/AiInHealthSection';
import { MachineLearningSection } from './components/MachineLearningSection';
import { ClinicalDataSection } from './components/ClinicalDataSection';
import { NeuralNetworkSection } from './components/NeuralNetworkSection';
import { GenerativeAiSection } from './components/GenerativeAiSection';
import { TelehealthPlayground } from './components/TelehealthPlayground';
import { TelehealthDashboard } from './components/TelehealthDashboard';
import { CybersecuritySection } from './components/CybersecuritySection';
import { ApplicationsSection } from './components/ApplicationsSection';
import { TechnologiesSection } from './components/TechnologiesSection';
import { EthicsGovernanceSection } from './components/EthicsGovernanceSection';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('inicio');

  useEffect(() => {
    const sections = [
      'inicio',
      'ia-salud',
      'machine-learning',
      'datos-clinicos',
      'redes-neuronales',
      'ia-generativa',
      'playground',
      'dashboard',
      'ciberseguridad',
      'aplicaciones',
      'tecnologias',
      'etica',
      'terminal',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic 2D Canvas Network Background */}
      <CyberBackground />

      {/* Persistent Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection />
        <AiInHealthSection />
        <MachineLearningSection />
        <ClinicalDataSection />
        <NeuralNetworkSection />
        <GenerativeAiSection />
        <TelehealthPlayground />
        <TelehealthDashboard />
        <CybersecuritySection />
        <ApplicationsSection />
        <TechnologiesSection />
        <EthicsGovernanceSection />
        <InteractiveTerminal />
      </main>

      {/* Institutional & Legal Footer */}
      <Footer />
    </div>
  );
}
