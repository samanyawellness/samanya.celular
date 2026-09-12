import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Filter,
  User,
  Users,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Pill,
  Utensils,
  Palette,
  HeartPulse,
  Droplets,
  Search,
  Check,
  X
} from 'lucide-react';
import { TaskItem } from '../../types';

interface EntityFilter {
  type: 'todos' | 'trabajador' | 'residente';
  id?: string;
  name?: string;
}

export const AdminTasksScreen: React.FC = () => {
  const {
    tasks,
    residents,
    staffWorkers,
    setSelectedTaskForAdminDetail,
    adminTasksStatusFilter,
    setAdminTasksStatusFilter
  } = useApp();

  const statusFilter = adminTasksStatusFilter;
  const setStatusFilter = setAdminTasksStatusFilter;

  const [entityFilter, setEntityFilter] = useState<EntityFilter>({ type: 'todos' });
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterMenuStep, setFilterMenuStep] = useState<'main' | 'workers' | 'residents'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterDropdownOpen(false);
        setFilterMenuStep('main');
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  // Workers list for the filter
  const workersList = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    const seen = new Set<string>();

    staffWorkers.forEach(sw => {
      if (!seen.has(sw.name)) {
        seen.add(sw.name);
        list.push({ id: sw.id, name: sw.name });
      }
    });

    tasks.forEach(t => {
      if (t.completedByWorkerName && !seen.has(t.completedByWorkerName)) {
        seen.add(t.completedByWorkerName);
        list.push({ id: t.completedByWorkerName, name: t.completedByWorkerName });
      }
      if (t.assignedWorkerName && !seen.has(t.assignedWorkerName)) {
        seen.add(t.assignedWorkerName);
        list.push({ id: t.assignedWorkerName, name: t.assignedWorkerName });
      }
    });

    return list;
  }, [staffWorkers, tasks]);

  // Residents list for the filter
  const residentsList = useMemo(() => {
    const list: { id: string; name: string }[] = [
      { id: 'grupal', name: 'Grupal (Comedor / Sala)' }
    ];
    const seen = new Set<string>();

    residents.forEach(r => {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        list.push({ id: r.id, name: r.name });
      }
    });

    tasks.forEach(t => {
      if (t.residentId && !seen.has(t.residentId)) {
        seen.add(t.residentId);
        list.push({ id: t.residentId, name: t.residentName || t.residentId });
      }
    });

    return list;
  }, [residents, tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Status
      if (statusFilter === 'pendientes' && task.status !== 'pendiente') return false;
      if (statusFilter === 'completadas' && task.status !== 'completada') return false;

      // 2. Entity filter (Worker or Resident)
      if (entityFilter.type === 'trabajador' && entityFilter.name) {
        const matchesWorker =
          task.completedByWorkerName === entityFilter.name ||
          task.assignedWorkerName === entityFilter.name;
        if (!matchesWorker) return false;
      } else if (entityFilter.type === 'residente') {
        if (entityFilter.id === 'grupal') {
          if (task.scope !== 'grupal') return false;
        } else {
          const matchesResident =
            task.residentId === entityFilter.id ||
            task.residentName === entityFilter.name ||
            (task.title && entityFilter.name && task.title.toLowerCase().includes(entityFilter.name.toLowerCase()));
          if (!matchesResident) return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          task.title.toLowerCase().includes(q) ||
          (task.residentName && task.residentName.toLowerCase().includes(q)) ||
          (task.completedByWorkerName && task.completedByWorkerName.toLowerCase().includes(q)) ||
          (task.assignedWorkerName && task.assignedWorkerName.toLowerCase().includes(q)) ||
          (task.medicationDetails?.drugName && task.medicationDetails.drugName.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, entityFilter, searchQuery]);

  // Group by time slots (Mañana, Tarde, Noche)
  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: TaskItem[] } = {
      'Mañana': [],
      'Tarde': [],
      'Noche': []
    };

    filteredTasks.forEach(task => {
      const match = task.time.match(/(\d{1,2}):(\d{2})/);
      let slot = 'Mañana';
      if (match) {
        const hour = parseInt(match[1], 10);
        if (hour >= 7 && hour < 15) slot = 'Mañana';
        else if (hour >= 15 && hour < 21) slot = 'Tarde';
        else slot = 'Noche';
      }
      if (!groups[slot]) {
        groups[slot] = [];
      }
      groups[slot].push(task);
    });

    const result: { [key: string]: TaskItem[] } = {};
    (['Mañana', 'Tarde', 'Noche'] as const).forEach(slot => {
      if (groups[slot] && groups[slot].length > 0) {
        result[slot] = groups[slot];
      }
    });

    return result;
  }, [filteredTasks]);

  // Icon config helper for all tasks
  const getTaskVisual = (task: TaskItem) => {
    const titleLower = task.title.toLowerCase();

    if (
      task.type === 'medicacion' ||
      titleLower.includes('insulina') ||
      titleLower.includes('mg') ||
      titleLower.includes('curación') ||
      titleLower.includes('pastilla')
    ) {
      return {
        icon: Pill,
        bg: 'bg-[#D9F0F1]',
        textColor: 'text-[#068591]',
        border: 'border-[#068591]/20'
      };
    }

    if (
      task.type === 'alimentacion' ||
      titleLower.includes('almuerzo') ||
      titleLower.includes('comida') ||
      titleLower.includes('desayuno') ||
      titleLower.includes('merienda') ||
      titleLower.includes('cena')
    ) {
      return {
        icon: Utensils,
        bg: 'bg-[#FEF7EE]',
        textColor: 'text-[#C68A3D]',
        border: 'border-[#C68A3D]/20'
      };
    }

    if (
      task.type === 'actividad' ||
      titleLower.includes('taller') ||
      titleLower.includes('cognitiva') ||
      titleLower.includes('estimulación') ||
      titleLower.includes('reminiscencia')
    ) {
      return {
        icon: Palette,
        bg: 'bg-[#FDF2F4]',
        textColor: 'text-[#C03761]',
        border: 'border-[#C03761]/20'
      };
    }

    if (
      task.type === 'fisioterapia' ||
      titleLower.includes('marcha') ||
      titleLower.includes('movilización') ||
      titleLower.includes('signos vitales') ||
      titleLower.includes('tensión')
    ) {
      return {
        icon: HeartPulse,
        bg: 'bg-[#F4ECFB]',
        textColor: 'text-[#7E38B7]',
        border: 'border-[#7E38B7]/20'
      };
    }

    if (
      task.type === 'higiene' ||
      titleLower.includes('higiene') ||
      titleLower.includes('aseo') ||
      titleLower.includes('baño') ||
      titleLower.includes('postural')
    ) {
      return {
        icon: Droplets,
        bg: 'bg-[#EAF3FA]',
        textColor: 'text-[#2C6ECB]',
        border: 'border-[#2C6ECB]/20'
      };
    }

    return {
      icon: CheckCircle2,
      bg: 'bg-[#DFF3E7]',
      textColor: 'text-[#1E7A4C]',
      border: 'border-[#1E7A4C]/20'
    };
  };

  // Extract resident name and specific task name
  const parseTaskTitles = (task: TaskItem) => {
    if (task.scope === 'grupal') {
      const residentDisplay = task.residentCount
        ? `Grupal (${task.residentCount} Residentes)`
        : 'Grupal (Comedor / Sala)';
      return {
        residentName: residentDisplay,
        taskName: task.title,
        isGrupal: true
      };
    }

    let residentName = task.residentName || '';
    let taskName = task.title;

    if (task.title.includes('—')) {
      const parts = task.title.split('—');
      if (!residentName) residentName = parts[0].trim();
      taskName = parts[1].trim();
    } else if (task.title.includes(' - ')) {
      const parts = task.title.split(' - ');
      if (!residentName) residentName = parts[0].trim();
      taskName = parts[1].trim();
    } else if (residentName && task.title.toLowerCase().startsWith(residentName.toLowerCase())) {
      taskName =
        task.title.slice(residentName.length).replace(/^[\s—\-:]+/, '').trim() || task.title;
    }

    if (!residentName) {
      residentName = 'Residente asignado';
    }

    return {
      residentName,
      taskName,
      isGrupal: false
    };
  };

  const activeFilterLabel =
    entityFilter.type === 'todos'
      ? 'Filtrar'
      : entityFilter.name?.split(' ')[0] || 'Filtro';

  return (
    <div className="space-y-4 pb-24 px-4 sm:px-5 max-w-lg mx-auto pt-1">
      {/* Header */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-[#292A24]">
          Supervisión de Tareas
        </h2>
      </div>

      {/* Search Input & Dropdown Filter Row */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5C6058] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tarea, medicamento..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#DEDBD1] rounded-2xl text-xs text-[#292A24] placeholder:text-[#5C6058]/60 focus:outline-none focus:border-[#068591] shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="touch-target absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C6058] hover:text-[#292A24] p-1"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filter by Worker or Resident */}
        <div ref={filterRef} className="relative shrink-0">
          <button
            type="button"
            id="btn-filter-dropdown"
            onClick={() => {
              setIsFilterDropdownOpen(!isFilterDropdownOpen);
              setFilterMenuStep('main');
            }}
            aria-expanded={isFilterDropdownOpen}
            aria-haspopup="listbox"
            className={`touch-target flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-2xs ${
              entityFilter.type !== 'todos'
                ? 'bg-[#D9F0F1] border-[#068591] text-[#075158]'
                : 'bg-white border-[#DEDBD1] text-[#5C6058] hover:border-[#068591]/50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="max-w-[85px] truncate">
              {activeFilterLabel}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isFilterDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Filter Dropdown Popover */}
          {isFilterDropdownOpen && (
            <div
              role="listbox"
              className="absolute right-0 top-[calc(100%+6px)] w-64 bg-white rounded-2xl border border-[#DEDBD1] shadow-xl p-1.5 space-y-1 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
            >
              {filterMenuStep === 'main' && (
                <>
                  {/* Option: Todos */}
                  <button
                    type="button"
                    id="filter-opt-todos"
                    onClick={() => {
                      setEntityFilter({ type: 'todos' });
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`touch-target w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                      entityFilter.type === 'todos'
                        ? 'bg-[#D9F0F1] text-[#075158]'
                        : 'text-[#292A24] hover:bg-[#F7F7F8]'
                    }`}
                  >
                    <span>Todos (sin filtro)</span>
                    {entityFilter.type === 'todos' && <Check className="w-3.5 h-3.5 text-[#068591]" />}
                  </button>

                  <div className="border-t border-[#DEDBD1]/60 my-1" />

                  {/* Option: Por Trabajador */}
                  <button
                    type="button"
                    id="filter-step-workers"
                    onClick={() => setFilterMenuStep('workers')}
                    className="touch-target w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-[#292A24] hover:bg-[#F7F7F8] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#068591]" />
                      <span>Por trabajador</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#5C6058]" />
                  </button>

                  {/* Option: Por Residente */}
                  <button
                    type="button"
                    id="filter-step-residents"
                    onClick={() => setFilterMenuStep('residents')}
                    className="touch-target w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-[#292A24] hover:bg-[#F7F7F8] transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#068591]" />
                      <span>Por residente</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#5C6058]" />
                  </button>
                </>
              )}

              {filterMenuStep === 'workers' && (
                <>
                  <button
                    type="button"
                    onClick={() => setFilterMenuStep('main')}
                    className="touch-target w-full flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-bold text-[#068591] hover:bg-[#D9F0F1]/50 mb-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver</span>
                  </button>

                  {workersList.map((worker) => {
                    const isSelected =
                      entityFilter.type === 'trabajador' && entityFilter.name === worker.name;
                    const count = tasks.filter(
                      t =>
                        t.completedByWorkerName === worker.name ||
                        t.assignedWorkerName === worker.name
                    ).length;

                    return (
                      <button
                        key={worker.id}
                        type="button"
                        id={`filter-worker-${worker.id}`}
                        onClick={() => {
                          setEntityFilter({
                            type: 'trabajador',
                            id: worker.id,
                            name: worker.name
                          });
                          setIsFilterDropdownOpen(false);
                          setFilterMenuStep('main');
                        }}
                        className={`touch-target w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                          isSelected
                            ? 'bg-[#D9F0F1] text-[#075158] font-bold'
                            : 'text-[#292A24] hover:bg-[#F7F7F8]'
                        }`}
                      >
                        <span className="truncate pr-2">{worker.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-[#5C6058] font-normal">({count})</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#068591]" />}
                        </div>
                      </button>
                    );
                  })}
                </>
              )}

              {filterMenuStep === 'residents' && (
                <>
                  <button
                    type="button"
                    onClick={() => setFilterMenuStep('main')}
                    className="touch-target w-full flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-bold text-[#068591] hover:bg-[#D9F0F1]/50 mb-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver</span>
                  </button>

                  {residentsList.map((res) => {
                    const isSelected =
                      entityFilter.type === 'residente' && entityFilter.id === res.id;
                    const count = tasks.filter(t => {
                      if (res.id === 'grupal') return t.scope === 'grupal';
                      return t.residentId === res.id || t.residentName === res.name;
                    }).length;

                    return (
                      <button
                        key={res.id}
                        type="button"
                        id={`filter-resident-${res.id}`}
                        onClick={() => {
                          setEntityFilter({
                            type: 'residente',
                            id: res.id,
                            name: res.name
                          });
                          setIsFilterDropdownOpen(false);
                          setFilterMenuStep('main');
                        }}
                        className={`touch-target w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                          isSelected
                            ? 'bg-[#D9F0F1] text-[#075158] font-bold'
                            : 'text-[#292A24] hover:bg-[#F7F7F8]'
                        }`}
                      >
                        <span className="truncate pr-2">{res.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-[#5C6058] font-normal">({count})</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#068591]" />}
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Indicator Badge (if any filter is selected) */}
      {entityFilter.type !== 'todos' && (
        <div className="flex items-center justify-between bg-[#D9F0F1]/60 border border-[#068591]/30 rounded-xl px-3 py-1.5 text-xs text-[#075158]">
          <span className="font-semibold truncate">
            Filtrando por {entityFilter.type === 'trabajador' ? 'trabajador' : 'residente'}:{' '}
            <strong className="font-bold">{entityFilter.name}</strong>
          </span>
          <button
            type="button"
            onClick={() => setEntityFilter({ type: 'todos' })}
            className="touch-target p-1 hover:bg-[#068591]/15 rounded-full shrink-0 ml-1 text-[#075158]"
            title="Quitar filtro"
            aria-label="Quitar filtro"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter: Status Tabs (Pendientes / Completadas / Todas) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]">
        <button
          type="button"
          onClick={() => setStatusFilter('pendientes')}
          className={`touch-target py-2 px-2 text-xs font-bold rounded-xl transition-all ${
            statusFilter === 'pendientes'
              ? 'bg-white text-[#075158] shadow-2xs'
              : 'text-[#5C6058] hover:text-[#292A24]'
          }`}
        >
          Pendientes ({tasks.filter(t => t.status === 'pendiente').length})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('completadas')}
          className={`touch-target py-2 px-2 text-xs font-bold rounded-xl transition-all ${
            statusFilter === 'completadas'
              ? 'bg-white text-[#1E7A4C] shadow-2xs'
              : 'text-[#5C6058] hover:text-[#292A24]'
          }`}
        >
          Completadas ({tasks.filter(t => t.status === 'completada').length})
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('todas')}
          className={`touch-target py-2 px-2 text-xs font-bold rounded-xl transition-all ${
            statusFilter === 'todas'
              ? 'bg-white text-[#292A24] shadow-2xs'
              : 'text-[#5C6058] hover:text-[#292A24]'
          }`}
        >
          Todas ({tasks.length})
        </button>
      </div>

      {/* Tasks List Grouped by Time */}
      <div className="space-y-4 pt-1">
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#DEDBD1]">
            <CheckCircle2 className="w-10 h-10 text-[#068591] mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold text-[#292A24]">
              No hay tareas con estos filtros
            </p>
            <p className="text-xs text-[#5C6058] mt-1">
              Prueba cambiando el estado o limpiando el filtro.
            </p>
          </div>
        ) : (
          (Object.entries(groupedTasks) as [string, TaskItem[]][]).map(([slot, items]) => (
            <div key={slot} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Clock className="w-3.5 h-3.5 text-[#068591]" />
                <span className="text-xs font-bold text-[#5C6058] uppercase tracking-wider">
                  {slot}
                </span>
              </div>

              <div className="space-y-2">
                {items.map(task => {
                  const isCompleted = task.status === 'completada';
                  const workerName = isCompleted
                    ? task.completedByWorkerName || 'Elena Morales'
                    : task.assignedWorkerName || 'Elena Morales';

                  const visual = getTaskVisual(task);
                  const IconComp = visual.icon;
                  const { residentName, taskName, isGrupal } = parseTaskTitles(task);

                  return (
                    <div
                      key={task.id}
                      id={`task-item-${task.id}`}
                      onClick={() => setSelectedTaskForAdminDetail(task)}
                      className="relative p-3 bg-white rounded-2xl border border-[#DEDBD1] hover:border-[#068591]/50 shadow-2xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      {/* Top right status tag when filtered by 'todas' */}
                      {statusFilter === 'todas' && (
                        <div className="absolute top-2.5 right-3 z-10">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-2xs ${
                              isCompleted
                                ? 'bg-[#DFF3E7] text-[#1E7A4C] border border-[#1E7A4C]/20'
                                : 'bg-[#FEF7EE] text-[#9A5B12] border border-[#C68A3D]/20'
                            }`}
                          >
                            {isCompleted ? 'Completada' : 'Pendiente'}
                          </span>
                        </div>
                      )}

                      <div className={`flex items-center gap-3 min-w-0 flex-1 ${statusFilter === 'todas' ? 'pr-16' : ''}`}>
                        {/* Task Icon */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${visual.bg} ${visual.textColor} ${visual.border}`}
                        >
                          <IconComp className="w-4.5 h-4.5" />
                        </div>

                        {/* Title & Metadata with smaller font hierarchy */}
                        <div className="min-w-0 flex-1">
                          {/* Line 1: Resident Name */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#292A24] truncate">
                              {residentName}
                            </span>
                            {isGrupal && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#F7F7F8] text-[#5C6058] border border-[#DEDBD1] shrink-0">
                                Grupal
                              </span>
                            )}
                          </div>

                          {/* Line 2: Task Name (Smaller font for fit) */}
                          <p className="text-[11px] font-medium text-[#5C6058] leading-tight truncate mt-0.5">
                            {taskName}
                          </p>

                          {/* Line 3: Time and Worker */}
                          <div className="flex items-center gap-2 flex-wrap mt-1 text-[10px] text-[#5C6058]">
                            <span className="font-semibold text-[#292A24] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#068591]" />
                              <span>{task.time}</span>
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-[#068591] font-semibold truncate">
                              <User className="w-3 h-3 shrink-0" />
                              <span className="truncate">{workerName}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
