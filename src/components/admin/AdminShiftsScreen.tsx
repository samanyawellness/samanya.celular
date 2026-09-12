import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Users,
  ChevronRight,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { ShiftInfo } from '../../types';

export const AdminShiftsScreen: React.FC = () => {
  const {
    shifts,
    highlightedShiftId,
    setHighlightedShiftId,
    selectedShiftForDetail,
    setSelectedShiftForDetail,
    setActiveAdminTab,
    setAdminTasksStatusFilter
  } = useApp();

  useEffect(() => {
    if (highlightedShiftId) {
      const element = document.getElementById(`shift-card-${highlightedShiftId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const timer = setTimeout(() => {
        setHighlightedShiftId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedShiftId, setHighlightedShiftId]);

  const handleSelectShift = (shift: ShiftInfo) => {
    setSelectedShiftForDetail(shift);
  };

  // FULL-SCREEN SHIFT DETAIL VIEW (when a shift is selected)
  if (selectedShiftForDetail) {
    const shift = selectedShiftForDetail;
    const isActive = shift.status === 'activo';
    const isClosed = shift.status === 'cerrado';
    const isFuture = shift.status === 'futuro';

    return (
      <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1 animate-in fade-in duration-150">
        {/* Top Back Navigation Bar */}
        <div className="pt-2 pb-2 flex items-center justify-between border-b border-[#DEDBD1]">
          <button
            type="button"
            id="btn-back-to-shifts"
            onClick={() => setSelectedShiftForDetail(null)}
            className="touch-target flex items-center gap-1.5 -ml-1 px-2 py-1.5 rounded-xl text-[#292A24] hover:bg-[#F7F7F8] font-bold text-xs transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#068591]" />
            <span>Volver a turnos</span>
          </button>
          <span className="text-xs font-semibold text-[#5C6058]">
            {shift.timeRange}
          </span>
        </div>

        {/* Shift Title & Status Card */}
        <div className="p-5 bg-white rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-3">
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
              {isActive ? 'Turno Activo' : isClosed ? 'Turno Cerrado' : 'Turno Próximo'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#292A24]">
            {shift.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-[#5C6058]">
            <Clock className="w-4 h-4 text-[#068591]" />
            <span className="font-semibold">{shift.timeRange}</span>
          </div>
        </div>

        {/* Team Assignment (same clean design without 'En servicio' and without resident counts) */}
        <div className="p-5 bg-white rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5C6058] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#068591]" />
              <span>Equipo asignado ({shift.assignedWorkers.length})</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {shift.assignedWorkers.map((worker) => (
              <div
                key={worker.id}
                className="flex items-center justify-between p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#DEDBD1]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#292A24] truncate">
                      {worker.name}
                    </div>
                    <div className="text-[11px] text-[#5C6058] truncate">
                      {worker.role}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#075158] bg-white border border-[#DEDBD1] px-2.5 py-1 rounded-xl shrink-0">
                  {worker.scheduledHours || shift.timeRange}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Verificar tareas de este turno (routes to Tareas with filter 'Pendientes') */}
        <div className="pt-2">
          <button
            type="button"
            id="btn-verify-shift-tasks"
            onClick={() => {
              setSelectedShiftForDetail(null);
              setAdminTasksStatusFilter('pendientes');
              setActiveAdminTab('tareas');
            }}
            className="touch-target w-full py-3.5 bg-[#068591] hover:bg-[#056c76] active:scale-[0.99] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <span>Verificar tareas de este turno</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // SHIFTS LIST VIEW
  return (
    <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1">
      {/* Header: without 'Cuadrante de hoy' */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-[#292A24]">
          Turnos del día
        </h2>
      </div>

      {/* Shifts List */}
      <div className="space-y-3">
        {shifts.map((shift) => {
          const isActive = shift.status === 'activo';
          const isClosed = shift.status === 'cerrado';
          const isFuture = shift.status === 'futuro';
          const isHighlighted = highlightedShiftId === shift.id;

          return (
            <div
              key={shift.id}
              id={`shift-card-${shift.id}`}
              onClick={() => handleSelectShift(shift)}
              className={`rounded-3xl border transition-all cursor-pointer p-4 ${
                isActive
                  ? 'bg-white border-[#068591] ring-2 ring-[#068591]/30 shadow-md'
                  : isHighlighted
                  ? 'bg-[#FEF7EE] border-[#C68A3D] ring-2 ring-[#C68A3D] shadow-sm animate-pulse'
                  : 'bg-white border-[#DEDBD1] shadow-2xs hover:border-[#068591]/40'
              }`}
            >
              {/* Top row: Name, Time (no 'Cubre X residentes'), Status badge (no 'En servicio') */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#292A24]">
                      {shift.name}
                    </h3>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DFF3E7] text-[#1E7A4C] border border-[#1E7A4C]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A4C] animate-pulse" />
                        Activo ahora
                      </span>
                    )}
                    {isClosed && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F7F7F8] text-[#5C6058] border border-[#DEDBD1]">
                        Cerrado
                      </span>
                    )}
                    {isFuture && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D9F0F1] text-[#075158]">
                        Próximo
                      </span>
                    )}
                  </div>
                  {/* Time only, no 'Cubre X residentes' */}
                  <div className="flex items-center gap-1.5 text-xs text-[#5C6058] mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#068591]" />
                    <span className="font-semibold">{shift.timeRange}</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#5C6058] shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Standardized team assignment across all shift types (closed, active, future) */}
              <div className="mt-3 pt-3 border-t border-[#DEDBD1]/60 flex items-center justify-between text-xs text-[#5C6058]">
                <span className="flex items-center gap-1.5 truncate">
                  <Users className="w-3.5 h-3.5 text-[#068591] shrink-0" />
                  <span className="truncate">{shift.assignedWorkers.map(w => w.name.split(' ')[0]).join(', ')}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
