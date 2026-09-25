import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Trash2, HelpCircle } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface CommandOutput {
  id: string;
  command: string;
  output: string;
  isError?: boolean;
}

export const InteractiveTerminal: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [outputs, setOutputs] = useState<CommandOutput[]>([
    {
      id: 'welcome',
      command: 'system.info',
      output: `================================================================
  NEXUS TELEHEALTH AI LAB • TERMINAL INTERACTIVA v2.6.0
  ENTORNO EDUCATIVO SEGURO • MOTOR HEURÍSTICO LOCAL
================================================================
  Escribe 'help' para listar todos los comandos disponibles.
  Todos los datos y lecturas son 100% sintéticos y simulados en cliente.`,
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [outputs]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    audioSynth.playEcgBeep(640, 30);

    // Update history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (trimmed === 'clear') {
      setOutputs([]);
      setInputVal('');
      return;
    }

    let response = '';
    let isError = false;

    switch (trimmed) {
      case 'help':
        response = `Comandos disponibles en Nexus Telehealth AI Lab:
  • help                : Muestra esta lista de ayuda
  • telehealth.status   : Resumen global de teleconsultas y cohortes
  • patient.monitor     : Lista de constantes vitales del paciente actual
  • vitals.stream       : Estado de ingestión de señales biométricas
  • ai.status           : Estado de inferencia y latencia de modelos
  • ml.models           : Algoritmos activos (Supervisado, K-Means, RL)
  • data.analyze        : Resumen de variabilidad temporal y artefactos
  • neural.network      : Topología de la red neuronal y pesos
  • security.scan       : Auditoría de cifrado y eventos de ciberseguridad
  • system.info         : Versión del sistema, entorno y avisos legales
  • fhir.sample         : Muestra un recurso Observation HL7 FHIR
  • clear               : Limpia la pantalla de la terminal`;
        break;

      case 'telehealth.status':
        response = `[TELEHEALTH OPERATIONAL STATUS]
  • Estado del Servicio : 100% OPERATIVO (SIMULADO)
  • Teleconsultas Hoy   : 342 realizadas | 8 en curso
  • Pacientes en RPM    : 1,480 pacientes domiciliarios conectados
  • Alertas Preventivas : 14 generadas | 3 pendientes de triaje
  • Tiempo Medio Resp.  : 4.2 minutos`;
        break;

      case 'patient.monitor':
        response = `[TELEMETRÍA EN VIVO · PACIENTE P-8012]
  • Identificador       : Elena Gómez (Ficticia · 64a)
  • Condición Base      : Insuficiencia Cardíaca Congestiva (NYHA II)
  • Frecuencia Cardiaca : 74 bpm [RITMO SINUSAL NORMAL]
  • Saturación SpO2     : 97 % [NORMOXEMIA]
  • Temperatura Corp.   : 36.6 °C [NORMOTERMIA]
  • Presión Arterial    : 128/82 mmHg
  • Riesgo 24h Est.     : 32% (Patrón Compensado)`;
        break;

      case 'vitals.stream':
        response = `[INGESTIÓN DE BIOSEÑALES MULTICANAL]
  • Canal 01 (ECG DII)  : 250 Hz | Formato IEE-11073 | Cero pérdida de paquetes
  • Canal 02 (PPG/SpO2) : 50 Hz  | Filtro paso-banda 0.5-4 Hz activo
  • Canal 03 (Presión)  : Modo oscilométrico domiciliario (Última: 10:42)
  • Latencia de Tránsito: 12 ms (vía WebSockets / TLS 1.3)`;
        break;

      case 'ai.status':
        response = `[MOTOR DE INFERENCIA DE IA CLÍNICA]
  • Modelo Clasificador : Random Forest Calibrado + Red MLP 3-Capas
  • Exactitud Global    : 96.8% (en cohorte sintética de validación)
  • Sensibilidad (Risk) : 94.2%
  • Especificidad       : 97.1%
  • Supervisión Humana  : REQUERIDA EN EL 100% DE LAS ALERTAS CRÍTICAS`;
        break;

      case 'ml.models':
        response = `[CATÁLOGO DE MODELOS EN TELEMEDICINA]
  1. RF-Triage-v2       : Clasificación de prioridad de videoconsulta (Supervisado)
  2. K-Means-Phenotype  : Agrupación de perfiles de adherencia glucémica (K=3)
  3. IsolationForest-04 : Detección de derivas anómalas en ECG móvil
  4. Clinical-NLP-Lite  : Extracción de términos SNOMED desde anamnesis`;
        break;

      case 'data.analyze':
        response = `[ANÁLISIS ESTADÍSTICO DE BIODATOS]
  • Muestras Analizadas : 84,620,000 puntos de datos sintéticos
  • Tasa de Imputación  : 1.2% (paquetes reconstituidos por spline cúbico)
  • Detección Artefactos: 4.8% de señales descartadas por ruido de movimiento
  • Incertidumbre 95% CI: Registrada y visualizada en consola`;
        break;

      case 'neural.network':
        response = `[ESTADO DE LA RED NEURONAL MULTICAPA]
  • Capa Entrada        : 5 neuronas (FC, SpO2, Temp, FR, Actigrafía)
  • Capas Ocultas       : 2 capas densas con 4 neuronas cada una
  • Función Activación  : ReLU
  • Capa Salida         : Softmax (Estable: 68% | Revisión: 22% | Alerta: 10%)
  • Aviso Terminología  : Categorización orientativa · No diagnóstica`;
        break;

      case 'security.scan':
        response = `[ESCÁNER DE CIBERSEGURIDAD CLÍNICA ZERO TRUST]
  • Certificados TLS    : Válidos X.509 (mTLS para gateways IoT)
  • Cifrado WebRTC      : DTLS 1.2 + SRTP (AES_CM_128_HMAC_SHA1_80)
  • Spoofing Sensor Check: 1 intento aislado en cuarentena (ID: SEC-303)
  • Cumplimiento HIPAA  : Datos anonimizados antes del almacenamiento`;
        break;

      case 'system.info':
        response = `================================================================
  NEXUS TELEHEALTH AI LAB
  Plataforma Educativa sobre IA y Ciencia de Datos en Salud
  Versión: 2.6.0 • Año: 2026
  Aviso: Proyecto educativo de divulgación técnica.
  No realiza diagnósticos ni sustituye la valoración médica.
================================================================`;
        break;

      case 'fhir.sample':
        response = `HL7 FHIR R4 Observation Snippet:
{
  "resourceType": "Observation",
  "id": "obs-telehealth-demo",
  "status": "final",
  "code": { "coding": [{ "system": "http://loinc.org", "code": "59408-5", "display": "SpO2" }] },
  "valueQuantity": { "value": 97, "unit": "%" }
}`;
        break;

      default:
        response = `Comando no reconocido: '${trimmed}'. Escribe 'help' para ver los comandos válidos.`;
        isError = true;
        break;
    }

    setOutputs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        command: cmd,
        output: response,
        isError,
      },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <section id="terminal" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <TerminalIcon className="w-4 h-4" />
          <span>Módulo Didáctico 11 · Consola CLI Simulada</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Terminal Interactiva de Telesalud
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Consulta estados de telemetría, inspecciona hiperparámetros de modelos y ejecuta auditorías de seguridad a través de la interfaz de línea de comandos. 100% simulada y confinada localmente en tu navegador.
        </p>
      </div>

      {/* Quick Clickable Commands */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-mono text-slate-500">Comandos rápidos:</span>
        {[
          'help',
          'telehealth.status',
          'patient.monitor',
          'vitals.stream',
          'ai.status',
          'neural.network',
          'security.scan',
          'fhir.sample',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300 text-slate-300 font-mono text-xs transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Box */}
      <div className="rounded-2xl bg-[#070a0f] border border-cyan-500/30 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 text-xs ml-2 font-mono">
              nexus-telehealth@ai-lab:~ (CLI Simulada)
            </span>
          </div>
          <button
            onClick={() => setOutputs([])}
            className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 transition-colors"
            title="Limpiar terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-5 max-h-[460px] overflow-y-auto space-y-4">
          {outputs.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <span className="text-emerald-400">nexus-telehealth@ai-lab:~$</span>
                <span>{item.command}</span>
              </div>
              <pre
                className={`whitespace-pre-wrap leading-relaxed ${
                  item.isError ? 'text-rose-400' : 'text-slate-300'
                }`}
              >
                {item.output}
              </pre>
            </div>
          ))}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 text-cyan-400 font-bold pt-2">
            <span className="text-emerald-400 shrink-0">nexus-telehealth@ai-lab:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un comando (ej: help, telehealth.status)..."
              className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono text-xs"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={() => executeCommand(inputVal)}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Ejecutar comando"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </section>
  );
};
