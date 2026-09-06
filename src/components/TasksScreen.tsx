import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Pill,
  Utensils,
  Activity,
  Users,
  User,
  CheckCircle2,
  Clock,
  Camera,
  Check,
  ChevronRight,
  Image as ImageIcon,
  RotateCcw,
  AlertCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { TaskItem } from '../types';

export const TasksScreen: React.FC = () => {
  const {
    tasks,
    residents,
    markMedicationAdministered,
    markTaskCompleted,
    unmarkTaskCompleted,
    setSelectedTaskForMassRegistration,
    setIsMassRegistrationModalOpen,
    setSelectedResident,
    setIsVitalSignsModalOpen,
    openResidentHub
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'todas' | 'pendientes' | 'completadas'>('pendientes');
  const [photoModalTaskId, setPhotoModalTaskId] = useState<string | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [taskToUncomplete, setTaskToUncomplete] = useState<TaskItem | null>(null);

  const pendingCount = tasks.filter(t => t.status === 'pendiente').length;
  const completedCount = tasks.filter(t => t.status === 'completada').length;

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'pendientes') return t.status === 'pendiente';
    if (filterStatus === 'completadas') return t.status === 'completada';
    return true;
  });

  const handleAdministerWithPhoto = (taskId: string) => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=300'
    ];
    const chosen = previewPhotoUrl || samplePhotos[0];
    markMedicationAdministered(taskId, chosen);
    setPhotoModalTaskId(null);
    setPreviewPhotoUrl(null);
  };

  const handleConfirmUncomplete = () => {
    if (!taskToUncomplete) return;
    unmarkTaskCompleted(taskToUncomplete.id);
    setTaskToUncomplete(null);
  };

  const getTaskIcon = (type: TaskItem['type']) => {
    switch (type) {
      case 'medicacion':
        return <Pill className="w-5 h-5 text-[#068591]" />;
      case 'alimentacion':
        return <Utensils className="w-5 h-5 text-[#C68A3D]" />;
      case 'fisioterapia':
        return <Activity className="w-5 h-5 text-[#068591]" />;
      case 'signos_vitales':
        return <Activity className="w-5 h-5 text-[#8C2E2E]" />;
      case 'actividad':
        return <Users className="w-5 h-5 text-[#075158]" />;
      default:
        return <Clock className="w-5 h-5 text-[#5C6058]" />;
    }
  };

  const handleStartTask = (task: TaskItem) => {
    const isVitals =
      task.type === 'signos_vitales' ||
      task.title.toLowerCase().includes('tensión') ||
      task.title.toLowerCase().includes('tension') ||
      task.title.toLowerCase().includes('signos') ||
      task.title.toLowerCase().includes('glucometr');

    if (isVitals) {
      setSelectedTaskForMassRegistration(task);
      const target = task.residentId
        ? residents.find(r => r.id === task.residentId) || residents[0]
        : residents[0];
      if (target) setSelectedResident(target);
      setIsVitalSignsModalOpen(true);
      return;
    }

    setSelectedTaskForMassRegistration(task);
    setIsMassRegistrationModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1">
      {/* Header (Clean, count is now in the filter tabs) */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-[#292A24]">
          Tareas del turno
        </h2>
      </div>

      {/* Filter Tabs with clear counts - Shorter and oval pills */}
      <div className="flex justify-center">
        <div className="inline-flex gap-1.5 p-1 bg-white rounded-full border border-[#DEDBD1] shadow-2xs">
          <button
            id="filter-task-pendientes"
            type="button"
            onClick={() => setFilterStatus('pendientes')}
            className={`touch-target py-1.5 px-3.5 text-xs font-bold rounded-full transition-all ${
              filterStatus === 'pendientes'
                ? 'bg-[#D9F0F1] text-[#075158] border border-[#068591]/30 shadow-xs'
                : 'text-[#5C6058] hover:text-[#292A24]'
            }`}
          >
            Pendientes ({pendingCount})
          </button>

          <button
            id="filter-task-completadas"
            type="button"
            onClick={() => setFilterStatus('completadas')}
            className={`touch-target py-1.5 px-3.5 text-xs font-bold rounded-full transition-all ${
              filterStatus === 'completadas'
                ? 'bg-[#D9F0F1] text-[#075158] border border-[#068591]/30 shadow-xs'
                : 'text-[#5C6058] hover:text-[#292A24]'
            }`}
          >
            Completadas ({completedCount})
          </button>

          <button
            id="filter-task-todas"
            type="button"
            onClick={() => setFilterStatus('todas')}
            className={`touch-target py-1.5 px-3.5 text-xs font-bold rounded-full transition-all ${
              filterStatus === 'todas'
                ? 'bg-[#D9F0F1] text-[#075158] border border-[#068591]/30 shadow-xs'
                : 'text-[#5C6058] hover:text-[#292A24]'
            }`}
          >
            Todas ({tasks.length})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#DEDBD1] text-center text-[#5C6058]">
            <CheckCircle2 className="w-10 h-10 text-[#068591] mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold text-[#292A24]">
              {filterStatus === 'pendientes'
                ? '¡No hay tareas pendientes en este turno!'
                : 'No se encontraron tareas en esta sección.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completada';
            const isGroup = task.scope === 'grupal';

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all shadow-2xs ${
                  isCompleted ? 'border-[#DEDBD1] bg-white/95' : 'border-[#DEDBD1] hover:border-[#068591]/40'
                }`}
              >
                {/* Top row: Time + Resident name (if individual) or Group pill + Status pill / uncomplete button */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-[#068591] bg-[#D9F0F1] px-2 py-0.5 rounded-lg">
                      {task.time}
                    </span>

                    {isGroup ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 bg-[#F7F7F8] text-[#5C6058] border border-[#DEDBD1]">
                        <Users className="w-3 h-3 text-[#068591]" />
                        <span>Grupal ({task.residentCount} res.)</span>
                      </span>
                    ) : task.residentName ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 bg-[#F7F7F8] text-[#5C6058] border border-[#DEDBD1]">
                        <User className="w-3 h-3 text-[#068591]" />
                        <span>{task.residentName}</span>
                      </span>
                    ) : null}
                  </div>

                  {isCompleted ? (
                    <button
                      type="button"
                      id={`btn-uncomplete-task-${task.id}`}
                      onClick={() => setTaskToUncomplete(task)}
                      className="group inline-flex items-center justify-center text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DFF3E7] hover:bg-[#FBEAEA] text-[#1E7A4C] hover:text-[#8C2E2E] transition-colors cursor-pointer"
                      title="Haz clic para volver a poner como pendiente"
                    >
                      <span className="group-hover:hidden">Completada</span>
                      <span className="hidden group-hover:inline">Desmarcar</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FBE9D2] text-[#9A5B12] inline-flex items-center justify-center">
                      Pendiente
                    </span>
                  )}
                </div>

                {/* Title & Description (No description for Alimentación) */}
                <div className="my-2.5 space-y-1">
                  <h3 className={`font-bold text-base text-[#292A24] leading-snug ${isCompleted ? 'line-through text-[#5C6058]' : ''}`}>
                    {task.title}
                  </h3>
                  {task.type !== 'alimentacion' && task.description && (
                    <p className="text-xs text-[#5C6058] leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Photo proof badge if already taken */}
                  {task.medicationDetails?.photoProofUrl && (
                    <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 bg-[#DFF3E7] rounded-xl text-xs font-semibold text-[#1E7A4C]">
                      <ImageIcon className="w-3 h-3" />
                      <span>Foto adjunta</span>
                    </div>
                  )}

                  {/* Pending Residents for Meal Task Alert */}
                  {task.mealDetails?.pendingResidents && task.mealDetails.pendingResidents.length > 0 && (
                    <div className="mt-2.5 p-3 bg-[#FEF7EE] rounded-2xl border border-[#C68A3D]/40 text-xs">
                      <div className="font-bold flex items-center gap-1.5 text-[#9A5B12]">
                        <AlertTriangle className="w-4 h-4 text-[#C68A3D] flex-shrink-0" />
                        <span>Faltan por registrar alimentación ({task.mealDetails.pendingResidents.length}):</span>
                      </div>
                      <p className="mt-1 text-xs text-[#292A24] font-medium pl-5.5">
                        {task.mealDetails.pendingResidents.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Exceptions list if any */}
                  {task.mealDetails?.exceptions && task.mealDetails.exceptions.length > 0 && (
                    <div className="mt-2 p-2 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1] text-xs text-[#5C6058]">
                      <span className="font-semibold text-[#292A24]">
                        {task.mealDetails.normalCount} normales · {task.mealDetails.exceptions.length} con excepción ({task.mealDetails.exceptions.map(e => e.residentName).join(', ')})
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons Row - Vertically aligned and full horizontal width */}
                <div className="pt-2.5 border-t border-[#DEDBD1] flex flex-col gap-2 w-full">
                  {/* 1. Medicación individual -> Administrado directo + foto en la misma fila */}
                  {task.type === 'medicacion' && task.scope === 'individual' && (
                    <>
                      {!isCompleted ? (
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <button
                            type="button"
                            id={`btn-administer-${task.id}`}
                            onClick={() => markMedicationAdministered(task.id)}
                            className="touch-target w-full py-2.5 px-3 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-4 h-4 shrink-0" />
                            <span className="truncate">Marcar administrado</span>
                          </button>

                          <button
                            type="button"
                            id={`btn-photo-${task.id}`}
                            onClick={() => setPhotoModalTaskId(task.id)}
                            className="touch-target w-full py-2.5 px-3 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                            title="Adjuntar foto de comprobante"
                          >
                            <Camera className="w-4 h-4 text-[#068591] shrink-0" />
                            <span className="truncate">Adjuntar foto</span>
                          </button>
                        </div>
                      ) : (
                        <div className="w-full flex items-center justify-between py-0.5">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DFF3E7] text-[#1E7A4C] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Administrado
                          </span>
                          <button
                            type="button"
                            onClick={() => setTaskToUncomplete(task)}
                            className="touch-target text-xs text-[#8C2E2E] hover:underline font-semibold"
                          >
                            Desmarcar
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* 2. Tarea grupal (alimentación / actividad / signos vitales) */}
                  {isGroup && (
                    <div className="w-full">
                      <button
                        type="button"
                        id={`btn-group-action-${task.id}`}
                        onClick={() => handleStartTask(task)}
                        className="touch-target w-full py-2.5 px-4 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>
                          {isCompleted
                            ? 'Ver / Modificar registro'
                            : task.mealDetails?.pendingResidents && task.mealDetails.pendingResidents.length > 0
                            ? `Completar restantes (${task.mealDetails.pendingResidents.length})`
                            : 'Iniciar registro'}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* 3. Tarea individual que NO es medicación (ej. Fisioterapia, Higiene, etc.) */}
                  {!isGroup && task.type !== 'medicacion' && (
                    <div className="flex flex-col gap-2 w-full">
                      {!isCompleted ? (
                        <>
                          {(task.type === 'signos_vitales' || task.type === 'alimentacion') ? (
                            <button
                              type="button"
                              id={`btn-start-task-${task.id}`}
                              onClick={() => handleStartTask(task)}
                              className="touch-target w-full py-2.5 px-4 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                            >
                              <span>Iniciar registro</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              id={`btn-complete-task-${task.id}`}
                              onClick={() => markTaskCompleted(task.id)}
                              className="touch-target w-full py-2.5 px-4 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>Marcar como completada</span>
                            </button>
                          )}

                          {task.residentId && (
                            <button
                              type="button"
                              id={`btn-view-res-modal-${task.id}`}
                              onClick={() => {
                                const res = residents.find(r => r.id === task.residentId);
                                if (res) openResidentHub(res, true);
                              }}
                              className="touch-target w-full py-2 px-4 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <span>Abrir ficha médica de {task.residentName?.split(' ')[0] || 'residente'}</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between py-0.5">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DFF3E7] text-[#1E7A4C] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Realizada
                          </span>
                          <div className="flex items-center gap-2">
                            {task.residentId && (
                              <button
                                type="button"
                                onClick={() => {
                                  const res = residents.find(r => r.id === task.residentId);
                                  if (res) openResidentHub(res, true);
                                }}
                                className="touch-target text-xs text-[#068591] hover:underline font-semibold"
                              >
                                Ver ficha
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setTaskToUncomplete(task)}
                              className="touch-target text-xs text-[#8C2E2E] hover:underline font-semibold"
                            >
                              Desmarcar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal to Unmark / Revert a Task */}
      {taskToUncomplete && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirmación de desmarcar tarea"
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#DEDBD1] space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center gap-3 pb-2 border-b border-[#DEDBD1]">
              <div className="w-10 h-10 rounded-2xl bg-[#FBEAEA] text-[#8C2E2E] flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#292A24]">
                  ¿Desmarcar tarea?
                </h3>
                <p className="text-xs text-[#5C6058]">
                  La tarea volverá a estar pendiente
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] text-xs text-[#292A24] space-y-1">
              <div className="font-bold">{taskToUncomplete.title}</div>
              {taskToUncomplete.residentName && (
                <div className="text-[#5C6058]">Residente: {taskToUncomplete.residentName}</div>
              )}
              <div className="text-[#5C6058]">Horario: {taskToUncomplete.time}</div>
            </div>

            <p className="text-xs text-[#5C6058] leading-relaxed">
              ¿Estás seguro de que deseas desmarcar esta tarea y devolverla a la lista de tareas pendientes del turno?
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                id="btn-confirm-unmark-task"
                onClick={handleConfirmUncomplete}
                className="touch-target flex-1 py-3 bg-[#8C2E2E] hover:bg-[#722525] text-white font-bold text-xs rounded-xl transition-colors"
              >
                Sí, volver a pendiente
              </button>
              <button
                type="button"
                id="btn-cancel-unmark-task"
                onClick={() => setTaskToUncomplete(null)}
                className="touch-target px-4 py-3 bg-[#F7F7F8] hover:bg-[#EAE8DF] text-[#5C6058] font-bold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Attachment Modal for Medication */}
      {photoModalTaskId && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#DEDBD1] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DEDBD1]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#068591]" />
                <h3 className="font-bold text-base text-[#292A24]">
                  Comprobante de medicación
                </h3>
              </div>
              <button
                onClick={() => setPhotoModalTaskId(null)}
                className="p-1 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5C6058]">
              Adjunta una fotografía del blister o la toma para el registro clínico del residente.
            </p>

            <div className="bg-[#F7F7F8] rounded-2xl border-2 border-dashed border-[#DEDBD1] p-4 text-center">
              {previewPhotoUrl ? (
                <div className="relative">
                  <img
                    src={previewPhotoUrl}
                    alt="Foto medicación"
                    className="w-full h-36 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => setPreviewPhotoUrl(null)}
                    className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 py-3">
                  <Camera className="w-8 h-8 text-[#068591] mx-auto" />
                  <div className="text-xs font-semibold text-[#292A24]">
                    Capturar o seleccionar foto
                  </div>
                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewPhotoUrl(
                          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300'
                        )
                      }
                      className="px-3 py-1.5 bg-[#D9F0F1] text-[#075158] text-xs font-bold rounded-xl"
                    >
                      Usar foto de prueba
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleAdministerWithPhoto(photoModalTaskId)}
                className="touch-target flex-1 py-3 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-xs rounded-xl transition-colors"
              >
                Confirmar y Administrar
              </button>
              <button
                type="button"
                onClick={() => setPhotoModalTaskId(null)}
                className="touch-target px-4 py-3 bg-[#F7F7F8] hover:bg-[#EAE8DF] text-[#5C6058] font-bold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


