import type { CategoryDefinition } from './types';

export const massCategory: CategoryDefinition = {
  id: 'mass',
  name: 'Mass & Weight',
  icon: 'scale',
  description: 'Convert grams, kilograms, pounds, ounces, stones, carats, and metric tons.',
  defaultFromUnit: 'kg',
  defaultToUnit: 'lb',
  defaultInputValue: '75',
  units: [
    { id: 'kg', name: 'Kilograms', symbol: 'kg', ratioToBase: 1, category: 'mass' },
    { id: 'g', name: 'Grams', symbol: 'g', ratioToBase: 0.001, category: 'mass' },
    { id: 'mg', name: 'Milligrams', symbol: 'mg', ratioToBase: 1e-6, category: 'mass' },
    { id: 'ug', name: 'Micrograms', symbol: 'μg', ratioToBase: 1e-9, category: 'mass' },
    { id: 'mton', name: 'Metric Tons (Tonne)', symbol: 't', ratioToBase: 1000, category: 'mass' },
    { id: 'lb', name: 'Pounds', symbol: 'lb', ratioToBase: 0.45359237, category: 'mass' },
    { id: 'oz', name: 'Ounces', symbol: 'oz', ratioToBase: 0.028349523125, category: 'mass' },
    { id: 'stone', name: 'Stones', symbol: 'st', ratioToBase: 6.35029318, category: 'mass' },
    { id: 'uston', name: 'US Short Tons', symbol: 'ton (US)', ratioToBase: 907.18474, category: 'mass' },
    { id: 'ukton', name: 'Imperial Long Tons', symbol: 'ton (UK)', ratioToBase: 1016.0469088, category: 'mass' },
    { id: 'carat', name: 'Carats (Gemstones)', symbol: 'ct', ratioToBase: 0.0002, category: 'mass' },
    { id: 'grain', name: 'Grains', symbol: 'gr', ratioToBase: 0.00006479891, category: 'mass' }
  ]
};

export const pressureCategory: CategoryDefinition = {
  id: 'pressure',
  name: 'Pressure',
  icon: 'barometer',
  description: 'Convert pressure units: Pascal, Bar, PSI, Atmosphere, Torr.',
  defaultFromUnit: 'bar',
  defaultToUnit: 'psi',
  defaultInputValue: '2.5',
  units: [
    { id: 'pa', name: 'Pascals', symbol: 'Pa', ratioToBase: 1, category: 'pressure' },
    { id: 'kpa', name: 'Kilopascals', symbol: 'kPa', ratioToBase: 1000, category: 'pressure' },
    { id: 'mpa', name: 'Megapascals', symbol: 'MPa', ratioToBase: 1e6, category: 'pressure' },
    { id: 'bar', name: 'Bars', symbol: 'bar', ratioToBase: 100000, category: 'pressure' },
    { id: 'mbar', name: 'Millibars / Hectopascals', symbol: 'mbar / hPa', ratioToBase: 100, category: 'pressure' },
    { id: 'psi', name: 'Pounds per Sq Inch (PSI)', symbol: 'psi', ratioToBase: 6894.757293168, category: 'pressure' },
    { id: 'atm', name: 'Standard Atmospheres', symbol: 'atm', ratioToBase: 101325, category: 'pressure' },
    { id: 'torr', name: 'Torr / mmHg', symbol: 'Torr', ratioToBase: 133.322368421, category: 'pressure' }
  ]
};
