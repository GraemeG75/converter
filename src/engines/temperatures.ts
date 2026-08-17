import type { CategoryDefinition } from './types';

export const temperatureCategory: CategoryDefinition = {
  id: 'temperatures',
  name: 'Temperatures',
  icon: 'thermometer',
  description: 'Convert thermodynamic, meteorological, and scientific temperature scales.',
  defaultFromUnit: 'celsius',
  defaultToUnit: 'fahrenheit',
  defaultInputValue: '25',
  hasVisualizer: true,
  visualizerType: 'thermometer',
  units: [
    {
      id: 'celsius',
      name: 'Celsius',
      symbol: '°C',
      category: 'temperatures',
      toBase: (c) => c,
      fromBase: (baseC) => baseC
    },
    {
      id: 'fahrenheit',
      name: 'Fahrenheit',
      symbol: '°F',
      category: 'temperatures',
      toBase: (f) => (f - 32) * (5 / 9),
      fromBase: (baseC) => baseC * (9 / 5) + 32
    },
    {
      id: 'kelvin',
      name: 'Kelvin',
      symbol: 'K',
      category: 'temperatures',
      toBase: (k) => k - 273.15,
      fromBase: (baseC) => baseC + 273.15
    },
    {
      id: 'rankine',
      name: 'Rankine',
      symbol: '°R',
      category: 'temperatures',
      toBase: (r) => (r - 491.67) * (5 / 9),
      fromBase: (baseC) => (baseC + 273.15) * (9 / 5)
    },
    {
      id: 'delisle',
      name: 'Delisle',
      symbol: '°De',
      category: 'temperatures',
      toBase: (de) => 100 - de * (2 / 3),
      fromBase: (baseC) => (100 - baseC) * (3 / 2)
    },
    {
      id: 'newton',
      name: 'Newton',
      symbol: '°N',
      category: 'temperatures',
      toBase: (n) => n * (100 / 33),
      fromBase: (baseC) => baseC * (33 / 100)
    },
    {
      id: 'reaumur',
      name: 'Réaumur',
      symbol: '°Ré',
      category: 'temperatures',
      toBase: (re) => re * (5 / 4),
      fromBase: (baseC) => baseC * (4 / 5)
    },
    {
      id: 'romer',
      name: 'Rømer',
      symbol: '°Rø',
      category: 'temperatures',
      toBase: (ro) => (ro - 7.5) * (40 / 21),
      fromBase: (baseC) => (baseC - 7.5 + 7.5) * (21 / 40) // simplified (baseC) * 21/40 + 7.5
    }
  ]
};
