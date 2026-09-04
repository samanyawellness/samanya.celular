import React from 'react';
import { Resident } from '../types';
import { ChevronLeft, QrCode, Sparkles } from 'lucide-react';

interface ResidentQRPlaceholderScreenProps {
  resident: Resident;
  onBack: () => void;
}

export const ResidentQRPlaceholderScreen: React.FC<ResidentQRPlaceholderScreenProps> = ({
  resident,
  onBack
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header with Back Navigation */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#DEDBD1] px-1 py-2.5 flex items-center justify-between">
        <button
          id="btn-back-from-qr"
          type="button"
          onClick={onBack}
          className="touch-target min-w-[44px] min-h-[44px] flex items-center gap-1.5 text-[#068591] font-bold text-sm hover:text-[#056c76] active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Ficha del residente</span>
        </button>

        <span className="text-xs font-bold text-[#5C6058] uppercase tracking-wider pr-2">
          Código QR
        </span>
      </div>

      {/* Main Empty / Placeholder Screen Content */}
      <div className="space-y-4 pt-1">
        {/* Resident Summary Chip */}
        <div className="p-3.5 bg-white rounded-2xl border border-[#DEDBD1] flex items-center gap-3 shadow-2xs">
          {resident.avatar ? (
            <img
              src={resident.avatar}
              alt={resident.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#DEDBD1] shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#D9F0F1] text-[#068591] font-bold flex items-center justify-center shrink-0">
              {resident.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm text-[#292A24] truncate">
              {resident.name}
            </h3>
            <p className="text-xs text-[#5C6058]">
              {resident.room.startsWith('Habitación') ? resident.room : `Habitación ${resident.room}`} · {resident.bed}
            </p>
          </div>
        </div>

        {/* Empty / Placeholder State Card */}
        <div className="p-6 bg-white rounded-3xl border border-[#DEDBD1] shadow-2xs text-center flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#D9F0F1] flex items-center justify-center text-[#068591] border border-[#068591]/20 shadow-xs">
            <QrCode className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-xs">
            <h4 className="font-bold text-base text-[#292A24]">
              Código QR del residente
            </h4>
            <p className="text-xs text-[#5C6058] leading-relaxed">
              Esta pantalla está reservada para la visualización, lectura y acciones asociadas al código QR de {resident.name}.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F7F8] border border-[#DEDBD1] text-[11px] font-semibold text-[#5C6058]">
            <Sparkles className="w-3.5 h-3.5 text-[#068591]" />
            <span>Módulo de navegación preparado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
