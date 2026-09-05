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
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-[#D9F0F1]/70 dark:bg-[#153B3E] border-[#068591] dark:border-[#14B8C7] ring-1 ring-[#068591] dark:ring-[#14B8C7]'
                        : 'bg-[#F7F7F8] dark:bg-[#181D1B] border-[#DEDBD1] dark:border-[#2B3430] hover:bg-white dark:hover:bg-[#202623]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className={`text-sm font-bold ${
                          isSelected
                            ? 'text-[#075158] dark:text-[#FFFFFF]'
                            : 'text-[#292A24] dark:text-[#F0F3F1]'
                        }`}>
                          {resident.name}
                        </div>
                        <div className={`text-xs mt-0.5 font-medium ${
                          isSelected
                            ? 'text-[#075158] dark:text-[#67E8F9]'
                            : 'text-[#5C6058] dark:text-[#A3ACA6]'
                        }`}>
                          {resident.room} · {resident.bed}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#068591] dark:bg-[#14B8C7] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-xs text-[#5C6058] dark:text-[#A3ACA6] font-medium">Seleccionar</span>
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
