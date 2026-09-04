import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { TasksScreen } from './components/TasksScreen';
import { ResidentsScreen } from './components/ResidentsScreen';
import { ConsentsScreen } from './components/ConsentsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LoginScreen } from './components/LoginScreen';
import { TimelineDrawer } from './components/TimelineDrawer';
import { MassRegistrationModal } from './components/MassRegistrationModal';
import { ResidentDetailModal } from './components/ResidentDetailModal';
import { BitacoraModal } from './components/BitacoraModal';
import { VitalSignsModal } from './components/VitalSignsModal';
import { IncidentReportScreen } from './components/IncidentReportScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { NewConsentModal } from './components/NewConsentModal';
import { Toast } from './components/Toast';

// Familiar Role Components
import { ResidentSelectorChip } from './components/familiar/ResidentSelectorChip';
import { FamiliarBottomNav } from './components/familiar/FamiliarBottomNav';
import { FamiliarHomeScreen } from './components/familiar/FamiliarHomeScreen';
import { FamiliarBitacoraScreen } from './components/familiar/FamiliarBitacoraScreen';
import { FamiliarResidenteScreen } from './components/familiar/FamiliarResidenteScreen';
import { FamiliarProfileScreen } from './components/familiar/FamiliarProfileScreen';
import { FamiliarConsentModal } from './components/familiar/FamiliarConsentModal';
import { FamiliarVitalsModal } from './components/familiar/FamiliarVitalsModal';

import { Smartphone, Monitor, Bell } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    isLoggedIn,
    activeTab,
    activeFamiliarTab,
    currentUser,
    user,
    notifications,
    setIsNotificationsOpen
  } = useApp();
  const [deviceFrameMode, setDeviceFrameMode] = useState(false);

  const activeRole = user?.role || currentUser?.role;
  const isFamiliar = activeRole === 'familiar';
  const unreadNotificationsCount = (notifications || []).filter((n) => !n.isRead).length;

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#F7F7F8]">
        <LoginScreen />
        <Toast />
      </main>
    );
  }

  // Header visibility rules: Always visible for Worker and Familiar with notification bell
  const showHeader = true;

  return (
    <div className={`min-h-screen bg-[#F7F7F8] flex flex-col justify-start items-center ${deviceFrameMode ? 'p-4 sm:py-8' : ''}`}>
      {/* Top Device Frame Toggle for Desktop Viewers */}
      <div className="hidden lg:flex items-center gap-2 mb-2 px-3 py-1 bg-white rounded-full border border-[#DEDBD1] shadow-2xs text-xs text-[#5C6058]">
        <span>Vista previa:</span>
        <button
          type="button"
          onClick={() => setDeviceFrameMode(false)}
          className={`px-2.5 py-1 rounded-full font-bold transition-colors flex items-center gap-1 ${
            !deviceFrameMode ? 'bg-[#068591] text-white' : 'hover:bg-[#F7F7F8]'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" /> Estándar Móvil
        </button>
        <button
          type="button"
          onClick={() => setDeviceFrameMode(true)}
          className={`px-2.5 py-1 rounded-full font-bold transition-colors flex items-center gap-1 ${
            deviceFrameMode ? 'bg-[#068591] text-white' : 'hover:bg-[#F7F7F8]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" /> Marco Celular
        </button>
      </div>

      {/* Main Cell Container */}
      <div
        className={`w-full max-w-md bg-[#F7F7F8] min-h-screen flex flex-col relative ${
          deviceFrameMode
            ? 'shadow-2xl rounded-[40px] border-8 border-[#292A24] overflow-hidden my-auto max-h-[860px]'
            : 'shadow-sm border-x border-[#DEDBD1]/60'
        }`}
      >
        {/* Dedicated Top App Bar with Messages and Notification Bell */}
        {showHeader && (
          <header className="w-full bg-[#F7F7F8] px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#DEDBD1]/60">
            {/* Left side: If Familiar -> Resident Selector. If Worker -> Brand & Role Badge */}
            {isFamiliar ? (
              <div className="flex items-center">
                <ResidentSelectorChip />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-[#068591]">SAMANYA</span>
                <span className="text-[10px] bg-[#D9F0F1] text-[#075158] font-bold px-2 py-0.5 rounded-md uppercase">
                  Asistencial
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                id="btn-top-notifications"
                type="button"
                onClick={() => setIsNotificationsOpen(true)}
                className="touch-target w-9 h-9 rounded-full bg-white border border-[#DEDBD1] shadow-2xs hover:bg-[#F7F7F8] active:scale-95 transition-all flex items-center justify-center relative text-[#292A24]"
                aria-label={`Notificaciones ${unreadNotificationsCount > 0 ? `(${unreadNotificationsCount} no leídas)` : ''}`}
                title="Notificaciones"
              >
                <Bell className="w-4.5 h-4.5 text-[#292A24]" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8C2E2E] px-1 text-[10px] font-bold text-white shadow-xs">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>
          </header>
        )}

        {/* Active Tab View */}
        <main className="flex-1 w-full pt-2">
          {isFamiliar ? (
            /* Familiar Role Screens (4 distinct views) */
            <>
              {activeFamiliarTab === 'inicio' && <FamiliarHomeScreen />}
              {activeFamiliarTab === 'bitacora' && <FamiliarBitacoraScreen />}
              {(activeFamiliarTab === 'residente' || activeFamiliarTab === 'calendario') && <FamiliarResidenteScreen />}
              {activeFamiliarTab === 'perfil' && <FamiliarProfileScreen />}
            </>
          ) : (
            /* Worker / Cuidador Role Screens */
            <>
              {activeTab === 'inicio' && <HomeScreen />}
              {activeTab === 'tareas' && <TasksScreen />}
              {activeTab === 'residentes' && <ResidentsScreen />}
              {activeTab === 'consentimientos' && <ConsentsScreen />}
              {activeTab === 'perfil' && <ProfileScreen />}
            </>
          )}
        </main>

        {/* Fixed Bottom Navigation (Role-specific) */}
        {isFamiliar ? <FamiliarBottomNav /> : <BottomNav />}

        {/* Worker Modals & Overlays */}
        <TimelineDrawer />
        <MassRegistrationModal />
        <ResidentDetailModal />
        <BitacoraModal />
        <VitalSignsModal />
        <IncidentReportScreen />
        <NotificationsScreen />
        <NewConsentModal />

        {/* Familiar & Common Modals */}
        <FamiliarConsentModal />
        <FamiliarVitalsModal />

        <Toast />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
