import { SimulatedPatient, TelehealthAlert, SecurityEvent, ClinicalApplication, EthicalTopic } from '../types/telehealth';

export const INITIAL_PATIENTS: SimulatedPatient[] = [
  {
    id: 'PAT-8012',
    name: 'Elena Gómez (Sintética)',
    age: 64,
    gender: 'F',
    condition: 'Insuficiencia Cardíaca Congestiva (NYHA II)',
    heartRate: 74,
    spo2: 97,
    temp: 36.6,
    respiratoryRate: 16,
    systolicBP: 128,
    diastolicBP: 82,
    riskScore: 32,
    status: 'monitoreo',
    lastReadingTime: '10:42:15',
  },
  {
    id: 'PAT-8013',
    name: 'Carlos Mendoza (Sintético)',
    age: 58,
    gender: 'M',
    condition: 'EPOC Grado II + Hipertensión',
    heartRate: 88,
    spo2: 91,
    temp: 37.1,
    respiratoryRate: 22,
    systolicBP: 145,
    diastolicBP: 92,
    riskScore: 68,
    status: 'alerta',
    lastReadingTime: '10:43:02',
    anomalyDetected: 'Desaturación progresiva (SpO2 < 92%) en reposo',
  },
  {
    id: 'PAT-8014',
    name: 'Sofía Valdés (Sintética)',
    age: 41,
    gender: 'F',
    condition: 'Diabetes Mellitus Tipo 2 (Monitoreo CGM)',
    heartRate: 71,
    spo2: 99,
    temp: 36.4,
    respiratoryRate: 15,
    systolicBP: 118,
    diastolicBP: 76,
    riskScore: 24,
    status: 'estable',
    lastReadingTime: '10:41:50',
  },
  {
    id: 'PAT-8015',
    name: 'Mateo Morales (Sintético)',
    age: 72,
    gender: 'M',
    condition: 'Fibrilación Auricular Paroxística',
    heartRate: 112,
    spo2: 95,
    temp: 36.8,
    respiratoryRate: 19,
    systolicBP: 138,
    diastolicBP: 88,
    riskScore: 78,
    status: 'alerta',
    lastReadingTime: '10:43:20',
    anomalyDetected: 'Taquiarritmia con irregularidad R-R persistente',
  },
  {
    id: 'PAT-8016',
    name: 'Lucía Herrera (Sintética)',
    age: 29,
    gender: 'F',
    condition: 'Control Gestacional Remoto (Semana 31)',
    heartRate: 79,
    spo2: 98,
    temp: 36.7,
    respiratoryRate: 17,
    systolicBP: 112,
    diastolicBP: 72,
    riskScore: 18,
    status: 'estable',
    lastReadingTime: '10:40:12',
  },
  {
    id: 'PAT-8017',
    name: 'Javier Navarro (Sintético)',
    age: 67,
    gender: 'M',
    condition: 'Post-quirúrgico Revascularización (Día 14)',
    heartRate: 82,
    spo2: 96,
    temp: 37.8,
    respiratoryRate: 20,
    systolicBP: 130,
    diastolicBP: 84,
    riskScore: 61,
    status: 'alerta',
    lastReadingTime: '10:43:45',
    anomalyDetected: 'Pico febril matutino detectado por parche continuo',
  },
];

