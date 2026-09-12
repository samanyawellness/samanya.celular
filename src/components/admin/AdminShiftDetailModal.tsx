import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  AlertTriangle,
  Info,
  Building2,
  CalendarCheck,
  ArrowRight
} from 'lucide-react';
import { ShiftInfo } from '../../types';

export const AdminShiftDetailModal: React.FC = () => {
  const {
    selectedShiftForDetail,
    setSelectedShiftForDetail,
    isShiftDetailModalOpen,
    setIsShiftDetailModalOpen,
    setActiveAdminTab
  } = useApp();

  if (!isShiftDetailModalOpen || !selectedShiftForDetail) return null;

  const shift = selectedShiftForDetail;
  const isClosed = shift.status === 'cerrado';
  const isActive = shift.status === 'activo';
  const isFuture = shift.status === 'futuro';

  const handleClose = () => {
    setIsShiftDetailModalOpen(false);
    setSelectedShiftForDetail(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="modal-admin-shift-detail"
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#DEDBD1] p-5 pb-7 sm:pb-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#DEDBD1]">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[#DFF3E7] text-[#1E7A4C]'
                    : isClosed
                    ? 'bg-[#F7F7F8] text-[#5C6058] border border-[#DEDBD1]'
                    : 'bg-[#D9F0F1] text-[#075158]'
                }`}
              >
                {isActive ? 'Turno Activo' : isClosed ? 'Turno Cerrado' : 'Turno Futuro'}
              </span>
              <span className="text-xs font-semibold text-[#5C6058]">
                {shift.timeRange}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#292A24] mt-1">
              {shift.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="touch-target p-1.5 rounded-full text-[#5C6058] hover:bg-[#F7F7F8] hover:text-[#292A24]"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CASE 1: TURNO CERRADO -> MINI REPORTE */}
        {isClosed && (
          <div className="space-y-4">
            <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#068591] mb-2 flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4" />
                <span>Mini-reporte de cierre de turno</span>
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-[#DEDBD1]">
                  <div className="text-lg font-black text-[#1E7A4C]">
                    {shift.completionRate}%
                  </div>
                  <div className="text-[10px] font-bold text-[#5C6058]">
                    Completadas
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-[#DEDBD1]">
                  <div className="text-lg font-black text-[#8C2E2E]">
                    {shift.pendingTasksCount}
                  </div>
                  <div className="text-[10px] font-bold text-[#5C6058]">
                    Pendientes
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-[#DEDBD1]">
                  <div className="text-lg font-black text-[#075158]">
                    {shift.incidentsCount}
                  </div>
                  <div className="text-[10px] font-bold text-[#5C6058]">
                    Incidentes
                  </div>
                </div>
              </div>
            </div>

            {/* Incidents check */}
            <div
              className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                shift.incidentsCount === 0
                  ? 'bg-[#DFF3E7]/40 border-[#1E7A4C]/30 text-[#1E7A4C]'
                  : 'bg-[#FBEAEA] border-[#8C2E2E]/30 text-[#8C2E2E]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold">
                  {shift.incidentsCount === 0
                    ? 'Sin incidentes reportados'
                    : `${shift.incidentsCount} incidencias registradas`}
                </div>
                <div className="text-[11px] text-[#5C6058] mt-0.5">
                  {shift.incidentsCount === 0
                    ? 'No se registraron caídas, descompensaciones ni traslados hospitalarios durante este turno.'
                    : 'Revisar registro en bitácora clínica y notificar a dirección médica.'}
                </div>
              </div>
            </div>

            {/* Pending tasks explanation if any */}
            {shift.pendingTasksCount && shift.pendingTasksCount > 0 ? (
              <div className="p-3 bg-[#FEF7EE] rounded-2xl border border-[#C68A3D]/40 text-[#292A24] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#9A5B12]">
                  <AlertCircle className="w-4 h-4 text-[#C68A3D]" />
                  <span>Tareas que quedaron pendientes ({shift.pendingTasksCount})</span>
                </div>
                <p className="text-xs text-[#5C6058] leading-relaxed">
                  Revisión postural y confort 04:30 (Manuel Pérez) — Se respetó descanso nocturno continuo por indicación médica.
                </p>
              </div>
            ) : null}

            {/* Staff who completed the shift */}
            <div>
              <h4 className="text-xs font-bold text-[#292A24] mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#068591]" />
                <span>Personal que cubrió el turno</span>
              </h4>
              <div className="space-y-1.5">
                {shift.assignedWorkers.map(worker => (
                  <div
                    key={worker.id}
                    className="flex items-center justify-between p-2 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1]/60"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#068591]/20"
                      />
                      <span className="text-xs font-bold text-[#292A24]">
                        {worker.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5C6058]">
                      {worker.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: TURNO FUTURO -> ASIGNACIÓN DE SOLO LECTURA CON AVISO */}
        {isFuture && (
          <div className="space-y-4">
            {/* Aviso claro de que no se puede editar ni reasignar desde acá */}
            <div className="p-3.5 bg-[#FEF7EE] rounded-2xl border border-[#C68A3D]/60 flex items-start gap-2.5">
              <Info className="w-5 h-5 text-[#C68A3D] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#9A5B12]">
                  Asignación de solo lectura
                </div>
                <p className="text-xs text-[#5C6058] mt-1 leading-relaxed">
                  Esta pantalla permite consultar la dotación prevista de personal. <strong>No se puede editar ni reasignar turnos desde la app móvil</strong>; cualquier modificación de cuadrante o suplencia se gestiona exclusivamente desde la <strong>plataforma Web de Dirección</strong>.
                </p>
              </div>
            </div>

            {/* Staff list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-[#292A24] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#068591]" />
                  <span>Personal programado ({shift.assignedWorkers.length})</span>
                </h4>
                <span className="text-xs text-[#5C6058]">
                  Cubre {shift.coveredResidentsCount} residentes
                </span>
              </div>

              <div className="space-y-2">
                {shift.assignedWorkers.map(worker => (
                  <div
                    key={worker.id}
                    className="flex items-center justify-between p-2.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#068591]/30"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#292A24]">
                          {worker.name}
                        </div>
                        <div className="text-[11px] text-[#5C6058]">
                          {worker.role}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#075158] bg-[#D9F0F1] px-2 py-0.5 rounded-lg">
                      {worker.scheduledHours || shift.timeRange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASE 3: TURNO ACTIVO */}
        {isActive && (
          <div className="space-y-4">
            <div className="p-3 bg-[#DFF3E7]/50 rounded-2xl border border-[#1E7A4C]/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1E7A4C] animate-pulse" />
                <span className="text-xs font-bold text-[#1E7A4C]">
                  Turno en curso · Horario {shift.timeRange}
                </span>
              </div>
              <span className="text-xs font-bold text-[#292A24]">
                {shift.coveredResidentsCount} residentes
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#292A24] mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#068591]" />
                <span>Personal en planta</span>
              </h4>
              <div className="space-y-2">
                {shift.assignedWorkers.map(worker => (
                  <div
                    key={worker.id}
                    className="flex items-center justify-between p-2.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#068591]/30"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#292A24]">
                          {worker.name}
                        </div>
                        <div className="text-[11px] text-[#5C6058]">
                          {worker.role}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#1E7A4C] bg-[#DFF3E7] px-2 py-0.5 rounded-lg">
                      En servicio
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleClose();
                setActiveAdminTab('tareas');
              }}
              className="touch-target w-full py-3 bg-[#068591] hover:bg-[#056c76] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Verificar tareas de este turno</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="touch-target w-full py-2.5 bg-white border border-[#DEDBD1] hover:bg-[#F7F7F8] text-[#292A24] font-bold text-xs rounded-xl"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
