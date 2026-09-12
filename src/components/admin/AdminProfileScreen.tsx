import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  KeyRound,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { RoleDropdownSelector } from '../RoleDropdownSelector';

export const AdminProfileScreen: React.FC = () => {
  const {
    currentUser,
    adminSubrole,
    setAdminSubrole,
    logout,
    showToast,
    isSimulatingFinishingShift,
    setIsSimulatingFinishingShift
  } = useApp();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const isDueno = adminSubrole === 'dueno';

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
    <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1">
      {/* Header */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-[#292A24]">
          Perfil
        </h2>
      </div>

      {/* Modo de visualización: Desplegable al inicio de la pantalla */}
      <RoleDropdownSelector />

      {/* Account Card */}
      <div className="p-4 bg-white rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-3">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#068591] shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D9F0F1] text-[#075158]">
                {isDueno ? 'Dueño / Propietario' : 'Administrador de Centro'}
              </span>
            </div>
            <h3 className="font-bold text-base text-[#292A24] truncate mt-1">
              {currentUser.name}
            </h3>
            <p className="text-xs text-[#5C6058] truncate">
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Subrole switcher pills */}
        <div className="pt-2 border-t border-[#DEDBD1]/60">
          <div className="flex items-center justify-between text-xs mb-1.5 px-0.5">
            <span className="font-bold text-[#5C6058]">Perfil directivo:</span>
            <span className="text-[11px] text-[#068591] font-semibold">
              {isDueno ? 'Multi-sede' : 'Sede fija'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-subrole-dueno"
              onClick={() => {
                setAdminSubrole('dueno');
                showToast('Modo Dueño activado: selector de sede habilitado', 'info');
              }}
              className={`touch-target py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                isDueno
                  ? 'bg-[#D9F0F1] border-[#068591] text-[#075158] shadow-xs'
                  : 'bg-[#F7F7F8] border-[#DEDBD1] text-[#5C6058] hover:bg-white'
              }`}
            >
              Dueño (Multi-sede)
            </button>

            <button
              type="button"
              id="btn-subrole-administrador"
              onClick={() => {
                setAdminSubrole('administrador');
                showToast('Modo Administrador activado: sede fija', 'info');
              }}
              className={`touch-target py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                !isDueno
                  ? 'bg-[#D9F0F1] border-[#068591] text-[#075158] shadow-xs'
                  : 'bg-[#F7F7F8] border-[#DEDBD1] text-[#5C6058] hover:bg-white'
              }`}
            >
              Administrador (Sede fija)
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings & Actions */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-xs font-bold text-[#5C6058] uppercase tracking-wider px-1">
          Opciones y Ajustes
        </label>

        {/* Mi Cuenta */}
        <button
          type="button"
          id="btn-admin-account"
          onClick={() => setShowAccountModal(true)}
          className="touch-target w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8] text-left font-semibold text-xs transition-all shadow-2xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F7F7F8] border border-[#DEDBD1] flex items-center justify-center text-[#068591]">
            <User className="w-4 h-4" />
          </div>
          <span className="flex-1">Mi Cuenta</span>
        </button>

        {/* Cambiar Contraseña */}
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="touch-target w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8] text-left font-semibold text-xs transition-all shadow-2xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F7F7F8] border border-[#DEDBD1] flex items-center justify-center text-[#068591]">
            <KeyRound className="w-4 h-4" />
          </div>
          <span className="flex-1">Cambiar Contraseña</span>
        </button>

        {/* Ajustes del Sistema */}
        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="touch-target w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8] text-left font-semibold text-xs transition-all shadow-2xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F7F7F8] border border-[#DEDBD1] flex items-center justify-center text-[#068591]">
            <Settings className="w-4 h-4" />
          </div>
          <span className="flex-1">Ajustes del Sistema</span>
        </button>

        {/* Cerrar Sesión */}
        <button
          type="button"
          onClick={logout}
          className="touch-target w-full flex items-center gap-3 p-3.5 rounded-2xl bg-[#FBEAEA]/60 border border-[#8C2E2E]/30 text-[#8C2E2E] hover:bg-[#FBEAEA] text-left font-bold text-xs transition-all shadow-2xs mt-2"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-[#8C2E2E]/30 flex items-center justify-center text-[#8C2E2E]">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="flex-1">Cerrar Sesión</span>
        </button>
      </div>

      {/* Mi Cuenta Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#DEDBD1] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D9F0F1] text-[#068591] flex items-center justify-center border border-[#068591]/20">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#292A24]">
                  Mi Cuenta
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountModal(false)}
                className="touch-target p-1.5 rounded-full text-[#5C6058] hover:bg-[#F7F7F8]"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]">
                <span className="text-[11px] font-bold text-[#5C6058] block">Nombre completo:</span>
                <span className="font-bold text-[#292A24] text-sm mt-0.5 block">{currentUser.name}</span>
              </div>

              <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]">
                <span className="text-[11px] font-bold text-[#5C6058] block">Correo institucional:</span>
                <span className="font-bold text-[#292A24] text-sm mt-0.5 block">{currentUser.email}</span>
              </div>

              <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]">
                <span className="text-[11px] font-bold text-[#5C6058] block">Rol directivo:</span>
                <span className="font-bold text-[#068591] text-sm mt-0.5 block">
                  {isDueno ? 'Dueño / Propietario General' : 'Administrador de Sede'}
                </span>
              </div>

              <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]">
                <span className="text-[11px] font-bold text-[#5C6058] block">Estado de acceso:</span>
                <span className="font-bold text-[#1E7A4C] text-sm mt-0.5 block">
                  Activo · Autenticación corporativa SAMANYA
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAccountModal(false)}
              className="touch-target w-full py-2.5 bg-[#068591] hover:bg-[#056c76] text-white font-bold text-xs rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Change Password Dialog */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#DEDBD1] space-y-4">
            <h3 className="font-bold text-base text-[#292A24]">
              Cambiar Contraseña
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs"
                />
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#068591] text-white font-bold text-xs rounded-xl"
                >
                  Guardar Contraseña
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="w-full py-2 text-xs font-semibold text-[#5C6058]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ajustes del Sistema Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#DEDBD1] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D9F0F1] text-[#068591] flex items-center justify-center border border-[#068591]/20">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#292A24]">
                  Ajustes del Sistema
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="touch-target p-1.5 rounded-full text-[#5C6058] hover:bg-[#F7F7F8]"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#292A24] text-xs">
                    Aviso 10 min antes de fin de turno
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSimulatingFinishingShift(!isSimulatingFinishingShift);
                      showToast(
                        !isSimulatingFinishingShift
                          ? 'Simulación de alerta activada'
                          : 'Simulación de alerta desactivada',
                        'info'
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors shadow-2xs ${
                      isSimulatingFinishingShift
                        ? 'bg-[#C68A3D] text-white'
                        : 'bg-white border border-[#DEDBD1] text-[#5C6058]'
                    }`}
                  >
                    {isSimulatingFinishingShift ? 'Alerta activa' : 'Inactivo'}
                  </button>
                </div>
                <p className="text-[11px] text-[#5C6058] leading-relaxed">
                  Permite simular la notificación sonora y banner 10 minutos antes de terminar el turno con tareas pendientes para evaluación y pruebas.
                </p>
              </div>

              <div className="p-3.5 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] space-y-1 text-xs">
                <span className="font-bold text-[#292A24] block">Auditoría y trazabilidad</span>
                <p className="text-[11px] text-[#5C6058] leading-relaxed">
                  Registro estricto de firma biométrica / clave única en suministros y medicamentos activado por defecto institucional.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="touch-target w-full py-2.5 bg-[#068591] text-white font-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-2xs"
                >
                  Cerrar Ajustes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
