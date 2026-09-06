import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Activity, Heart, Thermometer, Wind, Check, Droplets } from 'lucide-react';

export const VitalSignsModal: React.FC = () => {
  const {
    isVitalSignsModalOpen,
    setIsVitalSignsModalOpen,
    selectedResident,
    setSelectedResident,
    selectedTaskForMassRegistration,
    markTaskCompleted,
    residents,
    selectedDate,
    addVitalSigns
  } = useApp();

  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [spO2, setSpO2] = useState<number>(98);
  const [temperature, setTemperature] = useState<number>(36.5);
  const [glucose, setGlucose] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isVitalSignsModalOpen) return null;

  const currentResident = selectedResident || residents[0];
  if (!currentResident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addVitalSigns({
      residentId: currentResident.id,
      residentName: currentResident.name,
      date: selectedDate,
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      heartRate: Number(heartRate),
      spO2: Number(spO2),
      temperature: Number(temperature),
      glucose: glucose ? Number(glucose) : undefined,
      notes: notes.trim() || undefined
    });

    if (selectedTaskForMassRegistration) {
      markTaskCompleted(selectedTaskForMassRegistration.id);
    }
    setIsVitalSignsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-4 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Registrar signos vitales"
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D9F0F1] text-[#068591] flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#292A24] leading-tight">
                Tomar signos vitales
              </h3>
              <p className="text-xs text-[#5C6058]">
                {selectedTaskForMassRegistration
                  ? selectedTaskForMassRegistration.title
                  : `${currentResident.name} (${currentResident.room})`}
              </p>
            </div>
          </div>
          <button
            id="btn-close-vitals-modal"
            type="button"
            onClick={() => setIsVitalSignsModalOpen(false)}
            className="touch-target p-1.5 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Resident Selector */}
        <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
          <label className="block text-xs font-bold text-[#292A24] mb-1.5">
            Residente a evaluar
          </label>
          <select
            value={currentResident.id}
            onChange={(e) => {
              const found = residents.find((r) => r.id === e.target.value);
              if (found) setSelectedResident(found);
            }}
            className="w-full p-2.5 bg-white border border-[#DEDBD1] rounded-xl text-sm font-bold text-[#292A24] focus:outline-none focus:border-[#068591]"
          >
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — Hab. {r.room}{r.bed ? ` (${r.bed})` : ''}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tensión Arterial */}
          <div className="bg-[#F7F7F8] p-3.5 rounded-2xl border border-[#DEDBD1]">
            <label className="block text-xs font-bold text-[#292A24] mb-2 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#8C2E2E]" /> Tensión Arterial (mmHg)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-[#5C6058]">Sistólica (Máx)</span>
                <input
                  type="number"
                  required
                  min={60}
                  max={250}
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-white border border-[#DEDBD1] rounded-xl text-base font-bold text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>
              <div>
                <span className="text-[11px] text-[#5C6058]">Diastólica (Mín)</span>
                <input
                  type="number"
                  required
                  min={40}
                  max={150}
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-white border border-[#DEDBD1] rounded-xl text-base font-bold text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>
            </div>
          </div>

          {/* Frecuencia Cardíaca & SpO2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
              <label className="block text-xs font-bold text-[#292A24] mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-[#068591]" /> Frecuencia (lpm)
              </label>
              <input
                type="number"
                required
                min={30}
                max={200}
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full mt-1 p-2.5 bg-white border border-[#DEDBD1] rounded-xl text-base font-bold text-[#292A24] focus:outline-none focus:border-[#068591]"
              />
            </div>

            <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
              <label className="block text-xs font-bold text-[#292A24] mb-1 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#068591]" /> Sat. O2 (%)
              </label>
              <input
                type="number"
                required
                min={70}
                max={100}
                value={spO2}
                onChange={(e) => setSpO2(Number(e.target.value))}
                className="w-full mt-1 p-2.5 bg-white border border-[#DEDBD1] rounded-xl text-base font-bold text-[#292A24] focus:outline-none focus:border-[#068591]"
              />
            </div>
          </div>

          {/* Temperatura & Glucemia */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
              <label className="block text-xs font-bold text-[#292A24] mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-[#C68A3D]" /> Temp. (°C)
              </label>
              <input
                type="number"
                step="0.1"
                required
                min={33}
                max={42}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full mt-1 p-2.5 bg-white border border-[#DEDBD1] rounded-xl text-base font-bold text-[#292A24] focus:outline-none focus:border-[#068591]"
              />
            </div>

            <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1]">
              <label className="block text-xs font-bold text-[#292A24] mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-[#075158]" /> Glucemia (mg/dL)
              </label>
              <input
                type="number"
                placeholder="Opcional"
                value={glucose}
                onChange={(e) => setGlucose(e.target.value)}
                className="w-full mt-1 p-2.5 bg-white border border-[#DEDBD1] rounded-xl text-sm font-semibold text-[#292A24] focus:outline-none focus:border-[#068591]"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-bold text-[#292A24] mb-1">
              Observaciones (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Tomado en reposo tras medicación"
              className="w-full p-3 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] focus:outline-none focus:border-[#068591]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              id="btn-save-vitals"
              type="submit"
              className="touch-target w-full py-3.5 px-6 rounded-2xl bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-base shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Guardar signos vitales</span>
            </button>
            <button
              type="button"
              onClick={() => setIsVitalSignsModalOpen(false)}
              className="touch-target w-full py-2 text-xs font-semibold text-[#5C6058] hover:text-[#292A24]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
