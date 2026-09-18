import { Resident, TaskItem, ActivityEvent, ConsentRecord, AppNotification, BitacoraEntry, VitalSigns, IncidentReport, ClinicalRecord, DeletedClinicalRecord, SupplyEntry, StaffWorker, SedeInfo, ShiftInfo, UserCentro } from '../types';

export const INITIAL_RESIDENTS: Resident[] = [
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
    idCentro: 1,
    nombreCentro: 'Sede Central Bogotá',
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
      },
      {
        name: 'Carlos Delgado (Hijo)',
        relationship: 'Hijo',
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
    idCentro: 1,
    nombreCentro: 'Sede Central Bogotá',
    responsible: [
      {
        name: 'Javier Pérez (Hijo)',
        relationship: 'Hijo',
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
    idCentro: 1,
    nombreCentro: 'Sede Central Bogotá',
    responsible: [
      {
        name: 'Marta Valverde (Sobrina)',
        relationship: 'Tutora legal',
      }
    ]
  },
  {
    id: 'res-4',
    name: 'Rosa María Ibáñez Gil',
    room: 'Habitación 112',
    bed: 'Cama A',
    birthDate: '1947-08-30',
    age: 77,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    diet: 'Normal equilibrada',
    mobility: 'Marcha independiente',
    alerts: ['Deterioro cognitivo leve'],
    idCentro: 2,
    nombreCentro: 'Sede Campestre La Calera',
    responsible: [
      {
        name: 'Ignacio Gómez Ibáñez (Hijo)',
        relationship: 'Hijo tutor',
      }
    ]
  },
  {
    id: 'res-5',
    name: 'Francisco Morales Ramos',
    room: 'Habitación 201',
    bed: 'Cama B',
    birthDate: '1939-01-15',
    age: 85,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    diet: 'Hiposódica estricta',
    mobility: 'Silla de ruedas',
    alerts: ['Hipertensión arterial', 'Control de ingesta de líquidos'],
    idCentro: 2,
    nombreCentro: 'Sede Campestre La Calera',
    responsible: [
      {
        name: 'Elena Morales Soto (Hija)',
        relationship: 'Hija',
      }
    ]
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    time: '09:00 AM',
    title: 'Medicación — Carmen Delgado',
    type: 'medicacion',
    scope: 'individual',
    status: 'pendiente',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    description: 'Enalapril 10mg vía oral con medio vaso de agua.',
    medicationDetails: {
      drugName: 'Enalapril 10mg',
      dose: '1 comprimido',
      route: 'Vía Oral',
      photoRequired: false
    }
  },
  {
    id: 'task-2',
    time: '09:30 AM',
    title: 'Medicación — Manuel Pérez',
    type: 'medicacion',
    scope: 'individual',
    status: 'pendiente',
    residentId: 'res-2',
    residentName: 'Manuel Pérez González',
    description: 'Metformina 850mg post-desayuno.',
    medicationDetails: {
      drugName: 'Metformina 850mg',
      dose: '1 comprimido',
      route: 'Vía Oral',
      photoRequired: false
    }
  },
  {
    id: 'task-3',
    time: '10:30 AM',
    title: 'Fisioterapia y Movilización — Manuel Pérez',
    type: 'fisioterapia',
    scope: 'individual',
    status: 'pendiente',
    residentId: 'res-2',
    residentName: 'Manuel Pérez González',
    description: 'Ejercicios de reeducación de marcha con andador en pasillo norte (20 min).',
  },
  {
    id: 'task-4',
    time: '11:30 AM',
    title: 'Taller de Estimulación Cognitiva',
    type: 'actividad',
    scope: 'grupal',
    status: 'pendiente',
    residentCount: 18,
    description: 'Sesión grupal de reminiscencia y canciones populares en sala polivalente.',
  },
  {
    id: 'task-5',
    time: '14:00 PM',
    title: 'Control de Signos Vitales — Antonio Valverde',
    type: 'fisioterapia',
    scope: 'individual',
    status: 'pendiente',
    residentId: 'res-3',
    residentName: 'Antonio Valverde Ruiz',
    description: 'Toma de saturación O2, tensión y temperatura post-ingesta.',
  },
  {
    id: 'task-6',
    time: '18:00 PM',
    title: 'Registro de Alimentación Diaria (Cierre de Turno)',
    type: 'alimentacion',
    scope: 'grupal',
    status: 'pendiente',
    residentCount: 24,
    description: 'Registro consolidado de ingesta y excepciones del turno de la tarde.',
    mealDetails: {
      mealType: 'Cierre del día',
      totalExpected: 24,
      normalCount: 23,
      exceptions: [
        {
          residentId: 'res-3',
          residentName: 'Antonio Valverde Ruiz',
          note: 'Requiere espesante nivel 2 y cuchara de silicona',
          reason: 'Disfagia'
        }
      ]
    }
  }
];

export const INITIAL_ACTIVITY_TIMELINE: ActivityEvent[] = [
  {
    id: 'act-1',
    date: '2026-08-19',
    time: '07:30 AM',
    type: 'bitacora',
    title: 'Cambio de turno recibido',
    summary: 'Noche tranquila en Planta 1. Sin incidencias respiratorias.',
    residentNames: ['Planta 1 General'],
    fullDetails: {
      overview: 'Entrega de guardia realizada por Enfermera Nocturna S. Blanco a Cuidadora Elena Morales.',
      stats: [{ label: 'Residentes estables', value: '24/24' }],
      author: 'Silvia Blanco (Turno Noche)',
      notes: 'Todos los residentes durmieron adecuadamente sin episodios de agitación.'
    }
  },
  {
    id: 'act-2',
    date: '2026-08-19',
    time: '08:15 AM',
    type: 'alimentacion',
    title: 'Alimentación — Desayuno completado',
    summary: '23 residentes comieron con normalidad. 1 excepción reportada.',
    residentNames: ['Antonio Valverde', 'Carmen Delgado', 'Manuel Pérez +21'],
    fullDetails: {
      overview: 'Desayuno servido puntualmente en comedor central y bandejas de habitación.',
      stats: [
        { label: 'Normal', value: '23' },
        { label: 'Excepciones', value: '1' }
      ],
      exceptions: [
        {
          residentName: 'Antonio Valverde Ruiz',
          note: 'Ingesta del 60% del puré. Buena tolerancia de líquidos con espesante.'
        }
      ],
      author: 'Elena Morales (Cuidadora)'
    }
  },
  {
    id: 'act-3',
    date: '2026-08-19',
    time: '08:40 AM',
    type: 'medicacion',
    title: 'Medicación individual administrada',
    summary: 'Carmen Delgado Serrano — Enalapril 10mg + Omeprazol 20mg.',
    residentNames: ['Carmen Delgado Serrano'],
    fullDetails: {
      overview: 'Toma correcta sin atragantamiento ni resistencia. Registro con confirmación visual.',
      author: 'Elena Morales (Cuidadora)',
      notes: 'Constantes previas: TA 128/78 mmHg. No refiere mareo.'
    }
  },
  {
    id: 'act-4',
    date: '2026-08-19',
    time: '09:00 AM',
    type: 'signos_vitales',
    title: 'Signos vitales registrados',
    summary: 'Manuel Pérez González — TA: 124/80 mmHg, FC: 72 lpm, SpO2: 97%.',
    residentNames: ['Manuel Pérez González'],
    fullDetails: {
      overview: 'Control rutinario matutino de parámetros hemodinámicos.',
      stats: [
        { label: 'Tensión Arterial', value: '124/80 mmHg' },
        { label: 'Frecuencia Cardíaca', value: '72 lpm' },
        { label: 'Saturación O2', value: '97%' },
        { label: 'Temperatura', value: '36.4 °C' },
        { label: 'Glucemia basal', value: '112 mg/dL' }
      ],
      author: 'Elena Morales (Cuidadora)'
    }
  },
  {
    id: 'act-5',
    date: '2026-08-19',
    time: '09:45 AM',
    type: 'bitacora',
    title: 'Visita médica de seguimiento',
    summary: 'Dr. Ramírez revisó analítica y ajustó pauta a Rosa María Ibáñez.',
    residentNames: ['Rosa María Ibáñez Gil'],
    fullDetails: {
      overview: 'Evaluación geriátrica periódica. Buen estado general.',
      author: 'Dr. Carlos Ramírez (Médico Geriátrico)',
      notes: 'Mantener hidratación reforzada en horas de calor. Control cognitivo estable.'
    }
  },
  {
    id: 'act-6',
    date: '2026-08-18',
    time: '18:30 PM',
    type: 'consentimiento',
    title: 'Consentimiento firmado por familiar',
    summary: 'Salida de fin de semana para Manuel Pérez aprobada por su hijo Javier Pérez.',
    residentNames: ['Manuel Pérez González'],
    fullDetails: {
      overview: 'Autorización digital completada a través de la plataforma web del familiar.',
      author: 'Javier Pérez (Responsable)',
      stats: [{ label: 'Estado', value: 'Aprobado y Firmado' }]
    }
  },
  {
    id: 'act-7',
    date: '2026-08-18',
    time: '15:20 PM',
    type: 'alta_aprobada',
    title: 'Nueva alta de residente aprobada por Dirección',
    summary: 'Se autorizó el ingreso formal de Francisco Morales Ramos a Habitación 201.',
    residentNames: ['Francisco Morales Ramos'],
    fullDetails: {
      overview: 'Expediente validado por Dirección Médica y Administración central.',
      author: 'Dirección Samanya'
    }
  },
  {
    id: 'act-8',
    date: '2026-08-19',
    time: '11:00 AM',
    type: 'bitacora',
    title: 'Taller de Estimulación Cognitiva y Memoria',
    summary: 'Sesión grupal matutina de reminiscencia musical y puzzles de lógica. Muy participativa.',
    residentNames: ['Carmen Delgado Serrano', 'Manuel Pérez González', 'Rosa María Ibáñez Gil', 'Planta 1 General'],
    photoUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
    fullDetails: {
      overview: 'Dinámica de memoria visual y reconocimiento auditivo de piezas clásicas.',
      author: 'Lucía Santos (Terapeuta Ocupacional)'
    }
  },
  {
    id: 'act-9',
    date: '2026-08-19',
    time: '12:30 PM',
    type: 'bitacora',
    title: 'Sesión de Fisioterapia y Movilidad Suave',
    summary: 'Ejercicios de amplitud articular en miembros superiores y bipedestación asistida.',
    residentNames: ['Carmen Delgado Serrano', 'Antonio Valverde Ruiz'],
    photoUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    fullDetails: {
      overview: 'Pauta de mantenimiento muscular y prevención de rigidez.',
      author: 'Marcos R. (Fisioterapeuta)'
    }
  },
  {
    id: 'act-10',
    date: '2026-08-19',
    time: '13:30 PM',
    type: 'alimentacion',
    title: 'Alimentación — Almuerzo / Comida completado',
    summary: 'Menú principal: crema de calabaza y merluza al vapor. Ingesta completa y buena hidratación (300ml agua).',
    residentNames: ['Carmen Delgado Serrano', 'Manuel Pérez González', 'Rosa María Ibáñez Gil', 'Francisco Morales Ramos', 'Antonio Valverde Ruiz'],
    fullDetails: {
      overview: 'Comida servida en comedor principal. Postre: fruta fresca pelada.',
      author: 'Elena Morales (Cuidadora)'
    }
  }
];

export const INITIAL_BITACORA: BitacoraEntry[] = [
  {
    id: 'bit-vis-1',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    date: '2026-08-19',
    time: '11:30 AM',
    category: 'Visitante',
    text: 'La hija de Doña Carmen llegó acompañada de un familiar joven. Estuvieron en el jardín exterior merendando y paseando un rato. Residente muy animada y contenta.',
    recordedByVoice: true,
    author: 'Elena Morales (Cuidadora)'
  },
  {
    id: 'bit-1',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    date: '2026-08-19',
    time: '08:45 AM',
    category: 'Observación general',
    text: 'La residente se encuentra animada y conversadora. Participó voluntariamente en la elección de vestimenta. Sin quejas de dolor articular.',
    recordedByVoice: true,
    author: 'Elena Morales (Cuidadora)'
  },
  {
    id: 'bit-1b',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    date: '2026-08-19',
    time: '07:50 AM',
    category: 'Higiene y confort',
    text: 'Aseo matutino completo en baño adaptado. Aplicación de crema hidratante en piernas y brazos. Peinado y aseo bucal realizado.',
    recordedByVoice: false,
    author: 'Elena Morales (Cuidadora)'
  },
  {
    id: 'bit-2',
    residentId: 'res-2',
    residentName: 'Manuel Pérez González',
    date: '2026-08-19',
    time: '09:10 AM',
    category: 'Visita médica',
    text: 'Revisión por podología completada. Correcta higiene y corte de uñas sin lesiones en pie diabético.',
    recordedByVoice: false,
    author: 'Podóloga Marta S.'
  },
  {
    id: 'bit-2b',
    residentId: 'res-2',
    residentName: 'Manuel Pérez González',
    date: '2026-08-19',
    time: '08:00 AM',
    category: 'Higiene y confort',
    text: 'Aseo personal completado con apoyo para el afeitado. Calzado ortopédico colocado correctamente.',
    recordedByVoice: true,
    author: 'Silvia Blanco (Cuidadora)'
  },
  {
    id: 'bit-3',
    residentId: 'res-3',
    residentName: 'Antonio Valverde Ruiz',
    date: '2026-08-19',
    time: '07:45 AM',
    category: 'Higiene y confort',
    text: 'Aseo en cama completado. Hidratación cutánea con crema de ácidos grasos hiperoxigenados en sacro y talones. Piel íntegra.',
    recordedByVoice: true,
    author: 'Elena Morales (Cuidadora)'
  }
];

export const INITIAL_VITALS: VitalSigns[] = [
  {
    id: 'vit-1',
    residentId: 'res-2',
    residentName: 'Manuel Pérez González',
    date: '2026-08-19',
    time: '09:00 AM',
    systolic: 124,
    diastolic: 80,
    heartRate: 72,
    spO2: 97,
    temperature: 36.4,
    glucose: 112,
    notes: 'Valores dentro de los rangos óptimos basales.',
    takenBy: 'Elena Morales'
  },
  {
    id: 'vit-2',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    date: '2026-08-19',
    time: '08:30 AM',
    systolic: 128,
    diastolic: 78,
    heartRate: 74,
    spO2: 98,
    temperature: 36.5,
    glucose: 98,
    notes: 'Presión y pulso estables previo a la administración de Enalapril.',
    takenBy: 'Elena Morales'
  },
  {
    id: 'vit-3',
    residentId: 'res-3',
    residentName: 'Antonio Valverde Ruiz',
    date: '2026-08-19',
    time: '08:00 AM',
    systolic: 118,
    diastolic: 72,
    heartRate: 68,
    spO2: 96,
    temperature: 36.6,
    glucose: 104,
    notes: 'Saturación basal adecuada en reposo.',
    takenBy: 'Elena Morales'
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-1',
    residentIds: ['res-4'],
    residentNames: ['Rosa María Ibáñez Gil'],
    incidentType: 'caida',
    severity: 'leve',
    dateTime: '2026-08-18 16:45',
    description: 'Pérdida de equilibrio al intentar levantarse del sillón de lectura sin pedir ayuda. Amortiguada por la alfombrilla anticaídas. Sin traumatismo craneal ni hematomas aparentes.',
    reportedBy: 'Elena Morales',
    status: 'resuelto'
  }
];

export const INITIAL_CONSENTS: ConsentRecord[] = [
  {
    id: 'cons-1',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    room: 'Habitación 102',
    type: 'Procedimiento de enfermería',
    status: 'pendiente',
    sentDate: '2026-08-19 08:30',
    description: 'Autorización para vacunación de refuerzo estacional y extracción analítica de control trimestral.',
    documentName: 'Pauta_Vacunacion_CarmenDelgado.pdf',
    documentSize: '1.2 MB',
    recipients: [
      {
        name: 'Lucía Delgado (Hija)',
        relationship: 'Hija mayor / Apoderada',
        email: 'lucia.delgado@correo.es',
        status: 'enviado'
      }
    ]
  },
  {
    id: 'cons-2',
    residentId: 'res-2',
    residentName: 'Manuel Pérez González',
    room: 'Habitación 104',
    type: 'Salida con familiar',
    status: 'aprobado',
    sentDate: '2026-08-18 14:00',
    responseDate: '2026-08-18 18:30',
    description: 'Salida autorizada para comida familiar de fin de semana del sábado 23 de agosto (12:00 a 19:00).',
    documentName: 'Autorizacion_Salida_Familiar_MPerez.pdf',
    documentSize: '450 KB',
    recipients: [
      {
        name: 'Javier Pérez (Hijo)',
        relationship: 'Hijo',
        email: 'javier.perez@empresa.com',
        status: 'firmado'
      }
    ]
  },
  {
    id: 'cons-3',
    residentId: 'res-3',
    residentName: 'Antonio Valverde Ruiz',
    room: 'Habitación 108',
    type: 'Tratamiento médico',
    status: 'aprobado',
    sentDate: '2026-08-17 10:15',
    responseDate: '2026-08-17 16:40',
    description: 'Ajuste de terapia kinesiológica respiratoria y uso de aerosolterapia pautada por Neumología.',
    documentName: 'Consentimiento_Kinesioterapia_AValverde.pdf',
    documentSize: '890 KB',
    recipients: [
      {
        name: 'Marta Valverde (Sobrina)',
        relationship: 'Tutora legal',
        email: 'marta.valverde@correo.es',
        status: 'firmado'
      }
    ]
  },
  {
    id: 'cons-4',
    residentId: 'res-4',
    residentName: 'Rosa María Ibáñez Gil',
    room: 'Habitación 112',
    type: 'Uso de imágenes',
    status: 'rechazado',
    sentDate: '2026-08-15 09:00',
    responseDate: '2026-08-16 11:20',
    description: 'Permiso para publicación de fotografías de talleres en la revista interna y boletín del centro.',
    recipients: [
      {
        name: 'Ignacio Gómez Ibáñez (Hijo)',
        relationship: 'Hijo tutor',
        email: 'ignacio.gomez@gmail.com',
        status: 'rechazado'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-2',
    title: 'Incidente reportado',
    message: 'Se ha registrado un reporte de incidente para Carmen Delgado Serrano (Caída leve en pasillo). El equipo asistencial ha realizado la valoración oportuna.',
    timestamp: 'Hace 45 min',
    isRead: false,
    type: 'incidente',
    targetScreen: 'timeline',
    targetId: 'res-1'
  },
  {
    id: 'notif-1',
    title: 'Solicitud de alta aprobada',
    message: 'Dirección ha aprobado el alta de Francisco Morales Ramos (Habitación 201). Ya está disponible en su lista de residentes.',
    timestamp: 'Hace 25 min',
    isRead: false,
    type: 'alta',
    targetScreen: 'residents',
    targetId: 'res-5'
  },
  {
    id: 'notif-3',
    title: 'Consentimiento médico pendiente',
    message: 'Se requiere su aprobación para la pauta de vacunación y control analítico de Carmen Delgado.',
    timestamp: 'Hoy, 08:30',
    isRead: false,
    type: 'consentimiento',
    targetScreen: 'consents',
    targetId: 'cons-1'
  },
  {
    id: 'notif-4',
    title: 'Nuevo mensaje de la cuidadora',
    message: 'Elena Morales le ha enviado una actualización sobre la mañana de Doña Carmen.',
    timestamp: 'Hoy, 11:15',
    isRead: false,
    type: 'aviso',
    targetScreen: 'timeline'
  },
  {
    id: 'notif-5',
    title: 'Aviso general del centro',
    message: 'Recordatorio: Mantenimiento del ascensor norte entre las 15:00 y 16:30. Usar montacargas asistencial.',
    timestamp: 'Ayer, 10:00',
    isRead: true,
    type: 'aviso'
  }
];

export const INITIAL_CLINICAL_RECORDS: ClinicalRecord[] = [
  {
    id: 'cr-1',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    title: 'Receta externa - Colirio oftálmico',
    category: 'receta',
    categoryLabel: 'Receta externa',
    entryType: 'archivo',
    fileType: 'pdf',
    fileName: 'Receta_Oftalmologia_Dra_Perez.pdf',
    fileSize: '1.2 MB',
    uploadedByRole: 'familiar',
    uploadedByName: 'Lucía Delgado',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago -> editable within 24h
    date: '2026-08-22',
    time: '10:30',
    description: 'Prescripción médica tras revisión oftalmológica privada. Pauta de 1 gota cada 12 horas en ojo derecho.'
  },
  {
    id: 'cr-2',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    title: 'Analítica de sangre y perfil lipídico',
    category: 'laboratorio',
    categoryLabel: 'Resultados de laboratorio',
    entryType: 'archivo',
    fileType: 'pdf',
    fileName: 'Analitica_Completa_Agosto2026.pdf',
    fileSize: '2.4 MB',
    uploadedByRole: 'cuidador',
    uploadedByName: 'Dr. Carlos Ramírez',
    createdAt: '2026-08-19T09:15:00',
    date: '2026-08-19',
    time: '09:15',
    description: 'Resultados del control trimestral. Glucemia y perfil lipídico dentro de objetivos terapéuticos.'
  },
  {
    id: 'cr-3',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    title: 'Nota de valoración podológica y dérmica',
    category: 'nota_clinica',
    categoryLabel: 'Nota clínica',
    entryType: 'nota_texto',
    uploadedByRole: 'cuidador',
    uploadedByName: 'Elena Morales',
    createdAt: '2026-08-19T16:20:00',
    date: '2026-08-19',
    time: '16:20',
    description: 'Quiropodia de mantenimiento completada. No se observan puntos de presión ni hiperqueratosis. Piel hidratada.'
  },
  {
    id: 'cr-4',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    title: 'Informe ecocardiograma y control cardiológico',
    category: 'examen',
    categoryLabel: 'Exámenes médicos',
    entryType: 'archivo',
    fileType: 'pdf',
    fileName: 'Informe_Cardiologia_H_LaPaz.pdf',
    fileSize: '3.8 MB',
    uploadedByRole: 'familiar',
    uploadedByName: 'Lucía Delgado',
    createdAt: '2026-08-14T11:00:00', // Older than 24h -> fixed
    date: '2026-08-14',
    time: '11:00',
    description: 'Revisión anual en hospital de referencia. Función ventricular conservada sin cambios respecto al año previo.'
  },
  {
    id: 'cr-5',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    title: 'Densitometría ósea de control',
    category: 'examen',
    categoryLabel: 'Exámenes médicos',
    entryType: 'archivo',
    fileType: 'imagen',
    fileName: 'Densitometria_Osea_2026.jpg',
    fileSize: '1.8 MB',
    uploadedByRole: 'cuidador',
    uploadedByName: 'Dra. María Soler',
    createdAt: '2026-08-05T12:00:00',
    date: '2026-08-05',
    time: '12:00',
    description: 'Estudio de densidad mineral ósea. Se recomienda mantener suplementación de Vitamina D y paseos al sol.'
  }
];

export const INITIAL_DELETED_CLINICAL_RECORDS: DeletedClinicalRecord[] = [
  {
    id: 'del-cr-1',
    recordId: 'cr-old-1',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    title: 'Borrador analítica previa no firmada',
    category: 'laboratorio',
    categoryLabel: 'Resultados de laboratorio',
    description: 'Informe preliminar del hemograma y coagulación sustituido por el resultado analítico definitivo de fecha 18/08/2026.',
    entryType: 'archivo',
    fileType: 'pdf',
    fileName: 'Analitica_Preliminar_Borrador.pdf',
    fileSize: '1.2 MB',
    uploadedByRole: 'familiar',
    uploadedByName: 'Lucía Delgado',
    createdAt: '2026-08-17T10:00:00',
    date: '2026-08-17',
    time: '10:00',
    deletedAt: '20/08/2026 14:15'
  }
];

export const STAFF_WORKERS: StaffWorker[] = [
  {
    id: 'staff-1',
    name: 'Elena Morales',
    role: 'Cuidadora Principal (Planta 1)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    unit: 'Planta 1 — Cuidados Asistenciales'
  },
  {
    id: 'staff-2',
    name: 'Dr. Carlos Ramírez',
    role: 'Médico de Residencia',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    unit: 'Área Médica y Valoración'
  },
  {
    id: 'staff-3',
    name: 'Marta Gil',
    role: 'Enfermera de Turno',
    avatar: 'https://images.unsplash.com/photo-1594824813596-f947e4f35b40?auto=format&fit=crop&q=80&w=250',
    unit: 'Enfermería y Curas'
  },
  {
    id: 'staff-4',
    name: 'Javier Ortega',
    role: 'Fisioterapeuta y Rehabilitación',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250',
    unit: 'Gimnasio Terapéutico'
  },
  {
    id: 'staff-5',
    name: 'Silvia Benítez',
    role: 'Trabajadora Social y Administración',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    unit: 'Atención a Familias'
  }
];

export const INITIAL_SUPPLIES: SupplyEntry[] = [
  {
    id: 'sup-1',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    type: 'gasto_adicional',
    description: 'Paquete de empapadores de alta absorción (30 uds)',
    quantity: '1 paquete',
    cost: 18.50,
    paymentStatus: 'pendiente',
    date: '2026-08-19',
    time: '11:45',
    recordedByName: 'Elena Morales',
    recordedByRole: 'cuidador'
  },
  {
    id: 'sup-2',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    type: 'entrega_familiar',
    description: 'Crema hidratante dérmica de urea 10% y toallitas húmedas hipoalergénicas',
    quantity: '2 botes + 3 paquetes',
    date: '2026-08-19',
    time: '16:30',
    workerId: 'staff-1',
    workerName: 'Elena Morales',
    workerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    deliveredBy: 'Lucía Delgado (Hija)',
    recordedByName: 'Lucía Delgado',
    recordedByRole: 'familiar'
  },
  {
    id: 'sup-3',
    residentId: 'res-1',
    residentName: 'Carmen Delgado Serrano',
    type: 'gasto_adicional',
    description: 'Servicio externo de podología y quiropodia geriátrica especializada',
    quantity: '1 sesión',
    cost: 26.00,
    paymentStatus: 'pagado',
    paidBy: 'Lucía Delgado (Hija)',
    paidAt: '2026-08-15 17:00',
    date: '2026-08-14',
    time: '12:15',
    recordedByName: 'Elena Morales',
    recordedByRole: 'cuidador'
  }
];

export const INITIAL_SEDES: SedeInfo[] = [
  {
    id: 'sede-1',
    name: 'Sede Central (Madrid Centro)',
    shortName: 'Sede Central',
    city: 'Madrid',
    address: 'C/ Mayor 48, Centro, Madrid',
    residentCount: 24,
    activeShiftsCount: 1,
    totalWorkers: 16
  },
  {
    id: 'sede-2',
    name: 'Sede Norte (Miraflores)',
    shortName: 'Sede Norte',
    city: 'Madrid',
    address: 'Av. de la Sierra 12, Miraflores',
    residentCount: 18,
    activeShiftsCount: 1,
    totalWorkers: 12
  },
  {
    id: 'sede-3',
    name: 'Sede Jardines (El Pinar)',
    shortName: 'Sede Jardines',
    city: 'Pozuelo de Alarcón',
    address: 'Paseo de los Pinos 5, Pozuelo',
    residentCount: 30,
    activeShiftsCount: 1,
    totalWorkers: 20
  }
];

export const INITIAL_SHIFTS: ShiftInfo[] = [
  {
    id: 'shift-noche',
    sedeId: 'sede-1',
    name: 'Turno Noche',
    timeRange: '23:00 - 07:00',
    status: 'cerrado',
    coveredResidentsCount: 24,
    assignedWorkers: [
      {
        id: 'worker-1',
        name: 'Roberto Méndez',
        role: 'Auxiliar Nocturno',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        scheduledHours: '23:00 - 07:00'
      },
      {
        id: 'worker-2',
        name: 'Patricia Gómez',
        role: 'Enfermera de Guardia',
        avatar: 'https://images.unsplash.com/photo-1594824813596-f947e4f35b40?auto=format&fit=crop&q=80&w=250',
        scheduledHours: '23:00 - 07:00'
      }
    ],
    closedReport: {
      completionRate: 96,
      completedTasksCount: 24,
      pendingTasksCount: 1,
      pendingTasksList: [
        'Revisión postural y confort 04:30 — Manuel Pérez González'
      ],
      incidentsCount: 0,
      incidentsSummary: 'Sin incidencias médicas, caídas ni traslados de urgencia reportados durante la madrugada.'
    }
  },
  {
    id: 'shift-manana',
    sedeId: 'sede-1',
    name: 'Turno Mañana',
    timeRange: '07:00 - 15:00',
    status: 'activo',
    coveredResidentsCount: 24,
    isFinishingSoon: true,
    pendingTasksCount: 3,
    totalTasksCount: 12,
    assignedWorkers: [
      {
        id: 'staff-1',
        name: 'Elena Morales',
        role: 'Cuidadora Principal (Planta 1)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
        scheduledHours: '07:00 - 15:00'
      },
      {
        id: 'staff-4',
        name: 'Javier Ortega',
        role: 'Fisioterapeuta y Rehabilitación',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250',
        scheduledHours: '08:30 - 14:30'
      },
      {
        id: 'staff-3',
        name: 'Marta Gil',
        role: 'Enfermera de Turno',
        avatar: 'https://images.unsplash.com/photo-1594824813596-f947e4f35b40?auto=format&fit=crop&q=80&w=250',
        scheduledHours: '07:00 - 15:00'
      }
    ]
  },
  {
    id: 'shift-tarde',
    sedeId: 'sede-1',
    name: 'Turno Tarde',
    timeRange: '15:00 - 23:00',
    status: 'futuro',
    coveredResidentsCount: 24,
    assignedWorkers: [
      {
        id: 'worker-3',
        name: 'Lucía Santos',
        role: 'Cuidadora de Tarde',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
        scheduledHours: '15:00 - 23:00'
      },
      {
        id: 'worker-4',
        name: 'David Ramos',
        role: 'Auxiliar de Cuidados Asistenciales',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
        scheduledHours: '15:00 - 23:00'
      }
    ]
  },
  {
    id: 'shift-noche-siguiente',
    sedeId: 'sede-1',
    name: 'Turno Noche (Próximo)',
    timeRange: '23:00 - 07:00',
    status: 'futuro',
    coveredResidentsCount: 24,
    assignedWorkers: [
      {
        id: 'worker-1',
        name: 'Roberto Méndez',
        role: 'Auxiliar Nocturno',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        scheduledHours: '23:00 - 07:00'
      }
    ]
  }
];

export const MOCK_USER_CENTROS: Record<string, UserCentro[]> = {
  // Martha Rodríguez: Cuidadora vinculada a 2 centros en Bogotá y La Calera (Multi-centro -> Modal)
  mrodriguez: [
    {
      idCentro: 1,
      codigoCentro: 'SEDE-CENTRAL',
      nombreCentro: 'Sede Central Bogotá',
      ciudad: 'Bogotá D.C.',
      direccion: 'Calle 127 # 19-45, Usaquén',
      idOrganizacion: 1,
      codigoOrganizacion: 'ORG-SAMANYA',
      nombreOrganizacion: 'Samanya Senior Living',
      codigoRol: 'CUIDADOR',
      nombreRol: 'Enfermera Jefe / Cuidadora Principal',
      esSedePrincipal: true
    },
    {
      idCentro: 2,
      codigoCentro: 'SEDE-NORTE',
      nombreCentro: 'Sede Campestre La Calera',
      ciudad: 'La Calera',
      direccion: 'Km 4 Vía La Calera',
      idOrganizacion: 1,
      codigoOrganizacion: 'ORG-SAMANYA',
      nombreOrganizacion: 'Samanya Senior Living',
      codigoRol: 'CUIDADOR',
      nombreRol: 'Cuidadora de Apoyo Asistencial',
      esSedePrincipal: false
    }
  ],

  // Carlos Ramírez: Cuidador vinculado a 1 solo centro (Mono-centro -> Acceso directo)
  cramirez: [
    {
      idCentro: 1,
      codigoCentro: 'SEDE-CENTRAL',
      nombreCentro: 'Sede Central Bogotá',
      ciudad: 'Bogotá D.C.',
      direccion: 'Calle 127 # 19-45, Usaquén',
      idOrganizacion: 1,
      codigoOrganizacion: 'ORG-SAMANYA',
      nombreOrganizacion: 'Samanya Senior Living',
      codigoRol: 'CUIDADOR',
      nombreRol: 'Cuidador Asistencial TM',
      esSedePrincipal: true
    }
  ],

  // Administrador Principal: Acceso a las sedes de la organización (Multi-centro -> Modal)
  admin: [
    {
      idCentro: 1,
      codigoCentro: 'SEDE-CENTRAL',
      nombreCentro: 'Sede Central Bogotá',
      ciudad: 'Bogotá D.C.',
      direccion: 'Calle 127 # 19-45, Usaquén',
      idOrganizacion: 1,
      codigoOrganizacion: 'ORG-SAMANYA',
      nombreOrganizacion: 'Samanya Senior Living',
      codigoRol: 'ADMIN',
      nombreRol: 'Administrador General',
      esSedePrincipal: true
    },
    {
      idCentro: 2,
      codigoCentro: 'SEDE-NORTE',
      nombreCentro: 'Sede Campestre La Calera',
      ciudad: 'La Calera',
      direccion: 'Km 4 Vía La Calera',
      idOrganizacion: 1,
      codigoOrganizacion: 'ORG-SAMANYA',
      nombreOrganizacion: 'Samanya Senior Living',
      codigoRol: 'ADMIN',
      nombreRol: 'Supervisión de Sede Campestre',
      esSedePrincipal: false
    }
  ],

  // Javier Pérez: Familiar de Manuel Pérez en Sede Central (Mono-centro -> Acceso directo)
  jperez: [
    {
      idCentro: 1,
      codigoCentro: 'SEDE-CENTRAL',
      nombreCentro: 'Sede Central Bogotá',
      ciudad: 'Bogotá D.C.',
      direccion: 'Calle 127 # 19-45, Usaquén',
      idOrganizacion: 1,
      codigoOrganizacion: 'ORG-SAMANYA',
      nombreOrganizacion: 'Samanya Senior Living',
      codigoRol: 'FAMILIAR',
      nombreRol: 'Familiar Responsable',
      esSedePrincipal: true
    }
  ],

  // Lucía Delgado: Familiar de Carmen Delgado en Sede Central (Mono-centro -> Acceso directo)
  ldelgado: [
    {
      idCentro: 1,
      codigoCentro: 'SEDE-CENTRAL',
      nombreCentro: 'Sede Central Bogotá',
      ciudad: 'Bogotá D.C.',
      direccion: 'Calle 127 # 19-45, Usaquén',
      idOrganizacion: 1,
      codigoOrganizacion: 'ORG-SAMANYA',
      nombreOrganizacion: 'Samanya Senior Living',
      codigoRol: 'FAMILIAR',
      nombreRol: 'Familiar Responsable',
      esSedePrincipal: true
    }
  ],

  // Sofía Delgado: Familiar con residentes en ambas sedes (Multi-centro -> Modal)
  sdelgado: [
    {
      idCentro: 1,
      codigoCentro: 'SEDE-CENTRAL',
      nombreCentro: 'Sede Central Bogotá',
      ciudad: 'Bogotá D.C.',
      direccion: 'Calle 127 # 19-45, Usaquén',
      idOrganizacion: 1,
      codigoOrganizacion: 'ORG-SAMANYA',
      nombreOrganizacion: 'Samanya Senior Living',
      codigoRol: 'FAMILIAR',
      nombreRol: 'Acudiente Principal',
      esSedePrincipal: true
    },
    {
      idCentro: 2,
      codigoCentro: 'SEDE-NORTE',
      nombreCentro: 'Sede Campestre La Calera',
      ciudad: 'La Calera',
      direccion: 'Km 4 Vía La Calera',
      idOrganizacion: 1,
      codigoOrganizacion: 'ORG-SAMANYA',
      nombreOrganizacion: 'Samanya Senior Living',
      codigoRol: 'FAMILIAR',
      nombreRol: 'Acudiente Vinculado',
      esSedePrincipal: false
    }
  ]
};



