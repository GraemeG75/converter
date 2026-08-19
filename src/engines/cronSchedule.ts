import type { CategoryDefinition } from './types';

export const cronScheduleCategory: CategoryDefinition = {
  id: 'cron_schedule',
  name: 'Cron & Schedule',
  icon: 'clock',
  description: 'Convert standard 5-field Cron expressions into human-readable text, Quartz syntax, and next execution timestamps.',
  defaultFromUnit: 'cron_5field',
  defaultToUnit: 'cron_human',
  defaultInputValue: '*/15 9-17 * * 1-5',
  hasVisualizer: true,
  visualizerType: 'cron',
  units: [
    { id: 'cron_5field', name: 'Standard Cron (5-Field)', symbol: 'Cron', category: 'cron_schedule' },
    { id: 'cron_human', name: 'Human Readable Text', symbol: 'Text', category: 'cron_schedule' },
    { id: 'cron_quartz', name: 'Quartz Cron (6-Field)', symbol: 'Quartz', category: 'cron_schedule' },
    { id: 'next_trigger_iso', name: 'Next Trigger (ISO 8601)', symbol: 'ISO', category: 'cron_schedule' },
    { id: 'next_trigger_epoch', name: 'Next Trigger (Epoch Sec)', symbol: 'Epoch', category: 'cron_schedule' },
    { id: 'interval_seconds', name: 'Estimated Interval', symbol: 'Sec', category: 'cron_schedule' }
  ]
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function parseCronExpression(cronStr: string): {
  isValid: boolean;
  humanText: string;
  quartz: string;
  nextTriggers: Date[];
  intervalSec: number;
} {
  const parts = cronStr.trim().split(/\s+/);
  if (parts.length < 5) {
    return {
      isValid: false,
      humanText: 'Invalid Cron (Requires 5 fields: minute hour day-of-month month day-of-week)',
      quartz: 'Invalid Cron',
      nextTriggers: [],
      intervalSec: 0
    };
  }

  const [min, hour, dom, month, dow] = parts;
  const humanText = describeCron(min, hour, dom, month, dow);
  const quartz = `0 ${min} ${hour} ${dom} ${month} ${dow === '*' ? '?' : dow}`;
  const nextTriggers = calculateNextTriggers(min, hour, dom, month, dow, 5);
  const intervalSec = nextTriggers.length >= 2 
    ? Math.round((nextTriggers[1].getTime() - nextTriggers[0].getTime()) / 1000) 
    : 60;

  return {
    isValid: true,
    humanText,
    quartz,
    nextTriggers,
    intervalSec
  };
}

function describeCron(min: string, hour: string, dom: string, month: string, dow: string): string {
  let desc = 'At ';

  // Minutes
  if (min === '*') {
    desc = 'Every minute ';
  } else if (min.startsWith('*/')) {
    desc = `Every ${min.replace('*/', '')} minutes `;
  } else {
    desc = `At minute ${min} `;
  }

  // Hours
  if (hour === '*') {
    desc += 'of every hour';
  } else if (hour.startsWith('*/')) {
    desc += `every ${hour.replace('*/', '')} hours`;
  } else if (hour.includes('-')) {
    desc += `between hours ${hour}`;
  } else {
    desc += `past hour ${hour}`;
  }

  // Day of Month
  if (dom !== '*') {
    desc += `, on day ${dom} of the month`;
  }

  // Month
  if (month !== '*') {
    desc += `, in month ${formatMonth(month)}`;
  }

  // Day of Week
  if (dow !== '*') {
    desc += `, on ${formatDow(dow)}`;
  }

  return desc;
}

function formatMonth(m: string): string {
  const num = parseInt(m, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) return MONTH_NAMES[num - 1];
  return m;
}

function formatDow(d: string): string {
  if (d === '1-5') return 'weekdays (Mon-Fri)';
  if (d === '0,6' || d === '6,0') return 'weekends (Sat-Sun)';
  const num = parseInt(d, 10);
  if (!isNaN(num) && num >= 0 && num <= 6) return DAY_NAMES[num];
  return d;
}

export function calculateNextTriggers(minStr: string, hourStr: string, domStr: string, monthStr: string, dowStr: string, count: number = 5): Date[] {
  const triggers: Date[] = [];
  let current = new Date();
  current.setSeconds(0, 0);

  // Scan up to 10,000 minutes into the future to find matching timestamps
  for (let i = 1; i <= 10000 && triggers.length < count; i++) {
    const candidate = new Date(current.getTime() + i * 60 * 1000);
    const cMin = candidate.getMinutes();
    const cHour = candidate.getHours();
    const cDom = candidate.getDate();
    const cMonth = candidate.getMonth() + 1;
    const cDow = candidate.getDay();

    if (matchField(minStr, cMin) &&
        matchField(hourStr, cHour) &&
        matchField(domStr, cDom) &&
        matchField(monthStr, cMonth) &&
        matchField(dowStr, cDow)) {
      triggers.push(candidate);
    }
  }

  return triggers;
}

function matchField(fieldStr: string, val: number): boolean {
  if (fieldStr === '*') return true;
  if (fieldStr.startsWith('*/')) {
    const step = parseInt(fieldStr.replace('*/', ''), 10);
    return !isNaN(step) && step > 0 && val % step === 0;
  }
  if (fieldStr.includes('-')) {
    const [start, end] = fieldStr.split('-').map(s => parseInt(s, 10));
    return !isNaN(start) && !isNaN(end) && val >= start && val <= end;
  }
  if (fieldStr.includes(',')) {
    const values = fieldStr.split(',').map(s => parseInt(s, 10));
    return values.includes(val);
  }
  const exact = parseInt(fieldStr, 10);
  return exact === val;
}
