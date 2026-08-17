import type { CategoryDefinition } from './types';

export const energyCategory: CategoryDefinition = {
  id: 'energy',
  name: 'Energy & Work',
  icon: 'zap',
  description: 'Convert Joules, Calories, Kilowatt-hours, BTU, and Electronvolts.',
  defaultFromUnit: 'kwh',
  defaultToUnit: 'kj',
  defaultInputValue: '10',
  units: [
    { id: 'j', name: 'Joules', symbol: 'J', ratioToBase: 1, category: 'energy' },
    { id: 'kj', name: 'Kilojoules', symbol: 'kJ', ratioToBase: 1000, category: 'energy' },
    { id: 'mj', name: 'Megajoules', symbol: 'MJ', ratioToBase: 1e6, category: 'energy' },
    { id: 'cal', name: 'Calories (gram cal)', symbol: 'cal', ratioToBase: 4.184, category: 'energy' },
    { id: 'kcal', name: 'Kilocalories (Food Cal)', symbol: 'kcal', ratioToBase: 4184, category: 'energy' },
    { id: 'wh', name: 'Watt-hours', symbol: 'Wh', ratioToBase: 3600, category: 'energy' },
    { id: 'kwh', name: 'Kilowatt-hours', symbol: 'kWh', ratioToBase: 3.6e6, category: 'energy' },
    { id: 'ev', name: 'Electronvolts', symbol: 'eV', ratioToBase: 1.602176634e-19, category: 'energy' },
    { id: 'btu', name: 'British Thermal Units (BTU)', symbol: 'BTU', ratioToBase: 1055.05585262, category: 'energy' },
    { id: 'ftlbf', name: 'Foot-Pounds', symbol: 'ft·lbf', ratioToBase: 1.3558179483314, category: 'energy' }
  ]
};

export const powerCategory: CategoryDefinition = {
  id: 'power',
  name: 'Power',
  icon: 'activity',
  description: 'Convert Watts, Kilowatts, Horsepower, and BTU per hour.',
  defaultFromUnit: 'kw',
  defaultToUnit: 'hp',
  defaultInputValue: '100',
  units: [
    { id: 'w', name: 'Watts', symbol: 'W', ratioToBase: 1, category: 'power' },
    { id: 'kw', name: 'Kilowatts', symbol: 'kW', ratioToBase: 1000, category: 'power' },
    { id: 'mw', name: 'Megawatts', symbol: 'MW', ratioToBase: 1e6, category: 'power' },
    { id: 'hp', name: 'Horsepower (Mechanical)', symbol: 'hp', ratioToBase: 745.69987158227, category: 'power' },
    { id: 'ps', name: 'Horsepower (Metric / PS)', symbol: 'PS', ratioToBase: 735.49875, category: 'power' },
    { id: 'btuh', name: 'BTU per hour', symbol: 'BTU/h', ratioToBase: 0.29307107, category: 'power' }
  ]
};
