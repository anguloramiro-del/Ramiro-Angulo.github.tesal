import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Heart,
  Pause,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  User,
  ShieldCheck,
  Radio,
  CheckCheck,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';
import { INITIAL_PATIENTS, INITIAL_ALERTS } from '../data/telehealthData';
import { SimulatedPatient, TelehealthAlert } from '../types/telehealth';

export const TelehealthDashboard: React.FC = () => {
  const [patients, setPatients] = useState<SimulatedPatient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<TelehealthAlert[]>(INITIAL_ALERTS);
  const [selectedPatient, setSelectedPatient] = useState<SimulatedPatient>(INITIAL_PATIENTS[0]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<'1h' | '24h' | '7d'>('24h');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('todos');

  // Running ECG Canvas Ref
  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live real-time ECG sweep effect
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let x = 0;
    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;

    // Draw grid background once
    const drawGrid = () => {
      ctx.fillStyle = '#070a0f';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let j = 0; j < h; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
      }
    };

    drawGrid();

    let beatPhase = 0;

    const render = () => {
      if (!isStreaming) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Erase ahead bar (scanner bar effect)
      ctx.fillStyle = '#070a0f';
      ctx.fillRect(x, 0, 15, h);

      // Redraw subtle grid lines in cleared slice
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.beginPath();
      for (let j = 0; j < h; j += 20) {
        ctx.moveTo(x, j);
        ctx.lineTo(Math.min(x + 15, w), j);
      }
      ctx.stroke();

      // QRS waveform calculation
      let y = midY;
      const beatRate = (selectedPatient.heartRate / 60) * 0.08;
      beatPhase = (beatPhase + beatRate) % 1;

      if (beatPhase > 0.35 && beatPhase < 0.4) {
        // P wave
        y = midY - 6;
      } else if (beatPhase > 0.44 && beatPhase < 0.47) {
        // Q dip
        y = midY + 5;
      } else if (beatPhase >= 0.47 && beatPhase <= 0.52) {
        // R peak
        y = midY - 38;
      } else if (beatPhase > 0.52 && beatPhase < 0.55) {
        // S dip
        y = midY + 18;
      } else if (beatPhase > 0.62 && beatPhase < 0.72) {
        // T wave
        y = midY - 10;
      }

      // Draw active stroke point
      ctx.fillStyle = selectedPatient.status === 'alerta' ? '#ef4444' : '#06b6d4';
      ctx.shadowColor = selectedPatient.status === 'alerta' ? '#ef4444' : '#06b6d4';
      ctx.shadowBlur = 4;
      ctx.fillRect(x, y, 2.5, 2.5);
      ctx.shadowBlur = 0;

      x = (x + 2) % w;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isStreaming, selectedPatient]);

  // Periodic random vital updates when streaming
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setPatients((prev) =>
        prev.map((p) => {
          const hrDelta = Math.floor(Math.random() * 3 - 1);
          const spo2Delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          return {
            ...p,
            heartRate: Math.max(55, Math.min(135, p.heartRate + hrDelta)),
            spo2: Math.max(88, Math.min(100, p.spo2 + spo2Delta)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleSelectPatient = (patient: SimulatedPatient) => {
    setSelectedPatient(patient);
    audioSynth.playEcgBeep(patient.heartRate > 100 ? 680 : 520, 60);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'revisado' } : a))
    );
    audioSynth.playHarmonicChord('stable');
  };

  const handleReset = () => {
    setPatients(INITIAL_PATIENTS);
    setAlerts(INITIAL_ALERTS);
    setSelectedPatient(INITIAL_PATIENTS[0]);
    setIsStreaming(true);
    audioSynth.playEcgBeep(520, 60);
  };

  const pendingAlertsCount = alerts.filter((a) => a.status === 'pendiente').length;

  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Centro de Operaciones Telemétricas · En Vivo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Dashboard de Telesalud
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Supervisión simultánea de cohorte en telemonitoreo domiciliario, flujo de alertas tempranas y osciloscopio en tiempo real.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Stream Play/Pause */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              isStreaming
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'Pausar Telemetría' : 'Reanudar Stream'}</span>
          </button>

          {/* Time Filter */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            {(['1h', '24h', '7d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  timeFilter === t
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Restablecer simulación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7 KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">Consultas Hoy</div>
          <div className="text-xl font-bold text-white tabular-nums mt-0.5">342</div>
          <div className="text-[10px] text-cyan-400">↑ +8% estimado</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">Pacientes RPM</div>
          <div className="text-xl font-bold text-cyan-400 tabular-nums mt-0.5">1,480</div>
          <div className="text-[10px] text-slate-400">Activos 24/7</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">Señales / seg</div>
          <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">4,280</div>
          <div className="text-[10px] text-slate-400">Latencia &lt; 15ms</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">Alertas Totales</div>
          <div className="text-xl font-bold text-amber-400 tabular-nums mt-0.5">{alerts.length}</div>
          <div className="text-[10px] text-slate-400">Hoy acumuladas</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">Pendientes</div>
          <div className={`text-xl font-bold tabular-nums mt-0.5 ${pendingAlertsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {pendingAlertsCount}
          </div>
          <div className="text-[10px] text-slate-400">Requieren triaje</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">T. Respuesta</div>
          <div className="text-xl font-bold text-teal-300 tabular-nums mt-0.5">4.2 min</div>
          <div className="text-[10px] text-slate-400">Promedio médico</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono col-span-2 sm:col-span-1">
          <div className="text-[10px] text-slate-400 uppercase">Precisión IA</div>
          <div className="text-xl font-bold text-cyan-300 tabular-nums mt-0.5">96.8%</div>
          <div className="text-[10px] text-slate-400">Validada sintética</div>
        </div>
      </div>

      {/* Main Monitoring Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Real-Time Oscilloscope + Selected Patient Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          {/* Running Oscilloscope */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                <div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase">
                    OSCILOSCOPIO ECG EN VIVO · DERIVACIÓN DII
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Paciente activo: {selectedPatient.name} ({selectedPatient.condition})
                  </p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-cyan-400 font-bold">
                  {selectedPatient.heartRate} BPM
                </span>
                <span className="text-[10px] text-slate-400 block">
                  SpO2: {selectedPatient.spo2}%
                </span>
              </div>
            </div>

            {/* Canvas Screen */}
            <div className="relative rounded-xl overflow-hidden border border-cyan-500/20 shadow-inner">
              <canvas
                ref={ecgCanvasRef}
                width={560}
                height={150}
                className="w-full h-36 bg-[#070a0f]"
              />
              <div className="absolute bottom-2 left-3 text-[9px] font-mono text-cyan-400/60 flex gap-3">
                <span>25 mm/s</span>
                <span>10 mm/mV</span>
                <span>FILTRO: 0.05-150Hz</span>
              </div>
            </div>

            {/* Quick Vitals Summary of Selected Patient */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono pt-1">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase">Presión Art.</div>
                <div className="text-sm font-bold text-slate-200">
                  {selectedPatient.systolicBP}/{selectedPatient.diastolicBP}
                </div>
                <div className="text-[9px] text-slate-500">mmHg</div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase">Temp Corp</div>
                <div className="text-sm font-bold text-slate-200">
                  {selectedPatient.temp.toFixed(1)} °C
                </div>
                <div className="text-[9px] text-slate-500">Normotérmico</div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase">Frec. Resp.</div>
                <div className="text-sm font-bold text-slate-200">
                  {selectedPatient.respiratoryRate} rpm
                </div>
                <div className="text-[9px] text-slate-500">Eupneico</div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase">Riesgo IA</div>
                <div className={`text-sm font-bold ${selectedPatient.riskScore > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {selectedPatient.riskScore}%
                </div>
                <div className="text-[9px] text-slate-500">Score 24h</div>
              </div>
            </div>
          </div>

          {/* Interactive Cohort Table */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Cohorte en Monitoreo Domiciliario (Haz clic para seleccionar)</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {patients.length} Pacientes Ficticios
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="py-2 px-2">PACIENTE</th>
                    <th className="py-2 px-2">CONDICIÓN</th>
                    <th className="py-2 px-2">FC</th>
                    <th className="py-2 px-2">SpO2</th>
                    <th className="py-2 px-2">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {patients.map((p) => {
                    const isCurrent = selectedPatient.id === p.id;
                    return (
                      <tr
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className={`cursor-pointer transition-colors ${
                          isCurrent
                            ? 'bg-cyan-950/40 text-cyan-200'
                            : 'hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <td className="py-2 px-2 font-bold whitespace-nowrap">
                          {p.name}
                        </td>
                        <td className="py-2 px-2 text-[11px] text-slate-400 truncate max-w-[140px]">
                          {p.condition}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap font-bold text-cyan-400">
                          {p.heartRate} bpm
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          <span className={p.spo2 < 93 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                            {p.spo2}%
                          </span>
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          {p.status === 'alerta' ? (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px]">
                              Alerta Activa
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                              Estable
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Clinical Alert Stream & Teleconsultation Distribution */}
        <div className="lg:col-span-5 space-y-6">
          {/* Alert Stream Feed */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase">
                  Bandeja de Tele-Triaje Prioritario
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                {pendingAlertsCount} Pendientes
              </span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                    al.severity === 'critical'
                      ? 'bg-rose-950/30 border-rose-500/40'
                      : 'bg-amber-950/30 border-amber-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white">
                      {al.patientName} ({al.patientId})
                    </span>
                    <span className="text-[10px] text-slate-400">{al.timestamp}</span>
                  </div>

                  <div className="mt-1 text-slate-300">
                    <span className="text-cyan-400 font-semibold">{al.metric}:</span> {al.value} (Umbral: {al.threshold})
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 italic">
                    Acción recomendada: {al.recommendedAction}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Confianza IA: {al.aiConfidence}%
                    </span>

                    {al.status === 'pendiente' ? (
                      <button
                        onClick={() => handleAcknowledgeAlert(al.id)}
                        className="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Validar & Revisar</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" />
                        Revisada por Médico
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specialty Service Distribution Bar Chart */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase">
              Distribución de Teleconsultas por Especialidad (24h)
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {[
                { spec: 'Cardiología & RPM', count: 112, pct: 32, color: 'bg-cyan-500' },
                { spec: 'Neumología & EPOC', count: 84, pct: 24, color: 'bg-emerald-500' },
                { spec: 'Salud Mental & Psiquiatría', count: 68, pct: 20, color: 'bg-teal-400' },
                { spec: 'Endocrinología & CGM', count: 52, pct: 15, color: 'bg-amber-400' },
                { spec: 'Medicina General / Triaje', count: 26, pct: 9, color: 'bg-slate-500' },
              ].map((item) => (
                <div key={item.spec} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>{item.spec}</span>
                    <span className="text-slate-400">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
