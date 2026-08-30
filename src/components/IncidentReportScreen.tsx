import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldAlert,
  Camera,
  Check,
  AlertTriangle,
  ChevronLeft,
  Search
} from 'lucide-react';
import { IncidentType, IncidentSeverity } from '../types';
import { VoiceInputButton } from './VoiceInputButton';

export const IncidentReportScreen: React.FC = () => {
  const {
    isIncidentReportOpen,
    setIsIncidentReportOpen,
    selectedResident,
    residents,
    createIncidentReport
  } = useApp();

  const [selectedResidentIds, setSelectedResidentIds] = useState<string[]>([]);
  const [residentSearchQuery, setResidentSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [incidentType, setIncidentType] = useState<IncidentType>('caida');
  const [customIncidentType, setCustomIncidentType] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('leve');
  const [dateTime, setDateTime] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isIncidentReportOpen) {
      if (selectedResident) {
        setSelectedResidentIds([selectedResident.id]);
        setResidentSearchQuery('');
      } else {
        setSelectedResidentIds([]);
        setResidentSearchQuery('');
      }
      const now = new Date();
      const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setDateTime(formatted);
      setDescription('');
      setPhotoUrl(undefined);
      setCustomIncidentType('');
      setIsDropdownOpen(false);
    }
  }, [isIncidentReportOpen, selectedResident]);

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResidents = useMemo(() => {
    if (!residentSearchQuery.trim()) return residents;
    const q = residentSearchQuery.toLowerCase();
    return residents.filter(r => r.name.toLowerCase().includes(q));
  }, [residents, residentSearchQuery]);

  if (!isIncidentReportOpen) return null;

  const handleSelectResident = (resId: string) => {
    if (!selectedResidentIds.includes(resId)) {
      setSelectedResidentIds(prev => [...prev, resId]);
    }
    setResidentSearchQuery('');
    setIsDropdownOpen(false);
  };

  const handleRemoveResident = (resId: string) => {
    setSelectedResidentIds(prev => prev.filter(id => id !== resId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedResidentIds.length === 0 || !description.trim()) return;

    const names = residents
      .filter(r => selectedResidentIds.includes(r.id))
      .map(r => r.name);

    createIncidentReport({
      residentIds: selectedResidentIds,
      residentNames: names,
      incidentType,
      severity,
      dateTime,
      description: incidentType === 'otro' && customIncidentType.trim() 
        ? `[Tipo: ${customIncidentType.trim()}] ${description.trim()}`
        : description.trim(),
      photoUrl
    });
  };

  const incidentTypesList: { id: IncidentType; label: string; desc: string }[] = [
    { id: 'caida', label: 'Caída', desc: 'Resbalón, tropiezo o pérdida de equilibrio' },
    { id: 'cambio_salud', label: 'Cambio de estado de salud', desc: 'Fiebre, desaturación, desorientación repentina' },
    { id: 'conflicto', label: 'Conflicto entre residentes', desc: 'Discusión verbal o altercado en áreas comunes' },
    { id: 'medicacion', label: 'Error o reacción a medicación', desc: 'Alergia, rechazo o intolerancia al fármaco' },
    { id: 'otro', label: 'Otro evento', desc: 'Incidencias edilicias, extravíos u otros motivos' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F7F8] overflow-y-auto">
      <div className="min-h-screen max-w-lg mx-auto pb-24">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DEDBD1] px-4 py-3 flex items-center justify-between">
          <button
            id="btn-back-incident-screen"
            type="button"
            onClick={() => setIsIncidentReportOpen(false)}
            className="touch-target flex items-center gap-1 text-[#8C2E2E] font-bold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Cancelar</span>
          </button>
          <div>
            <h1 className="font-bold text-base text-[#292A24]">
              Reportar Incidente
            </h1>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Notice */}
          <div className="bg-[#FBEAEA] p-3.5 rounded-2xl border border-[#8C2E2E]/30 flex items-start gap-2.5 text-xs text-[#8C2E2E]">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Este reporte se registrará inmediatamente en el protocolo del centro y notificará a Enfermería Jefe y Dirección.
            </div>
          </div>

          {/* 1. Affected Resident(s) with Floating Dropdown showing only names */}
          <div className="space-y-2" ref={dropdownRef}>
            <label className="block text-xs font-bold text-[#5C6058] uppercase tracking-wider" htmlFor="input-incident-resident-search">
              1. Residente(s) afectado(s) *
            </label>

            {/* Selected Resident Chips */}
            {selectedResidentIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {selectedResidentIds.map((id) => {
                  const r = residents.find(res => res.id === id);
                  if (!r) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#D9F0F1] text-[#075158] rounded-full text-xs font-bold border border-[#068591]/30"
                    >
                      {r.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveResident(id)}
                        className="touch-target hover:text-[#8C2E2E] ml-0.5"
                        aria-label={`Eliminar ${r.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Search / Select Resident Input */}
            <div className="relative">
              <input
                id="input-incident-resident-search"
                type="text"
                value={residentSearchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onClick={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setResidentSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder="Escribe para buscar y seleccionar residente..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591]"
              />

              {/* Autocomplete Dropdown with ONLY Names */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-[#DEDBD1] shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar divide-y divide-[#DEDBD1]/60">
                  {filteredResidents.length > 0 ? (
                    filteredResidents.map((r) => {
                      const isSelected = selectedResidentIds.includes(r.id);
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleSelectResident(r.id)}
                          className={`touch-target w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#D9F0F1] font-bold text-[#075158]'
                              : 'text-[#292A24] hover:bg-[#F7F7F8]'
                          }`}
                        >
                          <span>{r.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#068591]" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-3 text-xs text-[#5C6058] text-center">
                      No se encontraron residentes con ese nombre.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 2. Incident Type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#5C6058] uppercase tracking-wider">
              2. Tipo de incidente *
            </label>
            <div className="space-y-2">
              {incidentTypesList.map((type) => {
                const isSelected = incidentType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setIncidentType(type.id)}
                    className={`touch-target w-full p-3 rounded-2xl border transition-all text-left flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#FBEAEA] border-[#8C2E2E] text-[#8C2E2E] ring-1 ring-[#8C2E2E]'
                        : 'bg-white border-[#DEDBD1] text-[#292A24] hover:bg-[#F7F7F8]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{type.label}</div>
                      <div className="text-xs text-[#5C6058] mt-0.5">{type.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#8C2E2E] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* If 'otro' is selected, show custom type input */}
            {incidentType === 'otro' && (
              <div className="mt-2 animate-in fade-in">
                <label className="block text-xs font-bold text-[#8C2E2E] mb-1" htmlFor="input-custom-incident-type">
                  Especificar tipo de incidente *
                </label>
                <input
                  id="input-custom-incident-type"
                  type="text"
                  required
                  value={customIncidentType}
                  onChange={(e) => setCustomIncidentType(e.target.value)}
                  placeholder="Escribe el tipo de incidente..."
                  className="w-full p-2.5 bg-white border border-[#8C2E2E] rounded-xl text-sm text-[#292A24] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* 3. Severity Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#5C6058] uppercase tracking-wider">
              3. Nivel de severidad *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['leve', 'moderada', 'critica'] as const).map((sev) => {
                const isSelected = severity === sev;
                const labels = {
                  leve: 'Leve (Sin daño)',
                  moderada: 'Moderada',
                  critica: 'Crítica / Urgente'
                };
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`touch-target p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? 'bg-[#8C2E2E] border-[#8C2E2E] text-white shadow-2xs'
                        : 'bg-white border-[#DEDBD1] text-[#5C6058] hover:bg-[#F7F7F8]'
                    }`}
                  >
                    {labels[sev]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Date & Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5C6058] uppercase tracking-wider" htmlFor="input-incident-datetime">
              4. Fecha y hora del suceso
            </label>
            <input
              id="input-incident-datetime"
              type="text"
              required
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full p-3 bg-white border border-[#DEDBD1] rounded-xl text-sm font-bold text-[#292A24] focus:outline-none focus:border-[#068591]"
            />
          </div>

          {/* 5. Description (Voice icon at bottom right of textarea) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5C6058] uppercase tracking-wider" htmlFor="textarea-incident-desc">
              5. Descripción detallada *
            </label>

            <div className="relative">
              <textarea
                id="textarea-incident-desc"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalla lo sucedido: estado del residente, primeros auxilios aplicados..."
                className="w-full p-3 pr-12 pb-12 bg-white border border-[#DEDBD1] rounded-2xl text-sm text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#8C2E2E] focus:ring-2 focus:ring-[#8C2E2E]/20"
              />
              <div className="absolute right-2.5 bottom-2.5 z-10">
                <VoiceInputButton
                  contextHint="incidente"
                  currentValue={description}
                  onTranscript={(t) => setDescription(t)}
                />
              </div>
            </div>
          </div>

          {/* 6. Photo attachment (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5C6058] uppercase tracking-wider">
              6. Fotografía o evidencia (opcional)
            </label>
            {photoUrl ? (
              <div className="relative">
                <img
                  src={photoUrl}
                  alt="Evidencia"
                  className="w-full h-40 object-cover rounded-2xl border border-[#DEDBD1]"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(undefined)}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setPhotoUrl(
                    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300'
                  )
                }
                className="touch-target w-full p-3 bg-white hover:bg-[#D9F0F1] text-[#075158] text-xs font-bold rounded-2xl border border-[#DEDBD1] flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4 text-[#068591]" />
                <span>Adjuntar foto de prueba</span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="btn-submit-incident"
              type="submit"
              disabled={
                selectedResidentIds.length === 0 ||
                !description.trim() ||
                (incidentType === 'otro' && !customIncidentType.trim())
              }
              className="touch-target w-full py-4 px-6 rounded-2xl bg-[#8C2E2E] text-white font-bold text-base shadow-sm hover:bg-[#772626] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Registrar y Notificar Incidente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
