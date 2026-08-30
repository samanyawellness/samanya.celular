import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  AlertTriangle,
  Check,
  AlertCircle
} from 'lucide-react';
import { VoiceInputButton } from './VoiceInputButton';

export const MassRegistrationModal: React.FC = () => {
  const {
    isMassRegistrationModalOpen,
    setIsMassRegistrationModalOpen,
    selectedTaskForMassRegistration,
    residents,
    completeMassRegistration
  } = useApp();

  // Primary (General) registration selected resident IDs
  const [primarySelectedIds, setPrimarySelectedIds] = useState<string[]>([]);
  const [primaryNote, setPrimaryNote] = useState<string>('Ingesta completa del menú según pauta nutricional sin incidencias.');

  // Secondary (Exceptions) note
  const [exceptionNote, setExceptionNote] = useState<string>('');

  // Missing residents confirmation prompt modal
  const [showMissingConfirmation, setShowMissingConfirmation] = useState(false);

  // Initialize selections when modal opens
  useEffect(() => {
    if (isMassRegistrationModalOpen) {
      // If task had pending residents or previous meal details, pre-populate
      const allIds = residents.map(r => r.id);
      setPrimarySelectedIds(allIds);
      setPrimaryNote('Ingesta completa del menú según pauta nutricional sin incidencias.');
      setExceptionNote('');
      setShowMissingConfirmation(false);
    }
  }, [isMassRegistrationModalOpen, residents]);

  if (!isMassRegistrationModalOpen || !selectedTaskForMassRegistration) return null;

  // Toggle resident in primary list
  const togglePrimaryResident = (id: string) => {
    if (primarySelectedIds.includes(id)) {
      setPrimarySelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setPrimarySelectedIds(prev => [...prev, id]);
    }
  };

  const handleSelectAllPrimary = () => {
    setPrimarySelectedIds(residents.map(r => r.id));
  };

  const handleDeselectAllPrimary = () => {
    setPrimarySelectedIds([]);
  };

  // Residents not selected in primary are automatically exceptions
  const exceptionResidents = residents.filter(r => !primarySelectedIds.includes(r.id));
  const normalResidentIds = primarySelectedIds;

  const executeSave = () => {
    const hasExceptionNote = exceptionNote.trim().length > 0;
    
    // If exception note is provided, these residents are registered exceptions
    // If NO exception note is provided, these residents remain pending (uncompleted)
    const finalExceptions = hasExceptionNote
      ? exceptionResidents.map(res => ({
          residentId: res.id,
          residentName: res.name,
          note: exceptionNote.trim(),
          reason: 'Excepción de alimentación'
        }))
      : [];

    const pendingResidents = hasExceptionNote
      ? []
      : exceptionResidents.map(r => r.name);

    completeMassRegistration(
      selectedTaskForMassRegistration.id,
      normalResidentIds.length,
      finalExceptions,
      pendingResidents
    );
    setShowMissingConfirmation(false);
    setIsMassRegistrationModalOpen(false);
  };

  const handleSaveClick = () => {
    // If there are exceptions, prompt confirmation dialog
    if (exceptionResidents.length > 0) {
      setShowMissingConfirmation(true);
    } else {
      executeSave();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Registro de Alimentación"
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] max-h-[90vh] overflow-y-auto space-y-4 custom-scrollbar animate-in zoom-in-95"
      >
        {/* Header - Simple title without extra text or icons */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
          <h2 className="text-lg font-bold text-[#292A24]">
            Registro de Alimentación
          </h2>
          <button
            id="btn-close-mass-reg"
            type="button"
            onClick={() => setIsMassRegistrationModalOpen(false)}
            className="touch-target p-1.5 -mr-2 rounded-full text-[#5C6058] hover:bg-[#F7F7F8]"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECTION 1: Selecciona los residentes */}
        <div className="bg-[#F7F7F8] p-4 rounded-2xl border border-[#DEDBD1] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#075158] uppercase tracking-wider">
              1. Selecciona los residentes
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSelectAllPrimary}
                className="text-xs font-bold text-[#068591] hover:bg-[#D9F0F1] px-2.5 py-0.5 rounded-full border border-[#068591]/30 transition-colors"
              >
                Todos
              </button>
              <button
                type="button"
                onClick={handleDeselectAllPrimary}
                className="text-xs font-bold text-[#5C6058] hover:bg-[#EAE8DF] px-2.5 py-0.5 rounded-full border border-[#DEDBD1] transition-colors"
              >
                Ninguno
              </button>
            </div>
          </div>

          {/* Resident Selection Chips - Small and Oval */}
          <div>
            <div className="flex flex-wrap gap-1.5">
              {residents.map((r) => {
                const isSelected = primarySelectedIds.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => togglePrimaryResident(r.id)}
                    className={`touch-target px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-[#D9F0F1] text-[#075158] border-[#068591]/40 shadow-2xs'
                        : 'bg-[#FEF7EE] text-[#9A5B12] border-[#C68A3D]/40'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3 h-3 text-[#068591]" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-[#C68A3D]" />
                    )}
                    <span>{r.name}</span>
                    {!isSelected && (
                      <span className="text-[10px] bg-[#C68A3D] text-white px-1.5 py-0.2 rounded-full font-bold">
                        Excepción
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes Field with Voice Transcription */}
          <div className="pt-2 border-t border-[#DEDBD1]">
            <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="textarea-primary-note">
              Observación de alimentación general *
            </label>
            <div className="relative">
              <textarea
                id="textarea-primary-note"
                rows={3}
                value={primaryNote}
                onChange={(e) => setPrimaryNote(e.target.value)}
                placeholder="Escribe o dicta la observación de alimentación general..."
                className="w-full p-3 pr-12 pb-10 bg-white border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] placeholder:text-[#5C6058]/70 focus:outline-none focus:border-[#068591]"
              />
              <div className="absolute right-2.5 bottom-2.5 z-10">
                <VoiceInputButton
                  contextHint="comida_general"
                  currentValue={primaryNote}
                  onTranscript={(text) => setPrimaryNote(text)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Registro de Excepciones - Only appears if at least 1 resident chosen in step 1 AND there are exceptions */}
        {primarySelectedIds.length > 0 && exceptionResidents.length > 0 && (
          <div className="bg-[#FEF7EE] p-4 rounded-2xl border border-[#C68A3D]/30 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#9A5B12] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C68A3D]" />
                2. Registro de Excepciones
              </h3>
              <span className="text-[11px] font-bold text-[#9A5B12] bg-white px-2.5 py-0.5 rounded-full border border-[#C68A3D]/30">
                {exceptionResidents.length} {exceptionResidents.length === 1 ? 'residente' : 'residentes'}
              </span>
            </div>

            {/* List of Exception Residents */}
            <div>
              <div className="flex flex-wrap gap-1.5">
                {exceptionResidents.map((r) => (
                  <div
                    key={r.id}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C68A3D] text-white flex items-center gap-1 shadow-2xs"
                  >
                    <AlertTriangle className="w-3 h-3 text-white" />
                    <span>{r.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Field for Exceptions with Voice Transcription */}
            <div>
              <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="textarea-exception-note">
                Observación para estas excepciones
              </label>
              <div className="relative">
                <textarea
                  id="textarea-exception-note"
                  rows={3}
                  value={exceptionNote}
                  onChange={(e) => setExceptionNote(e.target.value)}
                  placeholder="Escribe o dicta la observación particular..."
                  className="w-full p-3 pr-12 pb-10 bg-white border border-[#C68A3D]/40 rounded-xl text-sm text-[#292A24] placeholder:text-[#5C6058]/70 focus:outline-none focus:border-[#C68A3D]"
                />
                <div className="absolute right-2.5 bottom-2.5 z-10">
                  <VoiceInputButton
                    contextHint="excepcion_comida"
                    currentValue={exceptionNote}
                    onTranscript={(text) => setExceptionNote(text)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save / Confirm Action - No Icon on button */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            id="btn-confirm-feeding-day"
            type="button"
            onClick={handleSaveClick}
            disabled={primarySelectedIds.length === 0 || !primaryNote.trim()}
            className="touch-target w-full py-3.5 px-6 rounded-2xl bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-50"
          >
            Confirmar registro de alimentación
          </button>

          <button
            type="button"
            onClick={() => setIsMassRegistrationModalOpen(false)}
            className="touch-target w-full py-2 text-xs font-semibold text-[#5C6058] hover:text-[#292A24]"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Confirmation Dialog when there are exceptions */}
      {showMissingConfirmation && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirmar guardado de alimentación"
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#DEDBD1] space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center gap-3 pb-2 border-b border-[#DEDBD1]">
              <div className="w-10 h-10 rounded-2xl bg-[#FBE9D2] text-[#9A5B12] flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#292A24]">
                  ¿Seguro de guardar?
                </h3>
                <p className="text-xs text-[#5C6058]">
                  Hay residentes con excepción
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#FEF7EE] rounded-2xl border border-[#C68A3D]/30 text-xs text-[#292A24] space-y-1.5">
              <div className="font-bold text-[#9A5B12]">
                Residentes en excepción ({exceptionResidents.length}):
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[#292A24] font-semibold">
                {exceptionResidents.map(r => (
                  <li key={r.id}>{r.name}</li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-[#5C6058] leading-relaxed">
              {exceptionNote.trim()
                ? 'Se guardará el registro con las notas de excepción indicadas.'
                : 'No has escrito una observación para estos residentes. La tarea quedará pendiente con los residentes faltantes visibles.'}
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                id="btn-save-anyway-feeding"
                onClick={executeSave}
                className="touch-target flex-1 py-3 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Guardar de todos modos
              </button>
              <button
                type="button"
                id="btn-cancel-missing-feeding"
                onClick={() => setShowMissingConfirmation(false)}
                className="touch-target px-4 py-3 bg-[#F7F7F8] hover:bg-[#EAE8DF] text-[#5C6058] font-bold text-xs rounded-xl transition-colors"
              >
                Volver a revisar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
