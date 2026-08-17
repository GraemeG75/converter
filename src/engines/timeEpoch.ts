import type { CategoryDefinition } from './types';

export const timeCategory: CategoryDefinition = {
  id: 'time',
  name: 'Time Duration',
  icon: 'clock',
  description: 'Convert seconds, hours, days, years, and sub-millisecond durations.',
  defaultFromUnit: 'hr',
  defaultToUnit: 'sec',
  defaultInputValue: '24',
  units: [
    { id: 'ns', name: 'Nanoseconds', symbol: 'ns', ratioToBase: 1e-9, category: 'time' },
    { id: 'us', name: 'Microseconds', symbol: 'μs', ratioToBase: 1e-6, category: 'time' },
    { id: 'ms', name: 'Milliseconds', symbol: 'ms', ratioToBase: 0.001, category: 'time' },
    { id: 'sec', name: 'Seconds', symbol: 's', ratioToBase: 1, category: 'time' },
    { id: 'min', name: 'Minutes', symbol: 'min', ratioToBase: 60, category: 'time' },
    { id: 'hr', name: 'Hours', symbol: 'h', ratioToBase: 3600, category: 'time' },
    { id: 'day', name: 'Days', symbol: 'd', ratioToBase: 86400, category: 'time' },
    { id: 'week', name: 'Weeks', symbol: 'wk', ratioToBase: 604800, category: 'time' },
    { id: 'month', name: 'Months (Avg 30.44 d)', symbol: 'mo', ratioToBase: 2629746, category: 'time' },
    { id: 'year', name: 'Years (365.25 d)', symbol: 'yr', ratioToBase: 31557600, category: 'time' },
    { id: 'decade', name: 'Decades', symbol: 'dec', ratioToBase: 315576000, category: 'time' },
    { id: 'century', name: 'Centuries', symbol: 'cent', ratioToBase: 3155760000, category: 'time' }
  ]
};

export interface EpochConversion {
  timestampSec: number;
  timestampMs: number;
  isoString: string;
  utcString: string;
  localString: string;
  relativeDescription: string;
}

export function parseEpochInput(input: string): EpochConversion | null {
  const trimmed = input.trim();
  let ms: number;

  if (!trimmed) {
    ms = Date.now();
  } else if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    // If < 1e11 assume seconds, else milliseconds
    if (num < 1e11) {
      ms = num * 1000;
    } else {
      ms = num;
    }
  } else {
    const parsed = Date.parse(trimmed);
    if (isNaN(parsed)) return null;
    ms = parsed;
  }

  const d = new Date(ms);
  if (isNaN(d.getTime())) return null;

  const now = Date.now();
  const diffSec = Math.floor((ms - now) / 1000);
  let rel = '';
  if (Math.abs(diffSec) < 5) {
    rel = 'Right now';
  } else if (diffSec > 0) {
    rel = `${formatSecondsDuration(diffSec)} in the future`;
  } else {
    rel = `${formatSecondsDuration(Math.abs(diffSec))} ago`;
  }

  return {
    timestampSec: Math.floor(ms / 1000),
    timestampMs: ms,
    isoString: d.toISOString(),
    utcString: d.toUTCString(),
    localString: d.toLocaleString(),
    relativeDescription: rel
  };
}

function formatSecondsDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ${sec % 60}s`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
  return `${Math.floor(sec / 86400)}d ${Math.floor((sec % 86400) / 3600)}h`;
}
