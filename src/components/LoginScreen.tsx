import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, KeyRound, Mail, ArrowLeft, CheckCircle2, ShieldCheck, Heart, Server, Wifi, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { getApiBaseUrl, testApiHealth } from '../services/api';
import { CentroSelectionModal } from './CentroSelectionModal';

export const LoginScreen: React.FC = () => {
  const {
    login,
    pendingCentroSelection,
    assignedCentros,
    selectActiveCentro,
    cancelCentroSelection,
    currentUser
  } = useApp();
  const [view, setView] = useState<'login' | 'recover'>('login');
  const [email, setEmail] = useState('mrodriguez');
  const [password, setPassword] = useState('Samanya2026*');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverSuccess, setRecoverSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Configuración y diagnóstico del servidor backend
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [testState, setTestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    setServerUrl(getApiBaseUrl());
  }, []);

  const handleTestConnection = async () => {
    setTestState('loading');
    setTestMessage('Probando conexión con el servidor...');
    const result = await testApiHealth(serverUrl);
    if (result.ok) {
      setTestState('success');
      setTestMessage(result.message);
    } else {
      setTestState('error');
      setTestMessage(result.message);
    }
  };

  const handleSaveServerUrl = () => {
    if (serverUrl.trim()) {
      localStorage.setItem('samanya_custom_api_url', serverUrl.trim());
    } else {
      localStorage.removeItem('samanya_custom_api_url');
    }
    setTestState('idle');
    setTestMessage('URL guardada. Puedes volver a probar la conexión.');
  };

  const handleResetServerUrl = () => {
    localStorage.removeItem('samanya_custom_api_url');
    const defaultUrl = getApiBaseUrl();
    setServerUrl(defaultUrl);
    setTestState('idle');
    setTestMessage('Restablecido a la configuración por defecto.');
  };

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
              <p className="text-xs font-bold text-[#075158] uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span>Cuentas de Prueba (Oracle DB)</span>
                <span className="text-[10px] text-[#068591] font-normal">Identificación de Centro</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('mrodriguez');
                    setPassword('Samanya2026*');
                  }}
                  className="text-xs bg-white text-[#075158] font-semibold px-2.5 py-1.5 rounded-xl border border-[#068591]/30 hover:bg-[#D9F0F1] transition-colors"
                  title="Tiene 2 centros: Sede Central y Campestre -> Abre ventana modal"
                >
                  Martha (2 sedes → Modal)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('cramirez');
                    setPassword('Samanya2026*');
                  }}
                  className="text-xs bg-white text-[#075158] font-semibold px-2.5 py-1.5 rounded-xl border border-[#068591]/30 hover:bg-[#D9F0F1] transition-colors"
                  title="Tiene 1 solo centro: Sede Central -> Entra directo"
                >
                  Carlos (1 sede → Directo)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin');
                    setPassword('Samanya2026*');
                  }}
                  className="text-xs bg-white text-[#075158] font-semibold px-2.5 py-1.5 rounded-xl border border-[#068591]/30 hover:bg-[#D9F0F1] transition-colors"
                  title="Tiene 2 sedes activas -> Abre ventana modal"
                >
                  Admin (2 sedes)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('jperez');
                    setPassword('Samanya2026*');
                  }}
                  className="text-xs bg-white text-[#075158] font-semibold px-2.5 py-1.5 rounded-xl border border-[#068591]/30 hover:bg-[#D9F0F1] transition-colors"
                >
                  Javier (Familiar 1 sede)
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

      {/* Selector / Diagnóstico de Conexión al Servidor */}
      <div className="mt-4 mb-2">
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowServerConfig(!showServerConfig)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#068591] bg-white hover:bg-[#D9F0F1] px-3.5 py-2 rounded-full border border-[#068591]/25 shadow-xs transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-[#068591]" />
            <span>Servidor API: {serverUrl ? serverUrl.replace(/^https?:\/\//, '').replace(/\/api\/v1\/?$/, '') : 'Detectando...'}</span>
            <Settings className={`w-3 h-3 text-[#5C6058] transition-transform ${showServerConfig ? 'rotate-90 text-[#068591]' : ''}`} />
          </button>
        </div>

        {showServerConfig && (
          <div className="mt-3 p-4 bg-white rounded-2xl border border-[#DEDBD1] shadow-sm text-left animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#292A24] flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-[#068591]" />
                Conectividad Móvil / Servidor
              </span>
              <button
                type="button"
                onClick={handleResetServerUrl}
                className="text-xs text-[#5C6058] hover:text-[#068591] underline"
              >
                Restablecer
              </button>
            </div>

            <p className="text-xs text-[#5C6058] mb-2.5">
              Si tu teléfono muestra <em>Failed to fetch</em>, comprueba la IP de tu PC y pulsa <strong>Probar Conexión</strong>.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://192.168.1.16:4000/api/v1"
                className="w-full text-xs font-mono px-3 py-2 bg-[#F7F7F8] border border-[#DEDBD1] rounded-xl text-[#292A24] focus:outline-none focus:border-[#068591]"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={testState === 'loading'}
                  onClick={handleTestConnection}
                  className="flex-1 text-xs font-bold py-2 px-3 rounded-xl bg-[#068591] text-white hover:bg-[#056c76] flex items-center justify-center gap-1.5 disabled:opacity-60 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testState === 'loading' ? 'animate-spin' : ''}`} />
                  <span>{testState === 'loading' ? 'Verificando...' : 'Probar Conexión'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveServerUrl}
                  className="text-xs font-bold py-2 px-3 rounded-xl bg-[#F7F7F8] border border-[#DEDBD1] text-[#292A24] hover:bg-[#EAE8E1] transition-colors"
                >
                  Guardar
                </button>
              </div>

              {testState === 'success' && (
                <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-[#DFF3E7] text-[#1E7A4C] text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{testMessage}</span>
                </div>
              )}

              {testState === 'error' && (
                <div className="space-y-1 p-2.5 rounded-xl bg-[#FDE8E8] text-[#9B1C1C] text-xs">
                  <div className="flex items-start gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{testMessage}</span>
                  </div>
                  <p className="text-[11px] text-[#771D1D] pl-5">
                    💡 <strong>Tip:</strong> En Windows, ve a <em>Configuración &gt; Red e Internet &gt; Wi-Fi</em>, haz clic en la red conectada y cámbiala de <em>Pública</em> a <strong>Red Privada</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer accessibility notice */}
      <div className="text-center py-3 text-xs text-[#5C6058] flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#068591]" />
        <span>Acceso seguro protegido · Protocolo sanitario RGPD</span>
      </div>

      {/* Modal interactivo de Selección de Centro (Multi-Sede) */}
      <CentroSelectionModal
        isOpen={pendingCentroSelection}
        userName={currentUser.name || email}
        userRole={currentUser.role}
        centros={assignedCentros}
        onSelectCentro={(centro) => selectActiveCentro(centro)}
        onCancel={cancelCentroSelection}
      />
    </div>
  );
};
