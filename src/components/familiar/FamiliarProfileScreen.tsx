import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  KeyRound,
  Settings,
  LogOut,
  ChevronRight,
  Check,
  X,
  Heart,
  Building,
  Phone,
  Mail
} from 'lucide-react';
import { UserRole } from '../../types';

export const FamiliarProfileScreen: React.FC = () => {
  const { currentUser, switchRole, logout, familiarResidents, selectedFamiliarResident } = useApp();

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
    <div className="space-y-4 pb-28 px-4 sm:px-5 max-w-lg mx-auto pt-1 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-[#292A24]">
          Perfil del Responsable
        </h2>
      </div>

      {/* User Profile Card */}
      <div className="p-5 bg-white rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-4">
        {/* Top: Name, Role (No profile photo) */}
        <div>
          <h3 className="text-xl font-black text-[#292A24] tracking-tight">
            {currentUser.name}
          </h3>
          <p className="text-xs text-[#068591] font-bold mt-0.5">
            Familiar Responsable / Tutor Legal
          </p>
          <p className="text-[11px] text-[#5C6058] mt-0.5">
            Parentesco: Hijo / Representante
          </p>
        </div>

        {/* Highlight boxes: only text, no icons (matches Samanya design rule) */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#DEDBD1]/60">
          <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/60">
            <span className="text-[11px] uppercase font-bold text-[#5C6058] block">Residentes</span>
            <span className="text-sm font-black text-[#292A24] mt-0.5 block">{familiarResidents.length} a cargo</span>
          </div>

          <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/60">
            <span className="text-[11px] uppercase font-bold text-[#5C6058] block">Sede</span>
            <span className="text-sm font-black text-[#292A24] mt-0.5 block">Residencia Samanya Centro</span>
          </div>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="space-y-2">
        <div className="px-1">
          <label className="text-xs font-bold text-[#5C6058] uppercase tracking-wider">
            Modo de visualización
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Trabajador */}
          <button
            type="button"
            id="btn-role-cuidador-switch"
            onClick={() => switchRole('cuidador')}
            className="touch-target py-3.5 px-4 rounded-2xl border text-center transition-all bg-white border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8] font-medium"
          >
            <span className="text-sm font-bold block">Trabajador</span>
          </button>

          {/* Familiar */}
          <button
            type="button"
            id="btn-role-familiar-active"
            onClick={() => switchRole('familiar')}
            className="touch-target py-3.5 px-4 rounded-2xl border text-center transition-all bg-[#D9F0F1] border-[#068591]/50 text-[#075158] ring-2 ring-[#068591]/30 shadow-xs font-bold"
          >
            <span className="text-sm font-bold block">Familiar</span>
          </button>
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
            id="btn-familiar-profile-account"
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
            id="btn-familiar-profile-change-password"
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

          {/* Configuración */}
          <button
            id="btn-familiar-profile-settings"
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="touch-target w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F8] active:bg-[#F0EFEA] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F7F8] text-[#068591] flex items-center justify-center border border-[#DEDBD1]">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-[#292A24]">Configuración y Notificaciones</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5C6058]" />
          </button>

          {/* Cerrar Sesión */}
          <button
            id="btn-familiar-profile-logout"
            type="button"
            onClick={logout}
            className="touch-target w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#FBEAEA]/50 active:bg-[#FBEAEA] transition-colors text-[#8C2E2E]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FBEAEA] text-[#8C2E2E] flex items-center justify-center border border-[#8C2E2E]/20">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold">Cerrar Sesión</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8C2E2E]" />
          </button>
        </div>
      </div>

      {/* Account Info Modal */}
      {isAccountModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-xl border border-[#DEDBD1] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <h3 className="text-base font-bold text-[#292A24]">Datos de la Cuenta</h3>
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(false)}
                className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] rounded-full hover:bg-[#F7F7F8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
                <span className="text-[#5C6058] block">Nombre completo</span>
                <span className="text-sm font-bold text-[#292A24] mt-0.5 block">{currentUser.name}</span>
              </div>
              <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
                <span className="text-[#5C6058] block">Correo electrónico</span>
                <span className="text-sm font-bold text-[#292A24] mt-0.5 block">javier.perez.familiar@gmail.com</span>
              </div>
              <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
                <span className="text-[#5C6058] block">Teléfono de contacto prioritario</span>
                <span className="text-sm font-bold text-[#292A24] mt-0.5 block">+34 612 345 678</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAccountModalOpen(false)}
              className="touch-target w-full py-2.5 rounded-2xl bg-[#068591] text-white font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-xl border border-[#DEDBD1] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <h3 className="text-base font-bold text-[#292A24]">Cambiar Contraseña</h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] rounded-full hover:bg-[#F7F7F8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="py-4 space-y-3">
              {passwordError && (
                <div className="p-2.5 bg-[#FBEAEA] text-[#8C2E2E] rounded-xl text-xs font-semibold">
                  {passwordError}
                </div>
              )}
              {passwordSuccessMessage && (
                <div className="p-2.5 bg-[#DFF3E7] text-[#1E7A4C] rounded-xl text-xs font-semibold">
                  {passwordSuccessMessage}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#5C6058] block mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C6058] block mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C6058] block mb-1">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                  placeholder="Repite la contraseña"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="touch-target w-full py-3 rounded-2xl bg-[#068591] text-white font-bold text-xs shadow-xs hover:bg-[#056c76]"
                >
                  Guardar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-xl border border-[#DEDBD1] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <h3 className="text-base font-bold text-[#292A24]">Preferencias y Alertas</h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] rounded-full hover:bg-[#F7F7F8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <label className="flex items-center justify-between p-2.5 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1] cursor-pointer">
                <span className="font-semibold text-[#292A24]">Avisos de consentimientos urgentes</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#068591] focus:ring-[#068591]" />
              </label>
              <label className="flex items-center justify-between p-2.5 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1] cursor-pointer">
                <span className="font-semibold text-[#292A24]">Notificaciones de nuevos mensajes</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#068591] focus:ring-[#068591]" />
              </label>
              <label className="flex items-center justify-between p-2.5 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1] cursor-pointer">
                <span className="font-semibold text-[#292A24]">Resumen diario de actividades</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#068591] focus:ring-[#068591]" />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(false)}
              className="touch-target w-full py-2.5 rounded-2xl bg-[#068591] text-white font-bold text-xs"
            >
              Guardar preferencias
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
