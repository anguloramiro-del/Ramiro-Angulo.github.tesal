import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, ArrowRight, Play, Database, HeartPulse } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export const HeroSection: React.FC = () => {
  const [counters, setCounters] = useState({
    teleconsultations: 148290,
    patients: 1480,
    biosignals: 84620000,
    preventiveAlerts: 3120,
  });

  // Simulated live telemetry increments
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prev) => ({
        teleconsultations: prev.teleconsultations + Math.floor(Math.random() * 2),
        patients: prev.patients + (Math.random() > 0.8 ? 1 : 0),
        biosignals: prev.biosignals + Math.floor(Math.random() * 85 + 40),
        preventiveAlerts: prev.preventiveAlerts + (Math.random() > 0.85 ? 1 : 0),
      }));
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    audioSynth.playEcgBeep(520, 50);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-center px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Disclaimer Banner - Clean & High Contrast */}
        <div className="mb-8 inline-flex flex-wrap items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Aviso Clínico Responsable:</strong> Plataforma educativa y de divulgación. No realiza diagnósticos ni sustituye la valoración de profesionales de salud.
          </span>
          <span className="text-amber-400/60 hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-amber-200/80 text-xs font-mono">100% Datos Sintéticos Locales</span>
        </div>

        {/* Hero Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline / Subtitle */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono tracking-wider uppercase text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Inteligencia Artificial</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Monitoreo Remoto</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Ciencia de Datos en Salud</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
              TELESALUD <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                INTELIGENTE
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Plataforma interactiva para comprender cómo el Machine Learning, las redes neuronales y el procesamiento de señales transforman la teleconsulta, la detección precoz de anomalías y la atención médica personalizada, preservando la supervisión humana y la ciberseguridad clínica.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo('ia-salud')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0d1117] font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
              >
                <span>Explorar IA en Salud</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('playground')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white font-semibold text-sm transition-all"
              >
                <Play className="w-4 h-4 text-cyan-400" />
                <span>Iniciar Telehealth Playground</span>
              </button>
            </div>

            {/* Unboxed Status Line */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Telemetría en Vivo Simulada
              </span>
              <span aria-hidden="true" className="text-slate-700">/</span>
              <span>Motor Heurístico Local v2.6</span>
              <span aria-hidden="true" className="text-slate-700">/</span>
              <span>Estándar HL7 FHIR Compatible</span>
            </div>
          </div>

          {/* Right Visual Console: Live ECG & Vitals Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900/80 border border-cyan-500/30 p-5 shadow-2xl backdrop-blur-xl space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <HeartPulse className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-semibold text-slate-200">
                      TELEMETRÍA_REMOTA // STREAM #01
                    </h3>
                    <p className="text-[11px] text-slate-400">Paciente Ficticio: P-8012 (64a · ICC)</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  STREAM ACTIVO
                </span>
              </div>

              {/* Dynamic SVG Waveform */}
              <div className="bg-[#090d12] rounded-xl p-3 border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>DERIVACIÓN DII (ECG SINTÉTICO)</span>
                  <span className="text-cyan-400">74 BPM · RITMO SINUSAL</span>
                </div>
                <svg viewBox="0 0 400 80" className="w-full h-20 text-cyan-400">
                  <defs>
                    <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  {/* Repeated QRS Complex Path */}
                  <path
                    d="M 0 40 L 40 40 L 48 38 L 54 41 L 60 40 L 66 43 L 70 8 L 76 68 L 82 40 L 92 40 L 102 33 L 114 40 L 160 40 L 168 38 L 174 41 L 180 40 L 186 43 L 190 8 L 196 68 L 202 40 L 212 40 L 222 33 L 234 40 L 280 40 L 288 38 L 294 41 L 300 40 L 306 43 L 310 8 L 316 68 L 322 40 L 332 40 L 342 33 L 354 40 L 400 40"
                    fill="none"
                    stroke="url(#ecgGrad)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Vitals Snapshot */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase">SpO2</div>
                  <div className="text-base font-bold text-cyan-300">97 %</div>
                  <div className="text-[9px] text-emerald-400">Normal</div>
                </div>
                <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase">Temp Corp</div>
                  <div className="text-base font-bold text-slate-200">36.6 °C</div>
                  <div className="text-[9px] text-slate-400">Normotermia</div>
                </div>
                <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase">Presión Art.</div>
                  <div className="text-base font-bold text-slate-200">128/82</div>
                  <div className="text-[9px] text-slate-400">mmHg</div>
                </div>
              </div>

              {/* AI Triage Recommendation Preview */}
              <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-lg p-3 text-xs flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-cyan-300">Predicción Heurística Simulada:</div>
                  <p className="text-slate-300 leading-snug">
                    Patrón hemodinámico compensado. Probabilidad de estabilidad a 24h estimada en 96.4%. Sin criterios de alarma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Animated Simulated Counters Section */}
        <div className="mt-14 pt-8 border-t border-slate-800/80">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Indicadores de Telemetría Global (Datos Sintéticos en Tiempo Real)</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Counter 1 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
              <div className="text-xs text-slate-400">Teleconsultas Analizadas</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums tracking-tight mt-1">
                {counters.teleconsultations.toLocaleString()}
              </div>
              <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1 font-mono">
                <span>↑ +12% vs mes anterior</span>
              </div>
            </div>

            {/* Counter 2 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
              <div className="text-xs text-slate-400">Pacientes Ficticios en RPM</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 tabular-nums tracking-tight mt-1">
                {counters.patients.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                <span>● 100% monitorizados</span>
              </div>
            </div>

            {/* Counter 3 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
              <div className="text-xs text-slate-400">Señales Clínicas Procesadas</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums tracking-tight mt-1">
                {(counters.biosignals / 1000000).toFixed(1)} M
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                ECG · SpO2 · PPG · Presión
              </div>
            </div>

            {/* Counter 4 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
              <div className="text-xs text-slate-400">Alertas Preventivas Generadas</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums tracking-tight mt-1">
                {counters.preventiveAlerts.toLocaleString()}
              </div>
              <div className="text-[11px] text-amber-300 mt-1 font-mono">
                92.8% validadas por médicos
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
