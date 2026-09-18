import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Resident,
  ResidentMedication,
  TaskItem,
  ActivityEvent,
  BitacoraEntry,
  VitalSigns,
  IncidentReport,
  ConsentRecord,
  AppNotification,
  UserRole,
  ConsentType,
  FamiliarTab,
  ClinicalRecord,
  DeletedClinicalRecord,
  SupplyEntry,
  StaffWorker,
  AdminTab,
  AdminSubrole,
  SedeInfo,
  ShiftInfo,
  UserCentro
} from '../types';
import {
  INITIAL_RESIDENTS,
  INITIAL_TASKS,
  INITIAL_ACTIVITY_TIMELINE,
  INITIAL_BITACORA,
  INITIAL_VITALS,
  INITIAL_INCIDENTS,
  INITIAL_CONSENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CLINICAL_RECORDS,
  INITIAL_DELETED_CLINICAL_RECORDS,
  INITIAL_SUPPLIES,
  STAFF_WORKERS,
  INITIAL_SEDES,
  INITIAL_SHIFTS,
  MOCK_USER_CENTROS
} from '../data/mockData';
import { api, removeAuthToken, setActiveCentroContext, getActiveCentroContext } from '../services/api';

interface AppContextType {
  // Authentication & Role
  isLoggedIn: boolean;
  currentUser: {
    name: string;
    email: string;
    role: UserRole;
    shift: string;
    unit: string;
    avatar: string;
  };
  user: {
    name: string;
    email: string;
    role: UserRole;
    shift: string;
    unit: string;
    avatar: string;
  };
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole, subrole?: AdminSubrole) => void;

  // Centro & Organización (Multi-Tenant / Multi-Sede)
  assignedCentros: UserCentro[];
  activeCentro: UserCentro | null;
  activeOrganizacionId: number | string | null;
  pendingCentroSelection: boolean;
  selectActiveCentro: (centro: UserCentro) => void;
  cancelCentroSelection: () => void;
  switchActiveCentro: (centro: UserCentro) => void;

  // Navigation (Cuidador)
  activeTab: 'inicio' | 'tareas' | 'residentes' | 'consentimientos' | 'perfil';
  setActiveTab: (tab: 'inicio' | 'tareas' | 'residentes' | 'consentimientos' | 'perfil') => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;

  // Navigation (Familiar / Responsable)
  activeFamiliarTab: FamiliarTab;
  setActiveFamiliarTab: (tab: FamiliarTab) => void;
  selectedFamiliarResidentId: string;
  setSelectedFamiliarResidentId: (id: string) => void;
  selectedFamiliarResident: Resident;
  familiarResidents: Resident[];

  // Navigation & Management (Administrador / Dueño)
  activeAdminTab: AdminTab;
  setActiveAdminTab: (tab: AdminTab) => void;
  adminSubrole: AdminSubrole;
  setAdminSubrole: (subrole: AdminSubrole) => void;
  selectedSedeId: string;
  setSelectedSedeId: (id: string) => void;
  selectedSede: SedeInfo;
  sedes: SedeInfo[];
  shifts: ShiftInfo[];
  selectedShiftForDetail: ShiftInfo | null;
  setSelectedShiftForDetail: (shift: ShiftInfo | null) => void;
  isShiftDetailModalOpen: boolean;
  setIsShiftDetailModalOpen: (open: boolean) => void;
  isSedePickerModalOpen: boolean;
  setIsSedePickerModalOpen: (open: boolean) => void;
  highlightedShiftId: string | null;
  setHighlightedShiftId: (id: string | null) => void;
  isSimulatingFinishingShift: boolean;
  setIsSimulatingFinishingShift: (val: boolean) => void;
  selectedTaskForAdminDetail: TaskItem | null;
  setSelectedTaskForAdminDetail: (task: TaskItem | null) => void;
  adminTasksStatusFilter: 'todas' | 'pendientes' | 'completadas';
  setAdminTasksStatusFilter: (status: 'todas' | 'pendientes' | 'completadas') => void;
  tasksDateFilter: string;
  setTasksDateFilter: (date: string) => void;

  // Core Data
  residents: Resident[];
  tasks: TaskItem[];
  timelineEvents: ActivityEvent[];
  bitacoraEntries: BitacoraEntry[];
  supplies: SupplyEntry[];
  staffWorkers: StaffWorker[];
  vitalSigns: VitalSigns[];
  incidents: IncidentReport[];
  consents: ConsentRecord[];
  clinicalRecords: ClinicalRecord[];
  deletedClinicalRecords: DeletedClinicalRecord[];
  notifications: AppNotification[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Active Item selections
  selectedResident: Resident | null;
  setSelectedResident: (resident: Resident | null) => void;
  selectedEvent: ActivityEvent | null;
  setSelectedEvent: (event: ActivityEvent | null) => void;
  selectedTaskForMassRegistration: TaskItem | null;
  setSelectedTaskForMassRegistration: (task: TaskItem | null) => void;

  // Modals & Panels State
  isTimelineDrawerOpen: boolean;
  setIsTimelineDrawerOpen: (open: boolean) => void;
  isEventDetailModalOpen: boolean;
  setIsEventDetailModalOpen: (open: boolean) => void;
  isMassRegistrationModalOpen: boolean;
  setIsMassRegistrationModalOpen: (open: boolean) => void;
  isResidentDetailModalOpen: boolean;
  setIsResidentDetailModalOpen: (open: boolean) => void;
  isResidentDetailFullScreen: boolean;
  setIsResidentDetailFullScreen: (full: boolean) => void;
  isBitacoraModalOpen: boolean;
  setIsBitacoraModalOpen: (open: boolean) => void;
  isVitalSignsModalOpen: boolean;
  setIsVitalSignsModalOpen: (open: boolean) => void;
  isIncidentReportOpen: boolean;
  setIsIncidentReportOpen: (open: boolean) => void;
  isNewConsentModalOpen: boolean;
  setIsNewConsentModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isRoleMenuOpen: boolean;
  setIsRoleMenuOpen: (open: boolean) => void;

  // Familiar Modals & Actions
  isConsentSignModalOpen: boolean;
  setIsConsentSignModalOpen: (open: boolean) => void;
  consentToSign: ConsentRecord | null;
  setConsentToSign: (consent: ConsentRecord | null) => void;
  openConsentSignModal: (consent: ConsentRecord) => void;
  signConsent: (consentId: string, approved: boolean, note?: string) => void;
  isFamiliarVitalsModalOpen: boolean;
  setIsFamiliarVitalsModalOpen: (open: boolean) => void;
  isResidentPickerModalOpen: boolean;
  setIsResidentPickerModalOpen: (open: boolean) => void;

  // Actions
  markMedicationAdministered: (taskId: string, photoProofUrl?: string) => void;
  markTaskCompleted: (taskId: string) => void;
  unmarkTaskCompleted: (taskId: string) => void;
  completeMassRegistration: (
    taskId: string,
    normalCount: number,
    exceptions: { residentId: string; residentName: string; note: string; reason: string }[],
    pendingResidents?: string[]
  ) => void;
  addBitacoraEntry: (entry: Omit<BitacoraEntry, 'id' | 'author' | 'time'>) => void;
  addSupplyEntry: (supply: Omit<SupplyEntry, 'id' | 'time' | 'recordedByName' | 'recordedByRole'>) => void;
  updateSupplyPaymentStatus: (supplyId: string, status: 'pendiente' | 'pagado') => void;
  deleteSupplyEntry: (supplyId: string) => void;
  addVitalSigns: (vitals: Omit<VitalSigns, 'id' | 'takenBy' | 'time'>) => void;
  createIncidentReport: (incident: Omit<IncidentReport, 'id' | 'reportedBy' | 'status'>) => void;
  createConsent: (data: {
    residentId: string;
    type: ConsentType;
    description: string;
    documentName?: string;
    recipients: { name: string; relationship: string; email: string }[];
  }) => void;
  addClinicalRecord: (record: Omit<ClinicalRecord, 'id' | 'createdAt' | 'uploadedByRole' | 'uploadedByName'> & {
    uploadedByRole?: 'familiar' | 'cuidador';
    uploadedByName?: string;
    createdAt?: string;
  }) => void;
  updateClinicalRecord: (id: string, updates: Partial<ClinicalRecord>) => boolean;
  deleteClinicalRecord: (id: string) => boolean;
  canEditOrDeleteClinicalRecord: (record: ClinicalRecord) => boolean;
  addResidentMedication: (residentId: string, med: Omit<ResidentMedication, 'id' | 'status'>) => void;
  toggleResidentMedicationStatus: (residentId: string, medId: string) => void;
  deleteResidentMedication: (residentId: string, medId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Toast / Feedback
  toastMessage: string | null;
  toastType: 'success' | 'info' | 'alert';
  showToast: (message: string, type?: 'success' | 'info' | 'alert') => void;
  openResidentHub: (resident: Resident, asModal?: boolean) => void;

  // Dark Mode Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Arrancar por la pantalla de login como requiere el usuario
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Contexto Multi-Sede y Multi-Tenant (Centros y Organizaciones)
  const [assignedCentros, setAssignedCentros] = useState<UserCentro[]>(() => {
    const saved = localStorage.getItem('samanya_assigned_centros');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCentro, setActiveCentro] = useState<UserCentro | null>(() => {
    const saved = localStorage.getItem('samanya_active_centro');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeOrganizacionId, setActiveOrganizacionId] = useState<number | string | null>(() => {
    const saved = localStorage.getItem('samanya_active_org_id');
    return saved ? saved : (activeCentro?.idOrganizacion || 1);
  });

  const [pendingCentroSelection, setPendingCentroSelection] = useState<boolean>(false);
  const [pendingUserData, setPendingUserData] = useState<{
    dbUser: any;
    roleMapped: UserRole;
    centros: UserCentro[];
  } | null>(null);

  const [currentUser, setCurrentUser] = useState({
    name: 'María Rodríguez',
    email: 'mrodriguez@samanya.com.co',
    role: 'cuidador' as UserRole,
    shift: 'Turno Mañana (07:00 - 15:00)',
    unit: 'Ala Norte — Cuidados Asistenciales',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  });

  const [activeTab, setActiveTab] = useState<'inicio' | 'tareas' | 'residentes' | 'consentimientos' | 'perfil'>('inicio');
  const [activeFamiliarTab, setActiveFamiliarTab] = useState<FamiliarTab>('inicio');
  const [selectedFamiliarResidentId, setSelectedFamiliarResidentId] = useState<string>('res-1');
  const [currentScreen, setCurrentScreen] = useState<string>('app');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-19');

  // Admin & Sede States
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('inicio');
  const [adminSubrole, setAdminSubrole] = useState<AdminSubrole>('administrador');
  const [sedes, setSedes] = useState<SedeInfo[]>(INITIAL_SEDES);
  const [selectedSedeId, setSelectedSedeId] = useState<string>('sede-1');
  const [shifts, setShifts] = useState<ShiftInfo[]>(INITIAL_SHIFTS);
  const [selectedShiftForDetail, setSelectedShiftForDetail] = useState<ShiftInfo | null>(null);
  const [isShiftDetailModalOpen, setIsShiftDetailModalOpen] = useState(false);
  const [isSedePickerModalOpen, setIsSedePickerModalOpen] = useState(false);
  const [highlightedShiftId, setHighlightedShiftId] = useState<string | null>(null);
  const [isSimulatingFinishingShift, setIsSimulatingFinishingShift] = useState(false);
  const [selectedTaskForAdminDetail, setSelectedTaskForAdminDetail] = useState<TaskItem | null>(null);
  const [adminTasksStatusFilter, setAdminTasksStatusFilter] = useState<'todas' | 'pendientes' | 'completadas'>('todas');
  const [tasksDateFilter, setTasksDateFilter] = useState<string>('2026-08-19');

  const selectedSede = React.useMemo(() => {
    return sedes.find(s => s.id === selectedSedeId) || sedes[0];
  }, [sedes, selectedSedeId]);

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('samanya_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('samanya_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('samanya_dark_mode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setDarkMode = (val: boolean) => {
    setIsDarkMode(val);
  };

  // Persistence keys
  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem('samanya_residents');
    if (!saved) return INITIAL_RESIDENTS;
    try {
      const parsed: Resident[] = JSON.parse(saved);
      return parsed.map((p) => {
        const init = INITIAL_RESIDENTS.find((i) => i.id === p.id);
        const defaultCentroId =
          p.id === 'res-4' || p.id === 'res-5' || p.id === '4' || p.id === '5' || p.id === '7' || p.id === '8' || p.id === '9' || p.id === '10'
            ? 2
            : 1;
        const assignedIdCentro = p.idCentro || init?.idCentro || defaultCentroId;
        const assignedNombreCentro = Number(assignedIdCentro) === 2 ? 'Sede Campestre La Calera' : 'Sede Central Bogotá';
        return {
          ...p,
          idCentro: assignedIdCentro,
          nombreCentro: p.nombreCentro || init?.nombreCentro || assignedNombreCentro
        };
      });
    } catch {
      return INITIAL_RESIDENTS;
    }
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('samanya_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [timelineEvents, setTimelineEvents] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('samanya_timeline');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_TIMELINE;
  });

  const [bitacoraEntries, setBitacoraEntries] = useState<BitacoraEntry[]>(() => {
    const saved = localStorage.getItem('samanya_bitacora');
    return saved ? JSON.parse(saved) : INITIAL_BITACORA;
  });

  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>(() => {
    const saved = localStorage.getItem('samanya_vitals');
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  });

  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('samanya_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [consents, setConsents] = useState<ConsentRecord[]>(() => {
    const saved = localStorage.getItem('samanya_consents');
    return saved ? JSON.parse(saved) : INITIAL_CONSENTS;
  });

  const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>(() => {
    const saved = localStorage.getItem('samanya_clinical_records');
    return saved ? JSON.parse(saved) : INITIAL_CLINICAL_RECORDS;
  });

  const [deletedClinicalRecords, setDeletedClinicalRecords] = useState<DeletedClinicalRecord[]>(() => {
    const saved = localStorage.getItem('samanya_deleted_clinical_records');
    return saved ? JSON.parse(saved) : INITIAL_DELETED_CLINICAL_RECORDS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('samanya_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [supplies, setSupplies] = useState<SupplyEntry[]>(() => {
    const saved = localStorage.getItem('samanya_supplies');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIES;
  });

  // Modals & Selectors
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);
  const [selectedTaskForMassRegistration, setSelectedTaskForMassRegistration] = useState<TaskItem | null>(null);

  const [isTimelineDrawerOpen, setIsTimelineDrawerOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [isMassRegistrationModalOpen, setIsMassRegistrationModalOpen] = useState(false);
  const [isResidentDetailModalOpen, setIsResidentDetailModalOpen] = useState(false);
  const [isResidentDetailFullScreen, setIsResidentDetailFullScreen] = useState(false);
  const [isBitacoraModalOpen, setIsBitacoraModalOpen] = useState(false);
  const [isVitalSignsModalOpen, setIsVitalSignsModalOpen] = useState(false);
  const [isIncidentReportOpen, setIsIncidentReportOpen] = useState(false);
  const [isNewConsentModalOpen, setIsNewConsentModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  // Familiar specific modals
  const [isConsentSignModalOpen, setIsConsentSignModalOpen] = useState(false);
  const [consentToSign, setConsentToSign] = useState<ConsentRecord | null>(null);
  const [isFamiliarVitalsModalOpen, setIsFamiliarVitalsModalOpen] = useState(false);
  const [isResidentPickerModalOpen, setIsResidentPickerModalOpen] = useState(false);

  // Familiar residents list: si es familiar, utiliza directamente los residentes vinculados de la BD
  const familiarResidents = currentUser.role === 'familiar' ? residents : residents.slice(0, 2);
  const selectedFamiliarResident =
    residents.find(r => r.id === selectedFamiliarResidentId) || familiarResidents[0] || residents[0];

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'alert'>('success');

  const showToast = (message: string, type: 'success' | 'info' | 'alert' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('samanya_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('samanya_residents', JSON.stringify(residents));
  }, [residents]);

  useEffect(() => {
    localStorage.setItem('samanya_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('samanya_timeline', JSON.stringify(timelineEvents));
  }, [timelineEvents]);

  useEffect(() => {
    localStorage.setItem('samanya_bitacora', JSON.stringify(bitacoraEntries));
  }, [bitacoraEntries]);

  useEffect(() => {
    localStorage.setItem('samanya_vitals', JSON.stringify(vitalSigns));
  }, [vitalSigns]);

  useEffect(() => {
    localStorage.setItem('samanya_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('samanya_consents', JSON.stringify(consents));
  }, [consents]);

  useEffect(() => {
    localStorage.setItem('samanya_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('samanya_vitals', JSON.stringify(vitalSigns));
  }, [vitalSigns]);

  useEffect(() => {
    localStorage.setItem('samanya_supplies', JSON.stringify(supplies));
  }, [supplies]);

  useEffect(() => {
    localStorage.setItem('samanya_clinical_records', JSON.stringify(clinicalRecords));
  }, [clinicalRecords]);

  useEffect(() => {
    localStorage.setItem('samanya_deleted_clinical_records', JSON.stringify(deletedClinicalRecords));
  }, [deletedClinicalRecords]);

  // Cargar datos de la Base de Datos Oracle
  const loadDatabaseData = async (targetCentroId?: number | string) => {
    try {
      const cid = targetCentroId ?? activeCentro?.idCentro;
      const [resList, taskList, vitalsList, bitacoraList, consentsList, notifsList] = await Promise.all([
        api.getResidents(cid).catch(() => []),
        api.getTasks().catch(() => []),
        api.getVitalSigns().catch(() => []),
        api.getBitacora().catch(() => []),
        api.getConsents().catch(() => []),
        api.getNotifications().catch(() => [])
      ]);

      if (resList && resList.length > 0) {
        setResidents(resList);
        setSelectedFamiliarResidentId(resList[0].id);
      }
      if (taskList && taskList.length > 0) {
        setTasks(taskList);
      }
      if (vitalsList && vitalsList.length > 0) {
        setVitalSigns(vitalsList);
      }
      if (bitacoraList && bitacoraList.length > 0) {
        setBitacoraEntries(bitacoraList);
      }
      if (consentsList && consentsList.length > 0) {
        setConsents(consentsList);
      }
      if (notifsList && notifsList.length > 0) {
        setNotifications(notifsList);
      }
    } catch (err) {
      console.error('Error al cargar datos desde Oracle DB:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadDatabaseData(activeCentro?.idCentro);
    }
  }, [isLoggedIn, activeCentro?.idCentro]);

  const selectActiveCentro = (centro: UserCentro) => {
    setActiveCentro(centro);
    setActiveOrganizacionId(centro.idOrganizacion);
    setActiveCentroContext(centro.idCentro, centro.idOrganizacion);
    localStorage.setItem('samanya_active_centro', JSON.stringify(centro));
    localStorage.setItem('samanya_active_org_id', String(centro.idOrganizacion));

    if (pendingUserData) {
      const { dbUser, roleMapped } = pendingUserData;
      const isFam = roleMapped === 'familiar';
      setCurrentUser({
        name: dbUser.nombreCompleto,
        email: dbUser.email,
        role: roleMapped,
        shift: isFam ? 'Familiar Responsable Vinculado' : `${centro.nombreCentro} · Turno Asignado`,
        unit: isFam ? 'Portal Familiar' : `${centro.nombreCentro} — Cuidados Asistenciales`,
        avatar: dbUser.avatarUrl || (isFam
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
      });
      setPendingUserData(null);
    }

    setPendingCentroSelection(false);
    setIsLoggedIn(true);
    showToast(`¡Bienvenido(a)! Laborando en ${centro.nombreCentro} (${centro.nombreOrganizacion}).`, 'success');
    loadDatabaseData(centro.idCentro);
  };

  const cancelCentroSelection = () => {
    setPendingCentroSelection(false);
    setPendingUserData(null);
    removeAuthToken();
    showToast('Selección de centro cancelada', 'info');
  };

  const switchActiveCentro = (centro: UserCentro) => {
    setActiveCentro(centro);
    setActiveOrganizacionId(centro.idOrganizacion);
    setActiveCentroContext(centro.idCentro, centro.idOrganizacion);
    localStorage.setItem('samanya_active_centro', JSON.stringify(centro));
    localStorage.setItem('samanya_active_org_id', String(centro.idOrganizacion));
    showToast(`Cambiado a ${centro.nombreCentro} (${centro.nombreOrganizacion})`, 'info');
    loadDatabaseData(centro.idCentro);
  };

  const login = async (usernameOrEmail: string, pass: string): Promise<boolean> => {
    try {
      let dbUser: any;
      let centros: UserCentro[] = [];

      try {
        const result = await api.login(usernameOrEmail, pass);
        dbUser = result.user;
        centros = (result.centros as UserCentro[]) || [];
      } catch (apiErr) {
        // En caso de modo mock / desarrollo sin backend activo
        const lowerKey = usernameOrEmail.trim().toLowerCase();
        const mockCentros = MOCK_USER_CENTROS[lowerKey];
        if (mockCentros) {
          const isFam = lowerKey === 'jperez' || lowerKey === 'ldelgado' || lowerKey === 'sdelgado';
          const isAdmin = lowerKey === 'admin';
          dbUser = {
            id: lowerKey === 'admin' ? 1 : lowerKey === 'mrodriguez' ? 2 : lowerKey === 'cramirez' ? 3 : 8,
            username: lowerKey,
            email: `${lowerKey}@samanya.com.co`,
            nombreCompleto: lowerKey === 'mrodriguez'
              ? 'Martha Cecilia Rodríguez Peña'
              : lowerKey === 'cramirez'
              ? 'Carlos Eduardo Ramírez Soto'
              : lowerKey === 'admin'
              ? 'Administrador Principal Samanya'
              : lowerKey === 'sdelgado'
              ? 'Sofía Delgado Silva'
              : lowerKey === 'ldelgado'
              ? 'Lucía Delgado Serrano'
              : 'Javier Pérez González',
            role: isAdmin ? 'ADMIN' : isFam ? 'FAMILIAR' : 'CUIDADOR',
            nombreRol: isAdmin ? 'Administrador' : isFam ? 'Familiar' : 'Cuidador',
            avatarUrl: undefined
          };
          centros = mockCentros;
        } else {
          throw apiErr;
        }
      }

      // Si no vinieron centros, buscar en mock o asignar centro por defecto
      if (!centros || centros.length === 0) {
        const lowerKey = usernameOrEmail.trim().toLowerCase();
        centros = MOCK_USER_CENTROS[lowerKey] || [
          {
            idCentro: 1,
            codigoCentro: 'SEDE-CENTRAL',
            nombreCentro: 'Sede Central Bogotá',
            ciudad: 'Bogotá D.C.',
            direccion: 'Calle 127 # 19-45, Usaquén',
            idOrganizacion: 1,
            codigoOrganizacion: 'ORG-SAMANYA',
            nombreOrganizacion: 'Samanya Senior Living',
            codigoRol: dbUser.role,
            nombreRol: dbUser.nombreRol,
            esSedePrincipal: true
          }
        ];
      }

      setAssignedCentros(centros);
      localStorage.setItem('samanya_assigned_centros', JSON.stringify(centros));

      const isFam = dbUser.role === 'FAMILIAR';
      const roleMapped: UserRole = isFam ? 'familiar' : dbUser.role === 'ADMIN' ? 'admin' : 'cuidador';

      // REGLA CLAVE DE NEGOCIO:
      // Si el usuario SOLO TIENE 1 CENTRO: entra DIRECTO a la aplicación
      if (centros.length === 1) {
        const unicoCentro = centros[0];
        setActiveCentro(unicoCentro);
        setActiveOrganizacionId(unicoCentro.idOrganizacion);
        setActiveCentroContext(unicoCentro.idCentro, unicoCentro.idOrganizacion);
        localStorage.setItem('samanya_active_centro', JSON.stringify(unicoCentro));
        localStorage.setItem('samanya_active_org_id', String(unicoCentro.idOrganizacion));

        setCurrentUser({
          name: dbUser.nombreCompleto,
          email: dbUser.email,
          role: roleMapped,
          shift: isFam ? 'Familiar Responsable Vinculado' : `${unicoCentro.nombreCentro} · Turno Asignado`,
          unit: isFam ? 'Portal Familiar' : `${unicoCentro.nombreCentro} — Cuidados Asistenciales`,
          avatar: dbUser.avatarUrl || (isFam
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
        });

        setPendingCentroSelection(false);
        setPendingUserData(null);
        setIsLoggedIn(true);
        showToast(`¡Bienvenido(a), ${dbUser.nombreCompleto}! Ingreso directo a ${unicoCentro.nombreCentro}.`, 'success');
        return true;
      }

      // Si el usuario TIENE MÁS DE 1 CENTRO: abre ventana modal para escoger con cuál labora
      setPendingUserData({
        dbUser,
        roleMapped,
        centros
      });
      setPendingCentroSelection(true);
      setIsLoggedIn(false);
      return false;
    } catch (err: any) {
      showToast(err.message || 'Credenciales inválidas', 'alert');
      throw err;
    }
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('samanya_logged_in');
    localStorage.removeItem('samanya_active_centro');
    localStorage.removeItem('samanya_active_org_id');
    localStorage.removeItem('samanya_assigned_centros');
    setActiveCentro(null);
    setActiveOrganizacionId(null);
    setAssignedCentros([]);
    setPendingCentroSelection(false);
    setPendingUserData(null);
    setIsLoggedIn(false);
    showToast('Sesión cerrada correctamente', 'info');
  };

  const switchRole = (newRole: UserRole, subrole?: AdminSubrole) => {
    const targetSubrole = subrole || adminSubrole;
    if (subrole) {
      setAdminSubrole(subrole);
    }
    setCurrentUser(prev => ({
      ...prev,
      role: newRole,
      name:
        newRole === 'cuidador'
          ? 'Elena Morales'
          : newRole === 'familiar'
          ? 'Javier Pérez'
          : targetSubrole === 'dueno'
          ? 'Fernando Ruiz (Dueño)'
          : 'Carlos Vega (Administrador)',
      shift:
        newRole === 'cuidador'
          ? 'Turno Mañana (07:00 - 15:00)'
          : newRole === 'familiar'
          ? 'Familiar asignado a Manuel Pérez'
          : targetSubrole === 'dueno'
          ? 'Dirección General / Dueño'
          : 'Administrador de Sede Central',
      avatar:
        newRole === 'admin'
          ? targetSubrole === 'dueno'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
            : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'
          : prev.avatar
    }));
    setIsRoleMenuOpen(false);
    showToast(
      `Cambiado al perfil de ${
        newRole === 'cuidador'
          ? 'Trabajador / Cuidador'
          : newRole === 'familiar'
          ? 'Responsable / Familiar'
          : targetSubrole === 'dueno'
          ? 'Dueño de Residencia'
          : 'Administrador de Centro'
      }`,
      'info'
    );
  };

  const openResidentHub = (resident: Resident, asModal = false) => {
    setSelectedResident(resident);
    setIsResidentDetailFullScreen(!asModal);
    setIsResidentDetailModalOpen(true);
  };

  const markMedicationAdministered = (taskId: string, photoProofUrl?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'completada',
              medicationDetails: t.medicationDetails
                ? { ...t.medicationDetails, photoProofUrl: photoProofUrl || t.medicationDetails.photoProofUrl }
                : undefined
            }
          : t
      )
    );

    // Add to timeline
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      date: selectedDate,
      time: timeStr,
      type: 'medicacion',
      title: `${task.title} administrada`,
      summary: `${task.residentName || 'Residente'} — Medicación suministrada según prescripción.`,
      residentNames: [task.residentName || 'Residente'],
      fullDetails: {
        overview: `Pauta de medicación suministrada por ${currentUser.name}.`,
        author: `${currentUser.name} (${currentUser.role === 'cuidador' ? 'Cuidadora' : 'Enfermería'})`,
        notes: photoProofUrl ? 'Se adjuntó comprobante fotográfico de la administración.' : undefined,
        attachments: photoProofUrl ? [photoProofUrl] : []
      }
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    showToast('Medicación marcada como Administrada', 'success');
  };

  const markTaskCompleted = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'completada'
            }
          : t
      )
    );

    // Add to timeline
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      date: selectedDate,
      time: timeStr,
      type: (task.type === 'medicacion' ? 'medicacion' : task.type === 'alimentacion' ? 'alimentacion' : 'bitacora') as any,
      title: `${task.title} completada`,
      summary: `${task.residentName || 'Residente'} — Tarea completada con éxito.`,
      residentNames: task.residentName ? [task.residentName] : [],
      fullDetails: {
        overview: `Actividad registrada por ${currentUser.name}.`,
        author: `${currentUser.name} (${currentUser.role === 'cuidador' ? 'Cuidadora' : 'Enfermería'})`,
        notes: task.description || undefined
      }
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    showToast(`"${task.title}" marcada como completada`, 'success');
  };

  const unmarkTaskCompleted = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'pendiente'
            }
          : t
      )
    );
    showToast('Tarea restablecida como pendiente', 'info');
  };

  const completeMassRegistration = (
    taskId: string,
    normalCount: number,
    exceptions: { residentId: string; residentName: string; note: string; reason: string }[],
    pendingResidents?: string[]
  ) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const hasPending = pendingResidents && pendingResidents.length > 0;

    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: hasPending ? 'pendiente' : 'completada',
              mealDetails: t.mealDetails
                ? {
                    ...t.mealDetails,
                    normalCount,
                    exceptions,
                    pendingResidents: pendingResidents || []
                  }
                : {
                    mealType: 'Alimentación del día',
                    totalExpected: normalCount + exceptions.length + (pendingResidents?.length || 0),
                    normalCount,
                    exceptions,
                    pendingResidents: pendingResidents || []
                  }
            }
          : t
      )
    );

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      date: selectedDate,
      time: timeStr,
      type: task.type === 'alimentacion' ? 'alimentacion' : 'bitacora',
      title: hasPending ? `${task.title} (Parcial)` : `${task.title} completado`,
      summary: `${normalCount} normales · ${exceptions.length} excepciones${hasPending ? ` · ${pendingResidents.length} pendientes` : ''}`,
      residentNames: exceptions.length > 0 ? exceptions.map(e => e.residentName) : ['Grupo general'],
      fullDetails: {
        overview: hasPending
          ? `Registro parcial con ${normalCount} ingestas normales, ${exceptions.length} excepciones y ${pendingResidents.length} residentes pendientes.`
          : `Registro completado con ${normalCount} ingestas normales y ${exceptions.length} excepciones.`,
        stats: [
          { label: 'Normales', value: normalCount },
          { label: 'Excepciones', value: exceptions.length }
        ],
        exceptions: exceptions.map(e => ({ residentName: e.residentName, note: `${e.reason ? `[${e.reason}] ` : ''}${e.note}` })),
        author: currentUser.name
      }
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    if (hasPending) {
      showToast(`Registro guardado: quedan ${pendingResidents.length} pendientes`, 'info');
    } else {
      showToast('Registro de alimentación completado', 'success');
    }
    setIsMassRegistrationModalOpen(false);
  };

  const addBitacoraEntry = (entryData: Omit<BitacoraEntry, 'id' | 'author' | 'time'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEntry: BitacoraEntry = {
      ...entryData,
      id: `bit-${Date.now()}`,
      time: timeStr,
      author: `${currentUser.name} (${currentUser.role})`
    };

    setBitacoraEntries(prev => [newEntry, ...prev]);

    // Persistir en Oracle DB
    const resIdNum = parseInt(entryData.residentId?.replace(/\D/g, '') || '1', 10);
    api.addBitacoraEntry({
      residentId: resIdNum,
      contenido: entryData.text,
      grabadoPorVoz: entryData.recordedByVoice,
      audioUrl: (entryData as any).audioUrl,
      fotoAdjuntaUrl: (entryData as any).photoUrl
    }).catch(err => console.error('Error al persistir bitácora en Oracle DB:', err));

    // Timeline event
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      date: entryData.date,
      time: timeStr,
      type: 'bitacora',
      title: `Bitácora: ${entryData.category}`,
      summary: `${entryData.residentName} — ${entryData.text.slice(0, 75)}...`,
      residentNames: [entryData.residentName],
      fullDetails: {
        overview: entryData.text,
        author: currentUser.name,
        notes: entryData.recordedByVoice ? 'Entrada dictada por voz y confirmada.' : undefined
      }
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    showToast('Entrada de bitácora registrada', 'success');
    setIsBitacoraModalOpen(false);
  };

  const addSupplyEntry = (supplyData: Omit<SupplyEntry, 'id' | 'time' | 'recordedByName' | 'recordedByRole'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newSupply: SupplyEntry = {
      ...supplyData,
      id: `sup-${Date.now()}`,
      time: timeStr,
      recordedByName: currentUser.name,
      recordedByRole: currentUser.role
    };

    setSupplies(prev => [newSupply, ...prev]);

    // If registered by familiar (entrega_familiar), generate notification to that worker
    if (supplyData.type === 'entrega_familiar' && supplyData.workerName) {
      const workerNotification: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Nueva entrega de suministros recibida',
        message: `${supplyData.deliveredBy || currentUser.name} entregó "${supplyData.description}" (${supplyData.quantity}) para ${supplyData.residentName}. Recibido por: ${supplyData.workerName}.`,
        timestamp: `${timeStr} · Hoy`,
        isRead: false,
        type: 'suministros',
        targetScreen: 'bitacora'
      };
      setNotifications(prev => [workerNotification, ...prev]);
    }

    // Add to timeline
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      date: supplyData.date,
      time: timeStr,
      type: 'bitacora',
      title: supplyData.type === 'gasto_adicional' ? 'Suministros: Gasto adicional' : 'Suministros: Entrega de familiar',
      summary: `${supplyData.residentName} — ${supplyData.description} (${supplyData.quantity})${supplyData.cost ? ` · ${supplyData.cost.toFixed(2)}€` : ''}`,
      residentNames: [supplyData.residentName],
      fullDetails: {
        overview: supplyData.type === 'gasto_adicional'
          ? `Gasto adicional registrado por ${currentUser.name}: ${supplyData.description}. Cantidad: ${supplyData.quantity}. Costo: ${supplyData.cost?.toFixed(2)}€. Estado: ${supplyData.paymentStatus || 'pendiente'}.`
          : `Entrega de suministros por familiar (${supplyData.deliveredBy || currentUser.name}) a ${supplyData.workerName || 'Personal'}: ${supplyData.description}. Cantidad: ${supplyData.quantity}.`,
        author: currentUser.name
      }
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    showToast(
      supplyData.type === 'gasto_adicional'
        ? 'Gasto adicional registrado correctamente'
        : `Entrega registrada y notificada a ${supplyData.workerName || 'el trabajador'}`,
      'success'
    );
  };

  const updateSupplyPaymentStatus = (supplyId: string, status: 'pendiente' | 'pagado') => {
    setSupplies(prev =>
      prev.map(s => {
        if (s.id === supplyId) {
          const now = new Date();
          const paidTime = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          return {
            ...s,
            paymentStatus: status,
            paidBy: status === 'pagado' ? currentUser.name : undefined,
            paidAt: status === 'pagado' ? paidTime : undefined
          };
        }
        return s;
      })
    );
    showToast(
      status === 'pagado' ? 'Gasto marcado como pagado' : 'Gasto marcado como pendiente',
      'info'
    );
  };

  const deleteSupplyEntry = (supplyId: string) => {
    setSupplies(prev => prev.filter(s => s.id !== supplyId));
    showToast('Registro de suministro eliminado', 'info');
  };

  const addVitalSigns = (vitalsData: Omit<VitalSigns, 'id' | 'takenBy' | 'time'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newVitals: VitalSigns = {
      ...vitalsData,
      id: `vit-${Date.now()}`,
      time: timeStr,
      takenBy: currentUser.name
    };

    setVitalSigns(prev => [newVitals, ...prev]);

    // Persistir en Oracle DB
    const vitalsResId = parseInt(vitalsData.residentId?.replace(/\D/g, '') || '1', 10);
    api.addVitalSigns({
      residentId: vitalsResId,
      bloodPressure: `${vitalsData.systolic}/${vitalsData.diastolic}`,
      systolic: vitalsData.systolic,
      diastolic: vitalsData.diastolic,
      heartRate: vitalsData.heartRate,
      temperature: vitalsData.temperature,
      oxygenSaturation: vitalsData.spO2 || 98,
      glucose: vitalsData.glucose,
      weight: (vitalsData as any).weight,
      notes: vitalsData.notes || (vitalsData as any).observations
    }).catch(err => console.error('Error al persistir signos vitales en Oracle DB:', err));

    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      date: vitalsData.date,
      time: timeStr,
      type: 'signos_vitales',
      title: 'Signos vitales registrados',
      summary: `${vitalsData.residentName} — TA: ${vitalsData.systolic}/${vitalsData.diastolic} mmHg, FC: ${vitalsData.heartRate} lpm, SpO2: ${vitalsData.spO2}%`,
      residentNames: [vitalsData.residentName],
      fullDetails: {
        overview: `Control de constantes vitales tomado por ${currentUser.name}.`,
        stats: [
          { label: 'Tensión Arterial', value: `${vitalsData.systolic}/${vitalsData.diastolic} mmHg` },
          { label: 'Frecuencia Cardíaca', value: `${vitalsData.heartRate} lpm` },
          { label: 'Saturación O2', value: `${vitalsData.spO2}%` },
          { label: 'Temperatura', value: `${vitalsData.temperature} °C` },
          ...(vitalsData.glucose ? [{ label: 'Glucemia', value: `${vitalsData.glucose} mg/dL` }] : [])
        ],
        notes: vitalsData.notes,
        author: currentUser.name
      }
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    showToast('Signos vitales guardados con éxito', 'success');
    setIsVitalSignsModalOpen(false);
  };

  const createIncidentReport = (incidentData: Omit<IncidentReport, 'id' | 'reportedBy' | 'status'>) => {
    const newIncident: IncidentReport = {
      ...incidentData,
      id: `inc-${Date.now()}`,
      reportedBy: currentUser.name,
      status: 'recibido'
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Timeline event
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      date: selectedDate,
      time: incidentData.dateTime.split(' ')[1] || '10:00',
      type: 'incidente',
      title: `Incidente reportado: ${incidentData.incidentType.toUpperCase()} (${incidentData.severity})`,
      summary: `${incidentData.residentNames.join(', ')} — ${incidentData.description.slice(0, 80)}...`,
      residentNames: incidentData.residentNames,
      fullDetails: {
        overview: incidentData.description,
        stats: [
          { label: 'Tipo', value: incidentData.incidentType },
          { label: 'Severidad', value: incidentData.severity }
        ],
        author: currentUser.name,
        attachments: incidentData.photoUrl ? [incidentData.photoUrl] : []
      }
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    // Create an in-app notification for the incident
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Incidente reportado',
      message: `Se ha registrado un reporte de incidente para ${incidentData.residentNames.join(', ')} (${incidentData.incidentType.toUpperCase()}, severidad ${incidentData.severity}). Reportado por: ${currentUser.name}.`,
      timestamp: 'Ahora mismo',
      isRead: false,
      type: 'incidente',
      targetScreen: 'timeline',
      targetId: incidentData.residentIds?.[0]
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('Incidente reportado y notificado en la app', 'success');
    setIsIncidentReportOpen(false);
  };

  const createConsent = (data: {
    residentId: string;
    type: ConsentType;
    description: string;
    documentName?: string;
    recipients: { name: string; relationship: string; email: string }[];
  }) => {
    const resident = residents.find(r => r.id === data.residentId);
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newConsent: ConsentRecord = {
      id: `cons-${Date.now()}`,
      residentId: data.residentId,
      residentName: resident?.name || 'Residente',
      room: resident?.room || 'Habitación no asignada',
      type: data.type,
      status: 'pendiente',
      sentDate: dateStr,
      description: data.description,
      documentName: data.documentName || 'Documento_Consentimiento.pdf',
      documentSize: '780 KB',
      recipients: data.recipients.map(r => ({
        ...r,
        status: 'enviado'
      }))
    };

    setConsents(prev => [newConsent, ...prev]);

    // Timeline event
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      date: selectedDate,
      time: dateStr.split(' ')[1] || '11:00',
      type: 'consentimiento',
      title: `Consentimiento enviado: ${data.type}`,
      summary: `Enviado a ${data.recipients.map(r => r.name).join(', ')} para ${resident?.name}.`,
      residentNames: [resident?.name || 'Residente'],
      fullDetails: {
        overview: data.description,
        author: currentUser.name,
        stats: [{ label: 'Destinatarios', value: data.recipients.length }]
      }
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    showToast('Consentimiento enviado al familiar responsable', 'success');
    setIsNewConsentModalOpen(false);
  };

  const addResidentMedication = (residentId: string, med: Omit<ResidentMedication, 'id' | 'status'>) => {
    const newMed: ResidentMedication = {
      ...med,
      id: `med-${Date.now()}`,
      status: 'pendiente'
    };

    setResidents(prev =>
      prev.map(r => {
        if (r.id === residentId) {
          const currentMeds = r.medications || [];
          return { ...r, medications: [...currentMeds, newMed] };
        }
        return r;
      })
    );

    if (selectedResident && selectedResident.id === residentId) {
      setSelectedResident(prev => (prev ? { ...prev, medications: [...(prev.medications || []), newMed] } : null));
    }

    showToast(`Medicación ${med.drugName} agregada`, 'success');
  };

  const toggleResidentMedicationStatus = (residentId: string, medId: string) => {
    setResidents(prev =>
      prev.map(r => {
        if (r.id === residentId) {
          const updatedMeds = (r.medications || []).map(m =>
            m.id === medId ? { ...m, status: (m.status === 'pendiente' ? 'administrado' : 'pendiente') as 'pendiente' | 'administrado' } : m
          );
          return { ...r, medications: updatedMeds };
        }
        return r;
      })
    );

    if (selectedResident && selectedResident.id === residentId) {
      setSelectedResident(prev => {
        if (!prev) return null;
        const updatedMeds = (prev.medications || []).map(m =>
          m.id === medId ? { ...m, status: (m.status === 'pendiente' ? 'administrado' : 'pendiente') as 'pendiente' | 'administrado' } : m
        );
        return { ...prev, medications: updatedMeds };
      });
    }

    showToast('Estado de medicación actualizado', 'success');
  };

  const deleteResidentMedication = (residentId: string, medId: string) => {
    setResidents(prev =>
      prev.map(r => {
        if (r.id === residentId) {
          return { ...r, medications: (r.medications || []).filter(m => m.id !== medId) };
        }
        return r;
      })
    );

    if (selectedResident && selectedResident.id === residentId) {
      setSelectedResident(prev => (prev ? { ...prev, medications: (prev.medications || []).filter(m => m.id !== medId) } : null));
    }

    showToast('Medicación eliminada', 'info');
  };

  const openConsentSignModal = (consent: ConsentRecord) => {
    setConsentToSign(consent);
    setIsConsentSignModalOpen(true);
  };

  const signConsent = (consentId: string, approved: boolean, note?: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setConsents(prev =>
      prev.map(c => {
        if (c.id === consentId) {
          return {
            ...c,
            status: approved ? 'aprobado' : 'rechazado',
            responseDate: dateStr,
            recipients: c.recipients.map(r => ({
              ...r,
              status: approved ? 'firmado' : 'rechazado'
            }))
          };
        }
        return c;
      })
    );

    // Persistir firma en Oracle DB
    const cIdNum = parseInt(consentId.replace(/\D/g, '') || '1', 10);
    api.signConsent(cIdNum, {
      firmaDigitalHash: `SHA256-DIGITAL-SIGN-${Date.now()}`
    }).catch(err => console.error('Error al firmar consentimiento en Oracle DB:', err));

    const targetConsent = consents.find(c => c.id === consentId);
    if (targetConsent) {
      const newEvent: ActivityEvent = {
        id: `act-${Date.now()}`,
        date: selectedDate,
        time: timeStr,
        type: 'consentimiento',
        title: approved ? `Consentimiento APROBADO y firmado: ${targetConsent.type}` : `Consentimiento RECHAZADO: ${targetConsent.type}`,
        summary: `${targetConsent.residentName} — ${approved ? 'Firmado digitalmente por el familiar responsable.' : 'Rechazado por el familiar.'}`,
        residentNames: [targetConsent.residentName],
        fullDetails: {
          overview: targetConsent.description,
          author: `${currentUser.name} (Familiar / Responsable)`,
          notes: note ? `Nota del familiar: ${note}` : undefined,
          stats: [{ label: 'Resolución', value: approved ? 'Aprobado y Firmado' : 'Rechazado' }]
        }
      };
      setTimelineEvents(prev => [newEvent, ...prev]);

      // Update related notifications
      setNotifications(prev =>
        prev.map(n =>
          n.targetId === consentId || (n.type === 'consentimiento' && !n.isRead)
            ? { ...n, isRead: true }
            : n
        )
      );
    }

    setIsConsentSignModalOpen(false);
    showToast(
      approved ? 'Consentimiento firmado y remitido al centro médico' : 'Consentimiento rechazado',
      approved ? 'success' : 'alert'
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('Todas las notificaciones marcadas como leídas', 'info');
  };

  const canEditOrDeleteClinicalRecord = (record: ClinicalRecord) => {
    // Administradores siempre tienen permisos completos para editar y eliminar
    if (currentUser.role === 'admin' || (currentUser as any).role === 'administrador' || adminSubrole === 'administrador') {
      return true;
    }
    const createdTimestamp = new Date(record.createdAt).getTime();
    // Valid for 24 hours: 24 * 60 * 60 * 1000 ms
    const isWithin24Hours = isNaN(createdTimestamp) || (Date.now() - createdTimestamp) <= 24 * 60 * 60 * 1000;
    const isOwner = !record.uploadedByRole || currentUser.role === record.uploadedByRole;
    return isWithin24Hours && isOwner;
  };

  const addClinicalRecord = (recordData: Omit<ClinicalRecord, 'id' | 'createdAt' | 'uploadedByRole' | 'uploadedByName'> & {
    uploadedByRole?: 'familiar' | 'cuidador';
    uploadedByName?: string;
    createdAt?: string;
  }) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = recordData.date || selectedDate;
    const authorRole = recordData.uploadedByRole || currentUser.role;
    const authorName = recordData.uploadedByName || currentUser.name.replace(/\s*\([^)]*\)/g, '').trim();

    const newRecord: ClinicalRecord = {
      ...recordData,
      id: `cr-${Date.now()}`,
      createdAt: recordData.createdAt || now.toISOString(),
      date: dateStr,
      time: recordData.time || timeStr,
      uploadedByRole: authorRole,
      uploadedByName: authorName
    };

    setClinicalRecords(prev => [newRecord, ...prev]);

    // Also register event in timeline
    const newEvent: ActivityEvent = {
      id: `act-doc-${Date.now()}`,
      date: dateStr,
      time: recordData.time || timeStr,
      type: 'bitacora',
      title: `Documento médico: ${newRecord.title}`,
      summary: `${newRecord.residentName} — ${newRecord.categoryLabel} (${newRecord.entryType === 'archivo' ? newRecord.fileName || 'Archivo' : 'Nota clínica'}). Subido por ${authorName}.`,
      residentNames: [newRecord.residentName],
      photoUrl: newRecord.fileType === 'imagen' ? newRecord.fileUrl : undefined,
      fullDetails: {
        overview: newRecord.description || newRecord.title,
        author: authorName,
        attachments: newRecord.fileName ? [newRecord.fileName] : undefined,
        notes: `Categoría: ${newRecord.categoryLabel}`
      }
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    showToast('Entrada guardada en Historia clínica', 'success');
  };

  const updateClinicalRecord = (id: string, updates: Partial<ClinicalRecord>): boolean => {
    const record = clinicalRecords.find(r => r.id === id);
    if (!record) return false;

    if (!canEditOrDeleteClinicalRecord(record)) {
      showToast('Solo el autor puede editar este registro durante las primeras 24 horas', 'alert');
      return false;
    }

    setClinicalRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
    showToast('Registro clínico actualizado', 'success');
    return true;
  };

  const deleteClinicalRecord = (id: string): boolean => {
    const record = clinicalRecords.find(r => r.id === id);
    if (!record) return false;

    if (!canEditOrDeleteClinicalRecord(record)) {
      showToast('No se puede eliminar: han pasado más de 24 horas o no es el autor', 'alert');
      return false;
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const deletedTimestamp = `${day}/${month}/${year} ${hours}:${minutes}`;

    const deletedEntry: DeletedClinicalRecord = {
      id: `del-cr-${Date.now()}`,
      recordId: record.id,
      residentId: record.residentId,
      residentName: record.residentName,
      title: record.title,
      category: record.category,
      categoryLabel: record.categoryLabel,
      description: record.description,
      entryType: record.entryType,
      fileType: record.fileType,
      fileName: record.fileName,
      fileSize: record.fileSize,
      fileUrl: record.fileUrl,
      uploadedByRole: record.uploadedByRole,
      uploadedByName: record.uploadedByName,
      createdAt: record.createdAt,
      date: record.date,
      time: record.time,
      deletedAt: deletedTimestamp
    };

    setDeletedClinicalRecords(prev => [deletedEntry, ...prev]);
    setClinicalRecords(prev => prev.filter(r => r.id !== id));
    showToast('Registro eliminado y registrado en la lista de eliminados', 'info');
    return true;
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        user: currentUser,
        login,
        logout,
        switchRole,
        assignedCentros,
        activeCentro,
        activeOrganizacionId,
        pendingCentroSelection,
        selectActiveCentro,
        cancelCentroSelection,
        switchActiveCentro,
        activeTab,
        setActiveTab,
        activeFamiliarTab,
        setActiveFamiliarTab,
        selectedFamiliarResidentId,
        setSelectedFamiliarResidentId,
        selectedFamiliarResident,
        familiarResidents,
        activeAdminTab,
        setActiveAdminTab,
        adminSubrole,
        setAdminSubrole,
        selectedSedeId,
        setSelectedSedeId,
        selectedSede,
        sedes,
        shifts,
        selectedShiftForDetail,
        setSelectedShiftForDetail,
        isShiftDetailModalOpen,
        setIsShiftDetailModalOpen,
        isSedePickerModalOpen,
        setIsSedePickerModalOpen,
        highlightedShiftId,
        setHighlightedShiftId,
        isSimulatingFinishingShift,
        setIsSimulatingFinishingShift,
        selectedTaskForAdminDetail,
        setSelectedTaskForAdminDetail,
        adminTasksStatusFilter,
        setAdminTasksStatusFilter,
        tasksDateFilter,
        setTasksDateFilter,
        currentScreen,
        setCurrentScreen,
        residents,
        tasks,
        timelineEvents,
        bitacoraEntries,
        supplies,
        staffWorkers: STAFF_WORKERS,
        vitalSigns,
        incidents,
        consents,
        clinicalRecords,
        deletedClinicalRecords,
        notifications,
        selectedDate,
        setSelectedDate,
        selectedResident,
        setSelectedResident,
        selectedEvent,
        setSelectedEvent,
        selectedTaskForMassRegistration,
        setSelectedTaskForMassRegistration,
        isTimelineDrawerOpen,
        setIsTimelineDrawerOpen,
        isEventDetailModalOpen,
        setIsEventDetailModalOpen,
        isMassRegistrationModalOpen,
        setIsMassRegistrationModalOpen,
        isResidentDetailModalOpen,
        setIsResidentDetailModalOpen,
        isResidentDetailFullScreen,
        setIsResidentDetailFullScreen,
        isBitacoraModalOpen,
        setIsBitacoraModalOpen,
        isVitalSignsModalOpen,
        setIsVitalSignsModalOpen,
        isIncidentReportOpen,
        setIsIncidentReportOpen,
        isNewConsentModalOpen,
        setIsNewConsentModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isRoleMenuOpen,
        setIsRoleMenuOpen,
        isConsentSignModalOpen,
        setIsConsentSignModalOpen,
        consentToSign,
        setConsentToSign,
        openConsentSignModal,
        signConsent,
        isFamiliarVitalsModalOpen,
        setIsFamiliarVitalsModalOpen,
        isResidentPickerModalOpen,
        setIsResidentPickerModalOpen,
        markMedicationAdministered,
        markTaskCompleted,
        unmarkTaskCompleted,
        completeMassRegistration,
        addBitacoraEntry,
        addSupplyEntry,
        updateSupplyPaymentStatus,
        deleteSupplyEntry,
        addVitalSigns,
        createIncidentReport,
        createConsent,
        addClinicalRecord,
        updateClinicalRecord,
        deleteClinicalRecord,
        canEditOrDeleteClinicalRecord,
        addResidentMedication,
        toggleResidentMedicationStatus,
        deleteResidentMedication,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        toastMessage,
        toastType,
        showToast,
        openResidentHub,
        isDarkMode,
        toggleDarkMode,
        setDarkMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
