import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Clock, Home, CheckSquare } from 'lucide-react';

export const AdminBottomNav: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab } = useApp();

  return (
    <nav
      aria-label="Navegación Administrador y Dueño"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DEDBD1] shadow-[0_-4px_12px_rgba(0,0,0,0.04)] pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5"
    >
      <div className="max-w-lg mx-auto grid grid-cols-4 items-center px-2 sm:px-4">
        {/* 1. Perfil */}
        <button
          id="tab-admin-perfil"
          type="button"
          onClick={() => setActiveAdminTab('perfil')}
          className={`touch-target flex flex-col items-center justify-center py-1 px-1 transition-all ${
            activeAdminTab === 'perfil'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <User
            className={`w-5 h-5 transition-transform ${
              activeAdminTab === 'perfil' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Perfil
          </span>
        </button>

        {/* 2. Turnos */}
        <button
          id="tab-admin-turnos"
          type="button"
          onClick={() => setActiveAdminTab('turnos')}
          className={`touch-target flex flex-col items-center justify-center py-1 px-1 transition-all ${
            activeAdminTab === 'turnos'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <Clock
            className={`w-5 h-5 transition-transform ${
              activeAdminTab === 'turnos' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Turnos
          </span>
        </button>

        {/* 3. Inicio (Center Highlighted) */}
        <button
          id="tab-admin-inicio"
          type="button"
          onClick={() => setActiveAdminTab('inicio')}
          className="touch-target -mt-5 flex flex-col items-center justify-center px-1 group"
          aria-label="Ir a Inicio"
        >
          <div
            className={`w-13 h-13 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
              activeAdminTab === 'inicio'
                ? 'bg-[#068591] text-white ring-4 ring-white shadow-[#068591]/30'
                : 'bg-white border-2 border-[#068591] text-[#068591] ring-4 ring-white shadow-xs'
            }`}
          >
            <Home className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] sm:text-[12px] tracking-tight mt-1 ${
              activeAdminTab === 'inicio' ? 'font-black text-[#068591]' : 'font-semibold text-[#5C6058]'
            }`}
          >
            Inicio
          </span>
        </button>

        {/* 4. Tareas */}
        <button
          id="tab-admin-tareas"
          type="button"
          onClick={() => setActiveAdminTab('tareas')}
          className={`touch-target flex flex-col items-center justify-center py-1 px-1 transition-all ${
            activeAdminTab === 'tareas'
              ? 'text-[#068591] font-bold'
              : 'text-[#5C6058] hover:text-[#292A24] font-medium'
          }`}
        >
          <CheckSquare
            className={`w-5 h-5 transition-transform ${
              activeAdminTab === 'tareas' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          <span className="text-[11px] sm:text-[12px] tracking-tight whitespace-nowrap mt-1">
            Tareas
          </span>
        </button>
      </div>
    </nav>
  );
};
