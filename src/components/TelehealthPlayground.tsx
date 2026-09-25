import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Download,
  Sliders,
  Sparkles,
  PieChart,
  Users,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export const TelehealthPlayground: React.FC = () => {
  const [activeSim, setActiveSim] = useState<
    'riesgo' | 'demanda' | 'clustering' | 'anomalias' | 'sinteticos'
  >('riesgo');

  // Interactive controls
  const [sensitivitySlider, setSensitivitySlider] = useState<number>(75);
  const [noiseFilterSlider, setNoiseFilterSlider] = useState<number>(30);
  const [clusterCount, setClusterCount] = useState<number>(3);
  const [syntheticCohortSize, setSyntheticCohortSize] = useState<number>(250);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Dynamic simulation metrics
  const simResults = useMemo(() => {
    const baseLatency = Math.floor(8 + Math.random() * 8);
    const loss = Math.max(0.04, 0.45 - (sensitivitySlider / 250) + (noiseFilterSlider / 350));
    const accuracy = Math.min(98.2, 70 + (sensitivitySlider * 0.28) - (noiseFilterSlider * 0.1));
    const simulatedAlerts = Math.round((sensitivitySlider / 100) * (syntheticCohortSize * 0.18));
    const confidence = Math.min(99, 82 + (sensitivitySlider * 0.15) - (noiseFilterSlider * 0.08));

    return {
      accuracy: accuracy.toFixed(1),
      loss: loss.toFixed(3),
      latencyMs: baseLatency,
      simulatedAlerts,
      confidence: confidence.toFixed(1),
    };
  }, [sensitivitySlider, noiseFilterSlider, syntheticCohortSize, activeSim]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    audioSynth.playHarmonicChord('stable');
    setTimeout(() => {
      setIsSimulating(false);
      audioSynth.playEcgBeep(640, 50);
    }, 450);
  };

  const handleReset = () => {
    setSensitivitySlider(75);
    setNoiseFilterSlider(30);
    setClusterCount(3);
    setSyntheticCohortSize(250);
    audioSynth.playEcgBeep(480, 50);
  };

  // Export CSV synthetic dataset
  const handleExportCSV = () => {
    audioSynth.playEcgBeep(720, 60);
    const headers = 'ID_Paciente,Edad,Sexo,Condicion_Simulada,FC_Media,SpO2,Riesgo_Estimado,Alerta_Generada\n';
    const rows = Array.from({ length: 25 }, (_, i) => {
      const id = `SIM-P-${1000 + i}`;
      const age = Math.floor(35 + Math.random() * 45);
      const sex = Math.random() > 0.5 ? 'F' : 'M';
      const cond = i % 3 === 0 ? 'Hipertension' : i % 3 === 1 ? 'EPOC' : 'ICC';
      const fc = Math.floor(62 + Math.random() * 40);
      const spo2 = Math.floor(90 + Math.random() * 10);
      const risk = (Math.random() * 100).toFixed(1);
      const alert = Number(risk) > 65 ? 'SI' : 'NO';
      return `${id},${age},${sex},${cond},${fc},${spo2},${risk}%,${alert}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cohort_sintetica_telesalud_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="playground" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <FlaskConical className="w-4 h-4" />
          <span>Módulo Didáctico 06 · Laboratorio Interactivo</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Telehealth AI Playground
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Experimenta con algoritmos aplicados a la telemedicina en un entorno de pruebas interactivo: ajusta hiperparámetros, evalúa el impacto de la sensibilidad de alerta y exporta cohortes clínicas sintéticas anonimizadas.
        </p>
      </div>

      {/* Selector of Simulation Modules */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 mb-8 max-w-4xl overflow-x-auto scrollbar-none">
        {[
          { id: 'riesgo', label: '1. Triaje de Riesgo', icon: AlertTriangle },
          { id: 'demanda', label: '2. Predicción de Demanda', icon: Activity },
          { id: 'clustering', label: '3. Clustering de Pacientes', icon: Users },
          { id: 'anomalias', label: '4. Detector de Deriva', icon: Sparkles },
          { id: 'sinteticos', label: '5. Generador Sintético', icon: Download },
        ].map((tab) => {
          const IconC = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSim(tab.id as typeof activeSim);
                audioSynth.playEcgBeep(560, 40);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                activeSim === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <IconC className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Playground Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Controls Column */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Controles de la Simulación</span>
            </h3>
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>

          {/* Slider: Sensitivity */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-300">Sensibilidad del Algoritmo:</span>
              <span className="text-cyan-400 font-bold">{sensitivitySlider}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="99"
              value={sensitivitySlider}
              onChange={(e) => setSensitivitySlider(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Mayor sensibilidad detecta más casos límite a costa de incrementar las falsas alarmas.
            </p>
          </div>

          {/* Slider: Noise Filter */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-300">Filtro de Ruido / Smoothing:</span>
              <span className="text-teal-400 font-bold">{noiseFilterSlider}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={noiseFilterSlider}
              onChange={(e) => setNoiseFilterSlider(Number(e.target.value))}
              className="w-full accent-teal-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Suavizado adaptativo de la bioseñal para amortiguar artefactos de movimiento del sensor.
            </p>
          </div>

          {/* Cohort Size */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-300">Tamaño de Cohorte Ficticia:</span>
              <span className="text-white font-bold">{syntheticCohortSize} pacientes</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={syntheticCohortSize}
              onChange={(e) => setSyntheticCohortSize(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Specific control for clustering */}
          {activeSim === 'clustering' && (
            <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300">Número de Clusters K-Means:</span>
                <span className="text-cyan-400 font-bold">K = {clusterCount}</span>
              </div>
              <div className="flex gap-2 pt-1">
                {[2, 3, 4, 5].map((k) => (
                  <button
                    key={k}
                    onClick={() => setClusterCount(k)}
                    className={`flex-1 py-1.5 rounded border text-xs font-mono ${
                      clusterCount === k
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    K={k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Calculando Simulación...' : 'Ejecutar Simulación en Navegador'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Descargar Cohorte Sintética (CSV)</span>
            </button>
          </div>
        </div>

        {/* Right: Simulation Stage / Visualization */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Telemetry Readout Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Precisión Sim.</div>
              <div className="text-lg font-bold text-cyan-300 tabular-nums">{simResults.accuracy}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Pérdida (Loss)</div>
              <div className="text-lg font-bold text-slate-200 tabular-nums">{simResults.loss}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Latencia</div>
              <div className="text-lg font-bold text-emerald-400 tabular-nums">{simResults.latencyMs} ms</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Alertas Gen.</div>
              <div className="text-lg font-bold text-amber-400 tabular-nums">{simResults.simulatedAlerts}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 uppercase">Confianza</div>
              <div className="text-lg font-bold text-teal-300 tabular-nums">{simResults.confidence}%</div>
            </div>
          </div>

          {/* Interactive Dynamic Canvas / Stage based on active sim */}
          <div className="p-5 rounded-2xl bg-[#090d12] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="text-white font-bold">
                {activeSim === 'riesgo' && 'MAPA DE DISPERSIÓN DE RIESGO DE TELEMONITOREO'}
                {activeSim === 'demanda' && 'CURVA PREDICTIVA DE VOLUMEN DE TELECONSULTAS (24H)'}
                {activeSim === 'clustering' && `CLUSTERING K-MEANS DE FENOTIPOS (K=${clusterCount})`}
                {activeSim === 'anomalias' && 'DETECCIÓN DE DERIVAS EN TIEMPO REAL'}
                {activeSim === 'sinteticos' && 'GENERADOR DE COHORTE SINTÉTICA (HL7 FHIR ALIGNED)'}
              </span>
              <span className="text-cyan-400">N={syntheticCohortSize} PACIENTES</span>
            </div>

            {/* Render 2D SVG Scatter for Clustering / Risk */}
            {(activeSim === 'riesgo' || activeSim === 'clustering') && (
              <svg viewBox="0 0 500 200" className="w-full h-52 bg-slate-950/60 rounded-xl p-2">
                {/* Axes */}
                <line x1="30" y1="170" x2="470" y2="170" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="30" x2="30" y2="170" stroke="#334155" strokeWidth="1" />
                <text x="250" y="190" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  Frecuencia Cardiaca Promedio (bpm)
                </text>
                <text x="10" y="100" fill="#64748b" fontSize="8" fontFamily="monospace" transform="rotate(-90 10,100)" textAnchor="middle">
                  Variabilidad / Desaturación
                </text>

                {/* Synthetic Scatter Points */}
                {Array.from({ length: 45 }, (_, i) => {
                  const seed = (i * 37) % 100;
                  const x = 50 + ((seed * 4) % 400);
                  const y = 40 + (((i * 53) % 100) * 1.2);
                  const cluster = i % clusterCount;
                  const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
                  const color = activeSim === 'clustering' ? colors[cluster] : y < 80 ? '#ef4444' : '#06b6d4';

                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={color}
                      opacity="0.85"
                      stroke="#0d1117"
                      strokeWidth="0.8"
                    />
                  );
                })}
              </svg>
            )}

            {/* Render Demand Curve */}
            {activeSim === 'demanda' && (
              <svg viewBox="0 0 500 200" className="w-full h-52 bg-slate-950/60 rounded-xl p-2">
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  points="30,160 70,150 110,140 150,110 190,50 230,45 270,70 310,60 350,85 390,110 430,135 470,155"
                />
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="1.8"
                  strokeDasharray="4 2"
                  points="30,165 70,155 110,145 150,120 190,65 230,58 270,80 310,75 350,95 390,120 430,145 470,160"
                />
                <text x="470" y="50" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="end">
                  Demanda Observada (Consultas/h)
                </text>
                <text x="470" y="65" fill="#06b6d4" fontSize="8" fontFamily="monospace" textAnchor="end">
                  Predicción ARIMA / LSTM
                </text>
              </svg>
            )}

            {/* Render Biosignal Anomaly Drift */}
            {activeSim === 'anomalias' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs font-mono">
                <div className="text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Isolation Forest: Escaneo continuo sobre series multivariadas</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  El algoritmo analiza las últimas 1,000 ventanas deslizantes de telemetría buscando patrones que se desvíen más de 2.5 desviaciones estándar del centroide biológico del paciente.
                </p>
                <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[11px]">
                  ✓ Umbral de sensibilidad calibrado al {sensitivitySlider}% · Filtrado espectral: {noiseFilterSlider}Hz · Estado: Escaneo activo en segundo plano.
                </div>
              </div>
            )}

            {/* Render Synthetic Generation table preview */}
            {activeSim === 'sinteticos' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="py-1 px-2">ID_SINTETICO</th>
                      <th className="py-1 px-2">EDAD</th>
                      <th className="py-1 px-2">CONDICION</th>
                      <th className="py-1 px-2">FC (BPM)</th>
                      <th className="py-1 px-2">SpO2</th>
                      <th className="py-1 px-2">RIESGO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-1 px-2 text-cyan-400">P-SYN-01</td>
                      <td className="py-1 px-2">64</td>
                      <td className="py-1 px-2">ICC Compensada</td>
                      <td className="py-1 px-2">72</td>
                      <td className="py-1 px-2">98%</td>
                      <td className="py-1 px-2 text-emerald-400">Bajo (22%)</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2 text-cyan-400">P-SYN-02</td>
                      <td className="py-1 px-2">71</td>
                      <td className="py-1 px-2">EPOC Severo</td>
                      <td className="py-1 px-2">94</td>
                      <td className="py-1 px-2 text-amber-400">91%</td>
                      <td className="py-1 px-2 text-amber-400">Medio (68%)</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2 text-cyan-400">P-SYN-03</td>
                      <td className="py-1 px-2">55</td>
                      <td className="py-1 px-2">Diabetes T2</td>
                      <td className="py-1 px-2">68</td>
                      <td className="py-1 px-2">99%</td>
                      <td className="py-1 px-2 text-emerald-400">Bajo (15%)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
