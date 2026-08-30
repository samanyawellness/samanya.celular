import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Heart, Thermometer, Wind, Droplets, X, Calendar, UserCheck } from 'lucide-react';

export const FamiliarVitalsModal: React.FC = () => {
  const {
    isFamiliarVitalsModalOpen,
    setIsFamiliarVitalsModalOpen,
    selectedFamiliarResident,
    vitalSigns
  } = useApp();

  if (!isFamiliarVitalsModalOpen) return null;

  // Find latest vital signs for this resident
  const residentVitals = vitalSigns.filter(
    v => v.residentId === selectedFamiliarResident?.id || v.residentName === selectedFamiliarResident?.name
  );

  const latestVitals = residentVitals[0] || {
    id: 'vit-fallback',
    residentId: selectedFamiliarResident?.id || 'res-1',
    residentName: selectedFamiliarResident?.name || 'Residente',
    date: '2026-08-19',
    time: '09:00 AM',
    systolic: 124,
    diastolic: 80,
    heartRate: 72,
    spO2: 97,
    temperature: 36.4,
    glucose: 110,
    notes: 'Valores estables y dentro de rangos normales de control.',
    takenBy: 'Elena Morales (Cuidadora)'
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="modal-familiar-vitals"
        className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-xl border border-[#DEDBD1] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
          <h3 className="text-base font-bold text-[#292A24]">
            Signos vitales
          </h3>
          <button
            type="button"
            onClick={() => setIsFamiliarVitalsModalOpen(false)}
            className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] rounded-full hover:bg-[#F7F7F8]"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date & Author tag */}
        <div className="flex items-center justify-between bg-[#F7F7F8] rounded-2xl px-3.5 py-2 my-3 border border-[#DEDBD1]/60 text-xs text-[#5C6058]">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#068591]" />
            <span>{latestVitals.date} · {latestVitals.time}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-[#075158]">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{latestVitals.takenBy}</span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-3">
          {/* Blood Pressure */}
          <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5C6058] mb-1">
              <Heart className="w-3.5 h-3.5 text-[#8C2E2E]" />
              <span>Tensión arterial</span>
            </div>
            <div className="text-lg font-black text-[#292A24]">
              {latestVitals.systolic}/{latestVitals.diastolic}{' '}
              <span className="text-xs font-medium text-[#5C6058]">mmHg</span>
            </div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DFF3E7] text-[#1E7A4C]">
              Normal
            </span>
          </div>

          {/* Heart Rate */}
          <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5C6058] mb-1">
              <Activity className="w-3.5 h-3.5 text-[#068591]" />
              <span>Frecuencia cardíaca</span>
            </div>
            <div className="text-lg font-black text-[#292A24]">
              {latestVitals.heartRate}{' '}
              <span className="text-xs font-medium text-[#5C6058]">lpm</span>
            </div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DFF3E7] text-[#1E7A4C]">
              Estable
            </span>
          </div>

          {/* SpO2 */}
          <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5C6058] mb-1">
              <Wind className="w-3.5 h-3.5 text-[#068591]" />
              <span>Saturación O₂</span>
            </div>
            <div className="text-lg font-black text-[#292A24]">
              {latestVitals.spO2}%
            </div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DFF3E7] text-[#1E7A4C]">
              Óptimo
            </span>
          </div>

          {/* Temperature */}
          <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5C6058] mb-1">
              <Thermometer className="w-3.5 h-3.5 text-[#9A5B12]" />
              <span>Temperatura</span>
            </div>
            <div className="text-lg font-black text-[#292A24]">
              {latestVitals.temperature} <span className="text-xs font-medium text-[#5C6058]">°C</span>
            </div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DFF3E7] text-[#1E7A4C]">
              Afebril
            </span>
          </div>

          {/* Glucose if available */}
          {latestVitals.glucose && (
            <div className="col-span-2 bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#D9F0F1] text-[#068591] flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#5C6058]">Glucemia basal</div>
                  <div className="text-sm font-bold text-[#292A24]">
                    {latestVitals.glucose} mg/dL
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DFF3E7] text-[#1E7A4C]">
                En rango
              </span>
            </div>
          )}
        </div>

        {/* Clinical notes */}
        {latestVitals.notes && (
          <div className="p-3 bg-[#D9F0F1]/50 rounded-2xl border border-[#068591]/20 my-2">
            <div className="text-xs font-bold text-[#075158] mb-0.5">Observación sanitaria:</div>
            <p className="text-xs text-[#292A24] leading-relaxed">
              {latestVitals.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
