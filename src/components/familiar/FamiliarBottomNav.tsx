import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, ClipboardList, Home, Contact } from 'lucide-react';

export const FamiliarBottomNav: React.FC = () => {
  const { activeFamiliarTab, setActiveFamiliarTab } = useApp();

  return (
    <nav
      aria-label="Navegación familiar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DEDBD1] shadow-[0_-4px_12px_rgba(0,0,0,0.04)] pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5"
    >
      <div className="max-w-lg mx-auto grid grid-cols-4 items-center px-2 sm:px-4">
        {/* 1. Perfil */}
        <button
          id="tab-familiar-perfil"
          type="button"
          onClick={() => setActiveFamiliarTab('perfil')}
          className={`touch-target flex flex-col items-center justify-center py-1 px-1 transition-all ${
            activeFamiliarTab === 'perfil'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <User
            className={`w-5 h-5 transition-transform ${
              activeFamiliarTab === 'perfil' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Perfil
          </span>
        </button>

        {/* 2. Bitácora */}
        <button
          id="tab-familiar-bitacora"
          type="button"
          onClick={() => setActiveFamiliarTab('bitacora')}
          className={`touch-target flex flex-col items-center justify-center py-1 px-1 transition-all ${
            activeFamiliarTab === 'bitacora'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <ClipboardList
            className={`w-5 h-5 transition-transform ${
              activeFamiliarTab === 'bitacora' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Bitácora
          </span>
        </button>

        {/* 3. Inicio (Center Highlighted) */}
        <button
          id="tab-familiar-inicio"
          type="button"
          onClick={() => setActiveFamiliarTab('inicio')}
          className="touch-target -mt-5 flex flex-col items-center justify-center px-1 group"
          aria-label="Ir a Inicio"
        >
          <div
            className={`w-13 h-13 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
              activeFamiliarTab === 'inicio'
                ? 'bg-[#068591] text-white ring-4 ring-white shadow-[#068591]/30'
                : 'bg-white border-2 border-[#068591] text-[#068591] ring-4 ring-white shadow-xs'
            }`}
          >
            <Home className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] sm:text-[12px] tracking-tight mt-1 ${
              activeFamiliarTab === 'inicio' ? 'font-black text-[#068591]' : 'font-semibold text-[#5C6058]'
            }`}
          >
            Inicio
          </span>
        </button>

        {/* 4. Residente (Ficha del residente) */}
        <button
          id="tab-familiar-residente"
          type="button"
          onClick={() => setActiveFamiliarTab('residente')}
          className={`touch-target flex flex-col items-center justify-center py-1 px-1 transition-all ${
            activeFamiliarTab === 'residente' || activeFamiliarTab === 'calendario'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <Contact
            className={`w-5 h-5 transition-transform ${
              activeFamiliarTab === 'residente' || activeFamiliarTab === 'calendario' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Residente
          </span>
        </button>
      </div>
    </nav>
  );
};
