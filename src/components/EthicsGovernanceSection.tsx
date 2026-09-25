import React, { useState } from 'react';
import {
  Scale,
  Shield,
  Eye,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  HeartHandshake,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { ETHICAL_TOPICS } from '../data/telehealthData';
import { EthicalTopic } from '../types/telehealth';

export const EthicsGovernanceSection: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<EthicalTopic>(ETHICAL_TOPICS[0]);

  return (
    <section id="etica" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Módulo Didáctico 10 · Bioética & Marco Jurídico</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Ética, Privacidad y Gobernanza en Salud Digital
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          La adopción de algoritmos en telemedicina no es solo un desafío informático, sino un compromiso ético con la dignidad humana, la no discriminación algorítmica y la responsabilidad indelegable del acto médico.
        </p>
      </div>

      {/* Main Grid: Topic Selector List + Detailed Balanced Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (5 cols): List of topics */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Matriz de Responsabilidad Clínica
          </div>
          {ETHICAL_TOPICS.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-950/30'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                    {topic.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {topic.id.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {topic.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right (7 cols): Deep-Dive Balanced Matrix Card */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                DIMENSIÓN ÉTICA · {selectedTopic.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {selectedTopic.title}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Risk */}
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
              <div className="font-mono text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Riesgo o Daño Potencial:</span>
              </div>
              <p className="text-rose-200/90 leading-relaxed">
                {selectedTopic.riskDescription}
              </p>
            </div>

            {/* Practical Example Case */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="font-mono text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Caso Clínico / Escenario de Estudio:</span>
              </div>
              <p className="text-slate-300 leading-relaxed italic">
                "{selectedTopic.clinicalCaseExample}"
              </p>
            </div>

            {/* Technical Measure */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
              <div className="font-mono text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Medida Preventiva Algorítmica y Técnica:</span>
              </div>
              <p className="text-emerald-200/90 leading-relaxed">
                {selectedTopic.technicalPreventativeMeasure}
              </p>
            </div>

            {/* Human Responsible Role */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
              <div className="font-mono text-xs font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>Responsable Humano Indelegable:</span>
              </div>
              <p className="text-cyan-200 leading-relaxed font-medium">
                {selectedTopic.humanResponsibleRole}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Declaración de Helsinki & Directrices OMS sobre IA en Salud</span>
            <span className="text-slate-400">Auditoría Permanente 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};
