import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Info } from 'lucide-react';
import { VoiceInputButton } from './VoiceInputButton';

export const BitacoraModal: React.FC = () => {
  const {
    isBitacoraModalOpen,
    setIsBitacoraModalOpen,
    selectedResident,
    selectedDate,
    addBitacoraEntry
  } = useApp();

  const [category, setCategory] = useState<string>('Observación general');
  const [customCategory, setCustomCategory] = useState('');
  const [text, setText] = useState('');
  const [recordedByVoice, setRecordedByVoice] = useState(false);

  if (!isBitacoraModalOpen || !selectedResident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const finalCategory = category === 'Otra' ? (customCategory.trim() || 'Otra') : category;

    addBitacoraEntry({
      residentId: selectedResident.id,
      residentName: selectedResident.name,
      date: selectedDate,
      category: finalCategory,
      text: text.trim(),
      recordedByVoice
    });

    setText('');
    setCustomCategory('');
    setRecordedByVoice(false);
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
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Registrar entrada en bitácora"
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] space-y-4 animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
          <h3 className="font-bold text-base text-[#292A24] leading-tight">
            Registrar en bitácora
          </h3>
          <button
            id="btn-close-bitacora-modal"
            type="button"
            onClick={() => setIsBitacoraModalOpen(false)}
            className="touch-target p-1.5 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
            aria-label="Cerrar modal de bitácora"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-[#292A24] mb-1.5">
              Categoría de la entrada
            </label>
            <div className="grid grid-cols-2 gap-2">
              {standardCategories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`touch-target p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
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
              <div className="mt-2 animate-in fade-in">
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Escribe la categoría personalizada..."
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#068591] rounded-xl text-xs text-[#292A24] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Voice Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#292A24]" htmlFor="bitacora-text">
                {category === 'Visitante'
                  ? 'Registro de visita (dictado libre)'
                  : category === 'Gasto adicional'
                  ? 'Detalle del gasto adicional'
                  : 'Descripción de la observación'}
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
                className="w-full p-3 pr-12 pb-12 bg-[#F7F7F8] border border-[#DEDBD1] rounded-2xl text-base text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591] focus:ring-2 focus:ring-[#068591]/20"
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
              <div className="mt-2 p-2.5 rounded-2xl bg-[#D9F0F1]/50 border border-[#068591]/20 text-xs text-[#075158] flex items-start gap-2">
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

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              id="btn-save-bitacora"
              type="submit"
              disabled={!text.trim() || (category === 'Otra' && !customCategory.trim())}
              className="touch-target w-full py-3.5 px-6 rounded-2xl bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-base shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
              <span>Guardar entrada en bitácora</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBitacoraModalOpen(false)}
              className="touch-target w-full py-2 text-xs font-semibold text-[#5C6058] hover:text-[#292A24]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

