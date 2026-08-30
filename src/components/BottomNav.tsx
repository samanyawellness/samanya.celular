import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, CheckSquare, Users, FileCheck2, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsRoleMenuOpen } = useApp();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DEDBD1] shadow-[0_-4px_12px_rgba(0,0,0,0.04)] pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5"
    >
      <div className="max-w-lg mx-auto flex items-center justify-between px-3">
        {/* 1. Perfil */}
        <button
          id="tab-nav-perfil"
          type="button"
          onClick={() => setActiveTab('perfil')}
          className={`touch-target flex flex-1 flex-col items-center justify-center py-1 px-1 transition-all ${
            activeTab === 'perfil'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <User
            className={`w-5 h-5 transition-transform ${
              activeTab === 'perfil' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Perfil
          </span>
        </button>

        {/* 2. Residentes */}
        <button
          id="tab-nav-residentes"
          type="button"
          onClick={() => setActiveTab('residentes')}
          className={`touch-target flex flex-1 flex-col items-center justify-center py-1 px-1 transition-all ${
            activeTab === 'residentes'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <Users
            className={`w-5 h-5 transition-transform ${
              activeTab === 'residentes' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Residentes
          </span>
        </button>

        {/* 3. Inicio (Center Highlighted) */}
        <button
          id="tab-nav-inicio"
          type="button"
          onClick={() => setActiveTab('inicio')}
          className="touch-target -mt-5 flex flex-col items-center justify-center px-2 group"
          aria-label="Ir a Inicio"
        >
          <div
            className={`w-13 h-13 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
              activeTab === 'inicio'
                ? 'bg-[#068591] text-white ring-4 ring-white shadow-[#068591]/30'
                : 'bg-white border-2 border-[#068591] text-[#068591] ring-4 ring-white shadow-xs'
            }`}
          >
            <Home className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] sm:text-[12px] tracking-tight mt-1 ${
              activeTab === 'inicio' ? 'font-black text-[#068591]' : 'font-semibold text-[#5C6058]'
            }`}
          >
            Inicio
          </span>
        </button>

        {/* 4. Tareas */}
        <button
          id="tab-nav-tareas"
          type="button"
          onClick={() => setActiveTab('tareas')}
          className={`touch-target flex flex-1 flex-col items-center justify-center py-1 px-1 transition-all ${
            activeTab === 'tareas'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <CheckSquare
            className={`w-5 h-5 transition-transform ${
              activeTab === 'tareas' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Tareas
          </span>
        </button>

        {/* 5. Consentimientos */}
        <button
          id="tab-nav-consentimientos"
          type="button"
          onClick={() => setActiveTab('consentimientos')}
          className={`touch-target flex-1 flex flex-col items-center justify-center py-1 px-1 transition-all ${
            activeTab === 'consentimientos'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <FileCheck2
            className={`w-5 h-5 transition-transform ${
              activeTab === 'consentimientos' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Consentimientos
          </span>
        </button>
      </div>
    </nav>
  );
};
