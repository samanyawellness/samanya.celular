import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Check,
  Info,
  ChevronLeft,
  Search,
  BookOpen
} from 'lucide-react';
import { VoiceInputButton } from './VoiceInputButton';

export const BitacoraModal: React.FC = () => {
  const {
    isBitacoraModalOpen,
    setIsBitacoraModalOpen,
    selectedResident,
    residents,
    selectedDate,
    addBitacoraEntry
  } = useApp();

  const [activeResidentId, setActiveResidentId] = useState<string>('');
  const [residentSearchQuery, setResidentSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState<string>('Observación general');
  const [customCategory, setCustomCategory] = useState('');
  const [text, setText] = useState('');
  const [recordedByVoice, setRecordedByVoice] = useState(false);

  // Initialize resident when screen opens
  useEffect(() => {
    if (isBitacoraModalOpen) {
      if (selectedResident) {
        setActiveResidentId(selectedResident.id);
        setResidentSearchQuery('');
      } else if (residents.length > 0) {
        setActiveResidentId(residents[0].id);
        setResidentSearchQuery('');
      } else {
        setActiveResidentId('');
        setResidentSearchQuery('');
      }
      setText('');
      setCustomCategory('');
      setCategory('Observación general');
      setRecordedByVoice(false);
      setIsDropdownOpen(false);
    }
  }, [isBitacoraModalOpen, selectedResident, residents]);

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResidents = useMemo(() => {
    if (!residentSearchQuery.trim()) return residents;
    const q = residentSearchQuery.toLowerCase();
    return residents.filter(r => r.name.toLowerCase().includes(q));
  }, [residents, residentSearchQuery]);

  if (!isBitacoraModalOpen) return null;

  const currentResident = residents.find(r => r.id === activeResidentId) || selectedResident;

  const handleSelectResident = (resId: string) => {
    setActiveResidentId(resId);
    setResidentSearchQuery('');
    setIsDropdownOpen(false);
  };

  const handleRemoveResident = () => {
    setActiveResidentId('');
    setResidentSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !currentResident) return;

    const finalCategory = category === 'Otra' ? (customCategory.trim() || 'Otra') : category;

    addBitacoraEntry({
      residentId: currentResident.id,
      residentName: currentResident.name,
      date: selectedDate,
      category: finalCategory,
      text: text.trim(),
      recordedByVoice
    });

    setText('');
    setCustomCategory('');
    setRecordedByVoice(false);
    setIsBitacoraModalOpen(false);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setText(transcript);
    setRecordedByVoice(true);
  };

  const standardCategories = [
    'Visita médica',
    'Observación general',
    'Gasto adicional',
    'Visitante',
    'Higiene y confort',
    'Nutrición',
    'Otra'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F7F8] overflow-y-auto animate-in fade-in duration-200">
      <div className="min-h-screen max-w-lg mx-auto pb-28">
        {/* Sticky Top Header with back navigation button */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DEDBD1] px-4 py-3 flex items-center justify-between">
          <button
            id="btn-back-bitacora"
            type="button"
            onClick={() => setIsBitacoraModalOpen(false)}
            className="touch-target min-w-[44px] min-h-[44px] -ml-2 px-2 flex items-center gap-1 text-[#068591] font-bold text-sm active:scale-95 transition-all"
            aria-label="Volver atrás"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div>
            <h1 className="font-bold text-base text-[#292A24]">
              Registrar en Bitácora
            </h1>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Section 1: Resident Selection with Search (Matching IncidentReportScreen pattern) */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-3" ref={dropdownRef}>
            <label className="block text-xs font-bold text-[#075158] uppercase tracking-wider" htmlFor="input-bitacora-resident-search">
              1. Residente *
            </label>

            {/* Selected Resident Chip */}
            {currentResident && (
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D9F0F1] text-[#075158] rounded-full text-xs font-bold border border-[#068591]/30 shadow-2xs">
                  <span>{currentResident.name}</span>
                  <span className="text-[11px] font-normal text-[#075158]/80">({currentResident.room})</span>
                  <button
                    type="button"
                    onClick={handleRemoveResident}
                    className="touch-target hover:text-[#8C2E2E] ml-1 p-0.5"
                    aria-label={`Cambiar residente ${currentResident.name}`}
                    title="Cambiar residente"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
            )}

            {/* Search Input for Resident Autocomplete */}
            <div className="relative">
              <input
                id="input-bitacora-resident-search"
                type="text"
                value={residentSearchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onClick={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setResidentSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder={currentResident ? "Escribe para cambiar de residente..." : "Escribe para buscar y seleccionar residente..."}
                className="w-full pl-9 pr-8 py-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591] focus:bg-white transition-colors"
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

              {/* Autocomplete Dropdown with ONLY Names */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-[#DEDBD1] shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar divide-y divide-[#DEDBD1]/60">
                  {filteredResidents.length > 0 ? (
                    filteredResidents.map((r) => {
                      const isSelected = activeResidentId === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleSelectResident(r.id)}
                          className={`touch-target w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#D9F0F1] font-bold text-[#075158]'
                              : 'text-[#292A24] hover:bg-[#F7F7F8]'
                          }`}
                        >
                          <span>{r.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#068591]" />}
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

          {/* Section 2: Category Selector */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-3">
            <label className="block text-xs font-bold text-[#075158] uppercase tracking-wider">
              2. Categoría de la entrada *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {standardCategories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`touch-target p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                      isSelected
                        ? 'bg-[#D9F0F1] border-[#068591] text-[#075158] ring-1 ring-[#068591]'
                        : 'bg-[#F7F7F8] border-[#DEDBD1] text-[#5C6058] hover:bg-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* If 'Otra' is selected, display custom input */}
            {category === 'Otra' && (
              <div className="pt-2 animate-in fade-in">
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Escribe la categoría personalizada..."
                  className="w-full p-3 bg-[#F7F7F8] border border-[#068591] rounded-xl text-xs text-[#292A24] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Section 3: Voice / Text Input */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#075158] uppercase tracking-wider" htmlFor="bitacora-text">
                3. {category === 'Visitante'
                  ? 'Registro de visita (dictado libre)'
                  : category === 'Gasto adicional'
                  ? 'Detalle del gasto adicional'
                  : 'Descripción de la observación *'}
              </label>
              {recordedByVoice && (
                <span className="text-[11px] font-bold text-[#068591] bg-[#D9F0F1] px-2 py-0.5 rounded-md">
                  Voz transcrita (editable)
                </span>
              )}
            </div>

            <div className="relative">
              <textarea
                id="bitacora-text"
                rows={4}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  category === 'Visitante'
                    ? 'Ej: la hija de Doña Rosa llegó acompañada de un hombre joven...'
                    : category === 'Gasto adicional'
                    ? 'Ej: Compra extraordinaria en farmacia comunitaria de crema emoliente (14,20€)...'
                    : 'Escribe o dicta por voz la observación...'
                }
                className="w-full p-3.5 pr-12 pb-12 bg-[#F7F7F8] border border-[#DEDBD1] rounded-2xl text-sm text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591] focus:bg-white transition-colors"
              />
              <div className="absolute right-2.5 bottom-2.5 z-10">
                <VoiceInputButton
                  contextHint={category === 'Visitante' ? 'visitante' : category === 'Gasto adicional' ? 'gasto_adicional' : 'bitacora'}
                  currentValue={text}
                  onTranscript={handleVoiceTranscript}
                />
              </div>
            </div>

            {/* Helper guidance note for visitor category */}
            {category === 'Visitante' && (
              <div className="p-3 rounded-2xl bg-[#D9F0F1]/50 border border-[#068591]/20 text-xs text-[#075158] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#068591] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-[#075158]">Orientación para registro libre:</p>
                  <p className="text-[#292A24] leading-relaxed">
                    Ej: la hija de Doña Rosa llegó acompañada de un hombre joven. Puedes incluir quién visitó, parentesco, horario o incidencias con total libertad y editar el texto antes de confirmar.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              id="btn-save-bitacora"
              type="submit"
              disabled={!text.trim() || !currentResident || (category === 'Otra' && !customCategory.trim())}
              className="touch-target w-full py-3.5 px-6 rounded-2xl bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Guardar entrada en bitácora</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBitacoraModalOpen(false)}
              className="touch-target w-full py-2.5 text-xs font-semibold text-[#5C6058] hover:text-[#292A24]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
