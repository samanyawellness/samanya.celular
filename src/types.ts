export type UserRole = 'cuidador' | 'familiar';
export type AppTab = 'inicio' | 'tareas' | 'residentes' | 'consentimientos' | 'perfil';
export type FamiliarTab = 'perfil' | 'bitacora' | 'inicio' | 'residente' | 'calendario';

export interface StaffWorker {
  id: string;
  name: string;
  role: string;
  avatar: string;
  unit?: string;
}

export type SupplyType = 'gasto_adicional' | 'entrega_familiar';
export type PaymentStatus = 'pendiente' | 'pagado';

export interface SupplyEntry {
  id: string;
  residentId: string;
  residentName: string;
  type: SupplyType;
  description: string;
  quantity: string;
  date: string;
  time: string;
  // Gasto adicional
  cost?: number;
  paymentStatus?: PaymentStatus;
  paidBy?: string;
  paidAt?: string;
  // Entrega familiar
  workerId?: string;
  workerName?: string;
  workerAvatar?: string;
  deliveredBy?: string;
  recordedByName: string;
  recordedByRole: UserRole | 'admin' | 'dueño';
}

export interface ResidentMedication {
  id: string;
  drugName: string;
  time: string;
  dose: string;
  quantity?: string;
  route: string;
  details?: string;
  status: 'pendiente' | 'administrado';
}

export interface Resident {
  id: string;
  name: string;
  room: string;
  bed: string;
  birthDate: string;
  age: number;
  avatar: string;
  diet: string;
  mobility: string;
  alerts: string[];
  medications?: ResidentMedication[];
  responsible: {
    name: string;
    relationship: string;
    phone?: string;
    email?: string;
  }[];
}

export type TaskType = 'alimentacion' | 'medicacion' | 'fisioterapia' | 'higiene' | 'actividad' | 'signos_vitales';
export type TaskScope = 'grupal' | 'individual';
export type TaskStatus = 'pendiente' | 'en_curso' | 'completada';

export interface TaskItem {
  id: string;
  time: string;
  title: string;
  type: TaskType;
  scope: TaskScope;
  status: TaskStatus;
  residentCount?: number;
  residentId?: string;
  residentName?: string;
  description: string;
  medicationDetails?: {
    drugName: string;
    dose: string;
    route: string;
    quantity?: string;
    details?: string;
    photoRequired?: boolean;
    photoProofUrl?: string;
  };
  mealDetails?: {
    mealType: 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena' | 'Cierre del día' | string;
    totalExpected: number;
    normalCount: number;
    exceptions: {
      residentId: string;
      residentName: string;
      note: string;
      reason: string;
    }[];
    pendingResidents?: string[];
    registeredResidentIds?: string[];
  };
}

export interface ActivityEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'medicacion' | 'alimentacion' | 'bitacora' | 'incidente' | 'consentimiento' | 'alta_aprobada' | 'signos_vitales';
  title: string;
  summary: string;
  photoUrl?: string;
  residentNames: string[];
  fullDetails: {
    overview: string;
    stats?: { label: string; value: string | number }[];
    exceptions?: { residentName: string; note: string }[];
    author: string;
    notes?: string;
    attachments?: string[];
  };
}

export interface BitacoraEntry {
  id: string;
  residentId: string;
  residentName: string;
  date: string;
  time: string;
  category: string;
  text: string;
  recordedByVoice: boolean;
  author: string;
}

export interface VitalSigns {
  id: string;
  residentId: string;
  residentName: string;
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  spO2: number;
  temperature: number;
  glucose?: number;
  notes?: string;
  takenBy: string;
}

export type IncidentType = 'caida' | 'cambio_salud' | 'conflicto' | 'medicacion' | 'otro';
export type IncidentSeverity = 'leve' | 'moderada' | 'critica';

export interface IncidentReport {
  id: string;
  residentIds: string[];
  residentNames: string[];
  incidentType: IncidentType;
  severity: IncidentSeverity;
  dateTime: string;
  description: string;
  photoUrl?: string;
  reportedBy: string;
  status: 'recibido' | 'en_revision' | 'resuelto';
}

export type ConsentStatus = 'pendiente' | 'aprobado' | 'rechazado';
export type ConsentType = 'Tratamiento médico' | 'Salida con familiar' | 'Procedimiento de enfermería' | 'Actividad especial' | 'Uso de imágenes' | 'Otro';

export interface ConsentRecord {
  id: string;
  residentId: string;
  residentName: string;
  room: string;
  type: string;
  status: ConsentStatus;
  sentDate: string;
  responseDate?: string;
  description: string;
  documentName?: string;
  documentSize?: string;
  recipients: {
    name: string;
    relationship: string;
    email: string;
    status: 'enviado' | 'leido' | 'firmado' | 'rechazado';
  }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'alta' | 'incidente' | 'aviso' | 'turno' | 'consentimiento' | 'suministros' | 'mensaje';
  targetScreen?: 'residents' | 'incidents' | 'consents' | 'timeline' | 'tasks' | 'bitacora' | 'mensajes';
  targetId?: string;
}

export type ClinicalRecordCategory =
  | 'examen'
  | 'laboratorio'
  | 'receta'
  | 'nota_clinica'
  | 'consentimiento'
  | 'legal_personal'
  | 'administrativo'
  | 'otro';

export interface ClinicalRecord {
  id: string;
  residentId: string;
  residentName: string;
  title: string;
  category: ClinicalRecordCategory;
  categoryLabel: string;
  description?: string;
  entryType: 'archivo' | 'nota_texto';
  fileType?: 'pdf' | 'imagen';
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  uploadedByRole: 'familiar' | 'cuidador';
  uploadedByName: string;
  createdAt: string; // ISO string e.g. "2026-08-22T06:30:00"
  date: string; // YYYY-MM-DD for timeline integration
  time: string; // HH:MM
  updatedAt?: string;
}

export interface DeletedClinicalRecord {
  id: string;
  recordId: string;
  residentId: string;
  residentName: string;
  title: string;
  category?: ClinicalRecordCategory;
  categoryLabel: string;
  description?: string;
  entryType?: 'archivo' | 'nota_texto';
  fileType?: 'pdf' | 'imagen';
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  uploadedByRole?: 'familiar' | 'cuidador';
  uploadedByName?: string;
  createdAt?: string;
  date?: string;
  time?: string;
  deletedAt: string; // formatted timestamp e.g. "22/08/2026 10:45"
}
