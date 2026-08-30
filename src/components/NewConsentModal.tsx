import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Paperclip,
  Send,
  X,
  Check
} from 'lucide-react';
import { ConsentType } from '../types';

export const NewConsentModal: React.FC = () => {
  const {
    consents,
    residents,
    selectedResident,
    isNewConsentModalOpen,
    setIsNewConsentModalOpen,
    createConsent
  } = useApp();

  // New Consent Form State
  const [selectedResId, setSelectedResId] = useState<string>('');
  const [residentSearch, setResidentSearch] = useState<string>('');
  const [isResidentDropdownOpen, setIsResidentDropdownOpen] = useState(false);
  const residentDropdownRef = useRef<HTMLDivElement>(null);
  const [consentType, setConsentType] = useState<string>('Procedimiento de enfermería');
  const [customConsentType, setCustomConsentType] = useState<string>('');
  const [consentDescription, setConsentDescription] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('Autorizacion_Clinica.pdf');
  const [selectedRecipientEmails, setSelectedRecipientEmails] = useState<string[]>([]);

  const consentTypesList = [
    'Procedimiento de enfermería',
    'Salida del centro / Excursión',
    'Vacunación o Tratamiento',
    'Uso de contención / Barandillas',
    'Otro'
  ];

  useEffect(() => {
    if (isNewConsentModalOpen) {
      if (selectedResident) {
        setSelectedResId(selectedResident.id);
        setResidentSearch(selectedResident.name);
        const emails = (selectedResident.responsible || []).map(r => r.email);
        setSelectedRecipientEmails(emails);
      } else {
        setSelectedResId('');
        setResidentSearch('');
        setSelectedRecipientEmails([]);
      }
      setConsentDescription('');
      setCustomConsentType('');
      setIsResidentDropdownOpen(false);
    }
  }, [isNewConsentModalOpen, selectedResident, residents]);

  // Handle outside clicks for resident dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (residentDropdownRef.current && !residentDropdownRef.current.contains(event.target as Node)) {
        setIsResidentDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isNewConsentModalOpen) return null;

  const activeResidentForConsent = residents.find(r => r.id === selectedResId);

  const filteredResidents = residents.filter(r => {
    if (!residentSearch.trim()) return true;
    return r.name.toLowerCase().includes(residentSearch.toLowerCase());
  });

  const handleResidentChange = (resId: string) => {
    setSelectedResId(resId);
    const r = residents.find(res => res.id === resId);
    if (r) {
      setResidentSearch(r.name);
      setSelectedRecipientEmails((r.responsible || []).map(resp => resp.email));
    }
    setIsResidentDropdownOpen(false);
  };

  const toggleRecipient = (email: string) => {
    if (selectedRecipientEmails.includes(email)) {
      setSelectedRecipientEmails(prev => prev.filter(e => e !== email));
    } else {
      setSelectedRecipientEmails(prev => [...prev, email]);
    }
  };

  const handleCreateConsentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResId || !consentDescription.trim() || selectedRecipientEmails.length === 0) return;

    const r = residents.find(res => res.id === selectedResId);
    if (!r) return;

    const finalType = consentType === 'Otro' ? (customConsentType.trim() || 'Otro') : consentType;

    const recipients = (r.responsible || [])
      .filter(resp => selectedRecipientEmails.includes(resp.email))
      .map(resp => ({
        name: resp.name,
        relationship: resp.relationship,
        email: resp.email
      }));

    createConsent({
      residentId: r.id,
      type: finalType as ConsentType,
      description: consentDescription.trim(),
      documentName,
      recipients
    });

    setConsentDescription('');
    setCustomConsentType('');
    setIsNewConsentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nuevo consentimiento"
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95"
      >
        {/* Header (Clean, no icon, no subtitle) */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1]">
          <h3 className="font-bold text-base text-[#292A24]">
            Nuevo consentimiento
          </h3>
          <button
            id="btn-close-new-consent-modal"
            type="button"
            onClick={() => setIsNewConsentModalOpen(false)}
            className="touch-target p-1.5 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleCreateConsentSubmit} className="space-y-4">
          {/* 1. Resident Selection with Autocomplete/Search showing names only */}
          <div className="space-y-1.5" ref={residentDropdownRef}>
            <label className="block text-xs font-bold text-[#292A24]" htmlFor="input-consent-resident-search">
              1. Residente destinatario *
            </label>

            <div className="relative">
              <input
                id="input-consent-resident-search"
                type="text"
                required
                value={residentSearch}
                onFocus={() => setIsResidentDropdownOpen(true)}
                onClick={() => setIsResidentDropdownOpen(true)}
                onChange={(e) => {
                  setResidentSearch(e.target.value);
                  setIsResidentDropdownOpen(true);
                }}
                placeholder="Escribe el nombre del residente..."
                className="w-full px-3.5 py-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs font-bold text-[#292A24] focus:outline-none focus:border-[#068591]"
              />

              {/* Dropdown with only names */}
              {isResidentDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-[#DEDBD1] shadow-xl z-20 max-h-40 overflow-y-auto custom-scrollbar divide-y divide-[#DEDBD1]/60">
                  {filteredResidents.length > 0 ? (
                    filteredResidents.map((r) => {
                      const isSelected = selectedResId === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleResidentChange(r.id)}
                          className={`touch-target w-full px-3 py-2 text-left text-xs transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#D9F0F1] font-bold text-[#075158]'
                              : 'text-[#292A24] hover:bg-[#F7F7F8]'
                          }`}
                        >
                          <span>{r.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#068591]" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-2.5 text-[11px] text-[#5C6058] text-center">
                      No se encontraron residentes con ese nombre.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 2. Consent Type with 'Otro' option */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#292A24]" htmlFor="select-consent-type">
              2. Tipo de consentimiento *
            </label>
            <select
              id="select-consent-type"
              value={consentType}
              onChange={(e) => setConsentType(e.target.value)}
              className="w-full p-2.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs font-semibold text-[#292A24] focus:outline-none focus:border-[#068591]"
            >
              {consentTypesList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {consentType === 'Otro' && (
              <div className="mt-1.5 animate-in fade-in">
                <input
                  type="text"
                  required
                  value={customConsentType}
                  onChange={(e) => setCustomConsentType(e.target.value)}
                  placeholder="Escribe el tipo de consentimiento personalizado..."
                  className="w-full p-2.5 bg-[#F7F7F8] border border-[#068591] rounded-xl text-xs text-[#292A24] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* 3. Description or Text */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#292A24]" htmlFor="textarea-consent-desc">
              3. Descripción o cláusula del consentimiento *
            </label>
            <textarea
              id="textarea-consent-desc"
              rows={3}
              required
              value={consentDescription}
              onChange={(e) => setConsentDescription(e.target.value)}
              placeholder="Especifica el alcance del procedimiento, fecha prevista o condiciones autorizadas..."
              className="w-full p-3 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#068591]"
            />
          </div>

          {/* 4. Document Attachment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#292A24]">
              4. Documento adjunto (PDF / Informe clínico)
            </label>
            <div className="p-3 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#075158] font-semibold">
                <Paperclip className="w-4 h-4 text-[#068591]" />
                <span>{documentName}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDocumentName(
                    `Pauta_${consentType.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.pdf`
                  )
                }
                className="text-[#068591] font-bold hover:underline"
              >
                Cambiar archivo
              </button>
            </div>
          </div>

          {/* 5. Select Responsible Recipients */}
          {activeResidentForConsent && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#292A24]">
                5. Destinatarios (Responsables vinculados):
              </label>
              <div className="space-y-2">
                {(activeResidentForConsent.responsible || []).map((resp) => {
                  const isChecked = selectedRecipientEmails.includes(resp.email);
                  return (
                    <button
                      key={resp.email}
                      type="button"
                      onClick={() => toggleRecipient(resp.email)}
                      className={`touch-target w-full p-3 rounded-xl border transition-all text-left flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#D9F0F1] border-[#068591] text-[#075158]'
                          : 'bg-[#F7F7F8] border-[#DEDBD1] text-[#5C6058]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-[#292A24]">{resp.name}</div>
                        <div className="text-[11px] text-[#5C6058]">
                          {resp.relationship} · {resp.email}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-[#068591] border-[#068591] text-white' : 'border-[#DEDBD1] bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              id="btn-send-consent-submit"
              type="submit"
              disabled={
                !consentDescription.trim() ||
                selectedRecipientEmails.length === 0 ||
                (consentType === 'Otro' && !customConsentType.trim())
              }
              className="touch-target w-full py-3.5 px-6 rounded-2xl bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 font-bold text-base shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>Enviar consentimiento digital</span>
            </button>
            <button
              type="button"
              onClick={() => setIsNewConsentModalOpen(false)}
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
