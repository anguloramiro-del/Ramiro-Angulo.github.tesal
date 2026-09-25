export type AlertSeverity = 'stable' | 'warning' | 'critical';

export interface SimulatedPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  heartRate: number; // bpm
  spo2: number; // %
  temp: number; // °C
  respiratoryRate: number; // rpm
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  riskScore: number; // 0-100
  status: 'monitoreo' | 'alerta' | 'estable' | 'en_consulta';
  lastReadingTime: string;
  anomalyDetected?: string;
}

export interface TelehealthAlert {
  id: string;
  timestamp: string;
  patientId: string;
  patientName: string;
  severity: AlertSeverity;
  metric: string;
  value: string;
  threshold: string;
  status: 'pendiente' | 'revisado';
  aiConfidence: number; // 0-100%
  recommendedAction: string;
}

export interface MLMetrics {
  accuracy: number;
  sensitivity: number;
  specificity: number;
  fpr: number;
  f1Score: number;
  confidenceLower: number;
  confidenceUpper: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  source: string;
  target: string;
  protocol: string;
  eventType: 'NORMAL' | 'ANOMALIA_DETECTADA' | 'INTENTO_INTRUSION' | 'SENSOR_SPOOFING';
  severity: 'baja' | 'media' | 'alta';
  description: string;
  actionTaken: string;
}

export interface ClinicalApplication {
  id: string;
  title: string;
  category: string;
  iconName: string;
  description: string;
  practicalExample: string;
  potentialBenefit: string;
  riskOrLimitation: string;
  humanOversightRequirement: string;
}

export interface EthicalTopic {
  id: string;
  title: string;
  category: string;
  riskDescription: string;
  clinicalCaseExample: string;
  technicalPreventativeMeasure: string;
  humanResponsibleRole: string;
}
