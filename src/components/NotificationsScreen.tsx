import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  UserCheck2,
  ShieldAlert,
  FileCheck2,
  Megaphone,
  CalendarCheck,
  ChevronRight
} from 'lucide-react';
import { AppNotification } from '../types';

export const NotificationsScreen: React.FC = () => {
  const {
    currentUser,
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    setActiveFamiliarTab,
    setActiveAdminTab,
    setIsTimelineDrawerOpen,
    residents,
    openResidentHub,
    consents,
    openConsentSignModal
  } = useApp();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);

    // Admin role routing
    if (currentUser.role === 'admin') {
      setIsNotificationsOpen(false);
      if (notif.targetScreen === 'tasks') {
        setActiveAdminTab('tareas');
      } else if (notif.targetScreen === 'residents') {
        setActiveAdminTab('residentes');
      } else if (notif.type === 'incidente' || notif.type === 'turno') {
        setActiveAdminTab('turnos');
      } else {
        setActiveAdminTab('inicio');
      }
      return;
    }

    // Familiar role routing
    if (currentUser.role === 'familiar') {
      setIsNotificationsOpen(false);
      if (notif.type === 'incidente') {
        setActiveFamiliarTab('bitacora');
      } else if (notif.type === 'consentimiento') {
        if (notif.targetId) {
          const c = consents.find(item => item.id === notif.targetId);
          if (c) {
            openConsentSignModal(c);
            return;
          }
        }
        setActiveFamiliarTab('bitacora');
      } else if (notif.targetScreen === 'residents') {
        setActiveFamiliarTab('residente');
      } else {
        setActiveFamiliarTab('bitacora');
      }
      return;
    }

    // Cuidador / Worker navigation flow
    if (notif.targetScreen === 'residents') {
      setIsNotificationsOpen(false);
      setActiveTab('residentes');
      if (notif.targetId) {
        const r = residents.find(res => res.id === notif.targetId);
        if (r) openResidentHub(r, false);
      }
    } else if (notif.targetScreen === 'consents') {
      setIsNotificationsOpen(false);
      setActiveTab('consentimientos');
    } else if (notif.targetScreen === 'timeline') {
      setIsNotificationsOpen(false);
      setIsTimelineDrawerOpen(true);
    } else if (notif.targetScreen === 'tasks') {
      setIsNotificationsOpen(false);
      setActiveTab('tareas');
    }
  };

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'incidente':
        return <ShieldAlert className="w-5 h-5 text-[#8C2E2E]" />;
      case 'consentimiento':
        return <FileCheck2 className="w-5 h-5 text-[#1E7A4C]" />;
      case 'alta':
        return <UserCheck2 className="w-5 h-5 text-[#068591]" />;
      case 'turno':
        return <CalendarCheck className="w-5 h-5 text-[#068591]" />;
      case 'aviso':
      default:
        return <Megaphone className="w-5 h-5 text-[#F57C00]" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F7F8] flex flex-col w-full h-full overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md mx-auto flex flex-col h-full bg-[#F7F7F8]">
        {/* Full screen top navigation header with back arrow on top-left */}
        <div className="bg-[#F7F7F8] px-4 py-3 border-b border-[#DEDBD1] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              id="btn-back-notifications"
              type="button"
              onClick={() => setIsNotificationsOpen(false)}
              className="touch-target p-2 -ml-1.5 rounded-full text-[#292A24] hover:bg-white hover:shadow-2xs active:scale-95 transition-all"
              aria-label="Volver a la pantalla anterior"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-[#292A24] leading-tight">
              Notificaciones
            </h2>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              id="btn-mark-all-read"
              onClick={markAllNotificationsAsRead}
              className="text-xs font-bold text-[#068591] hover:bg-[#F7F7F8] flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#DEDBD1] shadow-2xs transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Marcar leídas</span>
            </button>
          )}
        </div>

        {/* Subheader status */}
        <div className="px-4 py-2 flex items-center justify-between text-xs text-[#5C6058] bg-[#FAF9F7] border-b border-[#DEDBD1]/60 shrink-0">
          <span>{unreadCount} no leídas</span>
          <span>{notifications.length} en total</span>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 custom-scrollbar pb-16">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-[#5C6058]">
              <Bell className="w-12 h-12 mx-auto text-[#DEDBD1] mb-3 opacity-70" />
              <p className="font-semibold text-base text-[#292A24]">Bandeja vacía</p>
              <p className="text-xs text-[#5C6058] mt-1">No tienes notificaciones pendientes</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const icon = getNotifIcon(notif.type);
              return (
                <button
                  key={notif.id}
                  id={`notif-item-${notif.id}`}
                  type="button"
                  onClick={() => handleNotificationClick(notif)}
                  className={`touch-target w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 relative group ${
                    !notif.isRead
                      ? 'bg-[#D9F0F1]/40 border-[#068591]/40 hover:bg-[#D9F0F1]/60 shadow-2xs'
                      : 'bg-white border-[#DEDBD1] hover:bg-[#F7F7F8]'
                  }`}
                >
                  {/* Read / Unread Indicator Dot */}
                  {!notif.isRead && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#068591] ring-2 ring-white" />
                  )}

                  {icon && (
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#DEDBD1] flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                      {icon}
                    </div>
                  )}

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold truncate ${
                          !notif.isRead ? 'text-[#075158]' : 'text-[#292A24]'
                        }`}
                      >
                        {notif.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#5C6058] leading-relaxed mt-0.5">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-black/5">
                      <span className="text-[10px] font-semibold text-[#5C6058]">
                        {notif.timestamp}
                      </span>
                      {notif.targetScreen && (
                        <span className="text-[#068591] flex items-center">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
