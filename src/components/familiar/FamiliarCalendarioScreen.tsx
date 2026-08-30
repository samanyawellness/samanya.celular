import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Layers,
  Pill,
  Utensils,
  HeartHandshake,
  Activity,
  Sparkles,
  BookOpen,
  AlertTriangle,
  FileCheck2,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  User,
  Mic,
  FileText,
  X
} from 'lucide-react';
import { ConsentRecord } from '../../types';

type CaregiverFilterCategory =
  | 'todos'
  | 'medicacion'
  | 'alimentacion'
  | 'cuidados'
  | 'vitales'
  | 'actividades'
  | 'bitacora'
  | 'incidencias'
  | 'consentimientos';

interface TimelineItem {
  id: string;
  category: CaregiverFilterCategory;
  date: string;
  time: string;
  title: string;
  summary: string;
  author?: string;
  photoUrl?: string;
  isConsent?: boolean;
  consentData?: ConsentRecord;
  isPendingConsent?: boolean;
  vitalsStats?: { label: string; value: string | number }[];
  isVoiceRecorded?: boolean;
  severity?: 'leve' | 'moderada' | 'grave';
}

export const FamiliarCalendarioScreen: React.FC = () => {
  const {
    selectedFamiliarResident,
    timelineEvents,
    consents,
    tasks,
    bitacoraEntries,
    vitalSigns,
    incidents,
    selectedDate,
    setSelectedDate,
    openConsentSignModal
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<CaregiverFilterCategory>('todos');
  const dateCarouselRef = useRef<HTMLDivElement>(null);

  // Generate 60 days starting from 2026-07-25 so family can swipe across July, August, September
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

  const scrollDates = (direction: 'left' | 'right') => {
    if (dateCarouselRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      dateCarouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const residentName = selectedFamiliarResident?.name || 'Residente';
  const residentId = selectedFamiliarResident?.id || '';

  // Filter definitions with icons matching caregiver daily records
  const filterDefinitions: {
    id: CaregiverFilterCategory;
    label: string;
    shortLabel: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
  }[] = [
    { id: 'todos', label: 'Todos', shortLabel: 'Todos', icon: Layers, accentColor: '#068591' },
    { id: 'medicacion', label: 'Medicación', shortLabel: 'Medicación', icon: Pill, accentColor: '#068591' },
    { id: 'alimentacion', label: 'Alimentación', shortLabel: 'Alimentación', icon: Utensils, accentColor: '#D97706' },
    { id: 'cuidados', label: 'Cuidados e Higiene', shortLabel: 'Cuidados', icon: HeartHandshake, accentColor: '#2563EB' },
    { id: 'vitales', label: 'Signos Vitales', shortLabel: 'Constantes', icon: Activity, accentColor: '#E11D48' },
    { id: 'actividades', label: 'Actividades', shortLabel: 'Actividades', icon: Sparkles, accentColor: '#7C3AED' },
    { id: 'bitacora', label: 'Notas y Evolución', shortLabel: 'Notas', icon: BookOpen, accentColor: '#059669' },
    { id: 'incidencias', label: 'Incidencias', shortLabel: 'Incidencias', icon: AlertTriangle, accentColor: '#DC2626' },
    { id: 'consentimientos', label: 'Consentimientos', shortLabel: 'Consentimientos', icon: FileCheck2, accentColor: '#F57C00' }
  ];

  // Helper to check if a specific date has pending consents
  const hasPendingConsentOnDate = (dateStr: string) => {
    return consents.some(
      c =>
        (c.residentId === residentId || c.residentName === residentName) &&
        c.status === 'pendiente' &&
        c.sentDate.startsWith(dateStr)
    );
  };

  // Compile all caregiver registrations for this resident into a rich unified timeline
  const allTimelineItems = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];

    // 1. Consents (Consentimientos solicitados o firmados)
    const residentConsents = consents.filter(
      c => c.residentId === residentId || c.residentName === residentName
    );
    residentConsents.forEach(c => {
      const date = c.sentDate.split(' ')[0] || '2026-08-19';
      const time = c.sentDate.split(' ')[1] || '10:00';
      items.push({
        id: `consent-${c.id}`,
        category: 'consentimientos',
        date,
        time,
        title: `Consentimiento: ${c.type}`,
        summary: c.description,
        author: 'Equipo Asistencial Samanya',
        isConsent: true,
        consentData: c,
        isPendingConsent: c.status === 'pendiente'
      });
    });

    // 2. Bitácora entries (Observaciones, higiene, visitas médicas)
    const residentBitacora = bitacoraEntries.filter(
      b => b.residentId === residentId || b.residentName === residentName
    );
    residentBitacora.forEach(b => {
      const isHygiene =
        b.category.toLowerCase().includes('higiene') ||
        b.category.toLowerCase().includes('confort') ||
        b.category.toLowerCase().includes('piel') ||
        b.category.toLowerCase().includes('postural');

      items.push({
        id: `bit-${b.id}`,
        category: isHygiene ? 'cuidados' : 'bitacora',
        date: b.date,
        time: b.time,
        title: b.category,
        summary: b.text,
        author: b.author,
        isVoiceRecorded: b.recordedByVoice
      });
    });

    // 3. Vital Signs (Signos vitales / constantes)
    const residentVitals = vitalSigns.filter(
      v => v.residentId === residentId || v.residentName === residentName
    );
    residentVitals.forEach(v => {
      const statsList: { label: string; value: string | number }[] = [];
      if (v.systolic && v.diastolic) statsList.push({ label: 'Tensión Arterial', value: `${v.systolic}/${v.diastolic} mmHg` });
      if (v.heartRate) statsList.push({ label: 'Pulso', value: `${v.heartRate} lpm` });
      if (v.spO2) statsList.push({ label: 'Saturación O₂', value: `${v.spO2}%` });
      if (v.temperature) statsList.push({ label: 'Temperatura', value: `${v.temperature} °C` });
      if (v.glucose) statsList.push({ label: 'Glucemia', value: `${v.glucose} mg/dL` });

      items.push({
        id: `vitals-${v.id}`,
        category: 'vitales',
        date: v.date,
        time: v.time,
        title: 'Control de Constantes y Signos Vitales',
        summary: v.notes || `Parámetros hemodinámicos registrados con normalidad: TA ${v.systolic}/${v.diastolic} mmHg, Pulso ${v.heartRate} lpm.`,
        author: v.takenBy ? `${v.takenBy} (Enfermería)` : 'Elena Morales (Cuidadora)',
        vitalsStats: statsList
      });
    });

    // 4. Incidents (Incidencias y alertas de salud)
    const residentIncidents = incidents.filter(
      inc => inc.residentIds.includes(residentId) || inc.residentNames.includes(residentName)
    );
    residentIncidents.forEach(inc => {
      const [date, time] = inc.dateTime.split(' ');
      items.push({
        id: `inc-${inc.id}`,
        category: 'incidencias',
        date: date || '2026-08-18',
        time: time || '16:45',
        title: `Incidencia: ${inc.incidentType === 'caida' ? 'Caída / Desestabilización' : inc.incidentType}`,
        summary: inc.description,
        author: `${inc.reportedBy} (Reporte Asistencial)`,
        severity: inc.severity
      });
    });

    // 5. Tasks (Tareas asistenciales: medicación, comidas, higiene, actividades)
    const residentTasks = tasks.filter(
      t => t.residentId === residentId || t.residentName === residentName || t.scope === 'grupal'
    );
    residentTasks.forEach(t => {
      let cat: CaregiverFilterCategory = 'actividades';

      if (t.type === 'medicacion') {
        cat = 'medicacion';
      } else if (t.type === 'alimentacion') {
        cat = 'alimentacion';
      } else if (t.type === 'higiene') {
        cat = 'cuidados';
      } else if (t.type === 'fisioterapia' || t.type === 'actividad') {
        cat = 'actividades';
      }

      items.push({
        id: `task-${t.id}`,
        category: cat,
        date: '2026-08-19',
        time: t.time,
        title: t.title,
        summary: t.description,
        author: 'Equipo Asistencial Samanya'
      });
    });

    // 6. Timeline Events (Eventos generales, fotos, talleres)
    timelineEvents.forEach(e => {
      const matchesResident =
        e.residentNames.includes(residentName) ||
        e.residentNames.includes('Todos los residentes') ||
        e.residentNames.includes('Planta 1');

      if (!matchesResident) return;

      let cat: CaregiverFilterCategory = 'actividades';

      if (e.type === 'medicacion') {
        cat = 'medicacion';
      } else if (e.type === 'alimentacion') {
        cat = 'alimentacion';
      } else if (e.type === 'signos_vitales') {
        cat = 'vitales';
      } else if (e.type === 'bitacora') {
        cat = 'bitacora';
      } else if (e.type === 'incidente') {
        cat = 'incidencias';
      } else if (e.type === 'consentimiento') {
        cat = 'consentimientos';
      }

      items.push({
        id: `event-${e.id}`,
        category: cat,
        date: e.date,
        time: e.time,
        title: e.title,
        summary: e.summary,
        author: e.fullDetails?.author || 'Personal de Planta',
        photoUrl: (e as any).photoUrl
      });
    });

    // Deduplicate by ID and sort chronologically
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [selectedFamiliarResident, consents, bitacoraEntries, vitalSigns, incidents, tasks, timelineEvents, residentId, residentName]);

  // Count items per filter category on the selected date
  const countsByFilter = useMemo(() => {
    const counts: Record<CaregiverFilterCategory, number> = {
      todos: 0,
      medicacion: 0,
      alimentacion: 0,
      cuidados: 0,
      vitales: 0,
      actividades: 0,
      bitacora: 0,
      incidencias: 0,
      consentimientos: 0
    };

    allTimelineItems.forEach(item => {
      if (item.date === selectedDate) {
        counts.todos += 1;
        if (counts[item.category] !== undefined) {
          counts[item.category] += 1;
        }
      }
    });

    return counts;
  }, [allTimelineItems, selectedDate]);

  // Filtered timeline for the selected date and active filter
  const filteredTimeline = useMemo(() => {
    return allTimelineItems
      .filter(item => {
        if (item.date !== selectedDate) return false;
        if (activeFilter === 'todos') return true;
        return item.category === activeFilter;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [allTimelineItems, selectedDate, activeFilter]);

  const activeFilterDef = filterDefinitions.find(f => f.id === activeFilter);

  return (
    <div className="space-y-4 pb-28 px-4 sm:px-5 max-w-lg mx-auto pt-1 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-[#292A24]">
          Calendario e Historial
        </h2>
      </div>

      {/* 2. Horizontal Date Selector with Swipe / Finger Scroll & Month Label */}
      <div className="bg-white rounded-3xl p-3.5 border border-[#DEDBD1] shadow-2xs space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#068591]">
            {activeMonthLabel}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollDates('left')}
              className="p-1 rounded-lg text-[#5C6058] hover:bg-[#F7F7F8]"
              aria-label="Mes o días anteriores"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollDates('right')}
              className="p-1 rounded-lg text-[#5C6058] hover:bg-[#F7F7F8]"
              aria-label="Mes o días siguientes"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable / Swipeable Day Row */}
        <div
          ref={dateCarouselRef}
          className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 custom-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {daysList.map(day => {
            const isSelected = selectedDate === day.fullDate;
            const hasPending = hasPendingConsentOnDate(day.fullDate);

            return (
              <button
                key={day.fullDate}
                type="button"
                onClick={() => setSelectedDate(day.fullDate)}
                className={`relative min-w-[52px] py-2.5 px-1.5 rounded-2xl flex flex-col items-center justify-center transition-all snap-start shrink-0 border ${
                  isSelected
                    ? 'bg-[#068591] text-white border-[#068591] shadow-xs font-bold scale-102'
                    : day.isToday
                    ? 'bg-[#D9F0F1] text-[#075158] border-[#068591]/40 font-bold'
                    : 'bg-[#F7F7F8] hover:bg-[#EBEBEB] text-[#292A24] border-[#DEDBD1]'
                }`}
              >
                <span className={`text-[11px] font-medium uppercase ${isSelected ? 'text-white/85' : 'text-[#5C6058]'}`}>
                  {day.dayName}
                </span>
                <span className="text-base font-bold mt-0.5">
                  {day.dayNum}
                </span>
                {day.isToday ? (
                  <span className={`text-[8px] font-extrabold uppercase mt-0.5 px-1 rounded-xs ${isSelected ? 'bg-white text-[#068591]' : 'bg-[#068591] text-white'}`}>
                    Hoy
                  </span>
                ) : (
                  <span className={`text-[8px] font-medium mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#5C6058]'}`}>
                    {day.monthName.slice(0, 3)}
                  </span>
                )}

                {/* Pending consent notification dot */}
                {hasPending && (
                  <span
                    title="Consentimiento pendiente de firma"
                    className="absolute -top-1 -right-1 w-3 h-3 bg-[#F57C00] rounded-full border-2 border-white animate-pulse"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Modern Filter Section with Caregiver Registration Categories */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-[11px] font-bold text-[#5C6058] uppercase tracking-wider">
            Filtrar registros del día
          </label>
          <span className="text-[11px] text-[#5C6058] font-medium">
            {countsByFilter.todos} {countsByFilter.todos === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {/* Modern Horizontal Scrollable Chip Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {filterDefinitions.map(filter => {
            const Icon = filter.icon;
            const isSelected = activeFilter === filter.id;
            const count = countsByFilter[filter.id] || 0;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`group touch-target inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                  isSelected
                    ? 'bg-[#068591] text-white border-[#068591] shadow-xs ring-2 ring-[#068591]/20'
                    : 'bg-white text-[#292A24] border-[#DEDBD1] hover:border-[#068591]/40 hover:bg-[#F7F7F8] active:scale-98'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    isSelected ? 'text-white' : 'text-[#068591]'
                  }`}
                />
                <span>{filter.label}</span>

                {/* Item count badge */}
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-all ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : count > 0
                      ? 'bg-[#D9F0F1] text-[#075158]'
                      : 'bg-[#F7F7F8] text-[#5C6058]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Summary & Quick Reset Bar */}
        {activeFilter !== 'todos' && (
          <div className="flex items-center justify-between px-3 py-2 bg-[#D9F0F1]/60 rounded-2xl border border-[#068591]/20 text-xs animate-in fade-in duration-150">
            <span className="text-[#075158] font-medium">
              Viendo <strong>{countsByFilter[activeFilter]}</strong> en <strong>{activeFilterDef?.label}</strong>
            </span>
            <button
              type="button"
              onClick={() => setActiveFilter('todos')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#068591] hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Ver todos</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Timeline List */}
      <div className="space-y-3 pt-1">
        {filteredTimeline.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#DEDBD1] text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F7F8] text-[#5C6058] flex items-center justify-center mx-auto border border-[#DEDBD1]">
              <CalendarIcon className="w-6 h-6 opacity-60" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#292A24]">
                Sin registros en {activeFilterDef?.label.toLowerCase() || 'esta categoría'}
              </p>
              <p className="text-xs text-[#5C6058] mt-1 max-w-xs mx-auto">
                No hay anotaciones registradas por el personal para la fecha seleccionada.
              </p>
            </div>
            {activeFilter !== 'todos' && (
              <button
                type="button"
                onClick={() => setActiveFilter('todos')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#068591] text-white text-xs font-bold shadow-2xs hover:bg-[#056c76]"
              >
                <span>Mostrar todos los registros de hoy</span>
              </button>
            )}
          </div>
        ) : (
          filteredTimeline.map(item => {
            // Pending Consent Card -> Highlighted authorization banner with direct signature button
            if (item.isPendingConsent && item.consentData) {
              return (
                <div
                  key={item.id}
                  className="bg-[#FEF3EB] rounded-3xl p-4 sm:p-5 border-2 border-[#F57C00] shadow-2xs space-y-3 animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#F57C00] text-white flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#7A3600]">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#7A3600] bg-white px-2.5 py-1 rounded-full border border-[#FAD7BC] shrink-0">
                      {item.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#5C6058] leading-relaxed">
                    {item.summary}
                  </p>

                  <button
                    type="button"
                    onClick={() => openConsentSignModal(item.consentData as ConsentRecord)}
                    className="touch-target w-full py-2.5 px-4 rounded-2xl bg-[#068591] text-white font-bold text-xs shadow-xs hover:bg-[#056c76] active:scale-[0.99] transition-all text-center"
                  >
                    Firmar autorización digital ahora
                  </button>
                </div>
              );
            }

            // Normal timeline card with dynamic category styling
            const def = filterDefinitions.find(f => f.id === item.category);
            const CategoryIcon = def?.icon || FileText;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DEDBD1] shadow-2xs space-y-3 transition-all hover:border-[#068591]/30"
              >
                {/* Header of the entry: Icon, Title ONLY (no subtitles like Medicación/Nota de evolución), Time */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-[#D9F0F1] text-[#068591] flex items-center justify-center font-bold text-xs shrink-0 border border-[#068591]/20 mt-0.5">
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        {item.isVoiceRecorded && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-[#F7F7F8] text-[#5C6058] px-1.5 py-0.2 rounded-md border border-[#DEDBD1]">
                            <Mic className="w-2.5 h-2.5 text-[#068591]" />
                            Voz
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-[#292A24] leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#5C6058] bg-[#F7F7F8] px-2 py-0.5 rounded-lg border border-[#DEDBD1]/60">
                      {item.time}
                    </span>
                  </div>
                </div>

                {/* Summary or Notes */}
                <p className="text-xs text-[#5C6058] leading-relaxed">
                  {item.summary}
                </p>

                {/* Vital signs stat chips if available */}
                {item.vitalsStats && item.vitalsStats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {item.vitalsStats.map((stat, idx) => (
                      <div key={idx} className="p-2.5 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1]">
                        <span className="text-[10px] font-bold text-[#5C6058] block">{stat.label}</span>
                        <span className="text-xs font-black text-[#292A24] mt-0.5 block">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Photo attachment if available */}
                {item.photoUrl && (
                  <div className="rounded-2xl overflow-hidden border border-[#DEDBD1] mt-2">
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-44 object-cover hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Footer: Author (no Pautado or Registro de turno badges) */}
                <div className="flex items-center justify-between pt-2 border-t border-[#DEDBD1]/60 text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#5C6058]">
                    <User className="w-3.5 h-3.5 text-[#5C6058]" />
                    <span className="font-medium truncate max-w-[200px]">
                      {item.author || 'Personal de Centro'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
