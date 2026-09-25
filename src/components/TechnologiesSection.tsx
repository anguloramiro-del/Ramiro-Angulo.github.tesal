import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Code,
  Globe,
  Radio,
  Share2,
  Database,
  FileCode,
  Shield,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { SAMPLE_FHIR_BUNDLE } from '../data/telehealthData';

export const TechnologiesSection: React.FC = () => {
  const [activeFhirTab, setActiveFhirTab] = useState<'patient' | 'observation' | 'encounter'>('observation');

  const techStack = [
    {
      category: 'Ciencia de Datos & IA',
      icon: Cpu,
      items: [
        { name: 'Python & Jupyter', desc: 'Lenguaje estándar para experimentación y modelado de datos biomédicos.' },
        { name: 'PyTorch & TensorFlow', desc: 'Entrenamiento de redes neuronales convolucionales y recurrentes.' },
        { name: 'Scikit-Learn', desc: 'Clasificadores de riesgo, regresiones logísticas y árboles de decisión.' },
        { name: 'Pandas & NumPy', desc: 'Procesamiento de series temporales de bioseñales a escala de milisegundos.' },
      ],
    },
    {
      category: 'Interoperabilidad Clínica',
      icon: Share2,
      items: [
        { name: 'HL7 FHIR (R4 / R5)', desc: 'Estándar global basado en JSON/REST para intercambio de historias clínicas.' },
        { name: 'DICOM Web (WADO-RS)', desc: 'Visualización y transmisión de estudios radiológicos y ecográficos remotos.' },
        { name: 'SNOMED CT & LOINC', desc: 'Terminologías clínicas estandarizadas para conceptos médicos y pruebas de laboratorio.' },
        { name: 'CIE-10 / CIE-11', desc: 'Codificación nosológica internacional de patologías y motivos de consulta.' },
      ],
    },
    {
      category: 'Comunicaciones & IoT',
      icon: Radio,
      items: [
        { name: 'WebRTC (E2EE)', desc: 'Audio y video de latencia ultrabaja cifrado mediante DTLS-SRTP para teleconsultas.' },
        { name: 'MQTT & CoAP', desc: 'Protocolos ligeros de telemetría para pulsioxímetros y parches de ECG continuos.' },
        { name: 'BLE GATT Medical', desc: 'Perfiles estandarizados Bluetooth Low Energy (Pulse Oximeter, Blood Pressure).' },
        { name: 'Cloud Healthcare APIs', desc: 'Repositorios FHIR gestionados con soporte para auditoría HIPAA y GDPR.' },
      ],
    },
  ];

  const fhirSnippets = {
    patient: {
      resourceType: "Patient",
      id: "pat-8013",
      identifier: [{ system: "urn:nexus:patients:synthetic", value: "P-8013" }],
      name: [{ family: "Mendoza (Sintético)", given: ["Carlos"] }],
      gender: "male",
      birthDate: "1968-05-14"
    },
    observation: {
      resourceType: "Observation",
      id: "obs-spo2-001",
      status: "final",
      code: {
        coding: [{
          system: "http://loinc.org",
          code: "59408-5",
          display: "Oxygen saturation in Arterial blood by Pulse oximetry"
        }]
      },
      subject: { reference: "Patient/pat-8013" },
      valueQuantity: { value: 91, unit: "%", system: "http://unitsofmeasure.org", code: "%" },
      interpretation: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation", code: "L", display: "Low" }] }]
    },
    encounter: {
      resourceType: "Encounter",
      id: "enc-telehealth-509",
      status: "in-progress",
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "VR",
        display: "Virtual (Teleconsulta)"
      },
      subject: { reference: "Patient/pat-8013" }
    }
  };

  return (
    <section id="tecnologias" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Header */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Share2 className="w-4 h-4" />
          <span>Módulo Didáctico 09 · Arquitectura de Sistemas Sanitarios</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Tecnologías e Interoperabilidad en Telesalud
        </h2>
        <p className="text-slate-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          Los estándares de interoperabilidad permiten intercambiar datos entre dispositivos domiciliarios, aplicaciones de teleconsulta y servidores hospitalarios. Toda integración debe cumplir normativas institucionales y de ciberseguridad.
        </p>
      </div>

      {/* Tech Stack Groups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {techStack.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.category}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-mono font-bold text-white uppercase">
                  {group.category}
                </h3>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.name} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70">
                    <div className="font-bold text-xs text-cyan-300 font-mono">{item.name}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive FHIR Resource Explorer */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Explorador de Recursos HL7 FHIR R4 (Estructura Sintética)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Inspecciona la codificación formal de un paciente ficticio, su teleconsulta virtual y la observación biométrica.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
            {(['observation', 'patient', 'encounter'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFhirTab(tab)}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeFhirTab === tab
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'observation' ? 'Observation (SpO2)' : tab === 'patient' ? 'Patient' : 'Encounter (VR)'}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 max-h-72 overflow-y-auto">
          {JSON.stringify(fhirSnippets[activeFhirTab], null, 2)}
        </pre>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Compatibilidad:</strong> Todos los datos sintéticos de la plataforma están alineados conceptualmente con las especificaciones de interoperabilidad internacional HL7 FHIR R4.
          </span>
        </div>
      </div>
    </section>
  );
};
