import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, Check, UserCheck, X } from 'lucide-react';

export const ResidentSelectorChip: React.FC = () => {
  const {
    selectedFamiliarResident,
    setSelectedFamiliarResidentId,
    familiarResidents,
    isResidentPickerModalOpen,
    setIsResidentPickerModalOpen
  } = useApp();

  const isMultiple = familiarResidents.length > 1;

  return (
    <>
      <div className="flex items-center">
        <button
          id="btn-familiar-resident-selector"
          type="button"
          disabled={!isMultiple}
          onClick={() => isMultiple && setIsResidentPickerModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs border ${
            isMultiple
              ? 'bg-white hover:bg-[#F7F7F8] active:scale-98 text-[#292A24] border-[#DEDBD1] cursor-pointer'
              : 'bg-[#D9F0F1] text-[#075158] border-[#068591]/20 cursor-default'
          }`}
          aria-label="Seleccionar residente"
        >
          <span className="text-[#5C6058] font-normal text-[11px]">Viendo a:</span>
          <span className="text-[#075158] font-bold max-w-[140px] truncate">{selectedFamiliarResident?.name || 'Residente'}</span>
          {isMultiple && <ChevronDown className="w-3.5 h-3.5 text-[#5C6058] shrink-0" />}
        </button>
      </div>

      {/* Resident Picker Modal */}
      {isResidentPickerModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            id="modal-resident-picker"
            className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-xl border border-[#DEDBD1] animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#D9F0F1] text-[#068591] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#292A24]">
                  Cambiar residente
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsResidentPickerModalOpen(false)}
                className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] rounded-full hover:bg-[#F7F7F8]"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#5C6058] mt-2 mb-3">
              Selecciona el familiar o residente sobre el cual deseas consultar información:
            </p>

            <div className="space-y-2">
              {familiarResidents.map(resident => {
                const isSelected = resident.id === selectedFamiliarResident.id;
                return (
                  <button
                    key={resident.id}
                    type="button"
                    onClick={() => {
                      setSelectedFamiliarResidentId(resident.id);
                      setIsResidentPickerModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-[#D9F0F1]/60 border-[#068591] ring-1 ring-[#068591]'
                        : 'bg-[#F7F7F8] border-[#DEDBD1] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-bold text-[#292A24]">
                          {resident.name}
                        </div>
                        <div className="text-xs text-[#5C6058]">
                          {resident.room} · {resident.bed}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#068591] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-xs text-[#5C6058] font-medium">Seleccionar</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
