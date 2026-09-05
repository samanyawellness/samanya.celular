import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  KeyRound,
  Settings,
  LogOut,
  X,
  RefreshCw,
  UserCheck,
  HeartHandshake
} from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';

export const RoleMenu: React.FC = () => {
  const {
    isRoleMenuOpen,
    setIsRoleMenuOpen,
    currentUser,
    residents,
    switchRole,
    logout,
    showToast
  } = useApp();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    if (isRoleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRoleMenuOpen, setIsRoleMenuOpen]);

  if (!isRoleMenuOpen) return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) {
      showToast('Las contraseñas no coinciden', 'alert');
      return;
    }
    showToast('Contraseña actualizada correctamente', 'success');
    setShowPasswordModal(false);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div
        ref={menuRef}
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#DEDBD1] p-5 pb-7 sm:pb-5 space-y-4 animate-in slide-in-from-bottom duration-200"
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-2 border-b border-[#DEDBD1]">
          <h2 className="text-base font-bold text-[#292A24]">Perfil de Usuario</h2>
          <button
            id="btn-close-profile-menu"
            type="button"
            onClick={() => setIsRoleMenuOpen(false)}
            className="touch-target p-1.5 rounded-full text-[#5C6058] hover:bg-black/5"
            aria-label="Cerrar menú de perfil"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card: Photo, Name, Count of residents, Floor */}
        <div className="flex items-center gap-3.5 p-3.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]">
          <div className="relative flex-shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#068591] shadow-xs"
            />
            {/* Quick Switch Role Badge button */}
            <button
              type="button"
              id="btn-quick-switch-role"
              onClick={() => switchRole(currentUser.role === 'cuidador' ? 'familiar' : 'cuidador')}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#068591] hover:bg-[#056c76] text-white rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90"
              title="Cambiar perfil"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base text-[#292A24] truncate">
              {currentUser.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-[#068591] bg-[#D9F0F1] px-2 py-0.5 rounded-md">
                {residents.length} Residentes
              </span>
              <span className="text-xs font-semibold text-[#5C6058] bg-white border border-[#DEDBD1] px-2 py-0.5 rounded-md">
                Planta 1
              </span>
            </div>
          </div>
        </div>

        {/* Role Toggle Button */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-profile-role-cuidador"
              type="button"
              onClick={() => switchRole('cuidador')}
              className={`touch-target py-3 px-2 rounded-2xl border text-center transition-all ${
                currentUser.role === 'cuidador'
                  ? 'bg-[#D9F0F1] border-[#068591] text-[#075158] font-bold shadow-xs'
                  : 'bg-white border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8] font-medium'
              }`}
            >
              <span className="text-xs font-bold block">Trabajador</span>
            </button>

            <button
              id="btn-profile-role-familiar"
              type="button"
              onClick={() => switchRole('familiar')}
              className={`touch-target py-3 px-2 rounded-2xl border text-center transition-all ${
                currentUser.role === 'familiar'
                  ? 'bg-[#D9F0F1] border-[#068591] text-[#075158] font-bold shadow-xs'
                  : 'bg-white border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8] font-medium'
              }`}
            >
              <span className="text-xs font-bold block">Familiar</span>
            </button>
          </div>
        </div>

        {/* Action Buttons List */}
        <div className="space-y-1.5 pt-1">
          {/* Mi Cuenta */}
          <button
            id="btn-profile-my-account"
            type="button"
            onClick={() => showToast('Detalles de cuenta activos para Elena Morales', 'info')}
            className="touch-target w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8] active:scale-[0.99] transition-all text-left font-semibold text-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F7F7F8] border border-[#DEDBD1] flex items-center justify-center text-[#068591]">
              <User className="w-4 h-4" />
            </div>
            <span>Mi Cuenta</span>
          </button>

          {/* Cambiar Contraseña */}
          <button
            id="btn-profile-change-password"
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="touch-target w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8] active:scale-[0.99] transition-all text-left font-semibold text-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F7F7F8] border border-[#DEDBD1] flex items-center justify-center text-[#068591]">
              <KeyRound className="w-4 h-4" />
            </div>
            <span>Cambiar Contraseña</span>
          </button>

          {/* Modo Oscuro */}
          <DarkModeToggle variant="row" id="toggle-role-menu-dark-mode" />

          {/* Configuración */}
          <button
            id="btn-profile-settings"
            type="button"
            onClick={() => showToast('Ajustes de notificaciones y centro activos', 'info')}
            className="touch-target w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8] active:scale-[0.99] transition-all text-left font-semibold text-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F7F7F8] border border-[#DEDBD1] flex items-center justify-center text-[#068591]">
              <Settings className="w-4 h-4" />
            </div>
            <span>Configuración</span>
          </button>

          {/* Cerrar Sesión */}
          <button
            id="btn-profile-logout"
            type="button"
            onClick={logout}
            className="touch-target w-full flex items-center gap-3 p-3 rounded-2xl bg-[#FBEAEA]/60 border border-[#8C2E2E]/30 text-[#8C2E2E] hover:bg-[#FBEAEA] active:scale-[0.99] transition-all text-left font-bold text-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-[#8C2E2E]/30 flex items-center justify-center text-[#8C2E2E]">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Change Password Dialog */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#DEDBD1] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#DEDBD1]">
              <h3 className="font-bold text-base text-[#292A24]">Cambiar Contraseña</h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-full text-[#5C6058] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-current-pass">
                  Contraseña actual
                </label>
                <input
                  id="input-current-pass"
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-new-pass">
                  Nueva contraseña
                </label>
                <input
                  id="input-new-pass"
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-confirm-pass">
                  Confirmar nueva contraseña
                </label>
                <input
                  id="input-confirm-pass"
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="touch-target w-full py-3 bg-[#068591] text-white font-bold text-sm rounded-xl hover:bg-[#056c76]"
                >
                  Guardar Contraseña
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="touch-target w-full py-2 text-xs font-semibold text-[#5C6058]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