export const INITIAL_ALERTS: TelehealthAlert[] = [
  {
    id: 'ALT-9401',
    timestamp: '10:43:20',
    patientId: 'PAT-8015',
    patientName: 'Mateo Morales',
    severity: 'critical',
    metric: 'Frecuencia Cardiaca',
    value: '112 bpm (irregular)',
    threshold: '> 100 bpm + Arritmia R-R',
    status: 'pendiente',
    aiConfidence: 94.2,
    recommendedAction: 'Videollamada prioritaria de tele-triaje cardiológico',
  },
  {
    id: 'ALT-9402',
    timestamp: '10:43:02',
    patientId: 'PAT-8013',
    patientName: 'Carlos Mendoza',
    severity: 'warning',
    metric: 'Saturación SpO2',
    value: '91%',
    threshold: '< 92% por > 3 min',
    status: 'pendiente',
    aiConfidence: 89.7,
    recommendedAction: 'Verificar posición de pulsioxímetro y protocolo broncodilatador',
  },
  {
    id: 'ALT-9403',
    timestamp: '10:43:45',
    patientId: 'PAT-8017',
    patientName: 'Javier Navarro',
    severity: 'warning',
    metric: 'Temperatura Continua',
    value: '37.8 °C',
    threshold: '> 37.5 °C en post-operatorio',
    status: 'pendiente',
    aiConfidence: 91.5,
    recommendedAction: 'Teleconsulta médica para evaluación de herida quirúrgica',
  },
];

export const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'SEC-301',
    timestamp: '10:44:02',
    source: 'Gateway-RPM-Home-04',
    target: 'Nexus-Ingestion-FHIR',
    protocol: 'MQTT / TLS 1.3',
    eventType: 'NORMAL',
    severity: 'baja',
    description: 'Paquete de telemetría de signos vitales verificado con certificado X.509',
    actionTaken: 'Ingesta autorizada y anonimizada',
  },
  {
    id: 'SEC-302',
    timestamp: '10:43:18',
    source: 'IP 192.0.2.148 (Proxy No Autorizado)',
    target: 'API Teleconsulta WebRTC',
    protocol: 'HTTPS / REST',
    eventType: 'INTENTO_INTRUSION',
    severity: 'alta',
    description: 'Intento de sondeo de endpoints de videollamada sin token OAuth2',
    actionTaken: 'IP bloqueada en WAF perimetral. Log archivado según normativa',
  },
  {
    id: 'SEC-303',
    timestamp: '10:41:55',
    source: 'Sensor-Biosignal-Sim-09',
    target: 'Nexus-Stream-Buffer',
    protocol: 'BLE / Encriptado',
    eventType: 'SENSOR_SPOOFING',
    severity: 'media',
    description: 'Discrepancia en firma criptográfica de telemetría pulsioximétrica',
    actionTaken: 'Dispositivo puesto en cuarentena virtual. Notificación enviada',
  },
  {
    id: 'SEC-304',
    timestamp: '10:40:10',
    source: 'Nexus-Audit-Agent',
    target: 'HL7-FHIR-Repository',
    protocol: 'gRPC Interno',
    eventType: 'NORMAL',
    severity: 'baja',
    description: 'Auditoría automatizada de accesos a historias clínicas (HIPAA/GDPR)',
    actionTaken: 'Cero discrepancias en control de acceso basado en roles (RBAC)',
  },
];

