import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Info, Plus, Trash2, AlertTriangle, Check } from 'lucide-react';

interface FormMedication {
  drugName: string;
  dose: string;
  time: string;
  route: string;
  details?: string;
}

export const RequestResidentAdmissionModal: React.FC = () => {
  const {
    isAdmissionModalOpen,
    setIsAdmissionModalOpen,
    requestResidentAdmission
  } = useApp();

  // 1. Datos básicos
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Femenino');
  const [customGender, setCustomGender] = useState('');
  const [roomPreference, setRoomPreference] = useState('');
  const [bedPreference, setBedPreference] = useState('Cama A');

  // 2. Alertas médicas (chips rápidos seleccionables)
  const defaultAlertOptions = [
    'Riesgo de caídas',
    'Alergia a Penicilina',
    'Alergia a AINEs',
    'Diabético',
    'Hipertensión',
    'Marcapasos',
    'Deterioro cognitivo',
    'Disfagia / Riesgo atragantamiento'
  ];
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [customAlertInput, setCustomAlertInput] = useState('');

  // 3. Movilidad
  const [mobility, setMobility] = useState('Marcha con andador / bastón');
  const mobilityOptions = [
    'Autónomo (sin soporte)',
    'Marcha con andador / bastón',
    'Silla de ruedas con asistencia',
    'Dependiente total / Encamado'
  ];

  // 4. Dieta
  const [diet, setDiet] = useState('Dieta hiposódica (sin sal)');
  const dietOptions = [
    'Dieta basal estándar',
    'Dieta hiposódica (sin sal)',
    'Dieta diabética',
    'Textura triturada / Turmix',
    'Dieta blanda de fácil masticación'
  ];

  // 5. Medicación inicial / habitual
  const [medications, setMedications] = useState<FormMedication[]>([
    {
      drugName: '',
      dose: '1 comprimido',
      time: '09:00 (Desayuno)',
      route: 'Vía oral',
      details: ''
    }
  ]);

  // 6. Contacto del Responsable
  const [responsibleName, setResponsibleName] = useState('');
  const [responsibleRelationship, setResponsibleRelationship] = useState('Hijo/a');
  const [responsiblePhone, setResponsiblePhone] = useState('');
  const [responsibleEmail, setResponsibleEmail] = useState('');

  // 7. Observaciones clínicas
  const [notes, setNotes] = useState('');

  if (!isAdmissionModalOpen) return null;

  const toggleAlert = (alert: string) => {
    if (selectedAlerts.includes(alert)) {
      setSelectedAlerts(selectedAlerts.filter(a => a !== alert));
    } else {
      setSelectedAlerts([...selectedAlerts, alert]);
    }
  };

  const handleAddCustomAlert = () => {
    const trimmed = customAlertInput.trim();
    if (trimmed && !selectedAlerts.includes(trimmed)) {
      setSelectedAlerts([...selectedAlerts, trimmed]);
      setCustomAlertInput('');
    }
  };

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      {
        drugName: '',
        dose: '1 comprimido',
        time: '14:00 (Comida)',
        route: 'Vía oral',
        details: ''
      }
    ]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleUpdateMedication = (index: number, field: keyof FormMedication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !responsibleName.trim() || !responsiblePhone.trim()) return;

    // Filter valid medications
    const validMeds = medications
      .filter(m => m.drugName.trim().length > 0)
      .map(m => ({
        drugName: m.drugName.trim(),
        dose: m.dose.trim() || '1 comprimido',
        time: m.time.trim() || '09:00',
        route: m.route.trim() || 'Vía oral',
        details: m.details?.trim() || undefined
      }));

    requestResidentAdmission({
      fullName: fullName.trim(),
      birthDate: birthDate || '1945-01-01',
      gender: gender === 'Otro' ? (customGender.trim() || 'Otro') : gender,
      roomPreference: roomPreference.trim() || 'Habitación según disponibilidad',
      bedPreference,
      alerts: selectedAlerts,
      mobility,
      diet,
      medications: validMeds,
      responsibleContacts: [
        {
          name: responsibleName.trim(),
          relationship: responsibleRelationship.trim() || 'Hijo/a',
          phone: responsiblePhone.trim(),
          email: responsibleEmail.trim() || 'contacto@familiar.es'
        }
      ],
      notes: notes.trim() || undefined
    });

    // Reset & close
    setFullName('');
    setResponsibleName('');
    setResponsiblePhone('');
    setIsAdmissionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Solicitar alta de nuevo residente"
        className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
          <h3 className="font-bold text-lg text-[#292A24]">
            Solicitar alta de residente
          </h3>
          <button
            id="btn-close-admission-modal"
            type="button"
            onClick={() => setIsAdmissionModalOpen(false)}
            className="touch-target p-1.5 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-[#D9F0F1] p-3.5 rounded-2xl border border-[#068591]/20 flex items-start gap-2.5 text-xs text-[#075158]">
          <Info className="w-4 h-4 text-[#068591] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Flujo de admisión:</strong> Completa los datos médicos y de contacto. Al enviar la solicitud, la dirección revisará y autorizará el ingreso en la plataforma Web.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. DATOS DEL FUTURO RESIDENTE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#5C6058] uppercase tracking-wider">
              1. Datos del futuro residente
            </h4>
            <div>
              <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-res-fullname">
                Nombre y Apellidos completos *
              </label>
              <input
                id="input-res-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Teresa Navarro Soler"
                className="w-full p-3 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] focus:outline-none focus:border-[#068591]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-res-birth">
                  Fecha de nacimiento
                </label>
                <input
                  id="input-res-birth"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="select-res-gender">
                  Género
                </label>
                <select
                  id="select-res-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                >
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
                {gender === 'Otro' && (
                  <input
                    type="text"
                    required
                    value={customGender}
                    onChange={(e) => setCustomGender(e.target.value)}
                    placeholder="Especificar..."
                    className="w-full mt-2 p-2 bg-[#F7F7F8] border border-[#068591] rounded-xl text-xs text-[#292A24] focus:outline-none"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-res-room">
                  Habitación asignada / preferida
                </label>
                <input
                  id="input-res-room"
                  type="text"
                  value={roomPreference}
                  onChange={(e) => setRoomPreference(e.target.value)}
                  placeholder="Ej: Habitación 104"
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="select-res-bed">
                  Cama
                </label>
                <select
                  id="select-res-bed"
                  value={bedPreference}
                  onChange={(e) => setBedPreference(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                >
                  <option value="Cama A">Cama A</option>
                  <option value="Cama B">Cama B</option>
                  <option value="Individual">Habitación individual</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. ALERTAS MÉDICAS Y ASISTENCIALES (Chips seleccionables) */}
          <div className="pt-3 border-t border-[#DEDBD1] space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#5C6058] uppercase tracking-wider">
                2. Alertas médicas y alergias
              </h4>
              <span className="text-[11px] text-[#5C6058]">
                {selectedAlerts.length} seleccionadas
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {defaultAlertOptions.map((alert) => {
                const isSelected = selectedAlerts.includes(alert);
                return (
                  <button
                    key={alert}
                    type="button"
                    onClick={() => toggleAlert(alert)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#FBEAEA] text-[#8C2E2E] border-[#F6C8C8]'
                        : 'bg-[#F7F7F8] text-[#5C6058] border-[#DEDBD1] hover:bg-white'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-[#8C2E2E]" />}
                    <span>{alert}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom alert input */}
            <div className="flex items-center gap-2 pt-1.5">
              <input
                type="text"
                value={customAlertInput}
                onChange={(e) => setCustomAlertInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomAlert();
                  }
                }}
                placeholder="Otra alerta o alergia médica..."
                className="flex-1 p-2 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
              />
              <button
                type="button"
                onClick={handleAddCustomAlert}
                className="px-3 py-2 bg-[#F7F7F8] hover:bg-[#EFECE6] border border-[#DEDBD1] text-xs font-bold text-[#292A24] rounded-xl transition-all"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* 3. MOVILIDAD Y DIETA */}
          <div className="pt-3 border-t border-[#DEDBD1] space-y-3">
            <h4 className="text-xs font-bold text-[#5C6058] uppercase tracking-wider">
              3. Movilidad y Dieta prescrita
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1">
                  Nivel de movilidad y transferencias
                </label>
                <select
                  value={mobility}
                  onChange={(e) => setMobility(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                >
                  {mobilityOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1">
                  Tipo de dieta y alimentación
                </label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                >
                  {dietOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. PLAN DE MEDICACIÓN INICIAL / HABITUAL */}
          <div className="pt-3 border-t border-[#DEDBD1] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#5C6058] uppercase tracking-wider">
                4. Plan de medicación habitual
              </h4>
              <button
                type="button"
                onClick={handleAddMedication}
                className="text-xs font-bold text-[#068591] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir fármaco</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {medications.map((med, idx) => (
                <div key={idx} className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#292A24]">Fármaco #{idx + 1}</span>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(idx)}
                        className="text-[#8C2E2E] hover:bg-[#FBEAEA] p-1 rounded-lg transition-colors"
                        title="Eliminar fármaco"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nombre del fármaco (ej. Enalapril 10mg)"
                      value={med.drugName}
                      onChange={(e) => handleUpdateMedication(idx, 'drugName', e.target.value)}
                      className="p-2 bg-white border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                    />
                    <input
                      type="text"
                      placeholder="Dosis (ej. 1 comprimido)"
                      value={med.dose}
                      onChange={(e) => handleUpdateMedication(idx, 'dose', e.target.value)}
                      className="p-2 bg-white border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Horario (ej. 08:00 Desayuno)"
                      value={med.time}
                      onChange={(e) => handleUpdateMedication(idx, 'time', e.target.value)}
                      className="p-2 bg-white border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                    />
                    <input
                      type="text"
                      placeholder="Vía / Indicaciones (ej. Vía oral)"
                      value={med.route}
                      onChange={(e) => handleUpdateMedication(idx, 'route', e.target.value)}
                      className="p-2 bg-white border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. CONTACTO DEL RESPONSABLE / FAMILIAR */}
          <div className="pt-3 border-t border-[#DEDBD1] space-y-3">
            <h4 className="text-xs font-bold text-[#5C6058] uppercase tracking-wider">
              5. Contacto del Responsable / Familiar
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-resp-name">
                  Nombre del familiar o tutor legal *
                </label>
                <input
                  id="input-resp-name"
                  type="text"
                  required
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  placeholder="Ej: Laura Navarro (Hija)"
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-sm text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-resp-rel">
                    Parentesco
                  </label>
                  <input
                    id="input-resp-rel"
                    type="text"
                    value={responsibleRelationship}
                    onChange={(e) => setResponsibleRelationship(e.target.value)}
                    placeholder="Hijo/a, Cónyuge..."
                    className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-resp-phone">
                    Teléfono de contacto *
                  </label>
                  <input
                    id="input-resp-phone"
                    type="tel"
                    required
                    value={responsiblePhone}
                    onChange={(e) => setResponsiblePhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292A24] mb-1" htmlFor="input-resp-email">
                  Correo electrónico
                </label>
                <input
                  id="input-resp-email"
                  type="email"
                  value={responsibleEmail}
                  onChange={(e) => setResponsibleEmail(e.target.value)}
                  placeholder="familiar@correo.es"
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
                />
              </div>
            </div>
          </div>

          {/* 6. OBSERVACIONES Y NOTAS CLÍNICAS */}
          <div className="pt-3 border-t border-[#DEDBD1] space-y-2">
            <h4 className="text-xs font-bold text-[#5C6058] uppercase tracking-wider">
              6. Observaciones de ingreso
            </h4>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Antecedentes médicos relevantes, hábitos de sueño o indicaciones especiales..."
              className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex flex-col gap-2">
            <button
              id="btn-submit-admission-request"
              type="submit"
              className="touch-target w-full py-3.5 px-6 rounded-2xl bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-sm shadow-xs active:scale-[0.99] transition-all flex items-center justify-center"
            >
              <span>Enviar solicitud completa a Administración</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAdmissionModalOpen(false)}
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
