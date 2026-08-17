import type { CategoryDefinition } from './types';

export const anglesCategory: CategoryDefinition = {
  id: 'angles',
  name: 'Angles & Rotation',
  icon: 'compass',
  description: 'Convert planar angles, rotational measures, radians, and trigonometric angles.',
  defaultFromUnit: 'deg',
  defaultToUnit: 'rad',
  defaultInputValue: '45',
  hasVisualizer: true,
  visualizerType: 'protractor',
  units: [
    { id: 'deg', name: 'Degrees', symbol: '°', ratioToBase: 1, category: 'angles' },
    { id: 'rad', name: 'Radians', symbol: 'rad', ratioToBase: 180 / Math.PI, category: 'angles' },
    { id: 'grad', name: 'Gradians', symbol: 'grad', ratioToBase: 0.9, category: 'angles' },
    { id: 'rev', name: 'Revolutions / Turns', symbol: 'rev', ratioToBase: 360, category: 'angles' },
    { id: 'arcmin', name: 'Arcminutes', symbol: '′', ratioToBase: 1 / 60, category: 'angles' },
    { id: 'arcsec', name: 'Arcseconds', symbol: '″', ratioToBase: 1 / 3600, category: 'angles' },
    { id: 'mrad', name: 'Milliradians', symbol: 'mrad', ratioToBase: (180 / Math.PI) / 1000, category: 'angles' },
    { id: 'quadrant', name: 'Quadrants', symbol: 'quad', ratioToBase: 90, category: 'angles' }
  ]
};
