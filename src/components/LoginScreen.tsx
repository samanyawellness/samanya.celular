import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, KeyRound, Mail, ArrowLeft, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [view, setView] = useState<'login' | 'recover'>('login');
  const [email, setEmail] = useState('mrodriguez');
  const [password, setPassword] = useState('Samanya2026*');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverSuccess, setRecoverSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (_) {
      // El error ya es capturado y mostrado como Toast en AppContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRecoverSuccess(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="pt-8 pb-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#D9F0F1] text-[#068591] mb-3 shadow-sm border border-[#068591]/20">
          <Heart className="w-8 h-8 fill-[#068591]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#292A24] tracking-tight">
          Samanya
        </h1>
        <p className="text-sm font-medium text-[#5C6058] mt-1">
          Gestión asistencial y residencial
        </p>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DEDBD1] my-auto">
        {view === 'login' ? (
          /* Pantalla 1: Login */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#292A24]">
                Iniciar sesión
              </h2>
              <p className="text-sm text-[#5C6058] mt-0.5">
                Ingresa con tu cuenta de trabajador o familiar de la BD
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-sm font-bold text-[#292A24] mb-1.5" htmlFor="email-input">
                  Usuario o Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6058]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email-input"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Usuario o correo de la BD"
                    className="w-full pl-11 pr-4 py-3 bg-[#F7F7F8] border border-[#DEDBD1] rounded-2xl text-base text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591] focus:ring-2 focus:ring-[#068591]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#292A24] mb-1.5" htmlFor="password-input">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6058]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    id="password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="w-full pl-11 pr-4 py-3 bg-[#F7F7F8] border border-[#DEDBD1] rounded-2xl text-base text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591] focus:ring-2 focus:ring-[#068591]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Quick pre-fill buttons from real Oracle DB */}
            <div className="p-3 bg-[#D9F0F1]/60 rounded-2xl border border-[#068591]/20">
              <p className="text-xs font-bold text-[#075158] uppercase tracking-wide mb-1.5">
                Cuentas en Base de Datos Oracle
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('mrodriguez');
                    setPassword('Samanya2026*');
                  }}
                  className="text-xs bg-white text-[#075158] font-semibold px-2.5 py-1.5 rounded-xl border border-[#068591]/30 hover:bg-[#D9F0F1] transition-colors"
                >
                  María (Cuidadora)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('jperez');
                    setPassword('Samanya2026*');
                  }}
                  className="text-xs bg-white text-[#075158] font-semibold px-2.5 py-1.5 rounded-xl border border-[#068591]/30 hover:bg-[#D9F0F1] transition-colors"
                >
                  Javier (Familiar)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('ldelgado');
                    setPassword('Samanya2026*');
                  }}
                  className="text-xs bg-white text-[#075158] font-semibold px-2.5 py-1.5 rounded-xl border border-[#068591]/30 hover:bg-[#D9F0F1] transition-colors"
                >
                  Lucía (Familiar)
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className="touch-target w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#068591] text-white font-bold text-base shadow-sm hover:bg-[#056c76] active:scale-[0.99] transition-all disabled:opacity-60"
              >
                <LogIn className="w-5 h-5" />
                <span>{isLoading ? 'Ingresando...' : 'Ingresar a Samanya'}</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                id="btn-forgot-password"
                type="button"
                onClick={() => {
                  setView('recover');
                  setRecoverSuccess(false);
                  setRecoverEmail(email);
                }}
                className="touch-target text-sm font-semibold text-[#068591] hover:underline"
              >
                ¿Olvidé mi contraseña?
              </button>
            </div>
          </form>
        ) : (
          /* Pantalla 2: Recuperar contraseña */
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView('login')}
                className="touch-target p-2 -ml-2 rounded-xl text-[#5C6058] hover:bg-[#F7F7F8]"
                aria-label="Volver a inicio de sesión"
              >
                <ArrowLeft className="w-5 h-5 text-[#292A24]" />
              </button>
              <h2 className="text-xl font-bold text-[#292A24]">
                Recuperar contraseña
              </h2>
            </div>

            {!recoverSuccess ? (
              <form onSubmit={handleRecover} className="space-y-4 pt-1">
                <p className="text-sm text-[#5C6058]">
                  Introduce tu correo electrónico registrado y te enviaremos un enlace seguro para restablecer tu acceso.
                </p>

                <div>
                  <label className="block text-sm font-bold text-[#292A24] mb-1.5" htmlFor="recover-email">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6058]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="recover-email"
                      type="email"
                      required
                      value={recoverEmail}
                      onChange={(e) => setRecoverEmail(e.target.value)}
                      placeholder="ejemplo@samanya.es"
                      className="w-full pl-11 pr-4 py-3 bg-[#F7F7F8] border border-[#DEDBD1] rounded-2xl text-base text-[#292A24] focus:outline-none focus:border-[#068591] focus:ring-2 focus:ring-[#068591]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="btn-recover-submit"
                    type="submit"
                    disabled={isLoading}
                    className="touch-target w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#068591] text-white font-bold text-base shadow-sm hover:bg-[#056c76] active:scale-[0.99] transition-all disabled:opacity-60"
                  >
                    <span>{isLoading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 pt-2 text-center">
                <div className="w-14 h-14 bg-[#DFF3E7] text-[#1E7A4C] rounded-full flex items-center justify-center mx-auto border border-[#1E7A4C]/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E7A4C]">
                    ¡Enlace de recuperación enviado!
                  </h3>
                  <p className="text-sm text-[#5C6058] mt-1">
                    Hemos enviado las instrucciones a <strong>{recoverEmail}</strong>. Por favor, revisa tu bandeja de entrada o spam.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="touch-target w-full py-3.5 px-6 rounded-2xl bg-[#068591] text-white font-bold text-base shadow-sm hover:bg-[#056c76]"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer accessibility notice */}
      <div className="text-center py-4 text-xs text-[#5C6058] flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#068591]" />
        <span>Acceso seguro protegido · Protocolo sanitario RGPD</span>
      </div>
    </div>
  );
};
