import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Shield,
  KeyRound,
  Settings,
  LogOut,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { UserRole } from '../types';
import { DarkModeToggle } from './DarkModeToggle';

export const ProfileScreen: React.FC = () => {
  const { user: userFromContext, currentUser, logout } = useApp();
  const user = userFromContext || currentUser || {
    name: 'Elena Morales',
    email: 'elena.morales@samanya.es',
    role: 'cuidador' as UserRole,
    shift: 'Turno Mañana (07:00 - 15:00)',
    unit: 'Planta 1 — Cuidados Asistenciales',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  };

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccessMessage('');

    if (!currentPass) {
      setPasswordError('Debes ingresar tu contraseña actual.');
      return;
    }
    if (newPass.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setPasswordError('Las nuevas contraseñas no coinciden.');
      return;
    }

    // Success
    setPasswordSuccessMessage('Contraseña actualizada correctamente.');
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setPasswordSuccessMessage('');
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1">
      {/* Top Header */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-[#292A24]">
          Perfil
        </h2>
      </div>

      {/* User Profile Card */}
      <div className="p-5 bg-white rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-4">
        {/* Top: Avatar, Name, Shift */}
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border border-[#DEDBD1] shadow-2xs"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-[#292A24] truncate">
              {user.name}
            </h3>
            <p className="text-xs text-[#5C6058] font-medium mt-0.5">
              {user.shift}
            </p>
          </div>
        </div>

        {/* Highlight boxes: only text, no icons. Box 1: Residentes. Box 2: Sede */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#DEDBD1]/60">
          <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/60">
            <span className="text-[11px] uppercase font-bold text-[#5C6058] block">Residentes</span>
            <span className="text-sm font-black text-[#292A24] mt-0.5 block">8 asignados</span>
          </div>

          <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/60">
            <span className="text-[11px] uppercase font-bold text-[#5C6058] block">Sede</span>
            <span className="text-sm font-black text-[#292A24] mt-0.5 block">{user.unit || 'Planta 1'}</span>
          </div>
        </div>
      </div>


      {/* Account Settings Menu */}
      <div className="space-y-2 pt-1">
        <label className="block text-xs font-bold text-[#5C6058] uppercase tracking-wider px-1">
          Opciones y Ajustes
        </label>

        <div className="bg-white rounded-3xl border border-[#DEDBD1] shadow-2xs divide-y divide-[#DEDBD1] overflow-hidden">
          {/* Mi Cuenta */}
          <button
            id="btn-profile-account"
            type="button"
            onClick={() => setIsAccountModalOpen(true)}
            className="touch-target w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F8] active:bg-[#F0EFEA] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F7F8] text-[#068591] flex items-center justify-center border border-[#DEDBD1]">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-[#292A24]">Mi Cuenta</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5C6058]" />
          </button>

          {/* Cambiar Contraseña */}
          <button
            id="btn-profile-change-password"
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="touch-target w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F8] active:bg-[#F0EFEA] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F7F8] text-[#068591] flex items-center justify-center border border-[#DEDBD1]">
                <KeyRound className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-[#292A24]">Cambiar Contraseña</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5C6058]" />
          </button>

          {/* Modo Oscuro */}
          <div className="p-2.5">
            <DarkModeToggle variant="row" id="toggle-profile-dark-mode" />
          </div>

          {/* Configuración */}
          <button
            id="btn-profile-settings"
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="touch-target w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F8] active:bg-[#F0EFEA] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F7F8] text-[#068591] flex items-center justify-center border border-[#DEDBD1]">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-[#292A24]">Configuración</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5C6058]" />
          </button>

          {/* Cerrar Sesión */}
          <button
            id="btn-profile-logout"
            type="button"
            onClick={logout}
            className="touch-target w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FBEAEA]/50 active:bg-[#FBEAEA] transition-colors text-[#8C2E2E]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FBEAEA] text-[#8C2E2E] flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-[#8C2E2E]">Cerrar Sesión</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8C2E2E]" />
          </button>
        </div>
      </div>

      {/* Modal: Cambiar Contraseña */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Cambiar contraseña"
            className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <h3 className="font-bold text-base text-[#292A24]">
                Cambiar Contraseña
              </h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="touch-target p-1.5 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {passwordError && (
              <div className="p-3 bg-[#FBEAEA] border border-[#8C2E2E]/30 rounded-xl text-xs font-bold text-[#8C2E2E]">
                {passwordError}
              </div>
            )}

            {passwordSuccessMessage && (
              <div className="p-3 bg-[#DFF3E7] border border-[#1E7A4C]/30 rounded-xl text-xs font-bold text-[#1E7A4C] flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                {passwordSuccessMessage}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-current-pass">
                  Contraseña actual *
                </label>
                <input
                  id="input-current-pass"
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full p-3 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-new-pass">
                  Nueva contraseña *
                </label>
                <input
                  id="input-new-pass"
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full p-3 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-confirm-pass">
                  Confirmar nueva contraseña *
                </label>
                <input
                  id="input-confirm-pass"
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full p-3 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="touch-target w-full py-3 px-4 rounded-xl bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-sm shadow-xs active:scale-[0.99] transition-all"
                >
                  Guardar nueva contraseña
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="touch-target w-full py-2 text-xs font-semibold text-[#5C6058] hover:text-[#292A24]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Mi Cuenta */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mi cuenta"
            className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <h3 className="font-bold text-base text-[#292A24]">
                Mi Cuenta
              </h3>
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(false)}
                className="touch-target p-1.5 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-[#292A24]">
              <div className="p-3 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1]/60">
                <span className="text-[#5C6058] block font-medium">Nombre completo</span>
                <strong className="text-sm text-[#292A24]">{user.name}</strong>
              </div>
              <div className="p-3 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1]/60">
                <span className="text-[#5C6058] block font-medium">Correo electrónico</span>
                <strong className="text-sm text-[#292A24]">{user.email}</strong>
              </div>
              <div className="p-3 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1]/60">
                <span className="text-[#5C6058] block font-medium">Unidad asignada</span>
                <strong className="text-sm text-[#292A24]">{user.unit}</strong>
              </div>
              <div className="p-3 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1]/60">
                <span className="text-[#5C6058] block font-medium">Horario de turno</span>
                <strong className="text-sm text-[#292A24]">{user.shift}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAccountModalOpen(false)}
              className="touch-target w-full py-3 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal: Configuración */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Configuración"
            className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <h3 className="font-bold text-base text-[#292A24]">
                Preferencias de la App
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="touch-target p-1.5 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <DarkModeToggle variant="row" id="toggle-modal-dark-mode" />
              <div className="flex items-center justify-between p-3.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/60">
                <div>
                  <span className="font-bold text-[#292A24] block">Notificaciones sonoras</span>
                  <span className="text-[#5C6058] text-[11px] block">Alertas de medicamentos y emergencias</span>
                </div>
                <span className="text-[#1E7A4C] font-bold px-2.5 py-1 bg-[#DFF3E7] rounded-lg">Activado</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/60">
                <div>
                  <span className="font-bold text-[#292A24] block">Idioma de dictado por voz</span>
                  <span className="text-[#5C6058] text-[11px] block">Reconocimiento para bitácoras</span>
                </div>
                <span className="text-[#075158] font-bold px-2.5 py-1 bg-[#D9F0F1] rounded-lg">Español (ES)</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/60">
                <div>
                  <span className="font-bold text-[#292A24] block">Versión del sistema</span>
                  <span className="text-[#5C6058] text-[11px] block">Plataforma Samanya Asistencial</span>
                </div>
                <span className="text-[#5C6058] font-semibold">v2.4.0</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(false)}
              className="touch-target w-full py-3 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
