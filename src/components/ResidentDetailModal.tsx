import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Activity,
  BookOpen,
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  ChevronLeft,
  Check,
  Calendar as CalendarIcon,
  QrCode
} from 'lucide-react';
import { ClinicalHistorySection } from './common/ClinicalHistorySection';
import { ResidentQRPlaceholderScreen } from './ResidentQRPlaceholderScreen';

export const ResidentDetailModal: React.FC = () => {
  const {
    isResidentDetailModalOpen,
    setIsResidentDetailModalOpen,
    isResidentDetailFullScreen,
    selectedResident,
    vitalSigns,
    bitacoraEntries,
    selectedDate: globalSelectedDate,
    setIsBitacoraModalOpen,
    setIsVitalSignsModalOpen,
    setIsIncidentReportOpen,
    setIsNewConsentModalOpen,
    toggleResidentMedicationStatus
  } = useApp();

  // Active tab: 'datos_generales' | 'actividad_hoy' | 'historia_clinica'
  const [activeTab, setActiveTab] = useState<'datos_generales' | 'actividad_hoy' | 'historia_clinica'>('datos_generales');
  const [showQRScreen, setShowQRScreen] = useState(false);

  // Date filter specific to "Actividad de hoy" tab
  const [activityDate, setActivityDate] = useState<string>(
    globalSelectedDate || new Date().toISOString().split('T')[0]
  );

  if (!isResidentDetailModalOpen || !selectedResident) return null;

  // Specific medications from the resident profile
  const medicationsList = selectedResident.medications || [];

  // Vitals for the selected activity date
  const residentVitalsForDate = vitalSigns.filter(
    (v) => (v.residentId === selectedResident.id || v.residentName === selectedResident.name) && v.date === activityDate
  );

  // Bitacora entries for the selected activity date
  const residentBitacoraForDate = bitacoraEntries.filter(
    (b) => (b.residentId === selectedResident.id || b.residentName === selectedResident.name) && b.date === activityDate
  );

  const handleOpenBitacora = () => {
    setIsBitacoraModalOpen(true);
  };

  const handleOpenVitals = () => {
    setIsVitalSignsModalOpen(true);
  };

  const handleOpenIncident = () => {
    setIsIncidentReportOpen(true);
  };

  const handleOpenConsent = () => {
    setIsNewConsentModalOpen(true);
  };

  const containerClasses = isResidentDetailFullScreen
    ? 'fixed inset-0 z-50 bg-[#F7F7F8] overflow-y-auto'
    : 'fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-4';

  const cardClasses = isResidentDetailFullScreen
    ? 'min-h-screen max-w-lg mx-auto pb-24'
    : 'w-full max-w-lg bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-[#DEDBD1] max-h-[92vh] overflow-y-auto space-y-4 custom-scrollbar';

  // Format activity date label nicely
  const formatActivityDateLabel = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        {showQRScreen ? (
          <ResidentQRPlaceholderScreen
            resident={selectedResident}
            onBack={() => setShowQRScreen(false)}
          />
        ) : (
          <>
            {/* Fullscreen Header or Modal Header */}
            {isResidentDetailFullScreen ? (
              <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DEDBD1] px-4 py-2.5 flex items-center justify-between">
                <button
                  id="btn-back-resident-detail"
                  type="button"
                  onClick={() => setIsResidentDetailModalOpen(false)}
                  className="touch-target min-w-[44px] min-h-[44px] flex items-center gap-1 text-[#068591] font-bold text-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Mis residentes</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#5C6058] uppercase hidden sm:inline">
                    Ficha del Residente
                  </span>
                  <button
                    id="btn-resident-qr-fullscreen"
                    type="button"
                    onClick={() => setShowQRScreen(true)}
                    className="touch-target w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#F7F7F8] hover:bg-[#EFECE6] border border-[#DEDBD1] flex items-center justify-center text-[#292A24] active:scale-95 transition-all shadow-2xs"
                    aria-label="Código QR del residente"
                    title="Código QR del residente"
                  >
                    <QrCode className="w-5 h-5 text-[#068591]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pb-2.5 border-b border-[#DEDBD1]">
                <h3 className="font-bold text-base text-[#292A24]">
                  Ficha del Residente
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-resident-qr-modal"
                    type="button"
                    onClick={() => setShowQRScreen(true)}
                    className="touch-target w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#F7F7F8] hover:bg-[#EFECE6] border border-[#DEDBD1] flex items-center justify-center text-[#292A24] active:scale-95 transition-all shadow-2xs"
                    aria-label="Código QR del residente"
                    title="Código QR del residente"
                  >
                    <QrCode className="w-5 h-5 text-[#068591]" />
                  </button>
                  <button
                    id="btn-close-resident-modal"
                    type="button"
                    onClick={() => setIsResidentDetailModalOpen(false)}
                    className="touch-target min-w-[44px] min-h-[44px] p-2 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8] flex items-center justify-center"
                    aria-label="Cerrar ficha"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

        {/* Fixed Header: Name, Age, Room, Red Alert Chips + Quick Action Buttons (Always visible) */}
        <div className="space-y-3.5">
          {/* Header Info (Includes resident photo for visual identification, unboxed clean layout) */}
          <div className="px-1 pt-1 flex items-start gap-3.5">
            {selectedResident.avatar && (
              <img
                src={selectedResident.avatar}
                alt={selectedResident.name}
                className="w-14 h-14 rounded-2xl object-cover border border-[#DEDBD1] shadow-2xs shrink-0"
              />
            )}
            <div className="min-w-0 flex-1 space-y-1.5">
              <div>
                <h2 className="text-xl font-bold text-[#292A24] leading-tight">
                  {selectedResident.name}
                </h2>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#5C6058]">
                  <span>{selectedResident.age} años</span>
                  <span>·</span>
                  <span className="font-semibold text-[#068591]">
                    {selectedResident.room.startsWith('Habitación') ? selectedResident.room : `Habitación ${selectedResident.room}`} · {selectedResident.bed}
                  </span>
                </div>
              </div>

              {/* Medical alert chips in red (risk of fall, allergies, etc. ONLY if the resident has them) */}
              {selectedResident.alerts && selectedResident.alerts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedResident.alerts.map((alert, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#FBEAEA] text-[#8C2E2E] border border-[#F6C8C8] flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{alert}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Buttons (Only Icon + Title, no descriptive subtext) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. Registrar bitácora */}
            <button
              id="btn-hub-bitacora"
              type="button"
              onClick={handleOpenBitacora}
              className="touch-target p-2.5 bg-white hover:bg-[#F7F7F8] active:scale-98 rounded-2xl border border-[#DEDBD1] flex items-center gap-2 text-left shadow-2xs transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#D9F0F1] text-[#068591] group-hover:bg-[#068591] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-[#292A24] leading-tight">
                Registrar bitácora
              </span>
            </button>

            {/* 2. Signos vitales */}
            <button
              id="btn-hub-vitals"
              type="button"
              onClick={handleOpenVitals}
              className="touch-target p-2.5 bg-white hover:bg-[#F7F7F8] active:scale-98 rounded-2xl border border-[#DEDBD1] flex items-center gap-2 text-left shadow-2xs transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#D9F0F1] text-[#068591] group-hover:bg-[#068591] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-[#292A24] leading-tight">
                Signos vitales
              </span>
            </button>

            {/* 3. Reportar incidente */}
            <button
              id="btn-hub-incident"
              type="button"
              onClick={handleOpenIncident}
              className="touch-target p-2.5 bg-white hover:bg-[#FBEAEA]/40 active:scale-98 rounded-2xl border border-[#DEDBD1] flex items-center gap-2 text-left shadow-2xs transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FBEAEA] text-[#8C2E2E] group-hover:bg-[#8C2E2E] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-[#8C2E2E] leading-tight">
                Reportar incidente
              </span>
            </button>

            {/* 4. Consentimientos */}
            <button
              id="btn-hub-consent"
              type="button"
              onClick={handleOpenConsent}
              className="touch-target p-2.5 bg-white hover:bg-[#DFF3E7]/40 active:scale-98 rounded-2xl border border-[#DEDBD1] flex items-center gap-2 text-left shadow-2xs transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#DFF3E7] text-[#1E7A4C] group-hover:bg-[#1E7A4C] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-[#1E7A4C] leading-tight">
                Consentimientos
              </span>
            </button>
          </div>

          {/* 3 Pestañas con selector gris */}
          <div className="flex bg-[#EFECE6] p-1 rounded-2xl border border-[#DEDBD1] mb-1">
            <button
              type="button"
              id="tab-worker-datos-generales"
              onClick={() => setActiveTab('datos_generales')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all text-center ${
                activeTab === 'datos_generales'
                  ? 'bg-white text-[#292A24] shadow-xs'
                  : 'text-[#5C6058] hover:text-[#292A24]'
              }`}
            >
              Datos generales
            </button>
            <button
              type="button"
              id="tab-worker-actividad-hoy"
              onClick={() => setActiveTab('actividad_hoy')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all text-center ${
                activeTab === 'actividad_hoy'
                  ? 'bg-white text-[#292A24] shadow-xs'
                  : 'text-[#5C6058] hover:text-[#292A24]'
              }`}
            >
              Actividad de hoy
            </button>
            <button
              type="button"
              id="tab-worker-historia-clinica"
              onClick={() => setActiveTab('historia_clinica')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all text-center ${
                activeTab === 'historia_clinica'
                  ? 'bg-white text-[#292A24] shadow-xs'
                  : 'text-[#5C6058] hover:text-[#292A24]'
              }`}
            >
              Documentos
            </button>
          </div>
        </div>

        {/* PESTAÑA 1: DATOS GENERALES */}
        {activeTab === 'datos_generales' && (
          <div className="pt-2 space-y-3.5 animate-in fade-in duration-150">
            {/* Movilidad y Dieta como texto plano agrupado */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DEDBD1] space-y-3 shadow-2xs">
              <h3 className="font-bold text-sm text-[#292A24] border-b border-[#DEDBD1] pb-2">
                Movilidad y Dieta
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-[#5C6058] block mb-0.5">Movilidad y Transferencias</span>
                  <p className="text-[#292A24] leading-relaxed">
                    {selectedResident.mobility || 'Sin limitaciones específicas registradas.'}
                  </p>
                </div>
                <div className="border-t border-[#DEDBD1]/60 pt-2.5">
                  <span className="font-bold text-[#5C6058] block mb-0.5">Dieta y Alimentación</span>
                  <p className="text-[#292A24] leading-relaxed">
                    {selectedResident.diet || 'Dieta basal estándar.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Medicación (Plan / Régimen habitual prescrito, no administrado) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DEDBD1] space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#DEDBD1] pb-2">
                <h3 className="font-bold text-sm text-[#292A24]">
                  Plan de medicación habitual
                </h3>
                <span className="text-xs font-semibold text-[#5C6058]">
                  {medicationsList.length} {medicationsList.length === 1 ? 'pauta' : 'pautas'}
                </span>
              </div>

              <div className="space-y-2">
                {medicationsList.length === 0 ? (
                  <p className="text-xs text-[#5C6058] italic py-1">
                    No hay pautas de medicación habitual registradas en la ficha.
                  </p>
                ) : (
                  medicationsList.map((med) => (
                    <div
                      key={med.id}
                      className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#292A24]">
                          {med.drugName}
                        </span>
                        <span className="text-xs font-black text-[#068591] bg-[#D9F0F1] px-2 py-0.5 rounded-lg">
                          {med.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5C6058]">
                        Dosis y vía: {med.dose} · {med.route}
                      </p>
                      {med.details && (
                        <p className="text-[10px] text-[#5C6058] italic">
                          Indicaciones: {med.details}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Familiares y Responsables */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DEDBD1] space-y-3 shadow-2xs">
              <h3 className="font-bold text-sm text-[#292A24] border-b border-[#DEDBD1] pb-2">
                Familiares y Responsables
              </h3>
              <div className="space-y-2">
                {selectedResident.responsible && selectedResident.responsible.length > 0 ? (
                  selectedResident.responsible.map((resp, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] text-xs shadow-2xs"
                    >
                      <div className="font-bold text-[#292A24]">{resp.name}</div>
                      <div className="text-[#5C6058] mt-0.5">{resp.relationship}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#5C6058] italic py-1">
                    No hay familiares o responsables registrados.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: ACTIVIDAD DE HOY */}
        {activeTab === 'actividad_hoy' && (
          <div className="pt-2 space-y-3.5 animate-in fade-in duration-150">
            {/* Filtro de fecha para elegir otra fecha de visualización de sólo esta pestaña (Sin caja ni icono) */}
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs font-bold text-[#292A24]">
                Fecha de visualización:
              </span>
              <input
                id="input-activity-date-filter"
                type="date"
                value={activityDate}
                onChange={(e) => {
                  if (e.target.value) setActivityDate(e.target.value);
                }}
                className="text-xs font-bold px-2.5 py-1.5 bg-white border border-[#DEDBD1] rounded-xl text-[#292A24] focus:outline-none focus:ring-1 focus:ring-[#068591] shadow-2xs cursor-pointer"
              />
            </div>

            {/* 1. Medicación administrada hoy */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DEDBD1] shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#DEDBD1] pb-2">
                <h3 className="font-bold text-sm text-[#292A24]">
                  Medicación administrada
                </h3>
                <span className="text-xs font-semibold text-[#5C6058]">
                  {medicationsList.filter(m => m.status === 'administrado').length}/{medicationsList.length} administradas
                </span>
              </div>

              <div className="space-y-2">
                {medicationsList.length === 0 ? (
                  <p className="text-xs text-[#5C6058] italic py-1">
                    No hay pautas de medicación programadas.
                  </p>
                ) : (
                  medicationsList.map((med) => {
                    const isDone = med.status === 'administrado';
                    return (
                      <div
                        key={med.id}
                        className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#068591]">
                              {med.time}
                            </span>
                            <span className="text-xs font-bold text-[#292A24]">
                              {med.drugName}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5C6058] mt-0.5">
                            Dosis: {med.dose} · {med.route}
                          </p>
                          {med.details && (
                            <p className="text-[10px] text-[#5C6058] italic">
                              {med.details}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          id={`btn-med-toggle-${med.id}`}
                          onClick={() => toggleResidentMedicationStatus(selectedResident.id, med.id)}
                          className={`touch-target flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 ${
                            isDone
                              ? 'bg-[#1E7A4C] text-white hover:bg-[#18643e]'
                              : 'bg-[#C68A3D] text-white hover:bg-[#a9742e]'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" />}
                          <span>{isDone ? 'Administrado' : 'Pendiente'}</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. Signos vitales de hoy */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DEDBD1] shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#DEDBD1] pb-2">
                <h3 className="font-bold text-sm text-[#292A24]">
                  Signos vitales ({formatActivityDateLabel(activityDate)})
                </h3>
                <button
                  type="button"
                  onClick={handleOpenVitals}
                  className="text-xs font-bold text-[#068591] hover:underline"
                >
                  + Registrar toma
                </button>
              </div>

              {residentVitalsForDate.length > 0 ? (
                residentVitalsForDate.map((v) => (
                  <div key={v.id} className="space-y-2">
                    <div className="text-[11px] text-[#5C6058] font-medium">
                      Hora de toma: <strong className="text-[#292A24]">{v.time}</strong>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-[#F7F7F8] border border-[#DEDBD1] p-2.5 rounded-xl text-center shadow-2xs">
                        <div className="text-xs text-[#5C6058]">Tensión</div>
                        <div className="text-sm font-bold text-[#292A24]">
                          {v.systolic}/{v.diastolic}
                        </div>
                        <div className="text-[10px] text-[#5C6058]">mmHg</div>
                      </div>

                      <div className="bg-[#F7F7F8] border border-[#DEDBD1] p-2.5 rounded-xl text-center shadow-2xs">
                        <div className="text-xs text-[#5C6058]">Frecuencia</div>
                        <div className="text-sm font-bold text-[#292A24]">
                          {v.heartRate}
                        </div>
                        <div className="text-[10px] text-[#5C6058]">lpm</div>
                      </div>

                      <div className="bg-[#F7F7F8] border border-[#DEDBD1] p-2.5 rounded-xl text-center shadow-2xs">
                        <div className="text-xs text-[#5C6058]">Sat. O2</div>
                        <div className="text-sm font-bold text-[#292A24]">
                          {v.spO2}%
                        </div>
                        <div className="text-[10px] text-[#5C6058]">óptima</div>
                      </div>

                      <div className="bg-[#F7F7F8] border border-[#DEDBD1] p-2.5 rounded-xl text-center shadow-2xs">
                        <div className="text-xs text-[#5C6058]">Temperatura</div>
                        <div className="text-sm font-bold text-[#292A24]">
                          {v.temperature} °C
                        </div>
                        <div className="text-[10px] text-[#5C6058]">axilar</div>
                      </div>
                    </div>

                    {v.notes && (
                      <p className="text-xs text-[#5C6058] italic bg-[#F7F7F8] p-2 rounded-xl border border-[#DEDBD1]">
                        "{v.notes}" — Por: {v.takenBy}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#5C6058] italic py-1">
                  No hay tomas de signos vitales registradas para esta fecha.
                </p>
              )}
            </div>

            {/* 3. Bitácora de cuidados de hoy */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DEDBD1] shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#DEDBD1] pb-2">
                <h3 className="font-bold text-sm text-[#292A24]">
                  Bitácora de cuidados ({formatActivityDateLabel(activityDate)})
                </h3>
                <button
                  type="button"
                  onClick={handleOpenBitacora}
                  className="text-xs font-bold text-[#068591] hover:underline"
                >
                  + Añadir
                </button>
              </div>

              <div className="space-y-2">
                {residentBitacoraForDate.length === 0 ? (
                  <p className="text-xs text-[#5C6058] italic py-1">
                    No hay anotaciones registradas en la bitácora para esta fecha.
                  </p>
                ) : (
                  residentBitacoraForDate.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] space-y-1 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#068591] bg-[#D9F0F1] px-2 py-0.5 rounded-md">
                          {b.category}
                        </span>
                        <span className="text-xs text-[#5C6058]">{b.time}</span>
                      </div>
                      <p className="text-xs text-[#292A24] leading-relaxed pt-0.5">
                        {b.text}
                      </p>
                      <div className="text-[10px] text-[#5C6058] pt-1 border-t border-[#DEDBD1]/60 flex items-center justify-between">
                        <span>Registrado por: {b.author}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: HISTORIA CLÍNICA (Misma pantalla y componentes que Familiar) */}
        {activeTab === 'historia_clinica' && (
          <div className="pt-2 animate-in fade-in duration-150">
            <ClinicalHistorySection resident={selectedResident} />
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};