export const CLINICAL_APPLICATIONS: ClinicalApplication[] = [
  {
    id: 'app-1',
    title: 'Teleconsulta Sincrónica Inteligente',
    category: 'Asistencia Directa',
    iconName: 'Video',
    description: 'Herramientas de soporte en vivo durante la videollamada entre médico y paciente.',
    practicalExample: 'Transcripción clínica en tiempo real con sugerencia de terminología SNOMED y resumen estructurado SOAP.',
    potentialBenefit: 'Reduce el tiempo de documentación administrativa en un 45%, permitiendo mayor contacto visual con el paciente.',
    riskOrLimitation: 'Riesgo de alucinaciones en términos farmacológicos; requiere revisión humana obligatoria antes de firmar la nota.',
    humanOversightRequirement: 'El profesional de la salud valida, edita y firma formalmente cada sección de la historia clínica.',
  },
  {
    id: 'app-2',
    title: 'Monitoreo Remoto de Pacientes (RPM)',
    category: 'Vigilancia Continua',
    iconName: 'Activity',
    description: 'Transmisión periódica o continua de bioseñales desde el domicilio del paciente hacia centros de telemonitoreo.',
    practicalExample: 'Detección de sobrecarga hídrica incipiente mediante básculas conectadas y algoritmos de tendencia de peso.',
    potentialBenefit: 'Prevención de reingresos hospitalarios no programados por descompensación de insuficiencia cardiaca.',
    riskOrLimitation: 'Riesgo de fatiga de alarmas en el equipo de enfermería si los umbrales algorítmicos no están personalizados.',
    humanOversightRequirement: 'Protocolos clínicos definidos por médicos especialistas para la respuesta a alertas escalonadas.',
  },
  {
    id: 'app-3',
    title: 'Tele-Salud Mental y Psiquiatría Digital',
    category: 'Salud Mental',
    iconName: 'Brain',
    description: 'Análisis de biomarcadores digitales del habla, prosodia y texto para apoyo en trastornos del ánimo.',
    practicalExample: 'Identificación de variaciones en la fluidez del habla entre sesiones para alertar de posibles recaídas depresivas.',
    potentialBenefit: 'Monitoreo longitudinal ecológico sin invadir la rutina diaria del consultante.',
    riskOrLimitation: 'Sesgos culturales en la modulación del tono de voz; no es diagnóstico de crisis suicida.',
    humanOversightRequirement: 'Evaluación psiquiátrica o psicológica integral siempre mandatoria ante cualquier alerta.',
  },
  {
    id: 'app-4',
    title: 'Cardiología Digital y Tele-ECG',
    category: 'Diagnóstico Remoto',
    iconName: 'HeartPulse',
    description: 'Clasificación de arritmias en registros de electrocardiografía móvil de 1 a 12 derivaciones.',
    practicalExample: 'Detección precoz de Fibrilación Auricular silente en parches ambulatorios de 14 días.',
    potentialBenefit: 'Prevención primaria y secundaria de accidentes cerebrovasculares embólicos.',
    riskOrLimitation: 'Artefactos de movimiento que simulan falsos flutter o taquicardias ventriculares.',
    humanOversightRequirement: 'Confirmación diagnóstica siempre realizada por un cardiólogo certificado.',
  },
  {
    id: 'app-5',
    title: 'Gestión de Enfermedades Crónicas',
    category: 'Manejo Longitudinal',
    iconName: 'ShieldCheck',
    description: 'Modelos predictivos para la adherencia y control glucémico en diabetes o tensión arterial.',
    practicalExample: 'Sistemas de predicción de hipoglucemia nocturna a partir de curvas de sensores continuos (CGM).',
    potentialBenefit: 'Empoderamiento del paciente y titulación oportuna de terapia bajo supervisión.',
    riskOrLimitation: 'Dependencia tecnológica y brecha digital en pacientes adultos mayores sin acompañamiento.',
    humanOversightRequirement: 'Revisión periódica de metas terapéuticas con el médico de atención primaria.',
  },
  {
    id: 'app-6',
    title: 'Telerehabilitación y Visión Artificial',
    category: 'Rehabilitación',
    iconName: 'UserCheck',
    description: 'Seguimiento de cinemática corporal mediante cámaras estándar en el domicilio.',
    practicalExample: 'Cálculo de rangos articulares y conteo de repeticiones durante ejercicios guiados post-ictus.',
    potentialBenefit: 'Aumenta el apego al tratamiento fisioterapéutico sin traslados costosos.',
    riskOrLimitation: 'Mala iluminación o ropa holgada pueden desviar la estimación de postura del modelo.',
    humanOversightRequirement: 'El kinesiólogo o fisioterapeuta ajusta la carga y valida la técnica de cada ejercicio.',
  },
  {
    id: 'app-7',
    title: 'Tele-Salud Materno-Fetal',
    category: 'Obstetricia',
    iconName: 'Users',
    description: 'Seguimiento domiciliario de cifras tensionales y monitoreo fetal remoto en embarazos de riesgo.',
    practicalExample: 'Detección temprana de patrones de preeclampsia mediante bioseñales combinadas.',
    potentialBenefit: 'Acceso a atención especializada en áreas rurales o zonas desprovistas de obstetras.',
    riskOrLimitation: 'Retraso en atención física presencial si no se activa la cadena de emergencia local.',
    humanOversightRequirement: 'Canal directo 24/7 con maternidades de referencia para derivación inmediata.',
  },
  {
    id: 'app-8',
    title: 'Vigilancia Epidemiológica y Salud Pública',
    category: 'Salud Poblacional',
    iconName: 'Globe',
    description: 'Agregación anonimizada de motivos de consulta telemédica para detección de brotes.',
    practicalExample: 'Identificación temprana de picos de síndromes respiratorios por geolocalización agregada.',
    potentialBenefit: 'Respuesta sanitaria oportuna antes de que los servicios de urgencias colapsen.',
    riskOrLimitation: 'Riesgo de subregistro en poblaciones sin conectividad a internet.',
    humanOversightRequirement: 'Epidemiólogos y autoridades de salud pública guían las intervenciones poblacionales.',
  },
];

