import type { CategoryDefinition } from './types';

export const cidrSubnetCategory: CategoryDefinition = {
  id: 'cidr_subnet',
  name: 'Subnet & CIDR',
  icon: 'globe',
  description: 'Calculate IPv4 CIDR prefixes, subnet masks, wildcard masks, network/broadcast addresses, and usable host ranges.',
  defaultFromUnit: 'cidr_prefix',
  defaultToUnit: 'subnet_mask',
  defaultInputValue: '192.168.1.1/24',
  hasVisualizer: true,
  visualizerType: 'subnet',
  units: [
    { id: 'cidr_prefix', name: 'CIDR Notation', symbol: 'CIDR', category: 'cidr_subnet' },
    { id: 'subnet_mask', name: 'Subnet Mask', symbol: 'Mask', category: 'cidr_subnet' },
    { id: 'wildcard_mask', name: 'Wildcard Mask', symbol: 'Wildcard', category: 'cidr_subnet' },
    { id: 'network_address', name: 'Network Address', symbol: 'NetID', category: 'cidr_subnet' },
    { id: 'broadcast_address', name: 'Broadcast Address', symbol: 'Bcast', category: 'cidr_subnet' },
    { id: 'usable_range', name: 'Usable Host Range', symbol: 'Hosts', category: 'cidr_subnet' },
    { id: 'total_hosts', name: 'Usable Host Count', symbol: 'Count', category: 'cidr_subnet' },
    { id: 'binary_ip', name: '32-Bit Binary IP', symbol: 'Binary', category: 'cidr_subnet' }
  ]
};

export interface SubnetDetails {
  ipStr: string;
  prefixLen: number;
  ipInt: number;
  maskInt: number;
  wildcardInt: number;
  networkInt: number;
  broadcastInt: number;
  firstHostInt: number;
  lastHostInt: number;
  totalHosts: number;
  usableHosts: number;
  subnetMaskStr: string;
  wildcardMaskStr: string;
  networkStr: string;
  broadcastStr: string;
  usableRangeStr: string;
  binaryIpStr: string;
}

export function parseSubnetInput(input: string): SubnetDetails | null {
  const cleanInput = input.trim();
  let ipStr = '192.168.1.1';
  let prefixLen = 24;

  if (cleanInput.includes('/')) {
    const parts = cleanInput.split('/');
    ipStr = parts[0].trim();
    prefixLen = parseInt(parts[1].trim(), 10);
    if (isNaN(prefixLen) || prefixLen < 0 || prefixLen > 32) prefixLen = 24;
  } else {
    ipStr = cleanInput;
  }

  const ipInt = ipToInt(ipStr);
  if (ipInt === null) return null;

  const maskInt = prefixLen === 0 ? 0 : (0xFFFFFFFF << (32 - prefixLen)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | wildcardInt) >>> 0;

  const usableHosts = prefixLen >= 31 ? (prefixLen === 31 ? 2 : 1) : Math.max(0, (1 << (32 - prefixLen)) - 2);
  const totalHosts = Math.pow(2, 32 - prefixLen);

  const firstHostInt = prefixLen >= 31 ? networkInt : (networkInt + 1) >>> 0;
  const lastHostInt = prefixLen >= 31 ? broadcastInt : (broadcastInt - 1) >>> 0;

  const subnetMaskStr = intToIp(maskInt);
  const wildcardMaskStr = intToIp(wildcardInt);
  const networkStr = intToIp(networkInt);
  const broadcastStr = intToIp(broadcastInt);
  const usableRangeStr = `${intToIp(firstHostInt)} - ${intToIp(lastHostInt)}`;
  const binaryIpStr = intToBinaryDot(ipInt);

  return {
    ipStr,
    prefixLen,
    ipInt,
    maskInt,
    wildcardInt,
    networkInt,
    broadcastInt,
    firstHostInt,
    lastHostInt,
    totalHosts,
    usableHosts,
    subnetMaskStr,
    wildcardMaskStr,
    networkStr,
    broadcastStr,
    usableRangeStr,
    binaryIpStr
  };
}

export function ipToInt(ipStr: string): number | null {
  const octets = ipStr.split('.').map(s => parseInt(s.trim(), 10));
  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
    return null;
  }
  return (((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0);
}

export function intToIp(intVal: number): string {
  const o1 = (intVal >>> 24) & 0xFF;
  const o2 = (intVal >>> 16) & 0xFF;
  const o3 = (intVal >>> 8) & 0xFF;
  const o4 = intVal & 0xFF;
  return `${o1}.${o2}.${o3}.${o4}`;
}

export function intToBinaryDot(intVal: number): string {
  const o1 = ((intVal >>> 24) & 0xFF).toString(2).padStart(8, '0');
  const o2 = ((intVal >>> 16) & 0xFF).toString(2).padStart(8, '0');
  const o3 = ((intVal >>> 8) & 0xFF).toString(2).padStart(8, '0');
  const o4 = (intVal & 0xFF).toString(2).padStart(8, '0');
  return `${o1}.${o2}.${o3}.${o4}`;
}
