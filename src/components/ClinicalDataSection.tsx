import React, { useState } from 'react';
import { Database, Filter, Layers, BarChart3, AlertOctagon, Check, ArrowRight, Eye } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export const ClinicalDataSection: React.FC = () => {
  const [selectedSignal, setSelectedSignal] = useState<'all' | 'hr' | 'spo2' | 'temp'>('all');
  const [highlightAnomalies, setHighlightAnomalies] = useState<boolean>(true);
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(null);

  // 16-point simulated clinical time series (e.g. 24h timeline)
  const timeSeries = [
    { time: '00:00', hr: 68, spo2: 98, temp: 36.5, consults: 4, hasAnomaly: false, isMissing: false },
    { time: '02:00', hr: 64, spo2: 97, temp: 36.4, consults: 2, hasAnomaly: false, isMissing: false },
    { time: '04:00', hr: 62, spo2: 98, temp: 36.3, consults: 1, hasAnomaly: false, isMissing: false },
    { time: '06:00', hr: 72, spo2: 96, temp: 36.6, consults: 8, hasAnomaly: false, isMissing: false },
    { time: '08:00', hr: 84, spo2: 95, temp: 36.8, consults: 24, hasAnomaly: false, isMissing: false },
    { time: '10:00', hr: 114, spo2: 91, temp: 37.6, consults: 38, hasAnomaly: true, isMissing: false, anomalyNote: 'Taquicardia refleja + Desaturación aguda (SpO2 91%)' },
    { time: '12:00', hr: 96, spo2: 94, temp: 37.4, consults: 42, hasAnomaly: false, isMissing: false },
    { time: '14:00', hr: 88, spo2: 95, temp: 37.1, consults: 36, hasAnomaly: false, isMissing: false },
    { time: '16:00', hr: 82, spo2: 96, temp: 36.9, consults: 30, hasAnomaly: false, isMissing: false },
    { time: '17:00', hr: 80, spo2: 96, temp: 36.8, consults: 28, hasAnomaly: false, isMissing: true, imputedNote: 'Dato imputado mediante spline cúbico (sensor desconectado 12 min)' },
    { time: '18:00', hr: 78, spo2: 97, temp: 36.7, consults: 26, hasAnomaly: false, isMissing: false },
    { time: '20:00', hr: 76, spo2: 97, temp: 36.6, consults: 20, hasAnomaly: false, isMissing: false },
    { time: '22:00', hr: 70, spo2: 98, temp: 36.5, consults: 12, hasAnomaly: false, isMissing: false },
  ];

  const pipelineSteps = [
    { step: '01', title: 'Datos Ficticios', desc: 'Ingesta de telemetría de sensores IoT y formularios de teleconsulta.' },
    { step: '02', title: 'Validación', desc: 'Comprobación de rangos biológicos creíbles y firmas criptográficas de dispositivo.' },
    { step: '03', title: 'Limpieza', desc: 'Filtrado de artefactos de movimiento e imputación de paquetes perdidos.' },
    { step: '04', title: 'Exploración', desc: 'Estadística descriptiva, variabilidad (HRV) y detección de derivas basales.' },
    { step: '05', title: 'Modelado', desc: 'Entrenamiento de algoritmos supervisados con validación cruzada estratificada.' },
    { step: '06', title: 'Visualización', desc: 'Renderizado interactivo de curvas y mapas de calor con intervalos de confianza.' },
    { step: '07', title: 'Decisión Médica', desc: 'El profesional de salud valida la recomendación asistida y define la conducta.' },
  ];

  const handlePointClick = (idx: number) => {
    setActiveDataIndex(idx);
    audioSynth.playEcgBeep(560 + idx * 15, 50);
  };

  return (
    <section id="datos-clinicos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>Módulo Didáctico 03 · Ciencia de Datos Clínicos</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Ciclo de Vida del Dato en Telesalud
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Desde la captura de la bioseñal en el domicilio del paciente hasta la visualización en la consola médica, cada etapa requiere rigurosidad estadística, preprocesamiento ético y trazabilidad de incertidumbre.
        </p>
      </div>

      {/* Pipeline Visual Flow */}
      <div className="mb-12">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Pipeline de Transformación y Análisis Continuo</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {pipelineSteps.map((p, i) => (
            <div
              key={p.step}
              className="relative p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-cyan-400 font-bold">{p.step}</span>
                  {i < pipelineSteps.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-600 hidden lg:inline" />
                  )}
                </div>
                <div className="font-semibold text-xs text-white mb-1">{p.title}</div>
                <p className="text-[11px] text-slate-400 leading-tight">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Telehealth Bio-Signals Visualizer */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Explorador de Series Temporales Clínicas (Simulación 24h)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Haz clic en cualquier punto para inspeccionar valores exactos, imputaciones y detección de anomalías.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Signal Filter Buttons */}
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
              {(['all', 'hr', 'spo2', 'temp'] as const).map((sig) => (
                <button
                  key={sig}
                  onClick={() => setSelectedSignal(sig)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedSignal === sig
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sig === 'all' ? 'Todas' : sig === 'hr' ? 'FC (BPM)' : sig === 'spo2' ? 'SpO2 (%)' : 'Temp (°C)'}
                </button>
              ))}
            </div>

            {/* Toggle Anomaly Highlight */}
            <button
              onClick={() => setHighlightAnomalies(!highlightAnomalies)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                highlightAnomalies
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
              <span>Resaltar Anomalías</span>
            </button>
          </div>
        </div>

        {/* Dynamic SVG Multi-Vital Chart */}
        <div className="bg-[#090d12] rounded-xl p-4 border border-slate-800/80 relative">
          <svg viewBox="0 0 700 220" className="w-full h-56 sm:h-72">
            {/* Horizontal Grid lines */}
            {[40, 80, 120, 160].map((y) => (
              <line
                key={y}
                x1="40"
                y1={y}
                x2="680"
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
              />
            ))}

            {/* Y-Axis Labels */}
            <text x="35" y="45" fill="#06b6d4" fontSize="9" textAnchor="end" fontFamily="monospace">120</text>
            <text x="35" y="85" fill="#06b6d4" fontSize="9" textAnchor="end" fontFamily="monospace">100</text>
            <text x="35" y="125" fill="#06b6d4" fontSize="9" textAnchor="end" fontFamily="monospace">80</text>
            <text x="35" y="165" fill="#06b6d4" fontSize="9" textAnchor="end" fontFamily="monospace">60</text>

            {/* Heart Rate Line (HR) */}
            {(selectedSignal === 'all' || selectedSignal === 'hr') && (
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={timeSeries
                  .map((p, i) => {
                    const x = 50 + (i / (timeSeries.length - 1)) * 620;
                    // map hr [60, 120] to y [170, 40]
                    const y = 170 - ((p.hr - 60) / 60) * 130;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* SpO2 Line */}
            {(selectedSignal === 'all' || selectedSignal === 'spo2') && (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.2"
                strokeDasharray="4 2"
                strokeLinecap="round"
                points={timeSeries
                  .map((p, i) => {
                    const x = 50 + (i / (timeSeries.length - 1)) * 620;
                    // map spo2 [85, 100] to y [180, 50]
                    const y = 180 - ((p.spo2 - 85) / 15) * 130;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Temperature Line */}
            {(selectedSignal === 'all' || selectedSignal === 'temp') && (
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                points={timeSeries
                  .map((p, i) => {
                    const x = 50 + (i / (timeSeries.length - 1)) * 620;
                    // map temp [36.0, 38.5] to y [180, 50]
                    const y = 180 - ((p.temp - 36.0) / 2.5) * 130;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Data Points and Interaction Circles */}
            {timeSeries.map((p, i) => {
              const x = 50 + (i / (timeSeries.length - 1)) * 620;
              const y = 170 - ((p.hr - 60) / 60) * 130;
              const isSelected = activeDataIndex === i;

              return (
                <g key={i} className="cursor-pointer" onClick={() => handlePointClick(i)}>
                  {/* Vertical Guide */}
                  <line
                    x1={x}
                    y1="30"
                    x2={x}
                    y2="185"
                    stroke={isSelected ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.03)'}
                    strokeWidth="1"
                  />

                  {/* Missing/Imputed indicator */}
                  {p.isMissing && (
                    <circle cx={x} cy="180" r="4" fill="#64748b" />
                  )}

                  {/* Anomaly Indicator */}
                  {p.hasAnomaly && highlightAnomalies && (
                    <g>
                      <circle cx={x} cy={y} r="9" fill="rgba(239, 68, 68, 0.25)" className="animate-ping" />
                      <circle cx={x} cy={y} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Standard Point */}
                  {!p.hasAnomaly && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 5 : 3.5}
                      fill={isSelected ? '#ffffff' : '#06b6d4'}
                      stroke="#090d12"
                      strokeWidth="1"
                    />
                  )}

                  {/* X-Axis Label */}
                  <text
                    x={x}
                    y="200"
                    fill={isSelected ? '#06b6d4' : '#64748b'}
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {p.time}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend & Active Point Inspector Drawer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Legend */}
          <div className="md:col-span-6 flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Frecuencia Cardiaca (bpm)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-0.5 bg-emerald-400" />
              SpO2 (%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Temperatura (°C)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Anomalía Detectada
            </span>
          </div>

          {/* Active Inspector HUD */}
          <div className="md:col-span-6 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            {activeDataIndex !== null ? (
              <div className="space-y-1 font-mono">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <span>HORA DE LECTURA: {timeSeries[activeDataIndex].time}</span>
                  <span>{timeSeries[activeDataIndex].hasAnomaly ? '⚠️ ALERTA DETECTADA' : '● REGISTRO NOMINAL'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-slate-300 text-[11px]">
                  <div>FC: <span className="text-white font-bold">{timeSeries[activeDataIndex].hr} bpm</span></div>
                  <div>SpO2: <span className="text-white font-bold">{timeSeries[activeDataIndex].spo2}%</span></div>
                  <div>Temp: <span className="text-white font-bold">{timeSeries[activeDataIndex].temp}°C</span></div>
                </div>
                {timeSeries[activeDataIndex].anomalyNote && (
                  <p className="text-rose-300 text-[11px] pt-1">
                    Nota algorítmica: {timeSeries[activeDataIndex].anomalyNote}
                  </p>
                )}
                {timeSeries[activeDataIndex].imputedNote && (
                  <p className="text-slate-400 text-[11px] pt-1 italic">
                    Tratamiento de dato: {timeSeries[activeDataIndex].imputedNote}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-slate-500 italic text-center">
                Haz clic en cualquier punto del gráfico para inspeccionar telemetría y notas algorítmicas.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
