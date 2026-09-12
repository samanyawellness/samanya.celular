import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export const AdminHomeScreen: React.FC = () => {
  const {
    adminSubrole,
    selectedSede,
    tasks,
    shifts,
    setActiveAdminTab,
    setHighlightedShiftId,
    setSelectedShiftForDetail,
    setIsShiftDetailModalOpen,
    isSimulatingFinishingShift,
    setIsSimulatingFinishingShift
  } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completada').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeShifts = shifts.filter(s => s.status === 'activo');
  const activeShift = activeShifts[0] || shifts[1];

  // Expiring shift with pending tasks rule
  const expiringShift = isSimulatingFinishingShift
    ? activeShift
    : shifts.find(s => s.status === 'activo' && s.isFinishingSoon && (s.pendingTasksCount || 0) > 0);

  const handleGoToExpiringShift = () => {
    if (expiringShift) {
      setHighlightedShiftId(expiringShift.id);
      setActiveAdminTab('turnos');
    }
  };

  return (
    <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1">
      {/* 1. Header */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-[#292A24]">
          Resumen general del día
        </h2>
      </div>

      {/* 2. ALERTA DESTACADA: Turno por terminar (10 min antes) con tareas pendientes */}
      {expiringShift && (
        <div
          id="alert-box-expiring-shift"
          className="p-4 bg-[#FEF7EE] rounded-2xl border border-[#C68A3D] text-[#292A24] space-y-3 shadow-xs animate-in fade-in duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBE9D2] flex items-center justify-center shrink-0 text-[#C68A3D]">
              <AlertTriangle className="w-5 h-5 text-[#9A5B12]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-[#9A5B12]">
                  Aviso · Turno por terminar
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#9A5B12] text-white">
                  Faltan 10 min
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#292A24] mt-1">
                {expiringShift.name}: {pendingTasks} tareas pendientes de registrar
              </h3>
            </div>
          </div>

          <button
            id="btn-alert-go-to-shift"
            type="button"
            onClick={handleGoToExpiringShift}
            className="touch-target w-full py-2.5 px-4 bg-[#C68A3D] hover:bg-[#b0782f] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <span>Ver turno</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. RESUMEN DEL DÍA DEL CENTRO: Metrics cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Metric 1: % Cumplimiento de tareas */}
        <div
          onClick={() => setActiveAdminTab('tareas')}
          className="bg-white p-4 rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-2 cursor-pointer hover:border-[#068591]/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5C6058]">Cumplimiento</span>
            <div className="w-7 h-7 rounded-xl bg-[#DFF3E7] text-[#1E7A4C] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#292A24] tracking-tight">
              {completionRate}%
            </span>
            <span className="text-xs font-semibold text-[#1E7A4C]">
              {completedTasks}/{totalTasks}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#F7F7F8] rounded-full overflow-hidden border border-[#DEDBD1]/60">
            <div
              className="h-full bg-[#1E7A4C] transition-all duration-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5C6058] pt-0.5">
            <span>{pendingTasks} pendientes</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#068591] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 2: Turnos activos ahora */}
        <div
          onClick={() => setActiveAdminTab('turnos')}
          className="bg-white p-4 rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-2 cursor-pointer hover:border-[#068591]/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5C6058]">Turnos activos</span>
            <div className="w-7 h-7 rounded-xl bg-[#D9F0F1] text-[#068591] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#075158] tracking-tight">
              {activeShifts.length}
            </span>
            <span className="text-xs font-semibold text-[#068591]">
              activo ahora
            </span>
          </div>

          <div className="text-xs text-[#292A24] font-bold truncate">
            {activeShift?.name || 'Turno Mañana'}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5C6058] pt-0.5">
            <span>{activeShift?.timeRange || '07:00 - 15:00'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#068591] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 4. Active Shift Snapshot Card */}
      <div className="bg-white rounded-3xl p-4 border border-[#DEDBD1] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1E7A4C] animate-pulse" />
            <h3 className="font-bold text-sm text-[#292A24]">
              Personal en servicio activo
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setActiveAdminTab('turnos')}
            className="text-xs font-bold text-[#068591] hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            <span>Ver turnos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {activeShift.assignedWorkers.map((worker) => (
            <div
              key={worker.id}
              className="flex items-center justify-between p-2.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/70"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#068591]/30 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#292A24] truncate">
                    {worker.name}
                  </div>
                  <div className="text-[11px] text-[#5C6058] truncate">
                    {worker.role}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#075158] bg-[#D9F0F1] px-2 py-0.5 rounded-lg shrink-0">
                {worker.scheduledHours || activeShift.timeRange}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
