import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';
import { ConsentRecord, ConsentStatus } from '../types';

export const ConsentsScreen: React.FC = () => {
  const {
    consents,
    setIsNewConsentModalOpen
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendiente' | 'aprobado' | 'rechazado'>('todos');

  const filteredConsents = consents.filter((c) => {
    if (statusFilter === 'todos') return true;
    return c.status === statusFilter;
  });

  const getStatusBadge = (status: ConsentStatus) => {
    switch (status) {
      case 'aprobado':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DFF3E7] text-[#1E7A4C] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
          </span>
        );
      case 'pendiente':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FBE9D2] text-[#9A5B12] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pendiente de firma
          </span>
        );
      case 'rechazado':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FBEAEA] text-[#8C2E2E] flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-1">
      {/* Header with New Consent Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#292A24]">Consentimientos</h2>
          <p className="text-xs text-[#5C6058]">Gestión y autorizaciones clínicas firmadas</p>
        </div>
        <button
          id="btn-open-new-consent-modal"
          type="button"
          onClick={() => setIsNewConsentModalOpen(true)}
          className="touch-target px-3.5 py-2 bg-[#D9F0F1] hover:bg-[#c6e6e8] text-[#075158] border border-[#068591]/30 rounded-2xl text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#EFECE6] p-1 rounded-2xl border border-[#DEDBD1]">
        {(['todos', 'pendiente', 'aprobado', 'rechazado'] as const).map((filter) => (
          <button
            key={filter}
            id={`filter-consent-${filter}`}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all capitalize ${
              statusFilter === filter
                ? 'bg-white text-[#292A24] shadow-xs'
                : 'text-[#5C6058] hover:text-[#292A24]'
            }`}
          >
            {filter === 'todos' ? 'Todos' : filter === 'pendiente' ? 'Pendientes' : filter === 'aprobado' ? 'Firmados' : 'Rechazados'}
          </button>
        ))}
      </div>

      {/* Consents List */}
      <div className="space-y-3">
        {filteredConsents.map((consent: ConsentRecord) => (
          <div
            key={consent.id}
            className="bg-white p-4 rounded-3xl border border-[#DEDBD1] shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#292A24]">
                    {consent.residentName}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 bg-[#F7F7F8] border border-[#DEDBD1] rounded-md font-semibold text-[#5C6058]">
                    {consent.type}
                  </span>
                </div>
                <div className="text-[11px] text-[#5C6058] mt-0.5">
                  Solicitado el {consent.sentDate}
                </div>
              </div>
              {getStatusBadge(consent.status)}
            </div>

            <p className="text-xs text-[#292A24] bg-[#F7F7F8] p-3 rounded-2xl border border-[#DEDBD1] leading-relaxed">
              {consent.description}
            </p>

            {consent.documentName && (
              <div className="flex items-center gap-2 text-xs text-[#075158] bg-[#D9F0F1]/50 p-2.5 rounded-xl border border-[#068591]/20 font-medium">
                <FileText className="w-4 h-4 text-[#068591]" />
                <span className="truncate">{consent.documentName}</span>
              </div>
            )}

            {/* Recipient status */}
            <div className="text-xs text-[#5C6058] space-y-1 pt-1 border-t border-[#DEDBD1]">
              <div className="flex items-center justify-between">
                <span>Estado de firma:</span>
                {consent.status === 'aprobado' ? (
                  <span className="font-semibold text-[#1E7A4C]">
                    Firmado {consent.responseDate ? `(${consent.responseDate})` : ''}
                  </span>
                ) : consent.status === 'rechazado' ? (
                  <span className="font-semibold text-[#8C2E2E]">
                    Rechazado {consent.responseDate ? `(${consent.responseDate})` : ''}
                  </span>
                ) : (
                  <span className="font-semibold text-[#9A5B12]">
                    Pendiente de firma
                  </span>
                )}
              </div>
              <div>
                <span>Destinatarios: </span>
                <span className="font-semibold text-[#292A24]">
                  {consent.recipients.map(r => `${r.name} (${r.relationship})`).join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredConsents.length === 0 && (
          <div className="text-center py-12 text-[#5C6058]">
            <FileCheck2 className="w-12 h-12 mx-auto text-[#DEDBD1] mb-2" />
            <p className="font-semibold text-base">No hay consentimientos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};
