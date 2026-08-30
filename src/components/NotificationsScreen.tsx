import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
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
    setIsTimelineDrawerOpen,
    residents,
    openResidentHub,
    consents,
    openConsentSignModal
  } = useApp();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);

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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-start justify-center p-4 sm:p-6 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bandeja de notificaciones"
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] max-h-[85vh] flex flex-col space-y-4 animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
          <h2 className="text-lg font-bold text-[#292A24] leading-tight">
            Notificaciones
          </h2>
          <button
            id="btn-close-notifications"
            type="button"
            onClick={() => setIsNotificationsOpen(false)}
            className="touch-target p-1.5 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
            aria-label="Cerrar notificaciones"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mark all as read button */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-[#5C6058]">
            {notifications.filter(n => !n.isRead).length} no leídas
          </span>
          <button
            type="button"
            id="btn-mark-all-read"
            onClick={markAllNotificationsAsRead}
            className="text-xs font-bold text-[#068591] hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Marcar todas como leídas</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-[#5C6058]">
              <Bell className="w-10 h-10 mx-auto text-[#DEDBD1] mb-2" />
              <p className="font-semibold text-base">Bandeja vacía</p>
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
                      ? 'bg-[#D9F0F1]/40 border-[#068591]/40 hover:bg-[#D9F0F1]/60'
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
