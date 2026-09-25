import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Wifi,
  Cpu,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  ShieldAlert,
  Server,
  Radio,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';
import { INITIAL_SECURITY_EVENTS } from '../data/telehealthData';
import { SecurityEvent } from '../types/telehealth';

export const CybersecuritySection: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>(INITIAL_SECURITY_EVENTS);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [simulatedAttackRunning, setSimulatedAttackRunning] = useState<boolean>(false);

  const securityPipeline = [
    { title: 'DISPOSITIVO IOT', desc: 'Wearable domiciliario o monitor biométrico.', icon: Radio },
    { title: 'RED SEGURA', desc: 'Canal cifrado TLS 1.3 & DTLS-SRTP.', icon: Lock },
    { title: 'ANÁLISIS IA', desc: 'Modelos de entropía y detección de tráfico anómalo.', icon: Cpu },
    { title: 'DETECCIÓN', desc: 'Identificación de spoofing o intento de intrusión.', icon: AlertTriangle },
    { title: 'ALERTA', desc: 'Aislamiento inmediato del paquete sospechoso.', icon: ShieldAlert },
    { title: 'REVISIÓN CISO', desc: 'Auditoría humana forense por el equipo de seguridad.', icon: UserCheck },
  ];

  const handleSimulateThreat = (type: 'spoofing' | 'mitm') => {
    setSimulatedAttackRunning(true);
    audioSynth.playWarningAlert();

    const newEvent: SecurityEvent = {
      id: `SEC-${Math.floor(400 + Math.random() * 500)}`,
      timestamp: new Date().toLocaleTimeString(),
      source: type === 'spoofing' ? 'Sensor-Biosignal-SpO2-Fake' : 'Proxy Intermedio No Autorizado',
      target: type === 'spoofing' ? 'Nexus-Telemetry-Gateway' : 'WebRTC Media Gateway',
      protocol: type === 'spoofing' ? 'BLE Spoofed' : 'TLS Intercept Attempt',
      eventType: type === 'spoofing' ? 'SENSOR_SPOOFING' : 'INTENTO_INTRUSION',
      severity: 'alta',
      description:
        type === 'spoofing'
          ? 'Intento de inyección de lecturas sintéticas falsas en la telemetría del paciente.'
          : 'Divergencia en firma criptográfica de certificado TLS durante videoconsulta.',
      actionTaken: 'Aislamiento inmediato en sandbox virtual. Alerta escalada a Oficial de Seguridad CISO.',
    };

    setTimeout(() => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
      setSimulatedAttackRunning(false);
      audioSynth.playEcgBeep(720, 80);
    }, 600);
  };

  return (
    <section id="ciberseguridad" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Módulo Didáctico 07 · Ciberseguridad Clínica & Privacidad</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Ciberseguridad y Protección de Datos Sanitarios
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          La telemedicina conecta dispositivos médicos domésticos a través de redes públicas. Aprende cómo la Inteligencia Artificial supervisa la integridad criptográfica, detecta sensores falsificados y protege la confidencialidad clínica (HIPAA/GDPR).
        </p>
      </div>

      {/* Animated Visual Pipeline Flow */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 mb-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Flujo Defensivo de Telemetría Clínica de Extremo a Extremo</span>
          </h3>
          <span className="text-[11px] font-mono text-cyan-400">
            ARQUITECTURA ZERO TRUST
          </span>
        </div>

        {/* 6 Step Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {securityPipeline.map((step, idx) => {
            const Icon = step.icon;
            const isHighlighted = simulatedAttackRunning ? idx >= 2 : true;
            return (
              <div
                key={step.title}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                  </div>
                  <div className="text-xs font-bold text-white font-mono">{step.title}</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Operations Center (SOC) Simulated Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): System Security Health & Threat Injector */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Estado del Perímetro Criptográfico</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              NOMINAL
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-bold">Cifrado en Tránsito</div>
                <div className="text-[10px] text-slate-400">TLS 1.3 / ChaCha20-Poly1305</div>
              </div>
              <span className="text-emerald-400 font-bold">100% ACTIVO</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-bold">Autenticación de Dispositivos</div>
                <div className="text-[10px] text-slate-400">Certificados Mutuos mTLS X.509</div>
              </div>
              <span className="text-cyan-400 font-bold">VERIFICADO</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-bold">Anonimización Pre-Almacenamiento</div>
                <div className="text-[10px] text-slate-400">Desidentificación de Safe Harbor (HIPAA)</div>
              </div>
              <span className="text-teal-400 font-bold">CERO PII EXPUESTA</span>
            </div>
          </div>

          {/* Interactive Simulated Threat Injector */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase">
              Simulador de Ciberataque Clínico (Entorno de Pruebas Seguro)
            </div>
            <p className="text-[11px] text-slate-400">
              Inyecta un evento malicioso ficticio para comprobar cómo el motor de IA defensivo bloquea y audita la amenaza sin afectar la teleconsulta.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleSimulateThreat('spoofing')}
                disabled={simulatedAttackRunning}
                className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simular Sensor Spoofing</span>
              </button>

              <button
                onClick={() => handleSimulateThreat('mitm')}
                disabled={simulatedAttackRunning}
                className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Simular Ataque MitM</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right (7 cols): Real-Time Audit Log Feed */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Registro de Auditoría de Ciberseguridad (SIEM Clínico)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {events.length} Eventos Registrados
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {events.map((ev) => (
              <div
                key={ev.id}
                className={`p-3.5 rounded-xl border font-mono text-xs transition-all ${
                  ev.severity === 'alta'
                    ? 'bg-rose-950/40 border-rose-500/40'
                    : ev.severity === 'media'
                    ? 'bg-amber-950/30 border-amber-500/40'
                    : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-cyan-400">{ev.id} · {ev.eventType}</span>
                  <span className="text-slate-400">{ev.timestamp}</span>
                </div>

                <div className="text-slate-200 mt-1 font-sans text-xs">
                  {ev.description}
                </div>

                <div className="mt-2 text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Origen: <strong className="text-slate-300">{ev.source}</strong></span>
                  <span>Protocolo: <strong className="text-slate-300">{ev.protocol}</strong></span>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Acción: {ev.actionTaken}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
            <strong>Garantía de Seguridad:</strong> Todos los eventos son simulados internamente en el navegador. La plataforma no realiza escaneos de red externa ni accede a sockets de tu sistema operativo.
          </div>
        </div>
      </div>
    </section>
  );
};
