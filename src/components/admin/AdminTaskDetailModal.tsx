import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const AdminTaskDetailModal: React.FC = () => {
  const {
    selectedTaskForAdminDetail,
    setSelectedTaskForAdminDetail
  } = useApp();

  if (!selectedTaskForAdminDetail) return null;

  const task = selectedTaskForAdminDetail;
  const isCompleted = task.status === 'completada';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        id="modal-admin-task-detail"
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#DEDBD1] space-y-4 animate-in zoom-in-95 duration-200"
      >
        {/* Header: Clean title without 'Auditoría de tarea' and without icon */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1] gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-[#292A24] leading-tight truncate">
              {task.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTaskForAdminDetail(null)}
            className="touch-target p-1.5 rounded-full text-[#5C6058] hover:bg-[#F7F7F8] shrink-0"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        <div
          className={`p-3 rounded-2xl border flex items-center justify-between ${
            isCompleted
              ? 'bg-[#DFF3E7]/60 border-[#1E7A4C]/30 text-[#1E7A4C]'
              : 'bg-[#FEF7EE] border-[#C68A3D]/40 text-[#9A5B12]'
          }`}
        >
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
            <span className="text-xs font-bold">
              {isCompleted ? 'Tarea Completada y Verificada' : 'Tarea Pendiente de Registro'}
            </span>
          </div>
          <span className="text-xs font-bold">
            {task.time}
          </span>
        </div>

        {/* Audit Details */}
        <div className="space-y-2.5 text-xs">
          {/* Worker who completed / is assigned */}
          <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] space-y-1">
            <span className="text-[11px] font-bold text-[#5C6058] block">
              {isCompleted ? 'Realizada por:' : 'Personal asignado:'}
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#068591] text-white flex items-center justify-center font-bold text-[10px]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-[#292A24]">
                  {isCompleted
                    ? task.completedByWorkerName || 'Elena Morales'
                    : task.assignedWorkerName || 'Elena Morales'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#068591] bg-white border border-[#DEDBD1] px-2 py-0.5 rounded-md">
                {isCompleted ? task.completedByWorkerRole || 'Cuidadora' : 'En turno'}
              </span>
            </div>
          </div>

          {/* Time completed */}
          {isCompleted && task.completedAtTime && (
            <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5C6058]">
                Hora exacta de registro:
              </span>
              <span className="font-bold text-[#292A24]">
                {task.completedAtTime}
              </span>
            </div>
          )}

          {/* Resident / Scope */}
          <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5C6058]">
              Residente / Cobertura:
            </span>
            <span className="font-bold text-[#292A24]">
              {task.residentName || 'Masiva (todos los residentes)'}
            </span>
          </div>

          {/* Notes: Only appear when task is completed and has registered observations */}
          {isCompleted && task.executionNote && task.executionNote.trim().length > 0 && (
            <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] space-y-1">
              <span className="text-[11px] font-bold text-[#5C6058] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#068591]" />
                <span>Observaciones / Notas de ejecución:</span>
              </span>
              <p className="text-xs text-[#292A24] leading-relaxed italic bg-white p-2.5 rounded-xl border border-[#DEDBD1]/60">
                {task.executionNote}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setSelectedTaskForAdminDetail(null)}
          className="touch-target w-full py-2.5 bg-[#068591] text-white font-bold text-xs rounded-xl hover:bg-[#056c76]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
