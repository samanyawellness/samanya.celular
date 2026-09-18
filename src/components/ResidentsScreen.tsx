import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  AlertTriangle,
  ChevronRight,
  Users,
  X,
  Building2,
  MapPin,
  ArrowLeftRight,
  ShieldCheck
} from 'lucide-react';

export const ResidentsScreen: React.FC = () => {
  const {
    residents,
    openResidentHub,
    activeCentro,
    assignedCentros,
    switchActiveCentro,
    role
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCentroSelector, setShowCentroSelector] = useState(false);

  // Filtrado estricto de residentes pertenecientes al centro activo
  const centerResidents = activeCentro
    ? residents.filter((r) => {
        const resCentroId =
          r.idCentro !== undefined && r.idCentro !== null
            ? String(r.idCentro)
            : r.id === 'res-4' || r.id === 'res-5' || r.id === '4' || r.id === '5' || r.id === '7' || r.id === '8' || r.id === '9' || r.id === '10'
            ? '2'
            : '1';
        return resCentroId === String(activeCentro.idCentro);
      })
    : residents;

  // Filtrado adicional por texto de búsqueda
  const filteredResidents = centerResidents.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.alerts.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1">
      {/* Centro Activo Context Banner */}
      {activeCentro && (
        <div className="bg-white border border-[#DEDBD1] rounded-2xl p-3 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#068591]/10 border border-[#068591]/20 flex items-center justify-center shrink-0 text-[#068591]">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[#292A24] truncate">
                    {activeCentro.nombreCentro}
                  </span>
                  {activeCentro.esSedePrincipal && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.2 rounded border border-amber-200">
                      Sede Principal
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5C6058] flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0 text-[#068591]" />
                  <span>{activeCentro.ciudad}</span>
                  <span>·</span>
                  <span className="truncate">{activeCentro.nombreOrganizacion}</span>
                </p>
              </div>
            </div>

            {assignedCentros.length > 1 && (
              <button
                type="button"
                id="btn-switch-centro-residents"
                onClick={() => setShowCentroSelector(!showCentroSelector)}
                className="shrink-0 text-xs font-bold text-[#068591] hover:text-[#056d77] bg-[#D9F0F1]/60 hover:bg-[#D9F0F1] px-2.5 py-1.5 rounded-xl border border-[#068591]/20 flex items-center gap-1 transition-all"
                title="Cambiar de centro de trabajo"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cambiar</span>
              </button>
            )}
          </div>

          {/* Quick Centro Selector Dropdown if user has multiple centers */}
          {showCentroSelector && assignedCentros.length > 1 && (
            <div className="mt-3 pt-3 border-t border-[#DEDBD1]/60 space-y-1.5 animate-fadeIn">
              <p className="text-[11px] font-bold text-[#5C6058] uppercase tracking-wider mb-1">
                Seleccionar sede de trabajo:
              </p>
              {assignedCentros.map((centro) => {
                const isCurrent = String(centro.idCentro) === String(activeCentro.idCentro);
                return (
                  <button
                    key={centro.idCentro}
                    type="button"
                    onClick={() => {
                      switchActiveCentro(centro);
                      setShowCentroSelector(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-[#068591] text-white font-bold shadow-2xs'
                        : 'bg-[#F7F7F8] hover:bg-[#EAE8DF] text-[#292A24]'
                    }`}
                  >
                    <div className="truncate min-w-0 pr-2">
                      <p className="truncate">{centro.nombreCentro}</p>
                      <p className={`text-[10px] truncate ${isCurrent ? 'text-white/80' : 'text-[#5C6058]'}`}>
                        {centro.ciudad} · {centro.nombreOrganizacion}
                      </p>
                    </div>
                    {isCurrent && <ShieldCheck className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-bold text-[#292A24]">
            {role === 'admin' ? 'Residentes del Centro' : 'Mis residentes'}
          </h2>
          <p className="text-xs text-[#5C6058] mt-0.5">
            {centerResidents.length}{' '}
            {centerResidents.length === 1 ? 'residente registrado' : 'residentes registrados'}
            {activeCentro ? ` en ${activeCentro.nombreCentro}` : ''}
          </p>
        </div>
      </div>

      {/* Search Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C6058]">
          <Search className="w-5 h-5" />
        </div>
        <input
          id="input-search-residents"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, habitación o alerta..."
          className="w-full pl-11 pr-10 py-3 bg-white border border-[#DEDBD1] rounded-2xl text-sm text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591] shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="touch-target absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5C6058] hover:text-[#292A24]"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Resident Cards List */}
      <div className="space-y-2.5">
        {filteredResidents.map((resident) => (
          <button
            key={resident.id}
            id={`resident-card-${resident.id}`}
            type="button"
            onClick={() => openResidentHub(resident, false)}
            className="touch-target w-full text-left bg-white hover:bg-[#F7F7F8] active:scale-[0.99] p-3.5 sm:p-4 rounded-3xl border border-[#DEDBD1] hover:border-[#068591]/40 shadow-2xs transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {resident.avatar && (
                <img
                  src={resident.avatar}
                  alt={resident.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#DEDBD1] shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[#292A24] truncate">
                    {resident.name}
                  </h3>
                  {resident.nombreCentro && activeCentro?.nombreCentro !== resident.nombreCentro && (
                    <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                      {resident.nombreCentro}
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-[#068591] mt-0.5">
                  {resident.room.startsWith('Habitación') ? resident.room : `Habitación ${resident.room}`} · {resident.bed}
                </p>

                {/* Alerts / Risks / Allergies */}
                {resident.alerts && resident.alerts.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-[#8C2E2E] bg-[#FBEAEA] px-2 py-0.5 rounded-md flex items-center gap-1 truncate max-w-[240px]">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      {resident.alerts.join(' · ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#5C6058] flex-shrink-0 group-hover:text-[#068591] group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}

        {filteredResidents.length === 0 && (
          <div className="text-center py-12 text-[#5C6058] bg-white rounded-3xl border border-[#DEDBD1] p-6 shadow-2xs">
            <Users className="w-12 h-12 mx-auto text-[#DEDBD1] mb-2" />
            <p className="font-semibold text-base text-[#292A24]">No se encontraron residentes</p>
            <p className="text-xs mt-1 text-[#5C6058]">
              {searchQuery
                ? 'Ningún residente coincide con la búsqueda actual.'
                : activeCentro
                ? `No hay residentes asignados en ${activeCentro.nombreCentro}.`
                : 'No hay residentes asignados.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-bold text-[#068591] hover:underline"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
