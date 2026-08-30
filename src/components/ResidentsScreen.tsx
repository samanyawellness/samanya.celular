import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Search,
  AlertTriangle,
  ChevronRight,
  Users
} from 'lucide-react';

export const ResidentsScreen: React.FC = () => {
  const {
    residents,
    openResidentHub,
    setIsAdmissionModalOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredResidents = residents.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1">
      {/* Top Header & Request Admission Action */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-bold text-[#292A24]">
            Mis residentes
          </h2>
        </div>

        <button
          id="btn-request-admission-plus"
          type="button"
          onClick={() => setIsAdmissionModalOpen(true)}
          className="touch-target w-10 h-10 bg-[#068591] hover:bg-[#056c76] text-white rounded-full shadow-xs active:scale-95 transition-all flex items-center justify-center"
          aria-label="Solicitar alta de residente"
          title="Solicitar alta de residente"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
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
          placeholder="Buscar por nombre o habitación..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-[#DEDBD1] rounded-2xl text-sm text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591] shadow-2xs"
        />
      </div>

      {/* Resident Cards List: Avatar, Name, Room, and Allergy/Risk Alerts */}
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
                <h3 className="text-base font-bold text-[#292A24] truncate">
                  {resident.name}
                </h3>

                <p className="text-xs font-semibold text-[#068591] mt-0.5">
                  {resident.room.startsWith('Habitación') ? resident.room : `Habitación ${resident.room}`} · {resident.bed}
                </p>

                {/* Alerts / Risks / Allergies */}
                {resident.alerts.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
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
          <div className="text-center py-12 text-[#5C6058]">
            <Users className="w-12 h-12 mx-auto text-[#DEDBD1] mb-2" />
            <p className="font-semibold text-base">No se encontraron residentes</p>
            <p className="text-xs mt-1">Intenta con otro término de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

