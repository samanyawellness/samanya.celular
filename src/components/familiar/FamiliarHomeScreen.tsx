import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  ShieldAlert
} from 'lucide-react';

export const FamiliarHomeScreen: React.FC = () => {
  const {
    currentUser,
    selectedFamiliarResident,
    consents,
    setActiveFamiliarTab,
    openConsentSignModal
  } = useApp();

  // Find pending consents for this resident
  const pendingConsents = consents.filter(
    c =>
      c.status === 'pendiente' &&
      (c.residentId === selectedFamiliarResident?.id || c.residentName === selectedFamiliarResident?.name)
  );

  const hasPendingConsent = pendingConsents.length > 0;
  const currentPendingConsent = pendingConsents[0];

  return (
    <div className="space-y-4 pb-28 px-4 sm:px-5 max-w-lg mx-auto pt-1 animate-in fade-in duration-200">
      {/* 1. Clean Greeting (No avatar for Familiar) */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-[#292A24]">
          Hola, {currentUser.name}
        </h2>
      </div>

      {/* 2. AVISO: Consentimiento pendiente de firma */}
      {hasPendingConsent && (
        <div className="bg-[#FEF3EB] rounded-3xl p-4 sm:p-5 border border-[#FAD7BC] space-y-3 shadow-2xs animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F57C00] text-white flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#7A3600]">
                Autorización pendiente de firma
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#5C6058] leading-relaxed">
            Se ha solicitado tu consentimiento para:{' '}
            <strong className="text-[#292A24]">{currentPendingConsent.type}</strong> — {currentPendingConsent.description}
          </p>

          <div className="pt-1 flex items-center gap-2">
            <button
              id="btn-familiar-sign-consent-alert"
              type="button"
              onClick={() => openConsentSignModal(currentPendingConsent)}
              className="touch-target flex-1 py-2.5 px-4 rounded-2xl bg-[#068591] text-white font-bold text-xs shadow-xs hover:bg-[#056c76] active:scale-[0.99] transition-all text-center"
            >
              Revisar y firmar
            </button>

            <button
              type="button"
              onClick={() => setActiveFamiliarTab('bitacora')}
              className="touch-target py-2.5 px-3 rounded-2xl bg-white border border-[#DEDBD1] text-[#292A24] font-semibold text-xs hover:bg-[#F7F7F8] transition-all"
            >
              Ver en Bitácora
            </button>
          </div>
        </div>
      )}

      {/* 3. Tarjeta de "Resumen de hoy" (Sin iconos, solo el título sin descripción) */}
      <div className="bg-[#EBF7F8] rounded-3xl p-4 sm:p-5 border border-[#BCE4E8] space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#075158]">
            Resumen de hoy
          </h3>
        </div>

        {/* Status items grid - text only, no icons */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-[#DEDBD1]">
            <div className="font-bold text-[#292A24]">Medicación</div>
            <div className="text-[11px] text-[#5C6058] mt-0.5">Al día (09:00h ✓)</div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#DEDBD1]">
            <div className="font-bold text-[#292A24]">Alimentación</div>
            <div className="text-[11px] text-[#5C6058] mt-0.5">Desayuno completo</div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#DEDBD1]">
            <div className="font-bold text-[#292A24]">Actividad</div>
            <div className="text-[11px] text-[#5C6058] mt-0.5">Taller de memoria 10h</div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#DEDBD1]">
            <div className="font-bold text-[#292A24]">Constantes</div>
            <div className="text-[11px] text-[#5C6058] mt-0.5">Estables (124/80)</div>
          </div>
        </div>

        {/* Direct Button to Bitacora de hoy */}
        <button
          id="btn-goto-bitacora"
          type="button"
          onClick={() => setActiveFamiliarTab('bitacora')}
          className="touch-target w-full py-3 px-4 rounded-2xl bg-[#068591] text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-[#056c76] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          <span>Ver bitácora completa de hoy</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
