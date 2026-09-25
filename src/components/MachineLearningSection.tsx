import React, { useState, useMemo } from 'react';
import {
  Sliders,
  RotateCcw,
  Play,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

export const MachineLearningSection: React.FC = () => {
  // Simulator Controls
  const [dataQuality, setDataQuality] = useState<number>(85); // 10% - 100%
  const [sampleCount, setSampleCount] = useState<number>(1200); // 100 - 5000
  const [complexity, setComplexity] = useState<'baja' | 'media' | 'alta'>('media');
  const [noiseLevel, setNoiseLevel] = useState<number>(15); // 0% - 50%
  const [iterations, setIterations] = useState<number>(60); // 10 - 200

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'supervisado' | 'no-supervisado' | 'refuerzo'>('supervisado');

  // Calculate realistic clinical ML metrics based on inputs
  const metrics = useMemo(() => {
    // Base quality score between 0 and 1
    const baseQ = dataQuality / 100;
    const noisePenalty = (noiseLevel / 100) * 0.45;
    const sampleBonus = Math.min(Math.log10(sampleCount) / 4, 0.15);
    const iterBonus = Math.min(iterations / 250, 0.12);

    // Complexity factor: high complexity on noisy data causes slight overfitting
    let complexityFactor = 0.05;
    if (complexity === 'alta' && noiseLevel > 25) {
      complexityFactor = -0.04; // overfitting penalty
    } else if (complexity === 'media') {
      complexityFactor = 0.03;
    } else if (complexity === 'baja') {
      complexityFactor = 0.0;
    }

    const rawAccuracy = baseQ - noisePenalty + sampleBonus + iterBonus + complexityFactor;
    const accuracy = Math.min(Math.max(rawAccuracy * 100, 52.0), 98.4);

    // Sensitivity & Specificity
    const sensitivity = Math.min(Math.max(accuracy - (noiseLevel * 0.18) + (complexity === 'alta' ? 2 : -1), 48.0), 97.8);
    const specificity = Math.min(Math.max(accuracy + 1.2 - (noiseLevel * 0.12), 50.0), 98.9);
    const fpr = Math.max(100 - specificity, 1.1);

    // Confusion matrix synthetic counts based on sampleCount
    const actualPositives = Math.round(sampleCount * 0.35); // 35% clinical risk cases
    const actualNegatives = sampleCount - actualPositives;

    const tp = Math.round((actualPositives * sensitivity) / 100);
    const fn = actualPositives - tp;
    const tn = Math.round((actualNegatives * specificity) / 100);
    const fp = actualNegatives - tn;

    // Confidence interval (Wilson score approx)
    const ciMargin = (1.96 * Math.sqrt((accuracy / 100 * (1 - accuracy / 100)) / sampleCount)) * 100;
    const ciLower = Math.max(accuracy - ciMargin, 50.0);
    const ciUpper = Math.min(accuracy + ciMargin, 99.5);

    return {
      accuracy: accuracy.toFixed(1),
      sensitivity: sensitivity.toFixed(1),
      specificity: specificity.toFixed(1),
      fpr: fpr.toFixed(1),
      tp,
      fp,
      tn,
      fn,
      ciLower: ciLower.toFixed(1),
      ciUpper: ciUpper.toFixed(1),
    };
  }, [dataQuality, sampleCount, complexity, noiseLevel, iterations]);

  const handleReset = () => {
    audioSynth.playEcgBeep(440, 60);
    setDataQuality(85);
    setSampleCount(1200);
    setComplexity('media');
    setNoiseLevel(15);
    setIterations(60);
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    audioSynth.playHarmonicChord('stable');
    setTimeout(() => {
      setIsRunning(false);
      audioSynth.playEcgBeep(620, 80);
    }, 400);
  };

  return (
    <section id="machine-learning" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-12">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Módulo Didáctico 02 · Aprendizaje Automático</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Machine Learning en Telesalud
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Explora los tres grandes paradigmas del aprendizaje automático orientados a la telemedicina y experimenta en tiempo real cómo la calidad del dato, el tamaño muestral y el ruido sensorial influyen en el rendimiento de los modelos predictivos.
        </p>
      </div>

      {/* 3 Paradigms Tab Selector */}
      <div className="mb-10">
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 max-w-xl">
          <button
            onClick={() => setActiveTab('supervisado')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'supervisado'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aprendizaje Supervisado
          </button>
          <button
            onClick={() => setActiveTab('no-supervisado')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'no-supervisado'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            No Supervisado
          </button>
          <button
            onClick={() => setActiveTab('refuerzo')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'refuerzo'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Por Refuerzo (RL)
          </button>
        </div>

        {/* Tab Detail Banner */}
        <div className="mt-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300">
          {activeTab === 'supervisado' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="font-bold text-cyan-300 mb-1">1. Clasificación de Riesgo</div>
                <p className="text-slate-400 text-xs">Etiquetado de pacientes en telemonitoreo según probabilidad de descompensación a 48h.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="font-bold text-cyan-300 mb-1">2. Demanda de Consultas</div>
                <p className="text-slate-400 text-xs">Series temporales para estimar dotación de médicos especialistas requeridos por hora.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="font-bold text-cyan-300 mb-1">3. Predicción de No-Show</div>
                <p className="text-slate-400 text-xs">Modelos logísticos para prever inasistencia a teleconsultas y reprogramar proactivamente.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="font-bold text-cyan-300 mb-1">4. Priorización de Alertas</div>
                <p className="text-slate-400 text-xs">Árboles gradient boosting que ordenan la bandeja de entrada según urgencia clínica real.</p>
              </div>
            </div>
          )}

          {activeTab === 'no-supervisado' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="font-bold text-teal-300 mb-1">1. Clustering de Perfiles</div>
                <p className="text-slate-400 text-xs">Agrupación (K-Means/DBSCAN) de fenotipos de pacientes según patrones horarios de glucemia y actividad.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="font-bold text-teal-300 mb-1">2. Detección de Anomalías</div>
                <p className="text-slate-400 text-xs">Isolation Forests para identificar derivas silenciosas en sensores electrocardiográficos.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="font-bold text-teal-300 mb-1">3. Reducción Dimensional</div>
                <p className="text-slate-400 text-xs">PCA / UMAP para comprimir 64 canales biométricos continuos en espacios visualizables.</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="font-bold text-teal-300 mb-1">4. Descubrimiento de Patrones</div>
                <p className="text-slate-400 text-xs">Minería de secuencias en eventos clínicos previos a hospitalizaciones evitables.</p>
              </div>
            </div>
          )}

          {activeTab === 'refuerzo' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/80 rounded-lg border border-cyan-500/30 font-mono text-xs text-cyan-300">
                <span>[AGENTE IA]</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span>[ACCIÓN: Ajustar Frecuencia Telemetría / Notificación]</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span>[ENTORNO ASISTENCIAL: Paciente Domiciliario]</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span>[RECOMPENSA: Adherencia Terapéutica + Ahorro Batería]</span>
              </div>
              <p className="text-xs text-slate-400">
                El aprendizaje por refuerzo optimiza políticas de intervención dinámica: aprende cuándo enviar un recordatorio de toma de medicación sin agobiar al paciente, o cuándo intensificar la frecuencia de muestreo del sensor si se detecta inestabilidad fisiológica.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Simulator: Controls vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase">
                Parámetros del Experimento
              </h3>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
          </div>

          {/* Slider 1: Data Quality */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Calidad de Datos Clínicos:</span>
              <span className="text-cyan-400 font-bold">{dataQuality}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={dataQuality}
              onChange={(e) => setDataQuality(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Integridad, etiquetado riguroso por especialistas y ausencia de sesgos de registro.
            </p>
          </div>

          {/* Slider 2: Number of observations */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Muestras Clínicas (N):</span>
              <span className="text-cyan-400 font-bold">{sampleCount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={sampleCount}
              onChange={(e) => setSampleCount(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Número de episodios o pacientes simulados en la cohorte de entrenamiento.
            </p>
          </div>

          {/* Selector 3: Model Complexity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Complejidad del Modelo:</span>
              <span className="text-cyan-400 font-bold uppercase">{complexity}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['baja', 'media', 'alta'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setComplexity(lvl)}
                  className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                    complexity === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl === 'baja' ? 'Lineal' : lvl === 'media' ? 'Random Forest' : 'Deep Neural'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Modelos de alta complejidad sobre datos ruidosos pueden sufrir sobreajuste (overfitting).
            </p>
          </div>

          {/* Slider 4: Noise Level */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Ruido Sensorial / Artefactos:</span>
              <span className="text-amber-400 font-bold">{noiseLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Movimiento del paciente, desprendimiento de electrodos o interferencia inalámbrica.
            </p>
          </div>

          {/* Slider 5: Epochs / Iterations */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Épocas de Entrenamiento:</span>
              <span className="text-cyan-400 font-bold">{iterations}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Run button */}
          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunning ? 'Reentrenando Modelo...' : 'Ejecutar Re-Entrenamiento Simulado'}</span>
          </button>
        </div>

        {/* Right Column: Computed Metrics & Confusion Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Exactitud (Accuracy)</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-300 tabular-nums mt-1">
                {metrics.accuracy}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Global en validación</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Sensibilidad (Recall)</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums mt-1">
                {metrics.sensitivity}%
              </div>
              <div className="text-[10px] text-emerald-400/90 mt-1">Detección de riesgo real</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Especificidad</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-teal-400 tabular-nums mt-1">
                {metrics.specificity}%
              </div>
              <div className="text-[10px] text-teal-400/90 mt-1">Evita falsas alarmas</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Tasa Falsos Positivos</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums mt-1">
                {metrics.fpr}%
              </div>
              <div className="text-[10px] text-amber-300 mt-1">Impacto en sobrecarga</div>
            </div>
          </div>

          {/* Confusion Matrix + ROC Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confusion Matrix */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-200 uppercase">
                  Matriz de Confusión Clínica (N={sampleCount})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">95% CI: [{metrics.ciLower}% - {metrics.ciUpper}%]</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                {/* True Positives */}
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                  <div className="text-[10px] uppercase text-emerald-400 font-semibold">
                    Verdaderos Positivos (VP)
                  </div>
                  <div className="text-xl font-bold text-emerald-300 tabular-nums mt-0.5">
                    {metrics.tp}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Alerta real detectada</div>
                </div>

                {/* False Positives */}
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30">
                  <div className="text-[10px] uppercase text-amber-400 font-semibold">
                    Falsos Positivos (FP)
                  </div>
                  <div className="text-xl font-bold text-amber-300 tabular-nums mt-0.5">
                    {metrics.fp}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Alarma espuria / fatiga</div>
                </div>

                {/* False Negatives */}
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30">
                  <div className="text-[10px] uppercase text-rose-400 font-semibold">
                    Falsos Negativos (FN)
                  </div>
                  <div className="text-xl font-bold text-rose-300 tabular-nums mt-0.5">
                    {metrics.fn}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Riesgo no detectado ⚠️</div>
                </div>

                {/* True Negatives */}
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30">
                  <div className="text-[10px] uppercase text-cyan-400 font-semibold">
                    Verdaderos Negativos (VN)
                  </div>
                  <div className="text-xl font-bold text-cyan-300 tabular-nums mt-0.5">
                    {metrics.tn}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Estado estable confirmado</div>
                </div>
              </div>
            </div>

            {/* Simulated ROC / Precision-Recall visualization */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-200">CURVA ROC ESTIMADA (AUC-ROC)</span>
                <span className="text-cyan-400 font-bold">AUC: {(Number(metrics.accuracy) / 100 * 0.98).toFixed(2)}</span>
              </div>

              <div className="bg-[#090d12] rounded-xl p-2 border border-slate-800/80 relative">
                <svg viewBox="0 0 160 120" className="w-full h-32">
                  {/* Diagonal reference */}
                  <line x1="20" y1="100" x2="140" y2="20" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" />
                  {/* Axis */}
                  <line x1="20" y1="100" x2="140" y2="100" stroke="#475569" strokeWidth="1" />
                  <line x1="20" y1="100" x2="20" y2="20" stroke="#475569" strokeWidth="1" />
                  {/* Dynamic ROC curve */}
                  {(() => {
                    const accFactor = Number(metrics.accuracy) / 100;
                    const curveY = 100 - (accFactor * 75);
                    const controlX = 35 - (accFactor * 10);
                    return (
                      <path
                        d={`M 20 100 Q ${controlX} ${curveY} 140 20`}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                      />
                    );
                  })()}
                  <text x="25" y="112" fill="#64748b" fontSize="7" fontFamily="monospace">1 - Especificidad</text>
                  <text x="5" y="60" fill="#64748b" fontSize="7" fontFamily="monospace" transform="rotate(-90 10,60)">Sensibilidad</text>
                </svg>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">
                El área bajo la curva (AUC) refleja la capacidad discriminativa del clasificador entre pacientes estables y en riesgo inminente.
              </p>
            </div>
          </div>

          {/* Educational Clinical Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Nota Pedagógica:</strong> Las métricas se calculan mediante simulación estocástica sintética. En la práctica clínica real, ningún modelo se despliega sin validación externa multicéntrica y aprobación por comités regulatorios (FDA SaMD / CE MDR).
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
