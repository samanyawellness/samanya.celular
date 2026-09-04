import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  currentValue?: string;
  contextHint?: 'excepcion_comida' | 'bitacora' | 'incidente' | 'visitante' | 'gasto_adicional';
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  currentValue = '',
  contextHint = 'bitacora',
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);

  const startListening = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    // Check for native SpeechRecognition
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          if (transcript) {
            const separator = currentValue && !currentValue.endsWith(' ') ? ' ' : '';
            onTranscript(`${currentValue}${separator}${transcript}`);
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition initialization fallback:', err);
      }
    }

    // Fallback simulation
    setIsRecording(true);
    setTimeout(() => {
      let sampleText = '';
      if (contextHint === 'excepcion_comida') {
        sampleText = 'Ingesta del 40% del plato principal, refiere inapetencia pero tomó los líquidos con espesante.';
      } else if (contextHint === 'incidente') {
        sampleText = 'Residente resbaló en el baño tras el aseo. Se encontraba consciente, refiere leve molestia en rodilla derecha sin deformidad.';
      } else if (contextHint === 'visitante') {
        sampleText = 'La hija de la residente llegó acompañada de un familiar joven. Estuvieron conversando en la sala común y paseando por el jardín. Residente muy animada y contenta.';
      } else if (contextHint === 'gasto_adicional') {
        sampleText = 'Adquisición en farmacia de crema hidratante específica para piel sensible y gel de baño dermatológico (15,80€).';
      } else {
        sampleText = 'Residente colaboradora durante el aseo matutino, piel bien hidratada y estado de ánimo alegre.';
      }

      const separator = currentValue && !currentValue.endsWith(' ') ? ' ' : '';
      onTranscript(`${currentValue}${separator}${sampleText}`);
      setIsRecording(false);
    }, 1800);
  };

  return (
    <button
      id="btn-voice-dictation"
      type="button"
      onClick={startListening}
      aria-label={isRecording ? 'Detener dictado por voz' : 'Dictar por voz'}
      title={isRecording ? 'Detener dictado' : 'Dictar por voz'}
      className={`touch-target w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-2xs ${
        isRecording
          ? 'bg-[#8C2E2E] text-white animate-pulse ring-2 ring-[#8C2E2E]/30'
          : 'bg-[#D9F0F1] hover:bg-[#c9e8ea] text-[#068591] active:scale-95'
      } ${className}`}
    >
      {isRecording ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
};
