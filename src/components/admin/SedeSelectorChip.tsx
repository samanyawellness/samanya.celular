import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, Check, Building2, X, Users, MapPin } from 'lucide-react';

export const SedeSelectorChip: React.FC = () => {
  const {
    adminSubrole,
    selectedSede,
    selectedSedeId,
    setSelectedSedeId,
    sedes,
    isSedePickerModalOpen,
    setIsSedePickerModalOpen
  } = useApp();

  const isDueno = adminSubrole === 'dueno';

  // For Administrador, they always see a single fixed sede (Sede Central)
  if (!isDueno) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#D9F0F1] text-[#075158] border border-[#068591]/20 shadow-2xs">
        <Building2 className="w-3.5 h-3.5 text-[#068591]" />
        <span className="text-[#5C6058] font-normal text-[11px]">Sede:</span>
        <span className="font-bold truncate max-w-[140px]">{selectedSede?.shortName || 'Sede Central'}</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <button
          id="btn-admin-sede-selector"
          type="button"
          onClick={() => setIsSedePickerModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs border bg-white hover:bg-[#F7F7F8] active:scale-98 text-[#292A24] border-[#DEDBD1] cursor-pointer"
          aria-label="Seleccionar sede del centro"
        >
          <Building2 className="w-3.5 h-3.5 text-[#068591] shrink-0" />
          <span className="text-[#5C6058] font-normal text-[11px]">Sede:</span>
          <span className="text-[#075158] font-bold max-w-[130px] truncate">
            {selectedSede?.shortName || 'Sede'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#5C6058] shrink-0" />
        </button>
      </div>

      {/* Sede Picker Modal (Reuses same pattern as ResidentPickerModal) */}
      {isSedePickerModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            id="modal-sede-picker"
            className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-xl border border-[#DEDBD1] animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#D9F0F1] text-[#068591] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#292A24]">
                  Seleccionar sede
                </h3>
              </div>
              <button
                type="button"
                id="btn-close-sede-modal"
                onClick={() => setIsSedePickerModalOpen(false)}
                className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] rounded-full hover:bg-[#F7F7F8]"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mt-3">
              {sedes.map(sede => {
                const isSelected = sede.id === selectedSedeId;
                return (
                  <button
                    key={sede.id}
                    id={`btn-select-sede-${sede.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedSedeId(sede.id);
                      setIsSedePickerModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-[#D9F0F1]/60 border-[#068591] ring-1 ring-[#068591]'
                        : 'bg-[#F7F7F8] border-[#DEDBD1] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-bold text-[#292A24]">
                          {sede.name}
                        </div>
                        <div className="text-xs text-[#5C6058] flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#068591]" />
                          <span>{sede.city}</span>
                          <span>·</span>
                          <Users className="w-3 h-3 text-[#5C6058]" />
                          <span>{sede.residentCount} residentes</span>
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#068591] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-xs text-[#068591] font-semibold shrink-0">
                        Cambiar
                      </span>
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
