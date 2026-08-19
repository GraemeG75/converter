import type { CategoryDefinition } from './types';

export const bitwiseFlagsCategory: CategoryDefinition = {
  id: 'bitwise_flags',
  name: 'Bitwise & Permissions',
  icon: 'shield',
  description: 'Convert Linux octal modes (0755), symbolic permissions (rwxr-xr-x), chmod syntax, integer bitmasks, and flag enums.',
  defaultFromUnit: 'file_mode_octal',
  defaultToUnit: 'file_mode_symbolic',
  defaultInputValue: '0755',
  hasVisualizer: true,
  visualizerType: 'permission',
  units: [
    { id: 'file_mode_octal', name: 'Linux Mode Octal', symbol: 'Octal', category: 'bitwise_flags' },
    { id: 'file_mode_symbolic', name: 'Symbolic Mode', symbol: 'Symbolic', category: 'bitwise_flags' },
    { id: 'chmod_command', name: 'chmod Command', symbol: 'chmod', category: 'bitwise_flags' },
    { id: 'enum_mask', name: 'Enum Bitmask', symbol: 'Enum', category: 'bitwise_flags' },
    { id: 'integer_val', name: 'Decimal Integer', symbol: 'Dec', category: 'bitwise_flags' },
    { id: 'binary_flags', name: '9-Bit Binary', symbol: 'Bin', category: 'bitwise_flags' }
  ]
};

export interface PermissionDetails {
  octal: string;
  symbolic: string;
  chmodCmd: string;
  enumStr: string;
  intVal: number;
  binaryStr: string;
  uRead: boolean;
  uWrite: boolean;
  uExec: boolean;
  gRead: boolean;
  gWrite: boolean;
  gExec: boolean;
  oRead: boolean;
  oWrite: boolean;
  oExec: boolean;
}

export function parsePermissionInput(input: string, fromId: string): PermissionDetails {
  let intVal = 493; // 0755 in decimal

  const clean = input.trim();
  if (fromId === 'file_mode_octal') {
    const octStr = clean.replace(/^0+/, '') || '0';
    const parsed = parseInt(octStr, 8);
    if (!isNaN(parsed)) intVal = parsed;
  } else if (fromId === 'file_mode_symbolic') {
    intVal = parseSymbolicToOctal(clean);
  } else if (fromId === 'chmod_command') {
    const match = clean.match(/(\d{3,4})/);
    if (match) {
      const parsed = parseInt(match[1], 8);
      if (!isNaN(parsed)) intVal = parsed;
    }
  } else if (fromId === 'binary_flags') {
    const cleanBin = clean.replace(/\s+/g, '');
    const parsed = parseInt(cleanBin, 2);
    if (!isNaN(parsed)) intVal = parsed;
  } else {
    const parsed = parseInt(clean, 10);
    if (!isNaN(parsed)) intVal = parsed;
  }

  const uRead = Boolean(intVal & (1 << 8));
  const uWrite = Boolean(intVal & (1 << 7));
  const uExec = Boolean(intVal & (1 << 6));

  const gRead = Boolean(intVal & (1 << 5));
  const gWrite = Boolean(intVal & (1 << 4));
  const gExec = Boolean(intVal & (1 << 3));

  const oRead = Boolean(intVal & (1 << 2));
  const oWrite = Boolean(intVal & (1 << 1));
  const oExec = Boolean(intVal & (1 << 0));

  const octal = '0' + (intVal & 0o777).toString(8).padStart(3, '0');
  const symbolic = [
    uRead ? 'r' : '-', uWrite ? 'w' : '-', uExec ? 'x' : '-',
    gRead ? 'r' : '-', gWrite ? 'w' : '-', gExec ? 'x' : '-',
    oRead ? 'r' : '-', oWrite ? 'w' : '-', oExec ? 'x' : '-'
  ].join('');

  const chmodCmd = `chmod ${octal.substring(1)} filename`;

  const enumParts: string[] = [];
  if (uRead) enumParts.push('USER_READ');
  if (uWrite) enumParts.push('USER_WRITE');
  if (uExec) enumParts.push('USER_EXEC');
  if (gRead) enumParts.push('GROUP_READ');
  if (gWrite) enumParts.push('GROUP_WRITE');
  if (gExec) enumParts.push('GROUP_EXEC');
  if (oRead) enumParts.push('OTHERS_READ');
  if (oWrite) enumParts.push('OTHERS_WRITE');
  if (oExec) enumParts.push('OTHERS_EXEC');
  const enumStr = enumParts.length > 0 ? enumParts.join(' | ') : 'NONE';

  const binaryStr = (intVal & 0o777).toString(2).padStart(9, '0');

  return {
    octal,
    symbolic,
    chmodCmd,
    enumStr,
    intVal,
    binaryStr,
    uRead, uWrite, uExec,
    gRead, gWrite, gExec,
    oRead, oWrite, oExec
  };
}

function parseSymbolicToOctal(sym: string): number {
  if (sym.length < 9) return 0;
  let val = 0;
  if (sym[0] === 'r') val |= (1 << 8);
  if (sym[1] === 'w') val |= (1 << 7);
  if (sym[2] === 'x' || sym[2] === 's') val |= (1 << 6);

  if (sym[3] === 'r') val |= (1 << 5);
  if (sym[4] === 'w') val |= (1 << 4);
  if (sym[5] === 'x' || sym[5] === 's') val |= (1 << 3);

  if (sym[6] === 'r') val |= (1 << 2);
  if (sym[7] === 'w') val |= (1 << 1);
  if (sym[8] === 'x' || sym[8] === 't') val |= (1 << 0);
  return val;
}
