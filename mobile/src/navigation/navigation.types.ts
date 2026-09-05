export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: { email?: string };
};

export type CuidadorTabParamList = {
  Inicio: undefined;
  Tareas: undefined;
  Residentes: undefined;
  Consentimientos: undefined;
  Perfil: undefined;
};

export type FamiliarTabParamList = {
  Inicio: undefined;
  Bitacora: undefined;
  Residente: undefined;
  Perfil: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Personal: undefined;
  Admisiones: undefined;
  Auditoria: undefined;
  Ajustes: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  CuidadorRoot: undefined;
  FamiliarRoot: undefined;
  AdminRoot: undefined;
  ResidentDetailModal: { residentId: number };
  ConsentSignModal: { consentId: number };
  VitalSignsModal: { residentId: number };
  IncidentReportModal: { residentId?: number };
  QRScannerModal: undefined;
  NotificationsModal: undefined;
};
