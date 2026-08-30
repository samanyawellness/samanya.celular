import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, toastType } = useApp();

  if (!toastMessage) return null;

  let bgClass = 'bg-[#DFF3E7] text-[#1E7A4C] border-[#1E7A4C]/30';
  let Icon = CheckCircle2;

  if (toastType === 'alert') {
    bgClass = 'bg-[#FBEAEA] text-[#8C2E2E] border-[#8C2E2E]/30';
    Icon = AlertCircle;
  } else if (toastType === 'info') {
    bgClass = 'bg-[#D9F0F1] text-[#075158] border-[#068591]/30';
    Icon = Info;
  }

  return (
    <div
      role="alert"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-in slide-in-from-top-4 fade-in duration-200"
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border ${bgClass} backdrop-blur-sm`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-semibold flex-1 leading-snug">{toastMessage}</p>
      </div>
    </div>
  );
};
