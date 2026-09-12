import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  AlertTriangle,
  Check,
  AlertCircle,
  ChevronLeft,
  Search,
  Utensils,
  Users
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

  // Search query for filtering residents in section 1
  const [residentSearchQuery, setResidentSearchQuery] = useState<string>('');

  // Search & dropdown for adding exception directly (replicating IncidentReportScreen pattern)
  const [exceptionSearchQuery, setExceptionSearchQuery] = useState<string>('');
  const [isExceptionDropdownOpen, setIsExceptionDropdownOpen] = useState(false);
  const exceptionDropdownRef = useRef<HTMLDivElement>(null);

  // Missing residents confirmation prompt modal
  const [showMissingConfirmation, setShowMissingConfirmation] = useState(false);

  // Initialize selections when modal opens
  useEffect(() => {
    if (isMassRegistrationModalOpen && selectedTaskForMassRegistration) {
      const existingMeal = selectedTaskForMassRegistration.mealDetails;
      if (existingMeal && existingMeal.exceptions && existingMeal.exceptions.length > 0) {
        const exceptionIds = existingMeal.exceptions.map(e => e.residentId);
        setPrimarySelectedIds(residents.filter(r => !exceptionIds.includes(r.id)).map(r => r.id));
        setExceptionNote(existingMeal.exceptions[0]?.note || '');
      } else {
        const allIds = residents.map(r => r.id);
        setPrimarySelectedIds(allIds);
        setExceptionNote('');
      }
      setPrimaryNote('Ingesta completa del menú según pauta nutricional sin incidencias.');
      setResidentSearchQuery('');
      setExceptionSearchQuery('');
      setIsExceptionDropdownOpen(false);
      setShowMissingConfirmation(false);
    }
  }, [isMassRegistrationModalOpen, selectedTaskForMassRegistration, residents]);

  // Handle outside click for exception search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exceptionDropdownRef.current && !exceptionDropdownRef.current.contains(event.target as Node)) {
        setIsExceptionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered residents for primary list based on residentSearchQuery
  const filteredPrimaryResidents = useMemo(() => {
    if (!residentSearchQuery.trim()) return residents;
    const q = residentSearchQuery.toLowerCase();
    return residents.filter(r => r.name.toLowerCase().includes(q));
  }, [residents, residentSearchQuery]);

  // Filtered residents for exception autocomplete dropdown
  const filteredExceptionResidents = useMemo(() => {
    if (!exceptionSearchQuery.trim()) return residents;
    const q = exceptionSearchQuery.toLowerCase();
    return residents.filter(r => r.name.toLowerCase().includes(q));
  }, [residents, exceptionSearchQuery]);

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

  // Directly toggle/add a resident to exceptions via search dropdown
  const handleSelectExceptionFromDropdown = (resId: string) => {
    // If currently primary, remove from primary so they become an exception
    setPrimarySelectedIds(prev => prev.filter(item => item !== resId));
    setExceptionSearchQuery('');
    setIsExceptionDropdownOpen(false);
  };

  const executeSave = () => {
    const finalExceptions = exceptionResidents.map(res => ({
      residentId: res.id,
      residentName: res.name,
      note: exceptionNote.trim() || 'Excepción de alimentación registrada',
      reason: 'Excepción de alimentación'
    }));

    // Exceptions are registered with note, marking complete with no pending
    completeMassRegistration(
      selectedTaskForMassRegistration.id,
      normalResidentIds.length,
      finalExceptions,
      []
    );
    setShowMissingConfirmation(false);
    setIsMassRegistrationModalOpen(false);
  };

  const handleSaveClick = () => {
    // If there are exceptions and the note is already filled, save directly without warning
    if (exceptionResidents.length > 0 && !exceptionNote.trim()) {
      setShowMissingConfirmation(true);
    } else {
      executeSave();
    }
  };

  const isMeal = selectedTaskForMassRegistration.type === 'alimentacion';

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F7F8] overflow-y-auto animate-in fade-in duration-200">
      <div className="min-h-screen max-w-lg mx-auto pb-28">
        {/* Sticky Top Header with back navigation button */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DEDBD1] px-4 py-3 flex items-center justify-between">
          <button
            id="btn-back-mass-reg"
            type="button"
            onClick={() => setIsMassRegistrationModalOpen(false)}
            className="touch-target min-w-[44px] min-h-[44px] -ml-2 px-2 flex items-center gap-1 text-[#068591] font-bold text-sm active:scale-95 transition-all"
            aria-label="Volver a la lista de tareas"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div>
            <h1 className="font-bold text-base text-[#292A24]">
              {isMeal ? 'Registro de Alimentación' : 'Registro de Actividad'}
            </h1>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Task Summary Banner */}
          <div className="bg-white p-4 rounded-2xl border border-[#DEDBD1] shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#D9F0F1] flex items-center justify-center text-[#068591] shrink-0">
                {isMeal ? <Utensils className="w-4 h-4 text-[#C68A3D]" /> : <Users className="w-4 h-4 text-[#068591]" />}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-black text-[#068591]">
                  {selectedTaskForMassRegistration.time}
                </span>
                <h2 className="text-sm font-bold text-[#292A24] truncate">
                  {selectedTaskForMassRegistration.title}
                </h2>
              </div>
            </div>
            {selectedTaskForMassRegistration.mealDetails?.menu && (
              <p className="text-xs text-[#5C6058] pl-10 leading-relaxed">
                <span className="font-semibold text-[#292A24]">Menú: </span>
                {selectedTaskForMassRegistration.mealDetails.menu}
              </p>
            )}
          </div>

          {/* SECTION 1: Resident Selection with Search Field */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#075158] uppercase tracking-wider">
                1. Residentes en registro normal ({primarySelectedIds.length}/{residents.length})
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSelectAllPrimary}
                  className="text-xs font-bold text-[#068591] hover:bg-[#D9F0F1] px-2.5 py-1 rounded-full border border-[#068591]/30 transition-colors touch-target"
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllPrimary}
                  className="text-xs font-bold text-[#5C6058] hover:bg-[#EAE8DF] px-2.5 py-1 rounded-full border border-[#DEDBD1] transition-colors touch-target"
                >
                  Ninguno
                </button>
              </div>
            </div>

            {/* Resident Search Input (Pattern replicating IncidentReportScreen) */}
            <div className="relative">
              <input
                id="input-feeding-resident-search"
                type="text"
                value={residentSearchQuery}
                onChange={(e) => setResidentSearchQuery(e.target.value)}
                placeholder="Buscar residente por nombre..."
                className="w-full pl-9 pr-9 py-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591] focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 text-[#5C6058] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {residentSearchQuery && (
                <button
                  type="button"
                  onClick={() => setResidentSearchQuery('')}
                  className="touch-target absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#5C6058] hover:text-[#292A24]"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Resident Selection Chips */}
            <div>
              {filteredPrimaryResidents.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {filteredPrimaryResidents.map((r) => {
                    const isSelected = primarySelectedIds.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => togglePrimaryResident(r.id)}
                        className={`touch-target px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-[#D9F0F1] text-[#075158] border-[#068591]/40 shadow-2xs'
                            : 'bg-[#FEF7EE] text-[#9A5B12] border-[#C68A3D]/40'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-[#068591]" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#C68A3D]" />
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
              ) : (
                <div className="p-3 text-xs text-[#5C6058] text-center bg-[#F7F7F8] rounded-xl border border-[#DEDBD1]">
                  No se encontraron residentes con ese nombre.
                </div>
              )}
            </div>

            {/* General Observation Field with Voice Transcription */}
            <div className="pt-2 border-t border-[#DEDBD1]">
              <label className="block text-xs font-bold text-[#292A24] mb-1.5" htmlFor="textarea-primary-note">
                Observación general *
              </label>
              <div className="relative">
                <textarea
                  id="textarea-primary-note"
                  rows={3}
                  value={primaryNote}
                  onChange={(e) => setPrimaryNote(e.target.value)}
                  placeholder="Escribe o dicta la observación general..."
                  className="w-full p-3 pr-12 pb-10 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] placeholder:text-[#5C6058]/70 focus:outline-none focus:border-[#068591] focus:bg-white transition-colors"
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

          {/* SECTION 2: Registro de Excepciones */}
          {exceptionResidents.length > 0 && (
            <div className="bg-[#FEF7EE] p-4 sm:p-5 rounded-3xl border border-[#C68A3D]/30 space-y-3.5 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#9A5B12] uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C68A3D]" />
                  2. Registro de Excepciones ({exceptionResidents.length})
                </h3>
                <span className="text-[11px] font-bold text-[#9A5B12] bg-white px-2.5 py-0.5 rounded-full border border-[#C68A3D]/30">
                  {exceptionResidents.length} {exceptionResidents.length === 1 ? 'residente' : 'residentes'}
                </span>
              </div>

              {/* Add Exception Autocomplete Dropdown Search (Reference pattern from IncidentReportScreen) */}
              <div className="space-y-1.5" ref={exceptionDropdownRef}>
                <label className="block text-xs font-bold text-[#5C6058] uppercase tracking-wider" htmlFor="input-exception-resident-search">
                  Buscar para añadir o revisar excepción:
                </label>
                <div className="relative">
                  <input
                    id="input-exception-resident-search"
                    type="text"
                    value={exceptionSearchQuery}
                    onFocus={() => setIsExceptionDropdownOpen(true)}
                    onClick={() => setIsExceptionDropdownOpen(true)}
                    onChange={(e) => {
                      setExceptionSearchQuery(e.target.value);
                      setIsExceptionDropdownOpen(true);
                    }}
                    placeholder="Escribe para buscar y añadir residente a excepciones..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#C68A3D]/40 rounded-xl text-sm text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#C68A3D]"
                  />

                  {/* Autocomplete Dropdown with ONLY Names */}
                  {isExceptionDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-[#DEDBD1] shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar divide-y divide-[#DEDBD1]/60">
                      {filteredExceptionResidents.length > 0 ? (
                        filteredExceptionResidents.map((r) => {
                          const isException = !primarySelectedIds.includes(r.id);
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => handleSelectExceptionFromDropdown(r.id)}
                              className={`touch-target w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                                isException
                                  ? 'bg-[#FEF7EE] font-bold text-[#9A5B12]'
                                  : 'text-[#292A24] hover:bg-[#F7F7F8]'
                              }`}
                            >
                              <span>{r.name}</span>
                              {isException ? (
                                <span className="text-[10px] bg-[#C68A3D] text-white px-2 py-0.5 rounded-full font-bold">
                                  En excepción
                                </span>
                              ) : (
                                <span className="text-xs text-[#068591] font-semibold">
                                  + Marcar excepción
                                </span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-3 text-xs text-[#5C6058] text-center">
                          No se encontraron residentes con ese nombre.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* List of Exception Residents Chips with remove button */}
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {exceptionResidents.map((r) => (
                    <div
                      key={r.id}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C68A3D] text-white flex items-center gap-1.5 shadow-2xs"
                    >
                      <AlertTriangle className="w-3 h-3 text-white" />
                      <span>{r.name}</span>
                      <button
                        type="button"
                        onClick={() => togglePrimaryResident(r.id)}
                        className="touch-target hover:bg-black/20 rounded-full p-0.5 ml-0.5"
                        aria-label={`Quitar ${r.name} de excepciones`}
                        title="Restaurar a normal"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Field for Exceptions with Voice Transcription */}
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1.5" htmlFor="textarea-exception-note">
                  Observación para estas excepciones *
                </label>
                <div className="relative">
                  <textarea
                    id="textarea-exception-note"
                    rows={3}
                    value={exceptionNote}
                    onChange={(e) => setExceptionNote(e.target.value)}
                    placeholder="Escribe o dicta la observación particular de las excepciones..."
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

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              id="btn-confirm-feeding-day"
              type="button"
              onClick={handleSaveClick}
              disabled={primarySelectedIds.length === 0 || !primaryNote.trim()}
              className="touch-target w-full py-3.5 px-6 rounded-2xl bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isMeal ? 'Confirmar registro de alimentación' : 'Confirmar registro grupal'}
            </button>

            <button
              type="button"
              onClick={() => setIsMassRegistrationModalOpen(false)}
              className="touch-target w-full py-2.5 text-xs font-semibold text-[#5C6058] hover:text-[#292A24]"
            >
              Cancelar
            </button>
          </div>
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