export const ETHICAL_TOPICS: EthicalTopic[] = [
  {
    id: 'eth-1',
    title: 'Sesgo Algorítmico y Equidad en Salud Digital',
    category: 'Equidad',
    riskDescription: 'Entrenamiento de modelos con conjuntos de datos no representativos de minorías étnicas o poblaciones de bajos recursos.',
    clinicalCaseExample: 'Un pulsioxímetro óptico con algoritmo de estimación que subestima hipoxemias en pacientes con fototipos cutáneos oscuros.',
    technicalPreventativeMeasure: 'Auditorías de paridad demográfica, métricas de disparate impact y calibración en subpoblaciones diversas.',
    humanResponsibleRole: 'Comités de bioética y científicos de datos clínicos antes de la autorización regulatoria.',
  },
  {
    id: 'eth-2',
    title: 'Consentimiento Informado y Soberanía de Datos',
    category: 'Privacidad',
    riskDescription: 'Uso secundario de grabaciones de teleconsulta o telemetría para re-entrenamiento comercial sin permiso explícito.',
    clinicalCaseExample: 'Grabaciones de sesiones de videollamada psiquiátrica compartidas con proveedores de nube sin consentimiento detallado.',
    technicalPreventativeMeasure: 'Mecanismos criptográficos de consentimiento granular, cifrado homomórfico y almacenamiento zero-knowledge.',
    humanResponsibleRole: 'Oficial de Protección de Datos (DPO) y el profesional médico al iniciar la relación asistencial.',
  },
  {
    id: 'eth-3',
    title: 'Explicabilidad y Cajas Negras (XAI)',
    category: 'Transparencia',
    riskDescription: 'Generación de recomendaciones clínicas de alto impacto sin trazabilidad de las razones biológicas subyacentes.',
    clinicalCaseExample: 'Un modelo de deep learning clasifica a un paciente como "riesgo crítico" pero el médico no sabe qué variable detonó la alerta.',
    technicalPreventativeMeasure: 'Uso de técnicas de explicabilidad local (SHAP values, mapas de atención, árboles sustitutos transparentes).',
    humanResponsibleRole: 'El médico tratante debe fundamentar clínicamente toda decisión, rechazando recomendaciones inexplicables.',
  },
  {
    id: 'eth-4',
    title: 'Responsabilidad Legal y Principio "Human-in-the-Loop"',
    category: 'Responsabilidad',
    riskDescription: 'Delegación implícita de decisiones clínicas a sistemas automatizados ("sesgo de automatización").',
    clinicalCaseExample: 'Un facultativo omite revisar un electrocardiograma ambulatorio porque la etiqueta automática decía "Ritmo Normal".',
    technicalPreventativeMeasure: 'Diseño de interfaz que impida la firma de reportes sin inspección visual activa de las curvas.',
    humanResponsibleRole: 'La responsabilidad civil y deontológica es indelegable y recae siempre en el médico tratante.',
  },
  {
    id: 'eth-5',
    title: 'Brecha Digital y Accesibilidad Universal',
    category: 'Acceso',
    riskDescription: 'Creación de servicios de telesalud que excluyen a pacientes sin dispositivos de última generación o sin alfabetización digital.',
    clinicalCaseExample: 'Pacientes de zonas rurales con baja velocidad de conexión que no pueden acceder a videoconsultas de alta definición.',
    technicalPreventativeMeasure: 'Diseño de protocolos asíncronos resilientes de bajo ancho de banda (WebRTC adaptativo, SMS clínico bidireccional).',
    humanResponsibleRole: 'Gestores de políticas sanitarias e instituciones públicas promotoras de inclusión tecnológica.',
  },
  {
    id: 'eth-6',
    title: 'Fatiga de Alarmas y Burnout del Personal de Salud',
    category: 'Seguridad del Paciente',
    riskDescription: 'Exceso de alertas de baja especificidad que satura la capacidad cognitiva del personal de monitoreo.',
    clinicalCaseExample: 'Enfermeras de guardia remota que reciben 400 notificaciones por hora y desactivan el sonido de avisos críticos.',
    technicalPreventativeMeasure: 'Filtrado contextual con modelos probabilísticos que fusionan múltiples bioseñales antes de alertar.',
    humanResponsibleRole: 'Jefaturas de enfermería y directores médicos en la calibración institucional de umbrales.',
  },
];

