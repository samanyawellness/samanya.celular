import { TaskItem, Resident, TaskStatus } from '../types';
import {
  Pill,
  Utensils,
  Activity,
  Sparkles,
  Droplets,
  CheckCircle2,
  LucideIcon
} from 'lucide-react';

/**
 * Parses a time string (e.g. "14:00", "09:30 AM", "14:30 PM") into minutes from midnight (0 to 1439).
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();
  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

export interface RelativeTimeInfo {
  text: string;
  type: 'atrasada' | 'en_curso' | 'proxima' | 'completada';
  badgeClass: string;
  isOverdue: boolean;
}

/**
 * Computes relative time for a task:
 * - "Atrasada · hace [X] min" (in critical red) if expired
 * - Normal time (e.g. "14:45") if in progress / current window
 * - "En [X] min" if scheduled time has not arrived yet
 */
export function getTaskRelativeTime(
  timeStr: string,
  status: TaskStatus,
  referenceMinutes = 14 * 60 + 50 // 14:50 (10 min before end of morning shift 07:00-15:00)
): RelativeTimeInfo {
  const cleanTime = timeStr ? timeStr.replace(/\s*(AM|PM)/i, '') : '--:--';

  if (status === 'completada') {
    return {
      text: cleanTime,
      type: 'completada',
      badgeClass: 'bg-[#DFF3E7] text-[#1E7A4C] border border-[#1E7A4C]/20',
      isOverdue: false
    };
  }

  const taskMinutes = parseTimeToMinutes(timeStr);
  if (taskMinutes === null) {
    return {
      text: cleanTime,
      type: 'en_curso',
      badgeClass: 'bg-[#D9F0F1] text-[#068591] border border-[#068591]/20',
      isOverdue: false
    };
  }

  const diff = taskMinutes - referenceMinutes;

  // If task is in the past by more than 10 minutes: OVERDUE (critical color)
  if (diff < -10) {
    const minutesLate = Math.abs(diff);
    return {
      text: `Atrasada · hace ${minutesLate} min`,
      type: 'atrasada',
      badgeClass: 'bg-[#FBEAEA] text-[#8C2E2E] border border-[#8C2E2E]/30 font-bold',
      isOverdue: true
    };
  }

  // If task is within current window (-10 to +10 minutes): Normal time
  if (diff >= -10 && diff <= 10) {
    return {
      text: cleanTime,
      type: 'en_curso',
      badgeClass: 'bg-[#D9F0F1] text-[#068591] border border-[#068591]/20 font-bold',
      isOverdue: false
    };
  }

  // If task is in the future: "En [X] min"
  const minutesLeft = diff;
  const timeText = minutesLeft >= 120
    ? `En ${Math.round(minutesLeft / 60)} h`
    : `En ${minutesLeft} min`;

  return {
    text: timeText,
    type: 'proxima',
    badgeClass: 'bg-[#D9F0F1] text-[#068591] border border-[#068591]/20 font-semibold',
    isOverdue: false
  };
}

/**
 * Checks if a task is overdue / atrasada.
 * It is overdue if:
 * 1. It is not completed, AND
 * 2. It belongs to a previous date (task.date < currentDate), OR
 * 3. It was scheduled more than 10 minutes before the current shift reference time.
 */
export function isTaskOverdue(
  task: TaskItem,
  currentDate = '2026-08-19',
  referenceMinutes = 14 * 60 + 50
): boolean {
  if (task.status === 'completada') return false;

  // Task from an earlier date is overdue
  if (task.date && task.date < currentDate) {
    return true;
  }

  const taskMinutes = parseTimeToMinutes(task.time);
  if (taskMinutes === null) return false;

  const diff = taskMinutes - referenceMinutes;
  return diff < -10;
}

/**
 * Returns formatted main text according to rule:
 * - Individual: "Nombre del residente — Medicamento/Tarea"
 * - Grupal: "Nombre de la actividad — X residentes"
 * Without separate name tags.
 */
export function formatTaskMainTitle(task: TaskItem, residents: Resident[] = []): string {
  if (task.scope === 'grupal') {
    const count = task.residentCount || 24;
    // Strip redundant suffixes like " — X residentes" if already in title
    const baseTitle = task.title.replace(/\s*—\s*\d+\s*residentes.*/i, '').trim();
    return `${baseTitle} — ${count} residentes`;
  }

  // Individual task
  let residentName = task.residentName || '';
  if (!residentName && task.residentId) {
    const found = residents.find(r => r.id === task.residentId);
    if (found) residentName = found.name;
  }
  if (!residentName) residentName = 'Residente';

  let detailName = '';
  if (task.type === 'medicacion' && task.medicationDetails?.drugName) {
    detailName = task.medicationDetails.drugName;
  } else if (task.title.includes('—')) {
    const parts = task.title.split('—');
    detailName = parts[1].trim();
  } else if (task.title.includes(' - ')) {
    const parts = task.title.split(' - ');
    detailName = parts[1].trim();
  } else if (residentName && task.title.toLowerCase().startsWith(residentName.toLowerCase())) {
    detailName = task.title.slice(residentName.length).replace(/^[\s—\-:]+/, '').trim();
  } else {
    detailName = task.title;
  }

  if (!detailName) detailName = task.title;

  return `${residentName} — ${detailName}`;
}

export interface TaskVisual {
  icon: LucideIcon;
  bg: string;
  textColor: string;
  border: string;
}

/**
 * Category color scheme matching Admin task supervisor design
 */
export function getTaskCategoryVisual(task: TaskItem): TaskVisual {
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
    titleLower.includes('desayuno') ||
    titleLower.includes('merienda') ||
    titleLower.includes('cena') ||
    titleLower.includes('comida')
  ) {
    return {
      icon: Utensils,
      bg: 'bg-[#FBE9D2]',
      textColor: 'text-[#9A5B12]',
      border: 'border-[#9A5B12]/20'
    };
  }

  if (
    (task.type as string) === 'signos_vitales' ||
    titleLower.includes('tensión') ||
    titleLower.includes('constantes') ||
    titleLower.includes('presión') ||
    titleLower.includes('temperatura') ||
    titleLower.includes('glucosa')
  ) {
    return {
      icon: Activity,
      bg: 'bg-[#FBEAEA]',
      textColor: 'text-[#8C2E2E]',
      border: 'border-[#8C2E2E]/20'
    };
  }

  if (
    task.type === 'actividad' ||
    titleLower.includes('taller') ||
    titleLower.includes('musicoterapia') ||
    titleLower.includes('paseo') ||
    titleLower.includes('estimulación')
  ) {
    return {
      icon: Sparkles,
      bg: 'bg-[#F2EAFD]',
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
}
