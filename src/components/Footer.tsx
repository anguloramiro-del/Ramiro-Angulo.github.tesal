import React from 'react';
import { Activity, ShieldAlert, Heart, ExternalLink, Code2, ArrowUp } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    audioSynth.playEcgBeep(600, 40);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090d12] border-t border-slate-800 text-slate-400 font-mono text-xs py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Branding & Quick Back-to-Top */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base text-white font-mono">
                NEXUS TELEHEALTH <span className="text-cyan-400">AI LAB</span>
              </span>
              <p className="text-[11px] text-slate-500 font-sans">
                Laboratorio Educativo de IA, Monitoreo Remoto y Ciencia de Datos en Salud
              </p>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
          >
            <span>Volver al Inicio</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Institution, Authorship & Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Metadata */}
          <div className="space-y-2">
            <div className="text-slate-200 font-bold uppercase text-[11px] tracking-wider">
              Datos Institucionales
            </div>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              <strong>Institución:</strong> Centro de Innovación en Salud Digital y Telemedicina<br />
              <strong>Autor:</strong> Equipo de Desarrollo e Informática Médica<br />
              <strong>Año:</strong> 2026<br />
              <strong>Edición:</strong> v2.6.0 (Educativa & Open Access)
            </p>
          </div>

          {/* Technologies Used */}
          <div className="space-y-2">
            <div className="text-slate-200 font-bold uppercase text-[11px] tracking-wider">
              Arquitectura Técnica
            </div>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              • React 19 & TypeScript Estricto<br />
              • Tailwind CSS & Canvas 2D Dinámico<br />
              • Web Audio API (Sintetizador Telemétrico)<br />
              • Modelos Heurísticos Locales en Navegador<br />
              • Alineación con HL7 FHIR R4 & DICOM Web
            </p>
          </div>

          {/* Professional Links */}
          <div className="space-y-2">
            <div className="text-slate-200 font-bold uppercase text-[11px] tracking-wider">
              Comunidad & Enlaces
            </div>
            <div className="space-y-1.5 font-sans text-xs">
              <div className="text-slate-400">
                <strong>GitHub:</strong> github.com/nexus-telehealth-ai-lab
              </div>
              <div className="text-slate-400">
                <strong>Red Profesional:</strong> red-salud-digital-interoperabilidad.org
              </div>
              <div className="text-slate-400">
                <strong>Licencia:</strong> Código abierto con fines académicos y pedagógicos.
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Clinical Disclaimer Banner */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>Descargo de Responsabilidad Clínica y Declaración de Datos Sintéticos</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            NEXUS TELEHEALTH AI LAB es una herramienta de simulación estrictamente educativa, orientada a estudiantes, ingenieros biomédicos, científicos de datos y profesionales de la salud. La plataforma <strong>no realiza diagnósticos médicos reales, no prescribe medicamentos ni tratamientos, ni sustituye el juicio clínico soberano</strong> de un profesional facultado. Todos los pacientes, historiales, constantes de signos vitales, predicciones de riesgo y eventos de seguridad son sintéticos, anónimos y calculados en el entorno local del cliente.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-[11px] text-slate-500 pt-4 border-t border-slate-900 font-sans">
          © 2026 NEXUS TELEHEALTH AI LAB. Diseñado con compromiso bioético, rigor técnico y accesibilidad universal.
        </div>
      </div>
    </footer>
  );
};