export const SAMPLE_FHIR_BUNDLE = {
  resourceType: "Bundle",
  id: "telehealth-simulated-bundle-2026",
  type: "collection",
  timestamp: "2026-09-24T10:45:00Z",
  entry: [
    {
      resource: {
        resourceType: "Patient",
        id: "pat-8013",
        identifier: [{ system: "urn:nexus:patients:synthetic", value: "P-8013" }],
        active: true,
        name: [{ family: "Mendoza (Sintético)", given: ["Carlos"] }],
        gender: "male",
        birthDate: "1968-05-14"
      }
    },
    {
      resource: {
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
    },
    {
      resource: {
        resourceType: "Observation",
        id: "obs-spo2-001",
        status: "final",
        category: [{
          coding: [{
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "vital-signs"
          }]
        }],
        code: {
          coding: [{
            system: "http://loinc.org",
            code: "59408-5",
            display: "Oxygen saturation in Arterial blood by Pulse oximetry"
          }]
        },
        subject: { reference: "Patient/pat-8013" },
        valueQuantity: {
          value: 91,
          unit: "%",
          system: "http://unitsofmeasure.org",
          code: "%"
        },
        interpretation: [{
          coding: [{
            system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
            code: "L",
            display: "Low"
          }]
        }]
      }
    }
  ]
};

export const SAMPLE_PYTHON_PIPELINE = `# Pipeline de Ingesta y Detección de Anomalías en Telesalud (Educativo)
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def procesar_telemetria_remota(df_senales):
    """
    Simulación de procesamiento de signos vitales para telemonitoreo
    Entrada: DataFrame con ['timestamp', 'fc', 'spo2', 'temp', 'presion_sist']
    """
    # 1. Limpieza e imputación temporal
    df_clean = df_senales.interpolate(method='time').dropna()
    
    # 2. Extracción de características de variabilidad (HRV)
    df_clean['fc_rolling_std'] = df_clean['fc'].rolling(window=10).std()
    
    # 3. Detección no supervisada de anomalías
    features = ['fc', 'spo2', 'temp', 'fc_rolling_std']
    detector = IsolationForest(contamination=0.03, random_state=42)
    df_clean['anomalia_simulada'] = detector.fit_predict(df_clean[features].fillna(0))
    
    # -1 indica señal inusual que requiere revisión por telemedicina
    return df_clean[df_clean['anomalia_simulada'] == -1]

print("Pipeline Nexus Telehealth AI Lab inicializado en entorno sintético.")
`;
