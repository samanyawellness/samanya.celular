import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Activity,
  AlertTriangle,
  FileCheck2,
  FileText,
  Image as ImageIcon,
  UserCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { ConsentRecord } from '../../types';

type BitacoraTypeFilter = 'todo' | 'consentimientos' | 'fotos_notas' | 'medicacion_actividad' | 'documentos_medicos';

export const FamiliarBitacoraScreen: React.FC = () => {
  const {
    selectedFamiliarResident,
    tasks,
    bitacoraEntries,
    consents,
    vitalSigns,
    incidents,
    timelineEvents,
    clinicalRecords,
    selectedDate,
    setSelectedDate,
    setIsFamiliarVitalsModalOpen,
    openConsentSignModal
  } = useApp();

  const [activeTypeFilter, setActiveTypeFilter] = useState<BitacoraTypeFilter>('todo');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const resident = selectedFamiliarResident;
  const residentName = resident?.name || 'Carmen Delgado Serrano';
  const residentId = resident?.id || 'res-1';

  // Format active date for display: "19 Ago. 2026"
  const formattedDateLabel = useMemo(() => {
    if (!selectedDate) return '19 Ago. 2026';
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const day = date.getDate();
      const monthNames = ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
      return `${day} ${monthNames[date.getMonth()]} ${y}`;
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Pending consents on the currently selected date
  const pendingConsentsForSelectedDate = useMemo(() => {
    return consents.filter(
      c =>
        (c.residentId === residentId || c.residentName === residentName) &&
        c.status === 'pendiente' &&
        c.sentDate.startsWith(selectedDate)
    );
  }, [consents, residentId, residentName, selectedDate]);

  // 1. Consents for this date
  const dateConsents = useMemo(() => {
    return consents.filter(
      c =>
        (c.residentId === residentId || c.residentName === residentName) &&
        c.sentDate.startsWith(selectedDate)
    );
  }, [consents, residentId, residentName, selectedDate]);

  // 2. Medications for this date
  const dateMedications = useMemo(() => {
    // If today, use actual tasks & resident medication state
    const residentMedTasks = tasks.filter(
      t =>
        t.type === 'medicacion' &&
        (t.residentId === residentId || t.residentName === residentName)
    );

    if (residentMedTasks.length > 0) {
      return residentMedTasks.map(t => {
        let medName = t.medicationDetails?.drugName;
        if (!medName) {
          medName = t.title
            .replace(/^Administrar\s+/i, '')
            .replace(/\s*—\s*.*$/, '')
            .replace(/\s*-\s*.*$/, '')
            .trim();
          if (!medName || medName.toLowerCase().includes('medicación') || medName.toLowerCase().includes('individual')) {
            medName = 'Enalapril 10mg';
          }
        }
        return {
          id: t.id,
          name: medName,
          dose: t.dose || t.medicationDetails?.dose || '1 comprimido',
          time: t.time,
          status: t.status === 'completada' ? 'administrado' : 'pendiente',
          instructions: t.instructions || 'Vía oral con agua'
        };
      });
    }

    return (resident?.medications || []).map(m => ({
      id: m.id,
      name: m.drugName,
      dose: m.dose,
      time: m.time,
      status: m.status,
      instructions: m.route || 'Vía oral'
    }));
  }, [tasks, resident, residentId, residentName]);

  // 3. Activities & Care for this date
  const dateActivities = useMemo(() => {
    if (selectedDate === '2026-08-19') {
      return [
        {
          id: 'act-1',
          time: '08:30',
          title: 'Desayuno completo',
          category: 'Alimentación',
          description: 'Ha tomado café con leche templada, tostadas de pan integral con aceite de oliva y fruta picada.',
          author: 'Elena Morales (Cuidadora)'
        },
        {
          id: 'act-2',
          time: '10:15',
          title: 'Taller de estimulación cognitiva',
          category: 'Taller',
          description: 'Participación muy activa en ejercicios de memoria asociativa y refranes populares en el salón principal.',
          author: 'Carlos Vega (Terapeuta Ocupacional)'
        },
        {
          id: 'act-3',
          time: '11:30',
          title: 'Aseo e hidratación de la piel',
          category: 'Higiene',
          description: 'Higiene asistida con aplicación de crema hidratante en extremidades.',
          author: 'Elena Morales (Cuidadora)'
        },
        {
          id: 'act-4',
          time: '12:15',
          title: 'Paseo por el jardín terapéutico',
          category: 'Actividad',
          description: 'Caminata asistida con andador aprovechando el sol de la mañana. Buen ánimo.',
          author: 'Equipo Asistencial'
        },
        {
          id: 'act-5',
          time: '13:30',
          title: 'Almuerzo adaptado',
          category: 'Alimentación',
          description: 'Menú hiposódico blando completo (puré de verduras con merluza al vapor). Ingesta hídrica óptima.',
          author: 'Personal de Comedor'
        }
      ];
    } else if (selectedDate === '2026-08-18') {
      return [
        {
          id: 'act-prev-1',
          time: '08:30',
          title: 'Desayuno completo',
          category: 'Alimentación',
          description: 'Ingesta habitual de desayuno con buena tolerancia.',
          author: 'Elena Morales (Cuidadora)'
        },
        {
          id: 'act-prev-2',
          time: '10:30',
          title: 'Sesión de fisioterapia',
          category: 'Fisioterapia',
          description: 'Ejercicios de marcha y mantenimiento de equilibrio con el fisioterapeuta.',
          author: 'Laura Santos (Fisioterapeuta)'
        },
        {
          id: 'act-prev-3',
          time: '17:00',
          title: 'Taller de musicoterapia',
          category: 'Taller',
          description: 'Audición de canciones tradicionales y acompañamiento rítmico.',
          author: 'Carlos Vega (Terapeuta)'
        }
      ];
    } else {
      return [
        {
          id: `act-gen-1-${selectedDate}`,
          time: '08:30',
          title: 'Desayuno e higiene matutina',
          category: 'Cuidados',
          description: 'Atención integral completada con pauta habitual.',
          author: 'Equipo Asistencial Samanya'
        },
        {
          id: `act-gen-2-${selectedDate}`,
          time: '11:00',
          title: 'Actividad programada y convivencia',
          category: 'Actividad',
          description: 'Participación en el programa asistencial del centro.',
          author: 'Equipo Asistencial'
        }
      ];
    }
  }, [selectedDate]);

  // 4. Photos & Notes from caregivers for this date
  const datePhotosAndNotes = useMemo(() => {
    const list: {
      id: string;
      time: string;
      title: string;
      text: string;
      author: string;
      photoUrl?: string;
      isVoice?: boolean;
    }[] = [];

    // From bitacora entries
    bitacoraEntries
      .filter(b => (b.residentId === residentId || b.residentName === residentName) && b.date === selectedDate)
      .forEach(b => {
        list.push({
          id: `bit-${b.id}`,
          time: b.time,
          title: b.category,
          text: b.text,
          author: b.author,
          isVoice: b.recordedByVoice
        });
      });

    // From timeline events (which contain photos and detailed reports)
    timelineEvents
      .filter(e => {
        const matchesResident =
          e.residentNames.includes(residentName) ||
          e.residentNames.includes('Todos los residentes') ||
          e.residentNames.includes('Planta 1');
        return matchesResident && e.date === selectedDate;
      })
      .forEach(e => {
        list.push({
          id: `evt-${e.id}`,
          time: e.time,
          title: e.title,
          text: e.summary,
          author: e.fullDetails?.author || 'Personal de Planta',
          photoUrl: (e as any).photoUrl
        });
      });

    // If today and empty, provide rich sample photo and caregiver note
    if (selectedDate === '2026-08-19' && list.length === 0) {
      list.push({
        id: 'sample-note-1',
        time: '12:20',
        title: 'Fotografía: Actividad de horticultura y paseo',
        text: 'Doña Carmen ha disfrutado mucho del rato en el huerto terapéutico y regando las macetas con sus compañeras.',
        author: 'Elena Morales (Cuidadora principal)',
        photoUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800'
      });
      list.push({
        id: 'sample-note-2',
        time: '15:45',
        title: 'Evolución asistencial de la tarde',
        text: 'Ha descansado plácidamente durante la siesta. Refiere encontrarse de muy buen humor tras la merienda.',
        author: 'Elena Morales (Cuidadora)'
      });
    } else if (selectedDate === '2026-08-18' && list.length === 0) {
      list.push({
        id: 'sample-note-prev',
        time: '17:30',
        title: 'Fotografía: Taller de música y reminiscencia',
        text: 'Momento entrañable recordando coplas clásicas y cantando en grupo.',
        author: 'Carlos Vega (Terapeuta Ocupacional)',
        photoUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=800'
      });
    }

    return list;
  }, [bitacoraEntries, timelineEvents, residentId, residentName, selectedDate]);

  // 5. Clinical records for this date
  const dateClinicalRecords = useMemo(() => {
    return clinicalRecords.filter(
      r =>
        (r.residentId === residentId || r.residentName === residentName) &&
        r.date === selectedDate
    );
  }, [clinicalRecords, residentId, residentName, selectedDate]);

  // Latest vital signs for this resident
  const latestVitals = useMemo(() => {
    const residentVitals = vitalSigns.filter(
      v => v.residentId === residentId || v.residentName === residentName
    );
    if (residentVitals.length === 0) return null;
    return residentVitals[0];
  }, [vitalSigns, residentId, residentName]);

  const latestVitalsDateLabel = useMemo(() => {
    if (!latestVitals) return 'Sin registros recientes';
    try {
      const [y, m, d] = latestVitals.date.split('-').map(Number);
      const monthNames = ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'];
      const dateFormatted = `${d} ${monthNames[m - 1]} ${y}`;
      return `${dateFormatted} · ${latestVitals.time}`;
    } catch {
      return `${latestVitals.date} · ${latestVitals.time}`;
    }
  }, [latestVitals]);

  return (
    <div className="space-y-4 pb-28 px-4 sm:px-5 max-w-lg mx-auto pt-1 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-[#292A24]">
          Bitácora
        </h2>
      </div>

      {/* 2. Botón de Signos Vitales Fijo Arriba (Muestra la fecha del último registro) */}
      <button
        id="btn-open-familiar-vitals"
        type="button"
        onClick={() => setIsFamiliarVitalsModalOpen(true)}
        className="w-full bg-[#EBF7F8] hover:bg-[#DDF2F4] border border-[#BCE4E8] rounded-3xl p-4 transition-all flex items-center justify-between text-left group shadow-2xs cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#068591] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#075158]">
              Signos vitales
            </h3>
            <p className="text-[11px] text-[#5C6058] mt-0.5">
              Último registro: <span className="font-semibold text-[#292A24]">{latestVitalsDateLabel}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center text-[#068591]">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>

      {/* 3. Filtros lado a lado: Selector de fecha + Selector de registros/eventos */}
      <div className="grid grid-cols-2 gap-2.5 items-stretch">
        {/* Selector de fecha (Abre de una el calendario al undirse) */}
        <div className="relative">
          <div className="w-full h-11 inline-flex items-center justify-between gap-1.5 text-xs font-bold text-[#292A24] bg-white hover:bg-[#F7F7F8] px-3.5 rounded-2xl border border-[#DEDBD1] shadow-2xs transition-all truncate pointer-events-none">
            <div className="flex items-center gap-1.5 truncate">
              <CalendarIcon className="w-3.5 h-3.5 text-[#068591] shrink-0" />
              <span className="truncate">{formattedDateLabel}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#5C6058] shrink-0" />
          </div>
          <input
            ref={dateInputRef}
            id="input-bitacora-date-picker"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedDate(e.target.value);
              }
            }}
            onClick={(e) => {
              try {
                (e.target as any).showPicker?.();
              } catch (err) {}
            }}
            aria-label="Seleccionar fecha de bitácora"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>

        {/* Selector de registros/eventos */}
        <div className="relative">
          <select
            id="select-bitacora-type-filter"
            value={activeTypeFilter}
            onChange={(e) => setActiveTypeFilter(e.target.value as BitacoraTypeFilter)}
            className="w-full h-11 appearance-none bg-white border border-[#DEDBD1] rounded-2xl pl-3.5 pr-8 text-xs font-bold text-[#292A24] focus:outline-none focus:ring-1 focus:ring-[#068591] shadow-2xs cursor-pointer truncate"
          >
            <option value="todo">Todos los registros</option>
            <option value="consentimientos">
              Consentimientos {pendingConsentsForSelectedDate.length > 0 ? `(${pendingConsentsForSelectedDate.length})` : ''}
            </option>
            <option value="fotos_notas">Fotos y notas</option>
            <option value="medicacion_actividad">Medicación y actividad</option>
            <option value="documentos_medicos">
              Docs. médicos {dateClinicalRecords.length > 0 ? `(${dateClinicalRecords.length})` : ''}
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#5C6058]">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 4. VISTA UNIFICADA: CONSENTIMIENTOS Y AUTORIZACIONES (Fondo naranja consistente, uno solo por autorización) */}
      {(activeTypeFilter === 'consentimientos' || activeTypeFilter === 'todo') && dateConsents.length > 0 && (
        <div className="space-y-3">
          <div className="px-1 pt-1">
            <h3 className="text-sm font-bold text-[#292A24]">
              Consentimientos y Autorizaciones
            </h3>
          </div>

          <div className="space-y-3">
            {dateConsents.map(c => {
              const isPending = c.status === 'pendiente';
              const isApproved = c.status === 'aprobado';
              return (
                <div
                  key={c.id}
                  className="bg-[#FEF3EB] rounded-3xl p-4 border border-[#FAD7BC] space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#7A3600] bg-white px-2.5 py-0.5 rounded-lg border border-[#FAD7BC]">
                      {c.type}
                    </span>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md border shrink-0 bg-white ${
                        isApproved
                          ? 'text-[#1E7A4C] border-[#B3E5C8]'
                          : isPending
                          ? 'text-[#8C2E2E] border-[#FAD7BC]'
                          : 'text-[#8C2E2E] border-[#f5b8b8]'
                      }`}
                    >
                      {isApproved ? 'Firmado' : isPending ? 'Requiere firma' : 'Rechazado'}
                    </span>
                  </div>

                  <p className="text-xs text-[#292A24] leading-relaxed">
                    {c.description}
                  </p>

                  {c.documentName && (
                    <div className="bg-white/80 rounded-xl p-2.5 border border-[#FAD7BC] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-[#7A3600] shrink-0" />
                        <span className="font-semibold text-[#292A24] truncate">
                          {c.documentName}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#5C6058] shrink-0 font-medium">
                        {c.documentSize || '1.2 MB'}
                      </span>
                    </div>
                  )}

                  {c.signedAt && (
                    <div className="text-[11px] text-[#5C6058] border-t border-[#FAD7BC]/80 pt-2">
                      Firmado por {c.signedBy || 'Familiar tutor'} el {c.signedAt}
                    </div>
                  )}

                  {isPending && (
                    <button
                      type="button"
                      onClick={() => openConsentSignModal(c)}
                      className="touch-target w-full py-2.5 px-4 rounded-2xl bg-[#068591] text-white font-bold text-xs shadow-xs hover:bg-[#056c76] active:scale-[0.99] transition-all text-center"
                    >
                      Revisar y firmar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Si se filtra por consentimientos y no hay ninguno en esta fecha */}
      {activeTypeFilter === 'consentimientos' && dateConsents.length === 0 && (
        <div className="bg-white p-8 rounded-3xl border border-[#DEDBD1] text-center space-y-2">
          <div className="font-bold text-sm text-[#292A24]">Sin autorizaciones en esta fecha</div>
          <div className="text-xs text-[#5C6058]">
            No hay consentimientos ni solicitudes de firma para {formattedDateLabel.toLowerCase()}.
          </div>
        </div>
      )}

      {/* 6. VISTA: MEDICACIÓN */}
      {(activeTypeFilter === 'medicacion_actividad' || activeTypeFilter === 'todo') && (
        <div className="space-y-2.5">
          <div className="px-1 pt-1">
            <h3 className="text-sm font-bold text-[#292A24]">
              Medicación del día
            </h3>
          </div>

          <div className="space-y-2">
            {dateMedications.map(med => {
              const isCompleted = med.status === 'administrado';
              return (
                <div
                  key={med.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#DEDBD1] flex items-center justify-between shadow-2xs"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="font-bold text-sm text-[#292A24] truncate">
                      {med.name}
                    </h4>
                    <p className="text-xs text-[#5C6058] mt-0.5">
                      {med.dose} · {med.instructions}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#DFF3E7] text-[#1E7A4C] border border-[#B3E5C8]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{med.time}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#FEF3EB] text-[#9A5B12] border border-[#FAD7BC]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{med.time}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. VISTA: CUIDADOS Y ACTIVIDADES */}
      {(activeTypeFilter === 'medicacion_actividad' || activeTypeFilter === 'todo') && (
        <div className="space-y-2.5 pt-2">
          <div className="px-1">
            <h3 className="text-sm font-bold text-[#292A24]">
              Cuidados y actividades
            </h3>
          </div>

          <div className="space-y-2.5">
            {dateActivities.map(act => (
              <div
                key={act.id}
                className="bg-white rounded-2xl p-3.5 border border-[#DEDBD1] space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#075158] bg-[#D9F0F1] px-2 py-0.5 rounded-md">
                      {act.time}
                    </span>
                    <h4 className="font-bold text-sm text-[#292A24]">
                      {act.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-[#5C6058] leading-relaxed">
                  {act.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#5C6058] pt-1 border-t border-[#DEDBD1]/60">
                  <span>{act.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. VISTA: FOTOS Y NOTAS DE CUIDADORES */}
      {(activeTypeFilter === 'fotos_notas' || activeTypeFilter === 'todo') && (
        <div className="space-y-2.5 pt-2">
          <div className="px-1">
            <h3 className="text-sm font-bold text-[#292A24]">
              Fotos y notas de cuidadores
            </h3>
          </div>

          {datePhotosAndNotes.length > 0 ? (
            <div className="space-y-3">
              {datePhotosAndNotes.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4 border border-[#DEDBD1] space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#075158] bg-[#D9F0F1] px-2 py-0.5 rounded-md">
                        {item.time}
                      </span>
                      <h4 className="font-bold text-sm text-[#292A24]">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {item.photoUrl && (
                    <div className="rounded-2xl overflow-hidden border border-[#DEDBD1] shadow-2xs">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover hover:scale-101 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <p className="text-xs text-[#292A24] leading-relaxed">
                    {item.text}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#5C6058] pt-2 border-t border-[#DEDBD1]/60">
                    <span>{item.author}</span>
                    {item.isVoice && (
                      <span className="text-[#068591] font-semibold">Registro de voz</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-[#DEDBD1] text-center text-xs text-[#5C6058]">
              No hay notas ni fotos registradas para esta fecha.
            </div>
          )}
        </div>
      )}

      {/* 9. VISTA: DOCUMENTOS MÉDICOS E HISTORIA CLÍNICA */}
      {(activeTypeFilter === 'documentos_medicos' || (activeTypeFilter === 'todo' && dateClinicalRecords.length > 0)) && (
        <div className="space-y-2.5 pt-2">
          <div className="px-1 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#292A24]">
              Documentos médicos e Historia clínica
            </h3>
            <span className="text-[11px] font-semibold text-[#5C6058]">
              {dateClinicalRecords.length} {dateClinicalRecords.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {dateClinicalRecords.length > 0 ? (
            <div className="space-y-3">
              {dateClinicalRecords.map(doc => (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl p-4 border border-[#DEDBD1] space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-sm text-[#292A24]">
                      {doc.title}
                    </h4>
                    <div className="flex flex-col items-end shrink-0 gap-1 text-right">
                      <span className="text-xs font-bold text-[#5C6058] bg-[#F7F7F8] px-2 py-0.5 rounded-lg border border-[#DEDBD1]">
                        {doc.time}
                      </span>
                      <span className="text-[11px] font-bold text-[#292A24] bg-white px-2 py-0.5 rounded-md border border-[#DEDBD1]">
                        {doc.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {doc.description && (
                    <p className="text-xs text-[#292A24] leading-relaxed">
                      {doc.description}
                    </p>
                  )}

                  {doc.entryType === 'archivo' && doc.fileName && (
                    <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1] flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-xs text-[#292A24] truncate">
                          {doc.fileName}
                        </div>
                        {doc.fileSize && (
                          <div className="text-[11px] text-[#5C6058]">{doc.fileSize} · {doc.fileType?.toUpperCase()}</div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#075158] bg-white px-2.5 py-1 rounded-xl border border-[#DEDBD1]">
                        Adjunto
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-[#5C6058] pt-2 border-t border-[#DEDBD1]/60">
                    <span>Subido por: <strong className="text-[#292A24]">{doc.uploadedByName.replace(/\s*\([^)]*\)/g, '').trim()}</strong></span>
                    <span className="text-[10px] uppercase font-bold text-[#5C6058]">
                      {doc.uploadedByRole === 'familiar' ? 'Familiar' : 'Personal del centro'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-[#DEDBD1] text-center text-xs text-[#5C6058]">
              No hay documentos médicos registrados para el {formattedDateLabel}.
            </div>
          )}
        </div>
      )}

      {/* Empty State for specific filters */}
      {activeTypeFilter === 'consentimientos' && dateConsents.length === 0 && (
        <div className="bg-white p-8 rounded-3xl border border-[#DEDBD1] text-center space-y-2">
          <div className="font-bold text-sm text-[#292A24]">No hay consentimientos</div>
          <div className="text-xs text-[#5C6058]">No se solicitaron autorizaciones para el {formattedDateLabel}.</div>
        </div>
      )}

      {activeTypeFilter === 'documentos_medicos' && dateClinicalRecords.length === 0 && (
        <div className="bg-white p-8 rounded-3xl border border-[#DEDBD1] text-center space-y-2">
          <div className="font-bold text-sm text-[#292A24]">No hay documentos médicos</div>
          <div className="text-xs text-[#5C6058]">No se han registrado recetas, analíticas ni notas clínicas para el {formattedDateLabel}.</div>
        </div>
      )}

      {activeTypeFilter === 'fotos_notas' && datePhotosAndNotes.length === 0 && (
        <div className="bg-white p-8 rounded-3xl border border-[#DEDBD1] text-center space-y-2">
          <div className="font-bold text-sm text-[#292A24]">No hay fotos ni notas</div>
          <div className="text-xs text-[#5C6058]">El equipo asistencial no ha registrado notas ni fotografías para el {formattedDateLabel}.</div>
        </div>
      )}
    </div>
  );
};
