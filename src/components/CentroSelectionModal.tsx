import React from 'react';
import { UserCentro } from '../types';
import { Building2, MapPin, CheckCircle2, ArrowRight, Shield, Star, LogOut } from 'lucide-react';

interface CentroSelectionModalProps {
  isOpen: boolean;
  userName: string;
  userRole: string;
  centros: UserCentro[];
  onSelectCentro: (centro: UserCentro) => void;
  onCancel: () => void;
}

export const CentroSelectionModal: React.FC<CentroSelectionModalProps> = ({
  isOpen,
  userName,
  userRole,
  centros,
  onSelectCentro,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E232A] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#DEDBD1] dark:border-gray-700 max-h-[90vh] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9F0F1] dark:bg-[#068591]/20 text-[#068591] dark:text-[#5ce1e6] text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Multi-Sede Asistencial</span>
            </div>
            <button
              onClick={onCancel}
              className="text-xs text-[#5C6058] dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
              title="Cancelar y volver"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>

          <h2 className="text-2xl font-extrabold text-[#292A24] dark:text-white tracking-tight">
            ¿En cuál centro estás laborando hoy?
          </h2>
          <p className="text-sm text-[#5C6058] dark:text-gray-300 mt-1.5 leading-relaxed">
            Hola <strong className="text-[#068591] dark:text-[#5ce1e6]">{userName}</strong>, estás vinculado(a) a{' '}
            <strong>{centros.length} centros</strong> geriátricos. Selecciona en cuál desarrollarás tus actividades en esta jornada:
          </p>
        </div>

        {/* List of Centros */}
        <div className="my-5 space-y-3 overflow-y-auto pr-1 max-h-[50vh]">
          {centros.map((centro) => {
            const isPrincipal = centro.esSedePrincipal;

            return (
              <div
                key={String(centro.idCentro)}
                onClick={() => onSelectCentro(centro)}
                className="group relative cursor-pointer p-4 rounded-2xl border-2 transition-all bg-white dark:bg-[#252C37] border-[#E5E3DC] dark:border-gray-700 hover:border-[#068591] dark:hover:border-[#068591] hover:shadow-md active:scale-[0.99]"
              >
                {/* Indicador de Sede Principal */}
                {isPrincipal && (
                  <div className="absolute -top-2.5 right-4 bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    <span>Sede habitual</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Organización Tag */}
                    <div className="flex items-center gap-1.5 text-xs text-[#068591] dark:text-[#5ce1e6] font-semibold mb-1">
                      <Shield className="w-3 h-3" />
                      <span>{centro.nombreOrganizacion || 'Samanya Senior Living'}</span>
                      <span className="text-[10px] text-gray-400">({centro.codigoOrganizacion})</span>
                    </div>

                    {/* Nombre del Centro */}
                    <h3 className="text-base font-bold text-[#292A24] dark:text-white group-hover:text-[#068591] dark:group-hover:text-[#5ce1e6] transition-colors">
                      {centro.nombreCentro}
                    </h3>

                    {/* Ubicación */}
                    <div className="flex items-center gap-1 text-xs text-[#5C6058] dark:text-gray-300 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{centro.ciudad}{centro.direccion ? ` · ${centro.direccion}` : ''}</span>
                    </div>

                    {/* Rol asignado en esta sede */}
                    {centro.nombreRol && (
                      <div className="mt-2 inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F7F7F8] dark:bg-[#1E232A] text-[#5C6058] dark:text-gray-300 border border-[#DEDBD1] dark:border-gray-600">
                        Rol: {centro.nombreRol}
                      </div>
                    )}
                  </div>

                  {/* Icono de Selección */}
                  <div className="w-9 h-9 rounded-xl bg-[#D9F0F1] dark:bg-[#068591]/20 text-[#068591] dark:text-[#5ce1e6] flex items-center justify-center shrink-0 group-hover:bg-[#068591] group-hover:text-white transition-colors mt-1">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / Nota */}
        <div className="pt-2 border-t border-[#EAE8E1] dark:border-gray-700/60 flex items-center justify-between text-xs text-[#5C6058] dark:text-gray-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#068591]" />
            Podrás cambiar de centro en cualquier momento desde tu perfil
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="font-medium text-[#068591] hover:underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
