import type { CategoryDefinition } from './types';

export const cssUnitsCategory: CategoryDefinition = {
  id: 'css_units',
  name: 'CSS & Screen Units',
  icon: 'layout',
  description: 'Convert between CSS px, rem, em, pt, Android dp, iOS pt, %, and generate fluid clamp(min, val, max) formulas.',
  defaultFromUnit: 'px',
  defaultToUnit: 'rem',
  defaultInputValue: '24',
  hasVisualizer: true,
  visualizerType: 'fluid_css',
  units: [
    { id: 'px', name: 'Pixels', symbol: 'px', category: 'css_units' },
    { id: 'rem', name: 'Root EM (base 16px)', symbol: 'rem', category: 'css_units' },
    { id: 'em', name: 'Element EM', symbol: 'em', category: 'css_units' },
    { id: 'pt', name: 'Points (1/72 in)', symbol: 'pt', category: 'css_units' },
    { id: 'dp', name: 'Android Density Pixels', symbol: 'dp', category: 'css_units' },
    { id: 'ios_pt', name: 'iOS Rendered Points', symbol: 'pt', category: 'css_units' },
    { id: 'percent', name: 'Percentage (base 16px)', symbol: '%', category: 'css_units' },
    { id: 'clamp', name: 'Fluid clamp() Formula', symbol: 'clamp', category: 'css_units' }
  ]
};

export function convertCssUnits(valStr: string, fromId: string, toId: string, baseFontSize: number = 16): string {
  const num = parseFloat(valStr);
  if (isNaN(num)) return 'Invalid Input';

  // Convert input to px base
  let pxVal = num;
  switch (fromId) {
    case 'px':
      pxVal = num;
      break;
    case 'rem':
    case 'em':
      pxVal = num * baseFontSize;
      break;
    case 'pt':
      pxVal = num * (4 / 3); // 1 pt = 1.333 px
      break;
    case 'dp':
      pxVal = num; // 1 dp = 1 px @ 160 dpi mdpi base
      break;
    case 'ios_pt':
      pxVal = num;
      break;
    case 'percent':
      pxVal = (num / 100) * baseFontSize;
      break;
    case 'clamp':
      pxVal = num;
      break;
  }

  // Convert px base to target unit
  switch (toId) {
    case 'px':
      return `${pxVal}px`;
    case 'rem':
    case 'em':
      return `${(pxVal / baseFontSize).toFixed(4).replace(/\.?0+$/, '')}${toId}`;
    case 'pt':
      return `${(pxVal * 0.75).toFixed(3).replace(/\.?0+$/, '')}pt`;
    case 'dp':
    case 'ios_pt':
      return `${pxVal.toFixed(2).replace(/\.?0+$/, '')}dp`;
    case 'percent':
      return `${((pxVal / baseFontSize) * 100).toFixed(1)}%`;
    case 'clamp':
      return generateClampFormula(pxVal, baseFontSize);
    default:
      return `${pxVal}px`;
  }
}

export function generateClampFormula(targetPx: number, baseFontSize: number = 16): string {
  const minPx = Math.max(12, Math.round(targetPx * 0.75));
  const maxPx = Math.round(targetPx * 1.35);

  const minRem = (minPx / baseFontSize).toFixed(3);
  const maxRem = (maxPx / baseFontSize).toFixed(3);

  // Preferred slope calculation between 375px mobile and 1440px desktop viewports
  const minVwWidth = 375;
  const maxVwWidth = 1440;

  const slope = (maxPx - minPx) / (maxVwWidth - minVwWidth);
  const yAxisIntersection = -minVwWidth * slope + minPx;

  const slopeVw = (slope * 100).toFixed(2);
  const intersectionRem = (yAxisIntersection / baseFontSize).toFixed(3);

  return `clamp(${minRem}rem, ${intersectionRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
}
