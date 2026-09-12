import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ChevronDown } from 'lucide-react';

interface RoleOption {
  id: UserRole;
  label: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'cuidador',
    label: 'Trabajador (Cuidador)'
  },
  {
    id: 'familiar',
    label: 'Familiar Responsable'
  },
  {
    id: 'admin',
    label: 'Administrador / Dueño'
  }
];

export const RoleDropdownSelector: React.FC = () => {
  const { currentUser, switchRole, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeRole = currentUser.role;
  const currentOption = ROLE_OPTIONS.find((opt) => opt.id === activeRole) || ROLE_OPTIONS[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (roleId: UserRole) => {
    if (roleId !== activeRole) {
      switchRole(roleId);
      const targetOption = ROLE_OPTIONS.find((opt) => opt.id === roleId);
      showToast(`Cambiado a vista de ${targetOption?.label || roleId}`, 'info');
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full z-30">
      {/* Label above dropdown: no icons, no badges */}
      <div className="mb-1.5 px-1">
        <label className="text-[11px] font-bold text-[#5C6058] uppercase tracking-wider block">
          Modo de visualización
        </label>
      </div>

      {/* Main Trigger Button: no icon, only rotating chevron on the right */}
      <button
        id="btn-dropdown-role-selector"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`touch-target w-full flex items-center justify-between px-4 py-3 bg-white border rounded-2xl shadow-2xs transition-all text-left ${
          isOpen
            ? 'border-[#068591] ring-2 ring-[#068591]/20'
            : 'border-[#DEDBD1] hover:border-[#068591]/50'
        }`}
      >
        <span className="text-sm font-bold text-[#292A24] truncate">
          {currentOption.label}
        </span>

        <div
          className={`w-6 h-6 flex items-center justify-center transition-transform duration-200 text-[#5C6058] ${
            isOpen ? 'rotate-180 text-[#068591]' : ''
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Dropdown Menu Popover: no icons, only clear text */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Seleccionar modo de visualización"
          className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-2xl border border-[#DEDBD1] shadow-xl p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {ROLE_OPTIONS.map((option) => {
            const isSelected = option.id === activeRole;

            return (
              <button
                key={option.id}
                id={`opt-role-${option.id}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.id)}
                className={`touch-target w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left ${
                  isSelected
                    ? 'bg-[#D9F0F1] text-[#075158] font-bold'
                    : 'text-[#292A24] hover:bg-[#F7F7F8] font-medium'
                }`}
              >
                <span className="text-xs truncate">
                  {option.label}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#068591] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
