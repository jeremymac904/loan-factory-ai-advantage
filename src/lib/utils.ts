import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTagline(tl: { languages: string[]; specialties: string[]; service_areas: string[] }): string {
  const primaryLang = tl.languages.find((l) => l !== 'English');
  const langPart = primaryLang ? `Your ${primaryLang}-Speaking ` : 'Your ';
  const specPart = tl.specialties.slice(0, 2).join(' & ') + ' Specialist';
  const areaPart = tl.service_areas[0] ? ` in ${tl.service_areas[0]}` : '';
  return `${langPart}${specPart}${areaPart}`;
}

export function formatNMLS(nmls: string): string {
  return `NMLS #${nmls}`;
}

export function statusColor(status: string): string {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800';
    case 'approved': return 'bg-blue-100 text-blue-800';
    case 'pending_review': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-600';
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'published': return 'Live';
    case 'approved': return 'Approved';
    case 'pending_review': return 'Pending Review';
    default: return 'Draft';
  }
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
