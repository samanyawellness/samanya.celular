import React from 'react';
import { TaskItem, Resident } from '../types';
import {
  X,
  Pill,
  Activity,
  Utensils,
  Users,
  Clock,
  User,
  Check,
  RotateCcw,
  Camera,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface TaskDetailModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (task: TaskItem) => void;
  onUncomplete: (task: TaskItem) => void;
  onOpenPhotoModal: (taskId: string) => void;
  onOpenResidentHub: (resident: Resident) => void;
  residents: Resident[];
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onComplete,
  onUncomplete,
  onOpenPhotoModal,
  onOpenResidentHub,
  residents
}) => {
  if (!isOpen || !task) return null;

  const resident = task.residentId
    ? residents.find((r) => r.id === task.residentId)
    : undefined;

  const isCompleted = task.status === 'completada';
  const isMedication = task.type === 'medicacion';

  // Get clean task title
  const medOrAction =
    isMedication && task.medicationDetails?.drugName
      ? task.medicationDetails.drugName
      : task.title.includes('—')
      ? task.title.split('—')[1]?.trim() || task.title.split('—')[0].trim()
      : task.title.includes(' - ')
      ? task.title.split(' - ')[1]?.trim() || task.title.split(' - ')[0].trim()
      : task.title;

  const simpleTitle =
    task.scope === 'grupal'
      ? task.title
      : task.residentName && !medOrAction.toLowerCase().startsWith(task.residentName.toLowerCase())
      ? `${task.residentName} — ${medOrAction}`
      : medOrAction;

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#DEDBD1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9F0F1] flex items-center justify-center text-[#068591] shrink-0 border border-[#068591]/20">
              {isMedication ? (
                <Pill className="w-5 h-5" />
              ) : task.type === 'fisioterapia' ? (
                <Activity className="w-5 h-5" />
              ) : task.type === 'alimentacion' ? (
                <Utensils className="w-5 h-5" />
              ) : task.type === 'actividad' ? (
                <Users className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#068591] uppercase tracking-wider">
                Detalle de tarea
              </span>
              <h3
                id="task-detail-title"
                className="font-bold text-lg text-[#292A24] leading-tight"
              >
                {simpleTitle}
              </h3>
            </div>
          </div>
          <button
            id="btn-close-task-detail"
            type="button"
            onClick={onClose}
            className="touch-target min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2 p-2 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8] active:scale-95 transition-all"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resident Card (if associated with a resident) */}
        {task.residentName && (
          <div className="p-3.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {resident?.avatar ? (
                <img
                  src={resident.avatar}
                  alt={task.residentName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#DEDBD1] shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#D9F0F1] text-[#068591] font-bold flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs text-[#5C6058] font-medium">Residente</p>
                <p className="text-sm font-bold text-[#292A24] truncate">
                  {task.residentName}
                </p>
                {resident && (
                  <p className="text-[11px] text-[#5C6058]">
                    {resident.room.startsWith('Habitación')
                      ? resident.room
                      : `Habitación ${resident.room}`}{' '}
                    · {resident.bed}
                  </p>
                )}
              </div>
            </div>

            {resident && (
              <button
                id="btn-modal-view-resident-hub"
                type="button"
                onClick={() => {
                  onClose();
                  onOpenResidentHub(resident);
                }}
                className="touch-target min-w-[44px] min-h-[44px] px-3 py-1.5 text-xs font-bold text-[#068591] hover:bg-white rounded-xl border border-[#DEDBD1] flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow-2xs"
                title="Abrir ficha del residente"
              >
                <span>Ficha</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Metadata section (Horario y Estado) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]">
            <span className="text-[11px] font-bold text-[#5C6058] block mb-0.5">
              Horario programado
            </span>
            <span className="text-sm font-bold text-[#075158] inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#068591]" />
              {task.time}
            </span>
          </div>

          <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]">
            <span className="text-[11px] font-bold text-[#5C6058] block mb-0.5">
              Estado actual
            </span>
            {isCompleted ? (
              <span className="text-xs font-bold text-[#1E7A4C] inline-flex items-center gap-1 bg-[#DFF3E7] px-2 py-0.5 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completada
              </span>
            ) : (
              <span className="text-xs font-bold text-[#9A5B12] inline-flex items-center gap-1 bg-[#FBE9D2] px-2 py-0.5 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5" />
                Pendiente
              </span>
            )}
          </div>
        </div>

        {/* Clinical / Medication details */}
        {isMedication && task.medicationDetails && (
          <div className="space-y-2 p-3.5 bg-white rounded-2xl border border-[#DEDBD1] shadow-2xs">
            <h4 className="text-xs font-bold text-[#292A24] flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-[#068591]" />
              <span>Pauta farmacológica</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {task.medicationDetails.dose && (
                <div>
                  <span className="text-[#5C6058] font-medium block text-[11px]">
                    Dosis prescrita
                  </span>
                  <span className="font-bold text-[#292A24]">
                    {task.medicationDetails.dose}
                  </span>
                </div>
              )}
              {task.medicationDetails.route && (
                <div>
                  <span className="text-[#5C6058] font-medium block text-[11px]">
                    Vía de administración
                  </span>
                  <span className="font-bold text-[#075158] bg-[#D9F0F1] px-2 py-0.5 rounded-md inline-block">
                    {task.medicationDetails.route}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions / Full Description */}
        {task.description && (
          <div className="space-y-1.5 p-3.5 bg-white rounded-2xl border border-[#DEDBD1] shadow-2xs">
            <h4 className="text-xs font-bold text-[#292A24] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#068591]" />
              <span>Instrucciones y observaciones</span>
            </h4>
            <p className="text-xs text-[#292A24] leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        {/* Photo Proof Section (for medication) */}
        {isMedication && (
          <div className="p-3.5 bg-white rounded-2xl border border-[#DEDBD1] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#292A24] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#068591]" />
                <span>Comprobante fotográfico</span>
              </span>
              {task.medicationDetails?.photoProofUrl ? (
                <span className="text-[11px] font-bold text-[#1E7A4C] bg-[#DFF3E7] px-2 py-0.5 rounded-md">
                  Adjunto
                </span>
              ) : (
                <span className="text-[11px] font-medium text-[#5C6058]">
                  Opcional
                </span>
              )}
            </div>

            {task.medicationDetails?.photoProofUrl ? (
              <div className="rounded-xl overflow-hidden border border-[#DEDBD1]">
                <img
                  src={task.medicationDetails.photoProofUrl}
                  alt="Comprobante medicación"
                  className="w-full h-32 object-cover"
                />
              </div>
            ) : (
              <button
                type="button"
                id="btn-attach-photo-from-detail"
                onClick={() => {
                  onClose();
                  onOpenPhotoModal(task.id);
                }}
                className="touch-target w-full py-2.5 px-3 bg-[#F7F7F8] hover:bg-[#EFECE6] border border-[#DEDBD1] text-xs font-bold text-[#075158] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-4 h-4 text-[#068591]" />
                <span>Adjuntar foto de la toma / blíster</span>
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#DEDBD1] flex flex-col gap-2">
          {!isCompleted ? (
            <button
              id="btn-complete-task-from-detail"
              type="button"
              onClick={() => {
                onComplete(task);
                onClose();
              }}
              className="touch-target w-full py-3 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-sm rounded-2xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>
                {isMedication ? 'Marcar como administrado' : 'Marcar como completada'}
              </span>
            </button>
          ) : (
            <button
              id="btn-uncomplete-task-from-detail"
              type="button"
              onClick={() => {
                onUncomplete(task);
                onClose();
              }}
              className="touch-target w-full py-3 bg-[#FBEAEA] hover:bg-[#f6d7d7] text-[#8C2E2E] border border-[#8C2E2E]/20 font-bold text-xs rounded-2xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Desmarcar y devolver a pendientes</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="touch-target w-full py-2.5 text-xs font-bold text-[#5C6058] hover:text-[#292A24] rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
