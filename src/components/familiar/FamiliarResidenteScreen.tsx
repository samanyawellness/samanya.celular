import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClinicalHistorySection } from '../common/ClinicalHistorySection';

export const FamiliarResidenteScreen: React.FC = () => {
  const { selectedFamiliarResident } = useApp();

  // Tab selector state: 'datos_generales' | 'historia_clinica'
  const [activeSection, setActiveSection] = useState<'datos_generales' | 'historia_clinica'>('datos_generales');

  const resident = selectedFamiliarResident;

  // Format birth date nicely
  const formatBirthDate = (dateStr: string, age: number) => {
    if (!dateStr) return `${age} años`;
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const formatted = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      return `${formatted} (${age} años)`;
    } catch {
      return `${dateStr} (${age} años)`;
    }
  };

  if (!resident) {
    return (
      <div className="p-6 text-center text-[#5C6058]">
        No hay residente seleccionado.
      </div>
    );
  }

  // 1. General resident medications plan (General continuous regimen)
  const generalMedications = resident.medications && resident.medications.length > 0
    ? resident.medications
    : [
        {
          id: 'med-plan-1',
          drugName: 'Enalapril 10mg',
          dose: '1 comprimido',
          time: '09:00',
          route: 'Vía oral',
          details: 'Tomar con medio vaso de agua durante el desayuno'
        },
        {
          id: 'med-plan-2',
          drugName: 'Omeprazol 20mg',
          dose: '1 cápsula',
          time: '08:00',
          route: 'Vía oral',
          details: 'En ayunas, 30 minutos antes del desayuno'
        },
        {
          id: 'med-plan-3',
          drugName: 'Paracetamol 1g',
          dose: '1 comprimido',
          time: 'Pauta condicional',
          route: 'Vía oral',
          details: 'Cada 8 horas si presenta dolor o febrícula'
        }
      ];

  // 2. Diet & Food details
  const dietInfo = resident.diet || 'Dieta hiposódica blanda';
  const hydrationInfo = 'Pauta de hidratación asistida · Mínimo 1.5 litros diarios';
  const foodRestrictions = [
    'Baja en sodio / sin sal añadida',
    'Textura de fácil masticación y deglución',
    'Intolerancia leve a la lactosa no procesada'
  ];

  // 3. Regularly scheduled activities
  const regularActivities = [
    {
      title: 'Fisioterapia y mantenimiento motriz',
      schedule: 'Lunes, Miércoles y Viernes · 10:30',
      description: 'Reeducación de la marcha con andador, transferencias y ejercicios de movilidad articular.'
    },
    {
      title: 'Taller de estimulación cognitiva y memoria',
      schedule: 'Martes y Jueves · 11:00',
      description: 'Dinámicas grupales de evocación, cálculo básico, lenguaje y reminiscencia guiada.'
    },
    {
      title: 'Paseo terapéutico y psicomotricidad',
      schedule: 'Diario · 12:15',
      description: 'Caminata asistida en el jardín sensorial de la residencia según climatología.'
    },
    {
      title: 'Taller de musicoterapia y manualidades',
      schedule: 'Viernes · 16:30',
      description: 'Actividad sociocultural orientada al bienestar emocional y relajación.'
    }
  ];

  // 4. Medical Notes & Clinical Alerts
  const medicalAlerts = resident.alerts && resident.alerts.length > 0
    ? resident.alerts
    : ['Riesgo de caída moderado-alto', 'Alergia diagnosticada a la Penicilina'];

  const clinicalNotes = [
    'Alergias conocidas: Alergia a Penicilina y derivados betalactámicos.',
    'Patologías principales: Hipertensión arterial esencial controlada farmacológicamente.',
    'Movilidad y transferencias: ' + (resident.mobility || 'Silla de ruedas con asistencia y andador en trayectos cortos.'),
    'Cuidado dérmico: Aplicación de emulsión hidratante en piernas y brazos tras la higiene matutina.',
    'Protocolo de descanso: Cama articulada con barandilla de seguridad acolchada.'
  ];

  return (
    <div className="space-y-4 pb-28 px-4 sm:px-5 max-w-lg mx-auto pt-1 animate-in fade-in duration-200">
      {/* 1. Selector de pestañas con fondo gris neutral (#EFECE6 / #DEDBD1) */}
      <div className="sticky top-0 z-30 pt-1 pb-1 bg-[#F7F7F8]">
        <div className="flex bg-[#EFECE6] p-1 rounded-2xl border border-[#DEDBD1]">
          <button
            type="button"
            id="tab-datos-generales"
            onClick={() => setActiveSection('datos_generales')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all text-center ${
              activeSection === 'datos_generales'
                ? 'bg-white text-[#292A24] shadow-xs'
                : 'text-[#5C6058] hover:text-[#292A24]'
            }`}
          >
            Datos generales
          </button>
          <button
            type="button"
            id="tab-historia-clinica"
            onClick={() => setActiveSection('historia_clinica')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all text-center ${
              activeSection === 'historia_clinica'
                ? 'bg-white text-[#292A24] shadow-xs'
                : 'text-[#5C6058] hover:text-[#292A24]'
            }`}
          >
            Documentos
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: DATOS GENERALES */}
      {activeSection === 'datos_generales' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* BLOQUE 1: Datos generales */}
          <section className="bg-white rounded-3xl p-5 border border-[#DEDBD1] space-y-4 shadow-2xs">
            <h3 className="font-bold text-base text-[#292A24] border-b border-[#DEDBD1] pb-2">
              Datos generales
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3.5 pb-2">
                {resident.avatar && (
                  <img
                    src={resident.avatar}
                    alt={resident.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#DEDBD1] shadow-2xs shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#5C6058]">Nombre completo</div>
                  <div className="font-bold text-[#292A24] text-base mt-0.5">{resident.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="text-xs font-semibold text-[#5C6058]">Fecha de nacimiento</div>
                  <div className="font-semibold text-[#292A24] mt-0.5">
                    {formatBirthDate(resident.birthDate, resident.age)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#5C6058]">Ubicación en centro</div>
                  <div className="font-semibold text-[#292A24] mt-0.5">
                    {resident.room} · {resident.bed}
                  </div>
                </div>
              </div>

              {/* Contacto del responsable */}
              <div className="pt-2 border-t border-[#DEDBD1]/60 space-y-2">
                <div className="text-xs font-semibold text-[#5C6058]">Contacto del responsable</div>
                {resident.responsible && resident.responsible.length > 0 ? (
                  resident.responsible.map((resp, idx) => (
                    <div key={idx} className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1] space-y-1">
                      <div className="font-bold text-[#292A24]">
                        {resp.name} <span className="font-normal text-xs text-[#5C6058]">({resp.relationship})</span>
                      </div>
                      <div className="text-xs text-[#292A24] font-medium">
                        Teléfono: <span className="font-semibold text-[#075158]">{resp.phone}</span>
                      </div>
                      <div className="text-xs text-[#5C6058]">
                        Email: {resp.email}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1] text-xs text-[#292A24]">
                    <div className="font-bold">Familiar responsable asignado</div>
                    <div className="text-[#5C6058] mt-0.5">Contacto directo registrado en la ficha asistencial.</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* BLOQUE 2: Medicación (Plan actual general) */}
          <section className="bg-white rounded-3xl p-5 border border-[#DEDBD1] space-y-4 shadow-2xs">
            <h3 className="font-bold text-base text-[#292A24] border-b border-[#DEDBD1] pb-2">
              Medicación
            </h3>

            <div className="space-y-2.5">
              {generalMedications.map((med) => (
                <div
                  key={med.id}
                  className="bg-[#F7F7F8] p-3.5 rounded-2xl border border-[#DEDBD1] space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-[#292A24]">
                      {med.drugName}
                    </span>
                    <span className="text-xs font-bold text-[#075158] bg-[#D9F0F1] px-2.5 py-0.5 rounded-lg shrink-0">
                      {med.time}
                    </span>
                  </div>
                  <div className="text-xs text-[#292A24] font-medium">
                    Pauta y dosis: <span className="text-[#5C6058]">{med.dose} ({med.route})</span>
                  </div>
                  {med.details && (
                    <div className="text-xs text-[#5C6058] leading-relaxed">
                      Indicaciones: {med.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* BLOQUE 3: Alimentación / Restricciones alimentarias */}
          <section className="bg-white rounded-3xl p-5 border border-[#DEDBD1] space-y-3.5 shadow-2xs">
            <h3 className="font-bold text-base text-[#292A24] border-b border-[#DEDBD1] pb-2">
              Alimentación y restricciones
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs font-semibold text-[#5C6058]">Pauta dietética principal</div>
                <div className="font-bold text-[#292A24] mt-0.5">{dietInfo}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#5C6058]">Pauta de hidratación</div>
                <div className="text-xs text-[#292A24] font-medium mt-0.5">{hydrationInfo}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#5C6058] mb-1.5">Restricciones y consideraciones</div>
                <ul className="space-y-1.5">
                  {foodRestrictions.map((item, idx) => (
                    <li key={idx} className="text-xs text-[#292A24] bg-[#F7F7F8] px-3 py-2 rounded-xl border border-[#DEDBD1]">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* BLOQUE 4: Actividades programadas regularmente */}
          <section className="bg-white rounded-3xl p-5 border border-[#DEDBD1] space-y-3.5 shadow-2xs">
            <h3 className="font-bold text-base text-[#292A24] border-b border-[#DEDBD1] pb-2">
              Actividades programadas regularmente
            </h3>

            <div className="space-y-2.5">
              {regularActivities.map((act, idx) => (
                <div
                  key={idx}
                  className="bg-[#F7F7F8] p-3.5 rounded-2xl border border-[#DEDBD1] space-y-1.5"
                >
                  <div className="font-bold text-sm text-[#292A24]">
                    {act.title}
                  </div>
                  <div className="text-xs font-semibold text-[#075158]">
                    {act.schedule}
                  </div>
                  <div className="text-xs text-[#5C6058] leading-relaxed">
                    {act.description}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BLOQUE 5: Notas médicas relevantes */}
          <section className="bg-white rounded-3xl p-5 border border-[#DEDBD1] space-y-3.5 shadow-2xs">
            <h3 className="font-bold text-base text-[#292A24] border-b border-[#DEDBD1] pb-2">
              Notas médicas relevantes
            </h3>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-[#5C6058] mb-1.5">Alertas asistenciales activas</div>
                <div className="flex flex-wrap gap-2">
                  {medicalAlerts.map((alert, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold px-3 py-1 rounded-xl bg-[#FEF3EB] text-[#8C2E2E] border border-[#FAD7BC]"
                    >
                      {alert}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#5C6058] mb-1.5">Condiciones y cuidados a tener en cuenta</div>
                <div className="space-y-2">
                  {clinicalNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F7F7F8] p-3 rounded-xl border border-[#DEDBD1] text-xs text-[#292A24] leading-relaxed"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* PESTAÑA 2: HISTORIA CLÍNICA (Mismo componente que Trabajador) */}
      {activeSection === 'historia_clinica' && (
        <ClinicalHistorySection resident={resident} />
      )}
    </div>
  );
};
