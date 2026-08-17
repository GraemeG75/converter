import type { CategoryDefinition } from './types';

export const speedCategory: CategoryDefinition = {
  id: 'speed',
  name: 'Speed & Velocity',
  icon: 'gauge',
  description: 'Convert speeds, Mach numbers, knots, and cosmic velocity scales.',
  defaultFromUnit: 'kmh',
  defaultToUnit: 'mph',
  defaultInputValue: '120',
  units: [
    { id: 'ms', name: 'Meters per Second', symbol: 'm/s', ratioToBase: 1, category: 'speed' },
    { id: 'kmh', name: 'Kilometers per Hour', symbol: 'km/h', ratioToBase: 1 / 3.6, category: 'speed' },
    { id: 'mph', name: 'Miles per Hour', symbol: 'mph', ratioToBase: 0.44704, category: 'speed' },
    { id: 'knot', name: 'Knots (Nautical)', symbol: 'kn', ratioToBase: 0.514444, category: 'speed' },
    { id: 'fps', name: 'Feet per Second', symbol: 'ft/s', ratioToBase: 0.3048, category: 'speed' },
    { id: 'mach', name: 'Mach (Sound in Air at STP)', symbol: 'M', ratioToBase: 343, category: 'speed' },
    { id: 'c', name: 'Speed of Light in Vacuum', symbol: 'c', ratioToBase: 299792458, category: 'speed' }
  ]
};
