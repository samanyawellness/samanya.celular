import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck2, FileText, CheckCircle2, XCircle, X, ShieldCheck, User, Calendar, AlertTriangle, PenTool, RotateCcw } from 'lucide-react';

export const FamiliarConsentModal: React.FC = () => {
  const {
    isConsentSignModalOpen,
    setIsConsentSignModalOpen,
    consentToSign,
    selectedFamiliarResident,
    signConsent,
    currentUser
  } = useApp();

  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!isConsentSignModalOpen || !consentToSign) return null;

  const residentName = consentToSign.residentName || selectedFamiliarResident?.name || 'Residente';
  const residentRoom = consentToSign.room || selectedFamiliarResident?.room || 'Habitación 102';

  // Canvas drawing functions for interactive digital signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#068591';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  const handleApprove = () => {
    signConsent(consentToSign.id, true);
  };

  const handleReject = () => {
    signConsent(consentToSign.id, false, rejectReason);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="modal-consent-sign"
        className="bg-white w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#DEDBD1] my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DEDBD1] shrink-0">
          <h2 className="text-base font-bold text-[#292A24]">
            Firma de consentimiento
          </h2>
          <button
            type="button"
            onClick={() => setIsConsentSignModalOpen(false)}
            className="touch-target p-1.5 text-[#5C6058] hover:text-[#292A24] rounded-full hover:bg-[#F7F7F8]"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 py-3 space-y-3.5 text-sm">
          {/* Resident Details Card */}
          <div className="bg-[#F7F7F8] p-3.5 rounded-2xl border border-[#DEDBD1] space-y-2">
            <div className="text-xs font-bold text-[#5C6058] uppercase tracking-wide">
              Datos del residente
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#068591]/10 text-[#068591] flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#292A24] text-sm">{residentName}</div>
                  <div className="text-xs text-[#5C6058]">{residentRoom}</div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-[#5C6058]">Fecha de solicitud:</div>
                <div className="font-semibold text-[#292A24]">{consentToSign.sentDate}</div>
              </div>
            </div>
          </div>

          {/* Document Content Box */}
          <div className="border border-[#DEDBD1] rounded-2xl p-4 bg-white space-y-2.5">
            <div className="text-xs font-bold text-[#075158]">
              {consentToSign.type}
            </div>
            <p className="text-xs text-[#292A24] leading-relaxed">
              {consentToSign.description}
            </p>
            <div className="p-3 bg-[#F7F7F8] rounded-xl border border-[#DEDBD1]/70 text-xs text-[#5C6058] leading-normal">
              <strong>Cláusula de conformidad:</strong> El firmante declara actuar en calidad de responsable / tutor legal del residente y manifiesta haber recibido información clara respecto al procedimiento o actividad descrita.
            </div>

            {/* Document attachment if present */}
            {consentToSign.documentName && (
              <div className="flex items-center justify-between p-2.5 bg-[#D9F0F1]/40 rounded-xl border border-[#068591]/20 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#068591]" />
                  <span className="font-semibold text-[#075158] truncate max-w-[200px]">
                    {consentToSign.documentName}
                  </span>
                  <span className="text-[10px] text-[#5C6058]">
                    ({consentToSign.documentSize || 'PDF'})
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#068591]">Adjunto oficial</span>
              </div>
            )}
          </div>

          {/* Form view toggle: either approval with digital signature or rejection justification */}
          {!showRejectForm ? (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#292A24]">
                  <PenTool className="w-3.5 h-3.5 text-[#068591]" />
                  <span>Firma digital del responsable</span>
                </div>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="touch-target text-xs text-[#5C6058] hover:text-[#292A24] flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Borrar trazo</span>
                </button>
              </div>

              {/* Signature Canvas Box */}
              <div className="border-2 border-dashed border-[#DEDBD1] rounded-2xl p-2 bg-[#F7F7F8] flex flex-col items-center justify-center relative touch-none">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={110}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[100px] bg-white rounded-xl cursor-crosshair border border-[#DEDBD1]/60"
                />
                {!hasDrawnSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-[#5C6058]/70 px-4 text-center">
                    Dibuja tu firma aquí con el dedo o ratón
                  </div>
                )}
              </div>

              {!hasDrawnSignature && (
                <div className="text-[11px] text-[#8C2E2E] font-medium flex items-center gap-1 justify-center">
                  <AlertTriangle className="w-3 h-3 text-[#F57C00] shrink-0" />
                  <span>Se requiere dibujar la firma para poder aprobar</span>
                </div>
              )}

              {/* Checkbox agreement */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#5C6058]">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#068591] focus:ring-[#068591]"
                />
                <span>
                  Confirmo que he leído los términos y autorizo la realización del procedimiento en nombre del residente.
                </span>
              </label>
            </div>
          ) : (
            /* Rejection reason form */
            <div className="p-3.5 bg-[#FBEAEA] rounded-2xl border border-[#8C2E2E]/20 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C2E2E]">
                <AlertTriangle className="w-4 h-4" />
                <span>Motivo del rechazo</span>
              </div>
              <p className="text-xs text-[#5C6058]">
                Indica brevemente el motivo para informar al equipo médico y asistencial:
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ej. Deseo consultar primero con el médico de cabecera habitual..."
                className="w-full p-2.5 bg-white border border-[#DEDBD1] rounded-xl text-xs text-[#292A24] focus:outline-none focus:border-[#8C2E2E]"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-3 border-t border-[#DEDBD1] shrink-0 space-y-2">
          {!showRejectForm ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                className="touch-target flex-1 py-3 px-3 rounded-2xl bg-[#FBEAEA] text-[#8C2E2E] font-bold text-xs hover:bg-[#f9dada] transition-all text-center"
              >
                Rechazar
              </button>

              <button
                id="btn-confirm-consent-approval"
                type="button"
                disabled={!agreeTerms || !hasDrawnSignature}
                onClick={handleApprove}
                className="touch-target flex-[2] py-3 px-4 rounded-2xl bg-[#068591] text-white font-bold text-sm shadow-sm hover:bg-[#056c76] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-center"
              >
                Aprobar y Firmar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                className="touch-target flex-1 py-3 px-3 rounded-2xl bg-[#F7F7F8] text-[#5C6058] font-bold text-xs hover:bg-[#EBEBEB] transition-all text-center"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={handleReject}
                className="touch-target flex-[2] py-3 px-4 rounded-2xl bg-[#8C2E2E] text-white font-bold text-sm shadow-sm hover:bg-[#722525] transition-all text-center"
              >
                Confirmar rechazo
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5C6058] pt-1">
            <span>Firma digital con validez asistencial y trazabilidad RGPD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
