import type { CategoryDefinition } from './types';

// Geohash base32 alphabet
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export interface LatLng {
  lat: number;
  lng: number;
}

export function encodeGeohash(lat: number, lng: number, precision: number = 8): string {
  let idx = 0;
  let bit = 0;
  let evenBit = true;
  let geohash = '';
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;

  while (geohash.length < precision) {
    if (evenBit) {
      const lngMid = (lngMin + lngMax) / 2;
      if (lng >= lngMid) {
        idx = (idx << 1) + 1;
        lngMin = lngMid;
      } else {
        idx = (idx << 1) + 0;
        lngMax = lngMid;
      }
    } else {
      const latMid = (latMin + latMax) / 2;
      if (lat >= latMid) {
        idx = (idx << 1) + 1;
        latMin = latMid;
      } else {
        idx = (idx << 1) + 0;
        latMax = latMid;
      }
    }
    evenBit = !evenBit;

    if (++bit === 5) {
      geohash += BASE32[idx];
      bit = 0;
      idx = 0;
    }
  }

  return geohash;
}

export function decodeGeohash(geohash: string): { lat: number; lng: number } {
  let evenBit = true;
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;

  for (let i = 0; i < geohash.length; i++) {
    const c = geohash[i].toLowerCase();
    const cd = BASE32.indexOf(c);
    if (cd === -1) continue;

    for (let j = 4; j >= 0; j--) {
      const bitN = (cd >> j) & 1;
      if (evenBit) {
        const lngMid = (lngMin + lngMax) / 2;
        if (bitN === 1) lngMin = lngMid;
        else lngMax = lngMid;
      } else {
        const latMid = (latMin + latMax) / 2;
        if (bitN === 1) latMin = latMid;
        else latMax = latMid;
      }
      evenBit = !evenBit;
    }
  }

  return {
    lat: (latMin + latMax) / 2,
    lng: (lngMin + lngMax) / 2
  };
}

export function ddToDms(val: number, isLat: boolean): string {
  const absVal = Math.abs(val);
  const deg = Math.floor(absVal);
  const minFloat = (absVal - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = ((minFloat - min) * 60).toFixed(2);
  const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
  return `${deg}° ${min}' ${sec}" ${dir}`;
}

export function ddToDdm(val: number, isLat: boolean): string {
  const absVal = Math.abs(val);
  const deg = Math.floor(absVal);
  const min = ((absVal - deg) * 60).toFixed(4);
  const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
  return `${deg}° ${min}' ${dir}`;
}

export function ddToUtm(lat: number, lng: number): string {
  // Approximate WGS84 UTM conversion
  const zone = Math.floor((lng + 180) / 6) + 1;
  const hemisphere = lat >= 0 ? 'N' : 'S';
  const radLat = (lat * Math.PI) / 180;
  const k0 = 0.9996;
  const a = 6378137; // WGS84 major axis
  const e = 0.081819191; // eccentricity

  const lngOrigin = (zone - 1) * 6 - 180 + 3;
  const radLngOrigin = (lngOrigin * Math.PI) / 180;
  const radLng = (lng * Math.PI) / 180;

  const N = a / Math.sqrt(1 - e * e * Math.sin(radLat) * Math.sin(radLat));
  const T = Math.tan(radLat) * Math.tan(radLat);
  const C = (e * e / (1 - e * e)) * Math.cos(radLat) * Math.cos(radLat);
  const A = (radLng - radLngOrigin) * Math.cos(radLat);

  const M = a * ((1 - e*e/4 - 3*e*e*e*e/64) * radLat - (3*e*e/8 + 3*e*e*e*e/32) * Math.sin(2*radLat) + (15*e*e*e*e/256) * Math.sin(4*radLat));

  let easting = k0 * N * (A + (1 - T + C) * A * A * A / 6 + (5 - 18 * T + T * T + 72 * C) * Math.pow(A, 5) / 120) + 500000;
  let northing = k0 * (M + N * Math.tan(radLat) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 24 + (61 - 58 * T + T * T) * Math.pow(A, 6) / 720));

  if (lat < 0) northing += 10000000;

  return `${zone}${hemisphere} E:${Math.round(easting)} N:${Math.round(northing)}`;
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): { km: number; miles: number; nmi: number } {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = R * c;
  return {
    km,
    miles: km * 0.621371,
    nmi: km * 0.539957
  };
}

export const coordinatesCategory: CategoryDefinition = {
  id: 'coordinates',
  name: 'Geographic Coordinates',
  icon: 'globe',
  description: 'Convert Decimal Degrees (DD), DMS, DDM, Geohash, and UTM, plus Great-Circle Distance.',
  defaultFromUnit: 'dd',
  defaultToUnit: 'dms',
  defaultInputValue: '37.7749,-122.4194',
  hasVisualizer: true,
  visualizerType: 'coordinate',
  units: [
    { id: 'dd', name: 'Decimal Degrees (DD)', symbol: 'DD', category: 'coordinates' },
    { id: 'dms', name: 'Degrees Minutes Seconds (DMS)', symbol: 'DMS', category: 'coordinates' },
    { id: 'ddm', name: 'Degrees Decimal Minutes (DDM)', symbol: 'DDM', category: 'coordinates' },
    { id: 'geohash', name: 'Geohash', symbol: 'Hash', category: 'coordinates' },
    { id: 'utm', name: 'UTM Grid Coordinate', symbol: 'UTM', category: 'coordinates' }
  ]
};
