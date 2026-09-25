import React, { useState, useEffect } from 'react';
import { Activity, Volume2, VolumeX, Menu, X, Terminal, ShieldAlert } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const muted = audioSynth.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      audioSynth.playEcgBeep(600, 60);
    }
  };

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'ia-salud', label: 'IA en Salud' },
    { id: 'machine-learning', label: 'Machine Learning' },
    { id: 'datos-clinicos', label: 'Datos Clínicos' },
    { id: 'redes-neuronales', label: 'Redes Neuronales' },
    { id: 'ia-generativa', label: 'IA Generativa' },
    { id: 'playground', label: 'Playground' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'ciberseguridad', label: 'Ciberseguridad' },
    { id: 'aplicaciones', label: 'Aplicaciones' },
    { id: 'tecnologias', label: 'Tecnologías' },
    { id: 'etica', label: 'Ética' },
    { id: 'terminal', label: 'Terminal' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0d1117]/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-black/40'
          : 'bg-[#0d1117]/80 backdrop-blur-sm border-b border-slate-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#inicio"
          className="flex items-center gap-2.5 text-slate-100 group transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:bg-cyan-500/20 transition-all">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <span className="font-bold tracking-tight text-base sm:text-lg font-mono text-cyan-400 group-hover:text-cyan-300">
            NEXUS TELEHEALTH <span className="text-slate-100 font-sans font-semibold text-sm">AI LAB</span>
          </span>
        </a>

        {/* Zone 2: Navigation Links (desktop scrollable / compact) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-2xl px-2 scrollbar-none">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Activar sonido de telemetría' : 'Silenciar sonido de telemetría'}
            title={isMuted ? 'Sonido silenciado' : 'Audio de telemetría activo'}
            className="p-2 text-xs rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Quick CLI Terminal Jump */}
          <button
            onClick={() => handleNavClick('terminal')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CLI</span>
          </button>

          {/* Dashboard CTA */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-cyan-500 text-[#0d1117] font-semibold hover:bg-cyan-400 shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Monitoreo</span> Vivo
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-cyan-400"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d1117]/98 border-b border-cyan-500/20 px-4 py-4 max-h-[75vh] overflow-y-auto space-y-1 backdrop-blur-xl">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1">
            Secciones de la Plataforma
          </div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                activeSection === link.id
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-medium'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800/80 mt-2 flex items-center justify-between px-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              Modo Educativo Sintético
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
