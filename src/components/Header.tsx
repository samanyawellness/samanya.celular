import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';

interface HeaderProps {
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ rightAction }) => {
  const {
    currentUser,
    setIsRoleMenuOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount
  } = useApp();

  const isFamiliar = currentUser.role === 'familiar';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DEDBD1] px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto w-full">
        {/* Left: If Cuidador -> Worker Avatar. If Familiar -> Clean Brand mark (No avatar, since Familiar has Perfil tab) */}
        {!isFamiliar ? (
          <button
            id="btn-header-avatar"
            type="button"
            onClick={() => setIsRoleMenuOpen(true)}
            className="flex items-center p-1 rounded-2xl hover:bg-[#F7F7F8] active:scale-95 transition-all text-left group"
            aria-label="Abrir perfil y menú"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#068591] group-hover:ring-2 group-hover:ring-[#068591]/30 transition-all"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#068591] text-white rounded-full flex items-center justify-center text-[9px] font-black shadow-sm">
                T
              </div>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-[#075158]">
              Samanya
            </span>
            <span className="text-[10px] font-bold text-[#068591] bg-[#D9F0F1] px-2 py-0.5 rounded-full">
              Familiar
            </span>
          </div>
        )}

        {/* Right: Dark Mode Toggle & Notifications Bell or Custom Action */}
        <div className="flex items-center gap-1.5">
          <DarkModeToggle id="btn-header-dark-mode" />
          {rightAction ? (
            rightAction
          ) : (
            <button
              id="btn-header-notifications"
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="touch-target relative flex items-center justify-center p-2 rounded-2xl text-[#292A24] hover:bg-[#F7F7F8] active:scale-95 transition-all"
              aria-label={`Notificaciones ${unreadNotificationsCount > 0 ? `(${unreadNotificationsCount} no leídas)` : ''}`}
              title="Notificaciones"
            >
              <Bell className="w-6 h-6 text-[#292A24]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8C2E2E] px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

