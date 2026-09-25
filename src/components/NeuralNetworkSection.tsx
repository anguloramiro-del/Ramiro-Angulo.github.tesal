import React, { useState, useMemo } from 'react';
import { Network, Zap, Sliders, RefreshCw, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export const NeuralNetworkSection: React.FC = () => {
  // Clinical inputs
  const [hr, setHr] = useState<number>(76); // 45 - 160 bpm
  const [spo2, setSpo2] = useState<number>(97); // 80 - 100%
  const [temp, setTemp] = useState<number>(36.6); // 35.0 - 40.0 °C
  const [rr, setRr] = useState<number>(16); // 10 - 35 rpm
  const [activity, setActivity] = useState<number>(45); // 0 - 100 actigraphy score

  // Network topology controls
  const [hiddenLayers, setHiddenLayers] = useState<number>(2); // 1, 2, or 3
  const [neuronsPerLayer, setNeuronsPerLayer] = useState<number>(4); // 2 to 5
  const [activationFn, setActivationFn] = useState<'ReLU' | 'Sigmoid' | 'Tanh'>('ReLU');
  const [weightGain, setWeightGain] = useState<number>(1.2); // 0.5 - 2.5
  const [alertThreshold, setAlertThreshold] = useState<number>(65); // 40 - 90%

  const [isPropagating, setIsPropagating] = useState<boolean>(false);

  // Compute forward pass
  const classification = useMemo(() => {
    // Normalize inputs roughly [0, 1]
    const normHr = (hr - 60) / 60; // 0 normal, > 0.6 high
    const normSpo2 = (100 - spo2) / 15; // 0 normal, > 0.5 low
    const normTemp = (temp - 36.5) / 2; // > 0.5 fever
    const normRr = (rr - 16) / 12;
    const normAct = activity / 100;

    // Synthetic anomaly score
    const weightedSum =
      (normHr * 0.35 + normSpo2 * 0.45 + normTemp * 0.25 + normRr * 0.2) * weightGain -
      normAct * 0.1;

    let activatedScore = 0;
    if (activationFn === 'ReLU') {
      activatedScore = Math.max(0, weightedSum);
    } else if (activationFn === 'Sigmoid') {
      activatedScore = 1 / (1 + Math.exp(-weightedSum * 2));
    } else {
      // Tanh
      activatedScore = Math.max(0, Math.tanh(weightedSum));
    }

    const anomalyProb = Math.min(Math.max(activatedScore * 65, 5), 98);
    const reviewProb = Math.min(Math.max((100 - anomalyProb) * 0.45, 10), 85);
    const stableProb = Math.max(100 - anomalyProb - reviewProb, 2);

    let category: 'estable' | 'revision' | 'anomalia' = 'estable';
    if (anomalyProb >= alertThreshold) {
      category = 'anomalia';
    } else if (anomalyProb >= alertThreshold * 0.6) {
      category = 'revision';
    }

    return {
      anomalyProb: anomalyProb.toFixed(1),
      reviewProb: reviewProb.toFixed(1),
      stableProb: stableProb.toFixed(1),
      category,
    };
  }, [hr, spo2, temp, rr, activity, activationFn, weightGain, alertThreshold]);

  const handlePropagate = () => {
    setIsPropagating(true);
    if (classification.category === 'anomalia') {
      audioSynth.playWarningAlert();
    } else {
      audioSynth.playHarmonicChord('stable');
    }
    setTimeout(() => setIsPropagating(false), 800);
  };

  return (
    <section id="redes-neuronales" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Network className="w-4 h-4" />
          <span>Módulo Didáctico 04 · Arquitectura Profunda</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Redes Neuronales en Bioseñales
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Comprueba visualmente la propagación hacia adelante (forward pass) de señales fisiológicas complejas a través de capas ocultas densas para categorizar patrones de riesgo en telemedicina.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Clinical Input Sliders & Topology */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Entradas Fisiológicas Simuladas</span>
            </h3>
            <button
              onClick={() => {
                setHr(76);
                setSpo2(97);
                setTemp(36.6);
                setRr(16);
                setActivity(45);
                audioSynth.playEcgBeep(480, 50);
              }}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Normalizar</span>
            </button>
          </div>

          {/* Vitals Controls */}
          <div className="space-y-4 text-xs font-mono">
            {/* HR */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">FC (Frecuencia Cardiaca):</span>
                <span className="text-cyan-400 font-bold">{hr} bpm</span>
              </div>
              <input
                type="range"
                min="45"
                max="160"
                value={hr}
                onChange={(e) => setHr(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* SpO2 */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">SpO2 (Saturación O2):</span>
                <span className={spo2 < 92 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {spo2} %
                </span>
              </div>
              <input
                type="range"
                min="82"
                max="100"
                value={spo2}
                onChange={(e) => setSpo2(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Temp */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Temperatura Corporal:</span>
                <span className={temp > 37.8 ? 'text-rose-400 font-bold' : 'text-slate-200 font-bold'}>
                  {temp.toFixed(1)} °C
                </span>
              </div>
              <input
                type="range"
                min="35.5"
                max="39.8"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* RR */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Frecuencia Respiratoria:</span>
                <span className="text-slate-200 font-bold">{rr} rpm</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                value={rr}
                onChange={(e) => setRr(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Hyperparameters Config */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400">
              Hiperparámetros de la Red
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block mb-1">Capas Ocultas:</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((l) => (
                    <button
                      key={l}
                      onClick={() => setHiddenLayers(l)}
                      className={`flex-1 py-1 rounded border ${
                        hiddenLayers === l
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Función Activación:</span>
                <div className="flex gap-1">
                  {(['ReLU', 'Sigmoid', 'Tanh'] as const).map((fn) => (
                    <button
                      key={fn}
                      onClick={() => setActivationFn(fn)}
                      className={`flex-1 py-1 text-[11px] rounded border ${
                        activationFn === fn
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {fn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Threshold Slider */}
            <div className="pt-2 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Umbral de Alerta Clínica:</span>
                <span className="text-amber-400 font-bold">{alertThreshold}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Propagate Button */}
          <button
            onClick={handlePropagate}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
          >
            <Zap className={`w-3.5 h-3.5 ${isPropagating ? 'animate-bounce text-yellow-300' : ''}`} />
            <span>{isPropagating ? 'Propagando Bioseñal...' : 'Propagar Bioseñal (Forward Pass)'}</span>
          </button>
        </div>

        {/* Right Column: Interactive Neural Visualizer & Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual SVG Network Diagram */}
          <div className="rounded-2xl bg-[#090d12] border border-slate-800 p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 border-b border-slate-800/80 pb-2">
              <span>MAPA DE CONECTIVIDAD SINÁPTICA</span>
              <span className="text-cyan-400">ACTIVACIÓN: {activationFn} · GANANCIA: {weightGain}x</span>
            </div>

            <svg viewBox="0 0 540 240" className="w-full h-56 sm:h-64">
              {/* Input Layer (5 Nodes) */}
              {[35, 75, 115, 155, 195].map((y, idx) => {
                const labels = ['FC', 'SpO2', 'Temp', 'FR', 'Act'];
                return (
                  <g key={`in-${idx}`}>
                    {/* Connections to first hidden layer */}
                    {[50, 95, 140, 185].slice(0, neuronsPerLayer).map((hy, hidx) => (
                      <line
                        key={`line-${idx}-${hidx}`}
                        x1="80"
                        y1={y}
                        x2="200"
                        y2={hy}
                        stroke={isPropagating ? '#00f0ff' : 'rgba(6, 182, 212, 0.2)'}
                        strokeWidth={isPropagating ? 1.8 : 0.8}
                        className={isPropagating ? 'animate-pulse' : ''}
                      />
                    ))}
                    <circle cx="80" cy={y} r="14" fill="#0d1117" stroke="#06b6d4" strokeWidth="2" />
                    <text x="80" y={y + 4} fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      {labels[idx]}
                    </text>
                  </g>
                );
              })}

              {/* Hidden Layer 1 (neuronsPerLayer nodes) */}
              {[50, 95, 140, 185].slice(0, neuronsPerLayer).map((hy, hidx) => (
                <g key={`h1-${hidx}`}>
                  {/* Connections to Hidden Layer 2 or Output */}
                  {hiddenLayers >= 2 ? (
                    [65, 115, 165].slice(0, neuronsPerLayer).map((h2y, h2idx) => (
                      <line
                        key={`h1h2-${hidx}-${h2idx}`}
                        x1="200"
                        y1={hy}
                        x2="320"
                        y2={h2y}
                        stroke={isPropagating ? '#10b981' : 'rgba(16, 185, 129, 0.2)'}
                        strokeWidth={isPropagating ? 1.8 : 0.8}
                      />
                    ))
                  ) : (
                    [70, 120, 170].map((oy, oidx) => (
                      <line
                        key={`h1out-${hidx}-${oidx}`}
                        x1="200"
                        y1={hy}
                        x2="450"
                        y2={oy}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="0.8"
                      />
                    ))
                  )}
                  <circle cx="200" cy={hy} r="13" fill="#090d12" stroke="#10b981" strokeWidth="1.8" />
                  <text x="200" y={hy + 4} fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    H1.{hidx + 1}
                  </text>
                </g>
              ))}

              {/* Hidden Layer 2 (if active) */}
              {hiddenLayers >= 2 &&
                [65, 115, 165].slice(0, neuronsPerLayer).map((h2y, h2idx) => (
                  <g key={`h2-${h2idx}`}>
                    {[70, 120, 170].map((oy, oidx) => (
                      <line
                        key={`h2out-${h2idx}-${oidx}`}
                        x1="320"
                        y1={h2y}
                        x2="450"
                        y2={oy}
                        stroke={isPropagating ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)'}
                        strokeWidth="0.8"
                      />
                    ))}
                    <circle cx="320" cy={h2y} r="13" fill="#090d12" stroke="#38bdf8" strokeWidth="1.8" />
                    <text x="320" y={h2y + 4} fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      H2.{h2idx + 1}
                    </text>
                  </g>
                ))}

              {/* Output Layer (3 Categories) */}
              {[
                { y: 70, label: 'ESTABLE', color: '#10b981', prob: classification.stableProb },
                { y: 120, label: 'REVISIÓN', color: '#f59e0b', prob: classification.reviewProb },
                { y: 170, label: 'ANOMALÍA', color: '#ef4444', prob: classification.anomalyProb },
              ].map((out, oidx) => (
                <g key={`out-${oidx}`}>
                  <circle
                    cx="450"
                    cy={out.y}
                    r="16"
                    fill="#0d1117"
                    stroke={out.color}
                    strokeWidth={classification.category === (oidx === 0 ? 'estable' : oidx === 1 ? 'revision' : 'anomalia') ? 3 : 1.5}
                  />
                  <text x="450" y={out.y + 4} fill={out.color} fontSize="8" fontFamily="monospace" textAnchor="middle">
                    {out.prob}%
                  </text>
                  <text x="475" y={out.y + 4} fill="#94a3b8" fontSize="8" fontFamily="monospace">
                    {out.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Classification Output Banner */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="text-xs font-mono uppercase text-slate-400">
              Salida del Clasificador (Categorización Pedagógica)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category 1 */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  classification.category === 'estable'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[11px] font-mono uppercase font-bold">Patrón Estable</div>
                <div className="text-2xl font-mono font-bold mt-1">{classification.stableProb}%</div>
                <p className="text-[10px] mt-1 text-slate-400">Constantes dentro de variabilidad esperada</p>
              </div>

              {/* Category 2 */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  classification.category === 'revision'
                    ? 'bg-amber-950/50 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[11px] font-mono uppercase font-bold">Requiere Revisión</div>
                <div className="text-2xl font-mono font-bold mt-1">{classification.reviewProb}%</div>
                <p className="text-[10px] mt-1 text-slate-400">Tendencia límite; contactar por teleconsulta</p>
              </div>

              {/* Category 3 */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  classification.category === 'anomalia'
                    ? 'bg-rose-950/50 border-rose-500 text-rose-300 ring-2 ring-rose-500/20'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[11px] font-mono uppercase font-bold">Señal Anómala Simulada</div>
                <div className="text-2xl font-mono font-bold mt-1">{classification.anomalyProb}%</div>
                <p className="text-[10px] mt-1 text-slate-400">Alerta de prioridad alta para equipo médico</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <span>
                <strong>Precaución de Terminología:</strong> La salida del modelo señala únicamente anomalías numéricas en bioseñales. Nunca equivale a un "diagnóstico confirmado". Todo evento debe ser evaluado clínicamente por un facultativo calificado.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
