import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Clock,
  Pill,
  Utensils,
  BookOpen,
  AlertOctagon,
  FileCheck2,
  UserCheck2,
  Activity,
  ChevronRight,
  User,
  Info,
  Calendar
} from 'lucide-react';
import { ActivityEvent } from '../types';

export const TimelineDrawer: React.FC = () => {
  const {
    isTimelineDrawerOpen,
    setIsTimelineDrawerOpen,
    selectedDate,
    setSelectedDate,
    timelineEvents,
    selectedEvent,
    setSelectedEvent,
    isEventDetailModalOpen,
    setIsEventDetailModalOpen
  } = useApp();

  if (!isTimelineDrawerOpen) return null;

  const filteredEvents = timelineEvents.filter(
    (e) => !selectedDate || e.date === selectedDate
  );

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'medicacion':
        return <Pill className="w-4 h-4 text-[#068591]" />;
      case 'alimentacion':
        return <Utensils className="w-4 h-4 text-[#C68A3D]" />;
      case 'bitacora':
        return <BookOpen className="w-4 h-4 text-[#068591]" />;
      case 'incidente':
        return <AlertOctagon className="w-4 h-4 text-[#8C2E2E]" />;
      case 'consentimiento':
        return <FileCheck2 className="w-4 h-4 text-[#1E7A4C]" />;
      case 'alta_aprobada':
        return <UserCheck2 className="w-4 h-4 text-[#075158]" />;
      case 'signos_vitales':
        return <Activity className="w-4 h-4 text-[#068591]" />;
      default:
        return <Clock className="w-4 h-4 text-[#5C6058]" />;
    }
  };

  const getEventTypeBadge = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'medicacion':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#D9F0F1] text-[#075158]">Medicación</span>;
      case 'alimentacion':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FBE9D2] text-[#9A5B12]">Alimentación</span>;
      case 'bitacora':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F7F7F8] text-[#5C6058] border border-[#DEDBD1]">Bitácora</span>;
      case 'incidente':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FBEAEA] text-[#8C2E2E]">Incidente</span>;
      case 'consentimiento':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#DFF3E7] text-[#1E7A4C]">Consentimiento</span>;
      case 'alta_aprobada':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#DFF3E7] text-[#1E7A4C]">Alta Aprobada</span>;
      case 'signos_vitales':
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#D9F0F1] text-[#075158]">Signos Vitales</span>;
    }
  };

  const handleOpenEventDetail = (event: ActivityEvent) => {
    setSelectedEvent(event);
    setIsEventDetailModalOpen(true);
  };

  return (
    <>
      {/* Pantalla 4: Línea de tiempo de actividad (Slide up drawer) */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex flex-col justify-end animate-in fade-in">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Línea de tiempo de actividad"
          className="w-full max-w-lg mx-auto bg-white rounded-t-[32px] max-h-[88vh] h-[88vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-250"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#DEDBD1] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#D9F0F1] text-[#068591] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#292A24] leading-tight">
                  Línea de tiempo
                </h2>
                <p className="text-xs text-[#5C6058]">
                  Fecha seleccionada: {selectedDate}
                </p>
              </div>
            </div>
            <button
              id="btn-close-timeline-drawer"
              type="button"
              onClick={() => setIsTimelineDrawerOpen(false)}
              className="touch-target p-2 rounded-2xl text-[#5C6058] hover:bg-[#F7F7F8]"
              aria-label="Cerrar línea de tiempo"
            >
              <X className="w-6 h-6 text-[#292A24]" />
            </button>
          </div>

          {/* Read-only notification notice */}
          <div className="bg-[#F7F7F8] px-5 py-2.5 border-b border-[#DEDBD1] text-xs text-[#5C6058] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#068591] flex-shrink-0" />
            <span>Vista de solo lectura cronológica. Toca una fila para ver el detalle.</span>
          </div>

          {/* Chronological List of Events */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-[#5C6058]">
                <Clock className="w-10 h-10 mx-auto text-[#DEDBD1] mb-2" />
                <p className="font-semibold text-base">No hay actividades registradas en esta fecha</p>
                <p className="text-xs mt-1">Selecciona el día 19 de agosto para ver los eventos de hoy.</p>
                <button
                  type="button"
                  onClick={() => setSelectedDate('2026-08-19')}
                  className="mt-4 px-4 py-2 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 text-xs font-bold rounded-xl"
                >
                  Ver hoy (19 Ago)
                </button>
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <button
                  key={evt.id}
                  id={`btn-event-${evt.id}`}
                  type="button"
                  onClick={() => handleOpenEventDetail(evt)}
                  className="touch-target w-full text-left bg-white hover:bg-[#F7F7F8] active:bg-[#D9F0F1]/30 p-3.5 rounded-2xl border border-[#DEDBD1] transition-all flex items-center justify-between gap-3 shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#F7F7F8] border border-[#DEDBD1] flex items-center justify-center flex-shrink-0 group-hover:border-[#068591]">
                      {getEventIcon(evt.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#068591]">
                          {evt.time}
                        </span>
                        {getEventTypeBadge(evt.type)}
                      </div>
                      <h4 className="text-sm font-bold text-[#292A24] truncate mt-0.5">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-[#5C6058] truncate flex items-center gap-1">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span>{evt.residentNames.join(', ')}</span>
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#5C6058] flex-shrink-0 group-hover:text-[#068591] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pantalla 5: Detalle de un evento (Modal, Fade in) */}
      {isEventDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle de evento: ${selectedEvent.title}`}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#DEDBD1] max-h-[85vh] overflow-y-auto space-y-4 animate-in zoom-in-95 duration-200 custom-scrollbar"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#DEDBD1]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#D9F0F1] flex items-center justify-center flex-shrink-0">
                  {getEventIcon(selectedEvent.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#068591]">
                      {selectedEvent.time} · {selectedEvent.date}
                    </span>
                    {getEventTypeBadge(selectedEvent.type)}
                  </div>
                  <h3 className="text-lg font-bold text-[#292A24] leading-snug mt-0.5">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>
              <button
                id="btn-close-event-detail"
                type="button"
                onClick={() => setIsEventDetailModalOpen(false)}
                className="touch-target p-1.5 -mr-2 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
                aria-label="Cerrar detalle"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* General Summary / Overview */}
            <div>
              <h4 className="text-xs font-bold text-[#5C6058] uppercase tracking-wider mb-1">
                Resumen general
              </h4>
              <p className="text-sm text-[#292A24] bg-[#F7F7F8] p-3.5 rounded-2xl border border-[#DEDBD1] leading-relaxed">
                {selectedEvent.fullDetails.overview}
              </p>
            </div>

            {/* Numerical Stats if meal or group */}
            {selectedEvent.fullDetails.stats && selectedEvent.fullDetails.stats.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#5C6058] uppercase tracking-wider mb-2">
                  Balance de participación
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedEvent.fullDetails.stats.map((st, i) => (
                    <div
                      key={i}
                      className="bg-[#D9F0F1] p-3 rounded-2xl border border-[#068591]/20 text-center"
                    >
                      <div className="text-lg font-black text-[#075158]">
                        {st.value}
                      </div>
                      <div className="text-xs font-semibold text-[#075158]/80">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Exceptions (e.g. Desayuno) */}
            {selectedEvent.fullDetails.exceptions && selectedEvent.fullDetails.exceptions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-[#8C2E2E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5" /> Excepciones individuales reportadas
                </h4>
                <div className="space-y-2">
                  {selectedEvent.fullDetails.exceptions.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FBEAEA] p-3.5 rounded-2xl border border-[#8C2E2E]/30"
                    >
                      <div className="text-sm font-bold text-[#8C2E2E]">
                        {ex.residentName}
                      </div>
                      <div className="text-xs text-[#8C2E2E]/90 mt-0.5">
                        {ex.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resident List */}
            <div>
              <h4 className="text-xs font-bold text-[#5C6058] uppercase tracking-wider mb-1">
                Residente(s) involucrado(s)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedEvent.residentNames.map((resName, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-xl bg-white border border-[#DEDBD1] text-[#292A24]"
                  >
                    {resName}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes & Author Footer */}
            <div className="pt-3 border-t border-[#DEDBD1] flex items-center justify-between text-xs text-[#5C6058]">
              <span>Registrado por: <strong>{selectedEvent.fullDetails.author}</strong></span>
              <span className="text-[11px] italic">Solo lectura</span>
            </div>

            <button
              type="button"
              onClick={() => setIsEventDetailModalOpen(false)}
              className="touch-target w-full py-3 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-sm rounded-2xl shadow-xs transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
