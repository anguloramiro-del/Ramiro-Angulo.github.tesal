import React, { useState } from 'react';
import {
  Stethoscope,
  Video,
  Activity,
  Brain,
  HeartPulse,
  ShieldCheck,
  UserCheck,
  Users,
  Globe,
  Building2,
  BookOpen,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { CLINICAL_APPLICATIONS } from '../data/telehealthData';
import { ClinicalApplication } from '../types/telehealth';

export const ApplicationsSection: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('todos');

  // Additional specialties to reach full 12
  const allApplications: ClinicalApplication[] = [
    ...CLINICAL_APPLICATIONS,
    {
      id: 'app-9',
      title: 'Investigación Clínica Descentralizada (DCT)',
      category: 'Investigación',
      iconName: 'BookOpen',
      description: 'Ensayos clínicos remotos con reclutamiento virtual y recolección de biomarcadores digitales en el hogar.',
      practicalExample: 'Monitoreo de la respuesta a un nuevo fármaco antihipertensivo mediante telemetría continua 24/7 sin traslados al hospital.',
      potentialBenefit: 'Multiplica por 4 la diversidad demográfica de participantes y reduce la deserción del estudio en un 60%.',
      riskOrLimitation: 'Diferencias en modelos de smartphones de participantes pueden introducir sesgos de medición sensorial.',
      humanOversightRequirement: 'Investigadores principales y comités de ética independientes auditan periódicamente la integridad del ensayo.',
    },
    {
      id: 'app-10',
      title: 'Gestión y Optimización Hospitalaria',
      category: 'Gestión',
      iconName: 'Building2',
      description: 'Modelos predictivos de camas, tele-triaje pre-hospitalario y asignación dinámica de personal médico.',
      practicalExample: 'Previsión de saturación de salas de teleconsulta durante picos estacionales de gripe y derivación virtual asistida.',
      potentialBenefit: 'Disminución del tiempo de espera en un 35% y descongestión de servicios presenciales de urgencias.',
      riskOrLimitation: 'Sobre-optimización económica que descuide la atención humanizada en pacientes vulnerables.',
      humanOversightRequirement: 'Directores médicos y jefes de guardia determinan la capacidad operativa real y validan reasignaciones.',
    },
    {
      id: 'app-11',
      title: 'Educación Personalizada del Paciente',
      category: 'Educación',
      iconName: 'BookOpen',
      description: 'Generación de material pedagógico interactivo adaptado al nivel de alfabetización digital y salud de cada usuario.',
      practicalExample: 'Explicación interactiva animada sobre cómo medir la presión arterial en el brazo correcto y a qué hora registrarla.',
      potentialBenefit: 'Aumenta la adherencia terapéutica y empodera al paciente en el autocuidado informado de su patología.',
      riskOrLimitation: 'Información descontextualizada que cause alarma innecesaria si no se explican rangos de normalidad.',
      humanOversightRequirement: 'El equipo de enfermería y educación para la salud revisa la pertinencia del material educativo.',
    },
    {
      id: 'app-12',
      title: 'Adherencia Terapéutica y Pastilleros IoT',
      category: 'Manejo Longitudinal',
      iconName: 'ShieldCheck',
      description: 'Detección de patrones de omisión de tomas farmacológicas mediante envases conectados y notificaciones inteligentes.',
      practicalExample: 'Alerta proactiva al equipo de salud cuando un paciente hipertenso olvida tres tomas consecutivas de su medicación.',
      potentialBenefit: 'Prevención de descompensaciones agudas graves por abandono inadvertido de tratamientos crónicos.',
      riskOrLimitation: 'Pacientes que abren el pastillero pero no ingieren el comprimido (falso registro de cumplimiento).',
      humanOversightRequirement: 'Teleconsulta de enfermería para indagar causas psicosociales o efectos secundarios de la omisión.',
    },
  ];

  const domains = ['todos', 'Asistencia Directa', 'Vigilancia Continua', 'Salud Mental', 'Diagnóstico Remoto', 'Manejo Longitudinal', 'Rehabilitación', 'Gestión', 'Investigación', 'Educación'];

  const filtered = allApplications.filter((app) => {
    const matchesDomain = selectedDomain === 'todos' || app.category === selectedDomain;
    const matchesQuery =
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase()) ||
      app.practicalExample.toLowerCase().includes(search.toLowerCase());
    return matchesDomain && matchesQuery;
  });

  return (
    <section id="aplicaciones" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Stethoscope className="w-4 h-4" />
          <span>Módulo Didáctico 08 · Casos de Uso Clínico</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Aplicaciones de la IA en Telesalud
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Explora 12 áreas especializadas donde la inteligencia artificial complementa la práctica médica telemática. Cada caso detalla su beneficio medible, sus límites técnicos y la indispensabilidad del criterio médico humano.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-3xl scrollbar-none pb-1">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedDomain === dom
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {dom === 'todos' ? 'Todas las Especialidades' : dom}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar especialidad o caso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* 12 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-cyan-950/20"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                  {app.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{app.id.toUpperCase()}</span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {app.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {app.description}
              </p>

              {/* Practical Example */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1 text-xs">
                <div className="font-mono text-[10px] text-cyan-400 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Ejemplo Práctico:</span>
                </div>
                <p className="text-slate-300 italic">{app.practicalExample}</p>
              </div>

              {/* Benefit */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-0.5 text-xs">
                <div className="font-mono text-[10px] text-emerald-400 uppercase font-semibold">
                  Beneficio Potencial:
                </div>
                <p className="text-emerald-200/90">{app.potentialBenefit}</p>
              </div>
            </div>

            {/* Risk & Human role */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 space-y-2 text-[11px]">
              <div className="text-amber-400/90 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong>Límite:</strong> {app.riskOrLimitation}</span>
              </div>

              <div className="text-slate-400 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Supervisión Humana:</strong> {app.humanOversightRequirement}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
