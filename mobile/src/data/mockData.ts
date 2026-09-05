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
  medications: ResidentMedication[];
  responsible: {
    name: string;
    relationship: string;
    phone?: string;
    email?: string;
  }[];
}

export interface TaskItem {
  id: string;
  time: string;
  title: string;
  type: 'alimentacion' | 'medicacion' | 'fisioterapia' | 'higiene' | 'actividad';
  scope: 'grupal' | 'individual';
  status: 'pendiente' | 'en_curso' | 'completada';
  residentCount?: number;
  residentId?: string;
  residentName?: string;
  description: string;
}

export interface ConsentRecord {
  id: string;
  residentId: string;
  residentName: string;
  type: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pendiente' | 'firmado' | 'rechazado';
  signedBy?: string;
  signedAt?: string;
  documentUrl?: string;
}

export interface BitacoraEntry {
  id: string;
  residentId: string;
  residentName: string;
  category: 'alimentacion' | 'medicacion' | 'higiene' | 'animo' | 'incidente' | 'general';
  title: string;
  description: string;
  time: string;
  author: string;
  authorRole: string;
}

export const MOCK_RESIDENTS: Resident[] = [
  {
    id: 'res-1',
    name: 'Carmen Delgado Serrano',
    room: 'Habitación 102',
    bed: 'Cama A',
    birthDate: '1941-05-14',
    age: 83,
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=250',
    diet: 'Dieta hiposódica blanda',
    mobility: 'Silla de ruedas con asistencia',
    alerts: ['Riesgo de caída alto', 'Alergia a Penicilina'],
    medications: [
      {
        id: 'med-1',
        drugName: 'Enalapril 10mg',
        time: '09:00 AM',
        dose: '10mg',
        quantity: '1 comprimido',
        route: 'Vía Oral',
        details: 'Tomar con medio vaso de agua',
        status: 'pendiente'
      },
      {
        id: 'med-2',
        drugName: 'Omeprazol 20mg',
        time: '08:00 AM',
        dose: '20mg',
        quantity: '1 cápsula',
        route: 'Vía Oral',
        details: 'En ayunas antes del desayuno',
        status: 'administrado'
      }
    ],
    responsible: [
      {
        name: 'Lucía Delgado (Hija)',
        relationship: 'Hija mayor / Apoderada',
        phone: '+57 312 456 7890',
        email: 'lucia.delgado@email.com'
      }
    ]
  },
  {
    id: 'res-2',
    name: 'Manuel Pérez González',
    room: 'Habitación 104',
    bed: 'Cama B',
    birthDate: '1938-11-20',
    age: 86,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    diet: 'Dieta diabética normal',
    mobility: 'Andador autónomo',
    alerts: ['Monitoreo glucémico diario'],
    medications: [
      {
        id: 'med-3',
        drugName: 'Metformina 850mg',
        time: '08:30 AM',
        dose: '850mg',
        quantity: '1 comprimido',
        route: 'Vía Oral',
        details: 'Durante el desayuno',
        status: 'administrado'
      }
    ],
    responsible: [
      {
        name: 'Javier Pérez (Hijo)',
        relationship: 'Hijo',
        phone: '+57 310 987 6543'
      }
    ]
  },
  {
    id: 'res-3',
    name: 'Antonio Valverde Ruiz',
    room: 'Habitación 108',
    bed: 'Cama A',
    birthDate: '1944-03-09',
    age: 80,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    diet: 'Dieta triturada / espesantes',
    mobility: 'Reposo en cama / Transferencia asistida',
    alerts: ['Disfagia severa', 'Prevención de UPP'],
    medications: [
      {
        id: 'med-4',
        drugName: 'Sintrom 4mg',
        time: '18:00 PM',
        dose: '2mg',
        quantity: '1/2 comprimido',
        route: 'Vía Oral',
        details: 'Según pauta INR',
        status: 'pendiente'
      }
    ],
    responsible: [
      {
        name: 'Marta Valverde (Sobrina)',
        relationship: 'Tutora legal',
        phone: '+57 315 123 4567'
      }
    ]
  }
];

export const MOCK_TASKS: TaskItem[] = [
  {
    id: 'tsk-1',
    time: '09:00 AM',
    title: 'Ronda de medicación matutina',
    type: 'medicacion',
    scope: 'grupal',
    status: 'pendiente',
    residentCount: 3,
    description: 'Administración de fármacos prescritos de la mañana'
  },
  {
    id: 'tsk-2',
    time: '08:00 AM',
    title: 'Desayuno asistido en comedor',
    type: 'alimentacion',
    scope: 'grupal',
    status: 'completada',
    residentCount: 24,
    description: 'Distribución de dietas según pauta médica'
  },
  {
    id: 'tsk-3',
    time: '10:30 AM',
    title: 'Toma de constantes y glicemia',
    type: 'fisioterapia',
    scope: 'individual',
    status: 'pendiente',
    residentId: 'res-2',
    residentName: 'Manuel Pérez González',
    description: 'Control de glucosa capilar pre-almuerzo'
  },
  {
    id: 'tsk-4',
    time: '11:00 AM',
    title: 'Movilización pasiva y cambio postural',
    type: 'higiene',
    scope: 'individual',
    status: 'pendiente',
    residentId: 'res-3',
    residentName: 'Antonio Valverde Ruiz',
    description: 'Prevención de úlceras por presión'
  }
];

export const MOCK_CONSENTS: ConsentRecord[] = [
  {
    id: 'con-1',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    type: 'Vacunación Estacional (Antigripal)',
    description: 'Autorización para inoculación de dosis anual contra virus Influenza.',
    requestedBy: 'Dra. Elena Ramos (Médico Coordinador)',
    requestedAt: '2026-09-04 14:30',
    status: 'pendiente'
  },
  {
    id: 'con-2',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    type: 'Salida recreativa programada',
    description: 'Visita guiada al Jardín Botánico el próximo 12 de Septiembre.',
    requestedBy: 'Lic. Andrés Peña (Terapeuta Ocupacional)',
    requestedAt: '2026-08-28 10:15',
    status: 'firmado',
    signedBy: 'Lucía Delgado',
    signedAt: '2026-08-29 09:00'
  }
];

export const MOCK_BITACORA: BitacoraEntry[] = [
  {
    id: 'bit-1',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    category: 'alimentacion',
    title: 'Desayuno completado',
    description: 'Ingirió el 100% de la porción recomendada (fruta cocida, avena y huevo tibio). Buen apetito.',
    time: '08:25 AM',
    author: 'Sonia Martínez',
    authorRole: 'Cuidadora Principal'
  },
  {
    id: 'bit-2',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    category: 'medicacion',
    title: 'Omeprazol 20mg administrado',
    description: 'Toma realizada en ayunas sin complicaciones deglutorias.',
    time: '08:05 AM',
    author: 'Sonia Martínez',
    authorRole: 'Cuidadora Principal'
  },
  {
    id: 'bit-3',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    category: 'animo',
    title: 'Estado de ánimo participativo',
    description: 'Muy comunicativa con sus compañeras de mesa. Expresó deseo de participar en el taller de música.',
    time: '09:15 AM',
    author: 'Carlos Ruiz',
    authorRole: 'Terapeuta'
  }
];
