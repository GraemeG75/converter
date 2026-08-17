import type { CategoryDefinition } from './types';

export const dataCategory: CategoryDefinition = {
  id: 'data',
  name: 'Data Storage & Size',
  icon: 'hard-drive',
  description: 'Convert digital storage units (SI decimal & IEC binary prefixes).',
  defaultFromUnit: 'gb',
  defaultToUnit: 'mb',
  defaultInputValue: '16',
  units: [
    { id: 'bit', name: 'Bits', symbol: 'b', ratioToBase: 0.125, category: 'data' },
    { id: 'byte', name: 'Bytes', symbol: 'B', ratioToBase: 1, category: 'data' },
    { id: 'kb', name: 'Kilobytes (1000 B)', symbol: 'KB', ratioToBase: 1000, category: 'data' },
    { id: 'mb', name: 'Megabytes (1000 KB)', symbol: 'MB', ratioToBase: 1e6, category: 'data' },
    { id: 'gb', name: 'Gigabytes (1000 MB)', symbol: 'GB', ratioToBase: 1e9, category: 'data' },
    { id: 'tb', name: 'Terabytes (1000 GB)', symbol: 'TB', ratioToBase: 1e12, category: 'data' },
    { id: 'pb', name: 'Petabytes (1000 TB)', symbol: 'PB', ratioToBase: 1e15, category: 'data' },
    { id: 'kib', name: 'Kibibytes (1024 B)', symbol: 'KiB', ratioToBase: 1024, category: 'data' },
    { id: 'mib', name: 'Mebibytes (1024 KiB)', symbol: 'MiB', ratioToBase: 1048576, category: 'data' },
    { id: 'gib', name: 'Gibibytes (1024 MiB)', symbol: 'GiB', ratioToBase: 1073741824, category: 'data' },
    { id: 'tib', name: 'Tebibytes (1024 GiB)', symbol: 'TiB', ratioToBase: 1099511627776, category: 'data' }
  ]
};

export const dataRateCategory: CategoryDefinition = {
  id: 'data_rate',
  name: 'Data Transfer Rate',
  icon: 'wifi',
  description: 'Convert network bandwidth and transfer speeds.',
  defaultFromUnit: 'mbps',
  defaultToUnit: 'mbs',
  defaultInputValue: '100',
  hasVisualizer: true,
  visualizerType: 'transfer',
  units: [
    { id: 'bps', name: 'Bits per second', symbol: 'bps', ratioToBase: 1, category: 'data_rate' },
    { id: 'kbps', name: 'Kilobits per second (Kbps)', symbol: 'Kbps', ratioToBase: 1e3, category: 'data_rate' },
    { id: 'mbps', name: 'Megabits per second (Mbps)', symbol: 'Mbps', ratioToBase: 1e6, category: 'data_rate' },
    { id: 'gbps', name: 'Gigabits per second (Gbps)', symbol: 'Gbps', ratioToBase: 1e9, category: 'data_rate' },
    { id: 'bys', name: 'Bytes per second', symbol: 'B/s', ratioToBase: 8, category: 'data_rate' },
    { id: 'kbs', name: 'Kilobytes per second (KB/s)', symbol: 'KB/s', ratioToBase: 8000, category: 'data_rate' },
    { id: 'mbs', name: 'Megabytes per second (MB/s)', symbol: 'MB/s', ratioToBase: 8e6, category: 'data_rate' },
    { id: 'gbs', name: 'Gigabytes per second (GB/s)', symbol: 'GB/s', ratioToBase: 8e9, category: 'data_rate' }
  ]
};

export function calculateTransferTime(fileSizeBytes: number, speedBytesPerSec: number): string {
  if (speedBytesPerSec <= 0) return 'Infinite / Unknown';
  const totalSeconds = fileSizeBytes / speedBytesPerSec;
  if (totalSeconds < 1) return `${(totalSeconds * 1000).toFixed(0)} ms`;
  
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const parts: string[] = [];
  if (hrs > 0) parts.push(`${hrs} hr${hrs > 1 ? 's' : ''}`);
  if (mins > 0) parts.push(`${mins} min${mins > 1 ? 's' : ''}`);
  parts.push(`${secs} sec${secs !== 1 ? 's' : ''}`);

  return parts.join(' ');
}
