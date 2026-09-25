import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  FileText,
  Image as ImageIcon,
  Code,
  Volume2,
  Copy,
  Check,
  AlertTriangle,
  Play,
  Square,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';
import { SAMPLE_FHIR_BUNDLE, SAMPLE_PYTHON_PIPELINE } from '../data/telehealthData';

export const GenerativeAiSection: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'texto' | 'imagen' | 'codigo' | 'audio'>('texto');

  // Text Mode State
  const [selectedCase, setSelectedCase] = useState<'icc' | 'epoc' | 'diabetes'>('icc');
  const [textFormat, setTextFormat] = useState<'soap' | 'paciente'>('soap');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Canvas Image Mode State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [spectrogramFreq, setSpectrogramFreq] = useState<number>(3);
  const [spectrogramNoise, setSpectrogramNoise] = useState<number>(20);

  // Audio Mode State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPreset, setAudioPreset] = useState<'sinusal' | 'taquicardia' | 'bradicardia' | 'alerta'>('sinusal');
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    audioSynth.playEcgBeep(700, 40);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Render Generative Spectrogram on Canvas
  useEffect(() => {
    if (activeMode !== 'imagen') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Generate synthetic spectrogram grid
    const cols = 60;
    const rows = 30;
    const cellW = width / cols;
    const cellH = height / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const harmonic = Math.sin((c / cols) * Math.PI * spectrogramFreq) * Math.cos((r / rows) * Math.PI * 2);
        const noise = (Math.random() - 0.5) * (spectrogramNoise / 50);
        const intensity = Math.min(Math.max((harmonic + 1) / 2 + noise, 0), 1);

        // Cyber matrix colormap: dark navy -> cyan -> lime -> yellow
        const rCol = Math.floor(intensity * 120);
        const gCol = Math.floor(intensity * 255);
        const bCol = Math.floor((1 - intensity) * 200 + intensity * 150);

        ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${0.15 + intensity * 0.85})`;
        ctx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
      }
    }
  }, [activeMode, spectrogramFreq, spectrogramNoise]);

  // Audio Mode Telemetry Loop
  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const intervalMs = audioPreset === 'taquicardia' ? 450 : audioPreset === 'bradicardia' ? 1250 : 830;
      const pitch = audioPreset === 'taquicardia' ? 680 : audioPreset === 'bradicardia' ? 440 : 520;

      audioSynth.playEcgBeep(pitch, 60);
      audioIntervalRef.current = setInterval(() => {
        if (audioPreset === 'alerta') {
          audioSynth.playWarningAlert();
        } else {
          audioSynth.playEcgBeep(pitch, 60);
        }
      }, intervalMs);
    }
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  const handleSpeakAccessible = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Synthetic Text Templates
  const clinicalSummaries = {
    icc: {
      soap: `[BORRADOR DE RESUMEN CLÍNICO - PARA REVISIÓN MÉDICA OBLIGATORIA]
S: Paciente femenina de 64 años en telemonitoreo domiciliario. Refiere leve edema bimaleolar vespertino de 2 días de evolución. Niega disnea paroxística nocturna u ortopnea.
O: FC 74 bpm (ritmo regular), SpO2 97% en aire ambiente, PA 128/82 mmHg. Peso corporal: incremento de 1.2 kg en las últimas 72h según báscula conectada.
A: Insuficiencia Cardíaca Congestiva (NYHA II) con signos incipientes de retención hídrica subclínica.
P: Pendiente validación médica: Ajuste transitorio de diurético de asa (furosemida 20mg a evaluar), refuerzo de restricción hidrosalina y nueva teleconsulta de control en 48 horas.`,
      paciente: `[GUÍA DE AUTOCUIDADO COMPRENSIBLE - REVISADA POR EL EQUIPO DE SALUD]
Hola Elena,
Durante tu teleconsulta de hoy revisamos tus registros de salud. Notamos que tu peso aumentó un poco (1.2 kg) y que sientes una ligera hinchazón en los tobillos por las tardes.
Tu oxigenación y tu pulso están muy bien. Para cuidarte mejor estos días:
1. Reduce la cantidad de sal en tus comidas y evita alimentos procesados.
2. Anota tu peso todas las mañanas al levantarte antes de desayunar.
3. El médico confirmará si es necesario hacer un pequeño ajuste en tu medicamento habitual.
Si sientes falta de aire al acostarte, avísanos de inmediato a través del botón de contacto.`,
    },
    epoc: {
      soap: `[BORRADOR DE RESUMEN CLÍNICO - PARA REVISIÓN MÉDICA OBLIGATORIA]
S: Paciente masculino de 58 años con EPOC Grado II. Reporta incremento en expectoración matutina de aspecto mucopurulento y sensación de opresión torácica.
O: SpO2 91% basal en reposo (umbral basal habitual 94%), FC 88 bpm, FR 22 rpm. Curva de espirometría remota con VEF1/CVF 0.58.
A: Exacerbación moderada de EPOC probablemente infecciosa vs irritativa.
P: Pendiente confirmación facultativa: Optimización de terapia broncodilatadora inhalada con espaciador, evaluación de ciclo corto de corticoide oral y vigilancia telemétrica cada 4 horas.`,
      paciente: `[GUÍA DE AUTOCUIDADO COMPRENSIBLE - REVISADA POR EL EQUIPO DE SALUD]
Estimado Carlos,
En la videollamada de hoy observamos que tu oxigenación bajó un poco (91%) y tienes mayor mucosidad.
Recomendaciones inmediatas:
1. Utiliza tu inhalador de rescate exactamente como te indicó el especialista.
2. Mantén reposo relativo en un ambiente libre de humo o frío intenso.
3. Bebe suficiente agua tibia durante el día para facilitar la expulsión de flemas.
Tu médico te llamará nuevamente esta tarde para corroborar cómo responde tu respiración.`,
    },
    diabetes: {
      soap: `[BORRADOR DE RESUMEN CLÍNICO - PARA REVISIÓN MÉDICA OBLIGATORIA]
S: Paciente de 41 años con DM2 en tratamiento con metformina. Sin síntomas de hipoglucemia.
O: Monitor continuo de glucosa (CGM): Tiempo en Rango (TIR 70-180 mg/dL) del 84% en los últimos 14 días. GMI estimada 6.6%. Presión arterial domiciliaria 118/76 mmHg.
A: Control glucémico excelente con muy baja variabilidad nocturna.
P: Mantener pauta farmacológica actual, felicitar por hábitos dietéticos y programar teleconsulta semestral con perfil lipídico.`,
      paciente: `[GUÍA DE AUTOCUIDADO COMPRENSIBLE - REVISADA POR EL EQUIPO DE SALUD]
¡Hola Sofía!
Tus niveles de glucosa de las últimas dos semanas han estado excelentes: el 84% del tiempo tus valores estuvieron dentro del objetivo saludable.
1. Continúa con tu alimentación equilibrada y tus caminatas diarias.
2. Mantén tu dosis habitual de metformina.
¡Felicitaciones por tu constancia en el cuidado de tu salud!`,
    },
  };

  return (
    <section id="ia-generativa" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Módulo Didáctico 05 · IA Generativa Local en Salud</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Modelos Generativos y Multimodales en Telesalud
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Demostración interactiva de las cuatro modalidades de síntesis (texto clínico estructurado, espectrograma visual, estándares de código FHIR y acústica de telemetría). Todos los ejemplos son procesados sintéticamente en tu navegador sin enviar datos a la red.
        </p>
      </div>

      {/* Safety & Governance Warning Banner */}
      <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Advertencias Éticas y Regulatorias para IA Generativa en Salud:</div>
          <p className="text-amber-200/90 leading-relaxed">
            1. <strong>Alucinaciones Clínicas:</strong> Los LLMs pueden inventar dosis, contraindicaciones o citas bibliográficas plausibles pero falsas.<br />
            2. <strong>Privacidad:</strong> Jamás deben introducirse nombres reales, números de documento ni historias clínicas identificables en modelos públicos.<br />
            3. <strong>Supervisión Humana Permanente:</strong> Todo reporte generado es únicamente un borrador de trabajo que requiere revisión, edición y firma médica.
          </p>
        </div>
      </div>

      {/* 4 Modes Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 mb-8 max-w-2xl overflow-x-auto">
        <button
          onClick={() => {
            setActiveMode('texto');
            audioSynth.playEcgBeep(520, 40);
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            activeMode === 'texto' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Texto (Resumen & Guía)</span>
        </button>

        <button
          onClick={() => {
            setActiveMode('imagen');
            audioSynth.playEcgBeep(560, 40);
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            activeMode === 'imagen' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>2. Espectrograma Visual</span>
        </button>

        <button
          onClick={() => {
            setActiveMode('codigo');
            audioSynth.playEcgBeep(600, 40);
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            activeMode === 'codigo' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>3. Código & FHIR</span>
        </button>

        <button
          onClick={() => {
            setActiveMode('audio');
            audioSynth.playEcgBeep(640, 40);
          }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            activeMode === 'audio' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>4. Audio & Telemetría</span>
        </button>
      </div>

      {/* Mode 1: Text Generation */}
      {activeMode === 'texto' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Caso Clínico Ficticio:</span>
              <div className="flex gap-1.5">
                {(['icc', 'epoc', 'diabetes'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCase(c)}
                    className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all ${
                      selectedCase === c
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c === 'icc' ? 'Insuficiencia Cardíaca' : c === 'epoc' ? 'EPOC Exacerbado' : 'Diabetes Tipo 2'}
                  </button>
                ))}
              </div>
            </div>

            {/* Language format toggle */}
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setTextFormat('soap')}
                className={`px-3 py-1 rounded-md transition-all ${
                  textFormat === 'soap' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Técnico (SOAP Médico)
              </button>
              <button
                onClick={() => setTextFormat('paciente')}
                className={`px-3 py-1 rounded-md transition-all ${
                  textFormat === 'paciente' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lenguaje Accesible (Paciente)
              </button>
            </div>
          </div>

          {/* Generated Text Window */}
          <div className="relative rounded-xl bg-slate-950 p-5 border border-slate-800/90 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
            {clinicalSummaries[selectedCase][textFormat]}

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={() => handleCopy(clinicalSummaries[selectedCase][textFormat])}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[11px]"
                title="Copiar texto"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Abstract Medical Image / Spectrogram */}
      {activeMode === 'imagen' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Generador Sintético de Espectrogramas de Bioseñal (PPG / Fotopletismografía)
              </h3>
              <p className="text-xs text-slate-400">
                Visualización de densidad espectral de potencia y variabilidad hemodinámica calculada en tiempo real.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <label className="flex items-center gap-2 text-slate-300">
                <span>Frecuencia:</span>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={spectrogramFreq}
                  onChange={(e) => setSpectrogramFreq(Number(e.target.value))}
                  className="accent-cyan-400 w-24 h-1 bg-slate-800 rounded"
                />
                <span className="text-cyan-400">{spectrogramFreq} Hz</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300">
                <span>Ruido:</span>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={spectrogramNoise}
                  onChange={(e) => setSpectrogramNoise(Number(e.target.value))}
                  className="accent-amber-400 w-20 h-1 bg-slate-800 rounded"
                />
                <span className="text-amber-400">{spectrogramNoise}%</span>
              </label>
            </div>
          </div>

          <div className="bg-[#090d12] p-2 rounded-xl border border-slate-800 flex justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={220}
              className="w-full h-56 rounded-lg bg-black"
            />
          </div>
          <p className="text-xs text-slate-400 font-mono text-center">
            Espectro sintético bidimensional: Eje horizontal (Tiempo en segundos) · Eje vertical (Frecuencia en Hz).
          </p>
        </div>
      )}

      {/* Mode 3: Code & FHIR JSON */}
      {activeMode === 'codigo' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>HL7 FHIR Bundle R4 (Recurso Clínico Interoperable Sintético)</span>
            </h3>
            <button
              onClick={() => handleCopy(JSON.stringify(SAMPLE_FHIR_BUNDLE, null, 2))}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copiado' : 'Copiar FHIR JSON'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 max-h-72 overflow-y-auto scrollbar-thin">
            {JSON.stringify(SAMPLE_FHIR_BUNDLE, null, 2)}
          </pre>

          <div className="pt-2 text-[11px] text-slate-400">
            Este recurso estandarizado permite enviar observaciones de pulsioximetría con codificación LOINC (59408-5) hacia cualquier repositorio de historia clínica electrónica hospitalaria (Epic, Cerner o repositorios FHIR de código abierto).
          </div>
        </div>
      )}

      {/* Mode 4: Audio & Acoustic Telemetry */}
      {activeMode === 'audio' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Síntesis Acústica de Bioseñales & Accesibilidad Auditiva</span>
              </h3>
              <p className="text-xs text-slate-400">
                Genera tonos de monitorización cardíaca sintetizados mediante la Web Audio API y voz sintética local.
              </p>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
              {(['sinusal', 'taquicardia', 'bradicardia', 'alerta'] as const).map((pr) => (
                <button
                  key={pr}
                  onClick={() => {
                    setAudioPreset(pr);
                    if (isPlayingAudio) {
                      togglePlayAudio(); // restart with new timing
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    audioPreset === pr ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pr === 'sinusal' ? 'Sinusal (72 bpm)' : pr === 'taquicardia' ? 'Taquicardia (130 bpm)' : pr === 'bradicardia' ? 'Bradicardia (48 bpm)' : 'Alerta Anómala'}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs font-mono font-bold text-white mb-1">
                  Telemetría Acústica en Vivo
                </div>
                <p className="text-xs text-slate-400">
                  Reproduce el pitido acústico característico de un monitor multiparamétrico para comprobar el ritmo cardíaco por sonido.
                </p>
              </div>
              <button
                onClick={togglePlayAudio}
                className={`w-full py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isPlayingAudio
                    ? 'bg-rose-500 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {isPlayingAudio ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Detener Sonido' : 'Iniciar Monitor Acústico'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xs font-mono font-bold text-white mb-1">
                  Locución de Telemetría Accesible (Web Speech)
                </div>
                <p className="text-xs text-slate-400">
                  Sintetiza por voz los signos vitales del paciente para personas con discapacidad visual o modo manos libres médico.
                </p>
              </div>
              <button
                onClick={() =>
                  handleSpeakAccessible(
                    'Atención de telemonitoreo: Paciente Elena Gómez. Frecuencia cardiaca 74 latidos por minuto. Saturación de oxígeno 97%. Parámetros dentro del rango esperado.'
                  )
                }
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Leer Telemetría por Voz</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
