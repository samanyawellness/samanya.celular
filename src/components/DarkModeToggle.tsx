import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  id?: string;
  variant?: 'icon' | 'row';
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  id = 'btn-dark-mode-toggle',
  variant = 'icon',
  className = ''
}) => {
  const { isDarkMode, toggleDarkMode } = useApp();

  if (variant === 'row') {
    return (
      <div
        className={`flex items-center justify-between p-3.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/60 transition-colors ${className}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isDarkMode
                ? 'bg-[#14B8C7]/20 text-[#14B8C7]'
                : 'bg-[#C68A3D]/15 text-[#C68A3D]'
            }`}
          >
            {isDarkMode ? (
              <Moon className="w-4.5 h-4.5 stroke-[2.2] animate-in spin-in-180 duration-300" />
            ) : (
              <Sun className="w-4.5 h-4.5 stroke-[2.2] animate-in spin-in-180 duration-300" />
            )}
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm text-[#292A24] block">
              Modo oscuro
            </span>
            <span className="text-[#5C6058] text-[11px] block">
              {isDarkMode ? 'Tema nocturno de alto contraste' : 'Tema diurno estándar'}
            </span>
          </div>
        </div>

        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={isDarkMode}
          onClick={toggleDarkMode}
          className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#068591] focus:ring-offset-2 ${
            isDarkMode ? 'bg-[#14B8C7]' : 'bg-gray-300'
          }`}
          aria-label={isDarkMode ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
              isDarkMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          >
            {isDarkMode ? (
              <Moon className="w-3.5 h-3.5 text-[#101413] stroke-[2.5]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-[#C68A3D] stroke-[2.5]" />
            )}
          </span>
        </button>
      </div>
    );
  }

  return (
    <button
      id={id}
      type="button"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={`touch-target w-9 h-9 rounded-full bg-white border border-[#DEDBD1] shadow-2xs hover:bg-[#F7F7F8] active:scale-95 transition-all flex items-center justify-center text-[#292A24] group ${className}`}
    >
      <span className="relative flex items-center justify-center w-5 h-5">
        {isDarkMode ? (
          <Sun className="w-4.5 h-4.5 text-[#FBBF24] group-hover:rotate-45 transition-transform duration-300 stroke-[2.2]" />
        ) : (
          <Moon className="w-4.5 h-4.5 text-[#5C6058] group-hover:text-[#068591] group-hover:-rotate-12 transition-transform duration-300 stroke-[2.2]" />
        )}
      </span>
    </button>
  );
};
