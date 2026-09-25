import React, { useState } from 'react';
import {
  Brain,
  Eye,
  FileText,
  Activity,
  UserCheck,
  Cpu,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Search,
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface TopicCard {
  id: string;
  icon: React.ElementType;
  title: string;
  category: string;
  shortDesc: string;
  explanation: string;
  telehealthExample: string;
  limitation: string;
  humanRole: string;
}

export const AiInHealthSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModal, setActiveModal] = useState<TopicCard | null>(null);

  const topics: TopicCard[] = [
    {
      id: 'cdss',
      icon: Cpu,
      title: 'Sistemas de Soporte a Decisiones Clínicas (CDSS)',
      category: 'Decisión Clínica',
      shortDesc: 'Algoritmos probabilísticos para alertar sobre interacciones, riesgos y pautas de tratamiento.',
      explanation: 'Los CDSS combinan bases de conocimiento médico codificadas con modelos predictivos para cruzar antecedentes del paciente, alergias y constantes vitales durante la teleconsulta.',
      telehealthExample: 'Durante una consulta telemédica, el sistema sugiere verificar la función renal antes de prescribir un antihipertensivo en un paciente con diabetes y edad avanzada.',
      limitation: 'Riesgo de sesgo de automatización o fatiga de alarmas si las alertas no están calibradas al contexto del paciente.',
      humanRole: 'El médico evalúa la sugerencia en el contexto integral de la persona y decide soberanamente si la adopta o rechaza.',
    },
    {
      id: 'nlp',
      icon: FileText,
      title: 'Procesamiento de Lenguaje Clínico (NLP)',
      category: 'Lenguaje & Datos',
      shortDesc: 'Extracción de entidades médicas, codificación SNOMED/CIE-10 y estructuración de notas.',
      explanation: 'Transforma el diálogo natural grabado (con consentimiento) durante una videoconsulta en un resumen estructurado bajo el formato SOAP (Subjetivo, Objetivo, Análisis, Plan).',
      telehealthExample: 'Generación automática de un borrador de informe de teleconsulta que lista síntomas descritos por el paciente y medicamentos actuales para revisión del médico.',
      limitation: 'Sensibilidad a modismos regionales, errores de audio en conexiones inestables y posibilidad de alucinaciones en modelos generativos.',
      humanRole: 'El facultativo debe leer, editar y rubricar formalmente cada palabra del registro antes de incorporarlo a la historia clínica.',
    },
    {
      id: 'vision',
      icon: Eye,
      title: 'Visión Computarizada en Telemedicina',
      category: 'Diagnóstico Visual',
      shortDesc: 'Análisis de imágenes fotográficas dérmicas, lesiones cutáneas y postura biomecánica.',
      explanation: 'Redes neuronales convolucionales (CNN) entrenadas con dermatoscopía o fotos clínicas para pre-clasificar lesiones melanocíticas o valorar la cicatrización de heridas quirúrgicas.',
      telehealthExample: 'El paciente envía una fotografía de una lesión dérmica antes de la videollamada; el modelo pre-clasifica la simetría y bordes para orientar la prioridad del triaje.',
      limitation: 'Alta variabilidad según calidad de iluminación, enfoque de cámara de celular y calibración de color.',
      humanRole: 'El dermatólogo realiza la anamnesis completa y solicita biopsia o consulta presencial cuando existe duda clínica.',
    },
    {
      id: 'rpm',
      icon: Activity,
      title: 'Monitoreo Remoto Inteligente (RPM)',
      category: 'Telemetría',
      shortDesc: 'Fusión de bioseñales procedentes de wearables y sensores médicos domiciliarios.',
      explanation: 'Procesamiento continuo de series temporales (frecuencia cardiaca, SpO2, glucemia, presión arterial) para detectar desviaciones respecto a la línea base individual del paciente.',
      telehealthExample: 'Detección de una ganancia progresiva de 2 kg en 48 horas en un paciente con insuficiencia cardíaca, advirtiendo retención de líquidos antes de disnea grave.',
      limitation: 'Artefactos de desconexión del sensor o lecturas espurias por mala colocación del manguito de presión.',
      humanRole: 'Enfermería de telemonitoreo contacta al paciente para corroborar la medición y ajustar diuréticos según protocolo médico.',
    },
    {
      id: 'agents',
      icon: Brain,
      title: 'Agentes para Coordinación y Triaje',
      category: 'Gestión',
      shortDesc: 'Orquestación de flujos pre y post consulta, recordatorios y escalado asistencial.',
      explanation: 'Sistemas conversacionales guiados por árboles clínicos validados que recogen síntomas previos, verifican signos vitales y agendan teleconsultas según urgencia.',
      telehealthExample: 'Un asistente virtual recopila el motivo de consulta respiratoria y, al detectar signos de alarma (estridor o disnea súbita), deriva de inmediato a la central de urgencias.',
      limitation: 'Incapacidad de percibir matices emocionales sutiles o signos de gravedad no expresados verbalmente por el usuario.',
      humanRole: 'Supervisión constante por personal de enfermería en cabina de tele-triaje con capacidad de intervención inmediata.',
    },
    {
      id: 'hitl',
      icon: UserCheck,
      title: 'Supervisión Humana Permanente (Human-in-the-Loop)',
      category: 'Gobernanza',
      shortDesc: 'Principio ético y legal que sitúa al profesional de la salud como decisor indelegable.',
      explanation: 'La IA actúa exclusivamente como asistente cognitivo ("segundo lector"), requiriendo siempre la validación explícita de un profesional calificado para cualquier acción diagnóstica o terapéutica.',
      telehealthExample: 'Ninguna receta médica, orden de laboratorio ni plan de egreso se emite sin la firma digital y consentimiento explícito del médico tratante.',
      limitation: 'Puede ralentizar procesos si la interfaz de validación no es ergonómica o induce fatiga en el profesional.',
      humanRole: 'El médico asume la responsabilidad ética y legal última, protegiendo los derechos y la salud integral del paciente.',
    },
    {
      id: 'weak-vs-gen',
      icon: Layers,
      title: 'IA Estrecha vs IA Generativa en Salud',
      category: 'Fundamentos',
      shortDesc: 'Diferencias críticas entre modelos clasificadores específicos y modelos de lenguaje fundacionales.',
      explanation: 'La IA estrecha (clasificadores de ECG, regresiones de riesgo) resuelve tareas delimitadas con alta reproducibilidad. La IA generativa (LLMs) sintetiza lenguaje o imágenes pero requiere filtros rigurosos de veracidad.',
      telehealthExample: 'Se utiliza un modelo supervisado determinista para calcular el riesgo cardiovascular (Score Framingham calibrado) y un LLM para redactar un folleto explicativo en lenguaje accesible.',
      limitation: 'Peligro de utilizar modelos generativos de caja negra para tareas que exigen determinismo probabilístico comprobado.',
      humanRole: 'Ingenieros biomédicos y clínicos definen cuál arquitectura algorítmica es adecuada y segura para cada necesidad.',
    },
    {
      id: 'evolution',
      icon: Clock,
      title: 'Evolución Histórica de la Telesalud',
      category: 'Fundamentos',
      shortDesc: 'Del telégrafo y la radio a las redes neuronales distribuidas y el estándar FHIR.',
      explanation: 'La telemedicina transitó de la transmisión básica de voz en el siglo XX a la era digital de videollamadas, y hoy a la telesalud 4.0 impulsada por gemelos digitales, biosensores e interoperabilidad en la nube.',
      telehealthExample: 'Evolución de un registro en papel que tardaba semanas en enviarse a un repositorio FHIR en tiempo real con análisis federado entre hospitales.',
      limitation: 'Fragmentación de sistemas heredados (legacy) en hospitales que dificulta la adopción de arquitecturas modernas.',
      humanRole: 'Equipos multidisciplinarios (informáticos médicos, directores de hospital) que lideran la transformación digital ética.',
    },
  ];

  const categories = ['todos', 'Decisión Clínica', 'Lenguaje & Datos', 'Diagnóstico Visual', 'Telemetría', 'Gestión', 'Fundamentos', 'Gobernanza'];

  const filteredTopics = topics.filter((topic) => {
    const matchesCat = selectedCategory === 'todos' || topic.category === selectedCategory;
    const matchesQuery =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.telehealthExample.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const openModal = (topic: TopicCard) => {
    audioSynth.playEcgBeep(640, 40);
    setActiveModal(topic);
  };

  return (
    <section id="ia-salud" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Section Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Brain className="w-4 h-4" />
          <span>Módulo Didáctico 01 · Fundamentos y Paradigmas</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Inteligencia Artificial en Telesalud
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Comprende cómo los algoritmos de aprendizaje automático, procesamiento de señales y modelos de lenguaje se integran en el flujo de atención a distancia, identificando siempre sus fortalezas, limitaciones y la supervisión médica requerida.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat === 'todos' ? 'Todos los Temas' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar concepto o ejemplo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Grid of Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const IconComp = topic.icon;
          return (
            <div
              key={topic.id}
              onClick={() => openModal(topic)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(topic);
                }
              }}
              className="group relative rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {/* Card Top */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {topic.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {topic.shortDesc}
                </p>

                {/* Telehealth Example snippet */}
                <div className="pt-2 border-t border-slate-800/70 space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Ejemplo en Telesalud:</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 italic">
                    "{topic.telehealthExample}"
                  </p>
                </div>
              </div>

              {/* Card Bottom: Precaution badge */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400/90 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[190px]">Precaución clínica requerida</span>
                </span>
                <span className="text-cyan-400 text-xs font-semibold group-hover:underline">
                  Explorar →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail View */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-2xl w-full rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <activeModal.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase">
                    {activeModal.category}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {activeModal.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-4 text-sm text-slate-300">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Explicación Conceptual
                </h4>
                <p className="leading-relaxed">{activeModal.explanation}</p>
              </div>

              <div className="bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/20 space-y-1">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Caso Práctico en Teleconsulta / RPM</span>
                </h4>
                <p className="leading-relaxed text-slate-200">
                  {activeModal.telehealthExample}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="font-semibold text-amber-300 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Limitación o Riesgo</span>
                  </div>
                  <p className="text-amber-200/90 leading-normal">
                    {activeModal.limitation}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Supervisión Humana Obligatoria</span>
                  </div>
                  <p className="text-emerald-200/90 leading-normal">
                    {activeModal.humanRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono">
                Marco de Validación Clínica · Nexus AI Lab 2026
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Cerrar Análisis
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
