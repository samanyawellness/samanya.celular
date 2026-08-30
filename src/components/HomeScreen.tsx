import React, { useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  ArrowUpRight,
  Check,
  AlertTriangle
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    tasks,
    residents,
    selectedDate,
    setSelectedDate,
    setIsTimelineDrawerOpen,
    setIsIncidentReportOpen,
    setActiveTab,
    openResidentHub,
    setSelectedTaskForMassRegistration,
    setIsMassRegistrationModalOpen,
    markMedicationAdministered
  } = useApp();

  const carouselRef = useRef<HTMLDivElement>(null);

  // Generate 60 days starting from 2026-07-25 so users can swipe across July, August, September
  const daysList = useMemo(() => {
    const start = new Date(2026, 6, 25); // 25 July 2026
    const days = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    for (let i = 0; i < 60; i++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + i);
      const curYear = cur.getFullYear();
      const curMonth = String(cur.getMonth() + 1).padStart(2, '0');
      const curDay = String(cur.getDate()).padStart(2, '0');
      const fullDate = `${curYear}-${curMonth}-${curDay}`;

      days.push({
        fullDate,
        dayNum: String(cur.getDate()),
        dayName: dayNames[cur.getDay()],
        monthName: monthNames[cur.getMonth()],
        monthNum: cur.getMonth() + 1,
        year: curYear,
        isToday: fullDate === '2026-08-19'
      });
    }
    return days;
  }, []);

  // Compute active month label from currently selected date
  const activeMonthLabel = useMemo(() => {
    if (!selectedDate) return 'Agosto 2026';
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${y}`;
  }, [selectedDate]);

  // Aggregated pending medication tasks
  const pendingMedicationTasks = useMemo(() => {
    return tasks.filter(t => t.status === 'pendiente' && t.type === 'medicacion');
  }, [tasks]);

  const pendingMedicationResidents = useMemo(() => {
    const names = new Set<string>();
    pendingMedicationTasks.forEach(t => {
      if (t.residentName) {
        names.add(t.residentName);
      } else if (t.residentId) {
        const res = residents.find(r => r.id === t.residentId);
        if (res) names.add(res.name);
      }
    });
    return Array.from(names);
  }, [pendingMedicationTasks, residents]);

  // Other non-medication urgent tasks (e.g. alimentacion or individual non-medication tasks)
  const otherUrgentTasks = useMemo(() => {
    return tasks.filter(t => {
      if (t.status === 'completada') return false;
      if (t.type === 'medicacion') return false; // Handled by aggregated box
      if (t.type === 'alimentacion') return true;
      return t.status === 'pendiente';
    }).slice(0, 2);
  }, [tasks]);

  const pendingCount = tasks.filter(t => t.status === 'pendiente').length;

  const handleDaySelect = (fullDate: string) => {
    setSelectedDate(fullDate);
    setIsTimelineDrawerOpen(true);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1">
      {/* 1. Worker Greeting */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-[#292A24]">
          Hola, {currentUser.name}
        </h2>
      </div>

      {/* 2. Bloque de TAREAS URGENTES (Fondo blanco con sombra para resaltar del fondo) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DEDBD1] space-y-3.5 shadow-md shadow-black/5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#292A24]">
            Tareas urgentes del turno
          </h3>
          <span className="text-xs font-extrabold text-[#068591] bg-[#D9F0F1] border border-[#068591]/20 px-2.5 py-0.5 rounded-full shadow-2xs">
            {pendingCount} pendientes
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Caja agregada única para medicamentos pendientes */}
          {pendingMedicationResidents.length > 0 && (
            <div
              id="urgent-box-aggregated-meds"
              className="bg-[#F7F7F8] rounded-2xl p-3.5 border border-[#DEDBD1] flex flex-col gap-2.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#068591]">
                      Medicación pendiente
                    </span>
                    <span className="text-[11px] font-semibold text-[#5C6058]">
                      · {pendingMedicationTasks.length} {pendingMedicationTasks.length === 1 ? 'toma' : 'tomas'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#292A24]">
                    {pendingMedicationResidents.length === 1
                      ? 'Falta administrar medicamentos a 1 residente'
                      : `Faltan administrar medicamentos a ${pendingMedicationResidents.length} residentes`}
                  </h4>
                  <p className="text-xs text-[#5C6058] truncate">
                    {pendingMedicationResidents.join(', ')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-urgent-goto-tasks-meds"
                onClick={() => setActiveTab('tareas')}
                className="touch-target w-full py-2.5 px-4 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Ir a tareas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Resto de tareas urgentes que no son de medicación (alimentación, etc.) */}
          {otherUrgentTasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#F7F7F8] rounded-2xl p-3.5 border border-[#DEDBD1] flex flex-col gap-2.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#068591]">
                      {task.time}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#292A24] truncate">
                    {task.title}
                  </h4>
                  <p className="text-xs text-[#5C6058] truncate">
                    {task.scope === 'grupal'
                      ? `${task.residentCount} residentes`
                      : task.residentName}
                  </p>

                  {/* Pending Residents for Meal Task Alert on HomeScreen */}
                  {task.mealDetails?.pendingResidents && task.mealDetails.pendingResidents.length > 0 && (
                    <div className="mt-2 p-2 bg-[#FEF7EE] rounded-xl border border-[#C68A3D]/40 text-xs">
                      <div className="font-bold flex items-center gap-1 text-[#9A5B12]">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#C68A3D] flex-shrink-0" />
                        <span>Faltan por registrar ({task.mealDetails.pendingResidents.length}):</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#292A24] font-medium pl-4.5">
                        {task.mealDetails.pendingResidents.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Exceptions list if any on HomeScreen */}
                  {task.mealDetails?.exceptions && task.mealDetails.exceptions.length > 0 && (
                    <div className="mt-1 text-xs text-[#5C6058]">
                      <span className="font-semibold text-[#292A24]">
                        {task.mealDetails.normalCount} normales · {task.mealDetails.exceptions.length} con excepción ({task.mealDetails.exceptions.map(e => e.residentName).join(', ')})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Action Button */}
              {task.scope === 'grupal' ? (
                <button
                  type="button"
                  id={`btn-urgent-group-${task.id}`}
                  onClick={() => {
                    setSelectedTaskForMassRegistration(task);
                    setIsMassRegistrationModalOpen(true);
                  }}
                  className="touch-target w-full py-2.5 px-4 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>
                    {task.mealDetails?.pendingResidents && task.mealDetails.pendingResidents.length > 0
                      ? `Completar restantes (${task.mealDetails.pendingResidents.length})`
                      : task.mealDetails?.exceptions && task.mealDetails.exceptions.length > 0
                      ? 'Ver / Modificar registro'
                      : 'Registrar'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  id={`btn-urgent-view-${task.id}`}
                  onClick={() => {
                    const r = residents.find(res => res.id === task.residentId);
                    if (r) openResidentHub(r, true);
                  }}
                  className="touch-target w-full py-2.5 px-4 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Ver ficha</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {pendingMedicationResidents.length === 0 && otherUrgentTasks.length === 0 && (
            <div className="py-4 text-center text-xs text-[#5C6058]">
              No hay tareas urgentes pendientes en este momento.
            </div>
          )}
        </div>

        {/* 'Ver todas' button placed cleanly at the bottom of the section */}
        <button
          type="button"
          onClick={() => setActiveTab('tareas')}
          className="w-full py-2 text-xs font-bold text-[#075158] hover:text-[#068591] flex items-center justify-center gap-1 transition-colors"
        >
          <span>Ver todas las tareas ({tasks.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Direct Access Button to REPORTAR INCIDENTE */}
      <button
        id="btn-home-report-incident"
        type="button"
        onClick={() => setIsIncidentReportOpen(true)}
        className="touch-target w-full flex items-center justify-between p-4 rounded-2xl bg-[#8C2E2E] hover:bg-[#772626] text-white font-bold shadow-xs active:scale-[0.99] transition-all"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-base font-bold">Reportar incidente</div>
            <div className="text-xs text-white/80 font-normal">
              Caídas, cambios de salud o reacciones adversas
            </div>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-white/90" />
      </button>

      {/* 4. Carrusel horizontal de días con navegación táctil y visualización de mes */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-bold text-base text-[#292A24]">
              Línea de tiempo de actividad
            </h3>
            <span className="text-xs font-semibold text-[#068591]">
              {activeMonthLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              className="touch-target p-1.5 rounded-xl bg-white border border-[#DEDBD1] text-[#5C6058] hover:bg-[#F7F7F8]"
              aria-label="Días anteriores"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              className="touch-target p-1.5 rounded-xl bg-white border border-[#DEDBD1] text-[#5C6058] hover:bg-[#F7F7F8]"
              aria-label="Días siguientes"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel (Move with finger / touch scroll) */}
        <div
          ref={carouselRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 custom-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {daysList.map((d) => {
            const isSelected = selectedDate === d.fullDate;
            return (
              <button
                key={d.fullDate}
                id={`btn-carousel-day-${d.fullDate}`}
                type="button"
                onClick={() => handleDaySelect(d.fullDate)}
                className={`touch-target flex flex-col items-center justify-center min-w-[56px] py-3 px-2 rounded-2xl transition-all border snap-start shrink-0 ${
                  isSelected
                    ? 'bg-[#068591] text-white border-[#068591] shadow-xs scale-102'
                    : d.isToday
                    ? 'bg-[#D9F0F1] text-[#075158] border-[#068591]/40 font-bold'
                    : 'bg-white text-[#292A24] border-[#DEDBD1] hover:bg-[#F7F7F8]'
                }`}
              >
                <span
                  className={`text-xs font-semibold uppercase ${
                    isSelected ? 'text-white/80' : 'text-[#5C6058]'
                  }`}
                >
                  {d.dayName}
                </span>
                <span className="text-lg font-bold mt-0.5">{d.dayNum}</span>
                {d.isToday ? (
                  <span
                    className={`text-[9px] font-extrabold uppercase mt-0.5 px-1 rounded-sm ${
                      isSelected ? 'bg-white text-[#068591]' : 'bg-[#068591] text-white'
                    }`}
                  >
                    Hoy
                  </span>
                ) : (
                  <span className={`text-[9px] font-medium mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#5C6058]'}`}>
                    {d.monthName.slice(0, 3)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsTimelineDrawerOpen(true)}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#D9F0F1] hover:bg-[#c6e6e8] border border-[#068591]/30 text-[#075158] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <span>Abrir historial completo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

