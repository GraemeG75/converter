import type { CategoryDefinition } from './types';

export const lengthCategory: CategoryDefinition = {
  id: 'length',
  name: 'Distance & Length',
  icon: 'ruler',
  description: 'Convert between metric, imperial, astronomical, and nautical distance units.',
  defaultFromUnit: 'm',
  defaultToUnit: 'ft',
  defaultInputValue: '100',
  units: [
    { id: 'm', name: 'Meters', symbol: 'm', ratioToBase: 1, category: 'length' },
    { id: 'km', name: 'Kilometers', symbol: 'km', ratioToBase: 1000, category: 'length' },
    { id: 'cm', name: 'Centimeters', symbol: 'cm', ratioToBase: 0.01, category: 'length' },
    { id: 'mm', name: 'Millimeters', symbol: 'mm', ratioToBase: 0.001, category: 'length' },
    { id: 'um', name: 'Micrometers (Microns)', symbol: 'μm', ratioToBase: 1e-6, category: 'length' },
    { id: 'nm', name: 'Nanometers', symbol: 'nm', ratioToBase: 1e-9, category: 'length' },
    { id: 'in', name: 'Inches', symbol: 'in', ratioToBase: 0.0254, category: 'length' },
    { id: 'ft', name: 'Feet', symbol: 'ft', ratioToBase: 0.3048, category: 'length' },
    { id: 'yd', name: 'Yards', symbol: 'yd', ratioToBase: 0.9144, category: 'length' },
    { id: 'mi', name: 'Miles', symbol: 'mi', ratioToBase: 1609.344, category: 'length' },
    { id: 'nmi', name: 'Nautical Miles', symbol: 'nmi', ratioToBase: 1852, category: 'length' },
    { id: 'au', name: 'Astronomical Units', symbol: 'AU', ratioToBase: 149597870700, category: 'length' },
    { id: 'ly', name: 'Light Years', symbol: 'ly', ratioToBase: 9.4607304725808e15, category: 'length' },
    { id: 'pc', name: 'Parsecs', symbol: 'pc', ratioToBase: 3.08567758149137e16, category: 'length' },
    { id: 'fathom', name: 'Fathoms', symbol: 'ftm', ratioToBase: 1.8288, category: 'length' },
    { id: 'rod', name: 'Rods', symbol: 'rd', ratioToBase: 5.0292, category: 'length' }
  ]
};

export const areaCategory: CategoryDefinition = {
  id: 'area',
  name: 'Area',
  icon: 'square',
  description: 'Convert square measurements, hectares, and land area units.',
  defaultFromUnit: 'sq_m',
  defaultToUnit: 'sq_ft',
  defaultInputValue: '1',
  units: [
    { id: 'sq_m', name: 'Square Meters', symbol: 'm²', ratioToBase: 1, category: 'area' },
    { id: 'sq_km', name: 'Square Kilometers', symbol: 'km²', ratioToBase: 1e6, category: 'area' },
    { id: 'sq_cm', name: 'Square Centimeters', symbol: 'cm²', ratioToBase: 1e-4, category: 'area' },
    { id: 'sq_mm', name: 'Square Millimeters', symbol: 'mm²', ratioToBase: 1e-6, category: 'area' },
    { id: 'hectare', name: 'Hectares', symbol: 'ha', ratioToBase: 10000, category: 'area' },
    { id: 'acre', name: 'Acres', symbol: 'ac', ratioToBase: 4046.8564224, category: 'area' },
    { id: 'sq_in', name: 'Square Inches', symbol: 'in²', ratioToBase: 0.00064516, category: 'area' },
    { id: 'sq_ft', name: 'Square Feet', symbol: 'ft²', ratioToBase: 0.09290304, category: 'area' },
    { id: 'sq_yd', name: 'Square Yards', symbol: 'yd²', ratioToBase: 0.83612736, category: 'area' },
    { id: 'sq_mi', name: 'Square Miles', symbol: 'mi²', ratioToBase: 2589988.110336, category: 'area' }
  ]
};

export const volumeCategory: CategoryDefinition = {
  id: 'volume',
  name: 'Volume & Liquid',
  icon: 'box',
  description: 'Convert liquid volumes, cubic measurements, liters, and gallons.',
  defaultFromUnit: 'l',
  defaultToUnit: 'us_gal',
  defaultInputValue: '5',
  units: [
    { id: 'l', name: 'Liters', symbol: 'L', ratioToBase: 0.001, category: 'volume' },
    { id: 'ml', name: 'Milliliters', symbol: 'mL', ratioToBase: 1e-6, category: 'volume' },
    { id: 'cu_m', name: 'Cubic Meters', symbol: 'm³', ratioToBase: 1, category: 'volume' },
    { id: 'cu_cm', name: 'Cubic Centimeters (cc)', symbol: 'cm³', ratioToBase: 1e-6, category: 'volume' },
    { id: 'us_gal', name: 'US Gallons', symbol: 'gal (US)', ratioToBase: 0.003785411784, category: 'volume' },
    { id: 'us_qt', name: 'US Quarts', symbol: 'qt (US)', ratioToBase: 0.000946352946, category: 'volume' },
    { id: 'us_pt', name: 'US Pints', symbol: 'pt (US)', ratioToBase: 0.000473176473, category: 'volume' },
    { id: 'us_cup', name: 'US Cups', symbol: 'cup (US)', ratioToBase: 0.0002365882365, category: 'volume' },
    { id: 'us_floz', name: 'US Fluid Ounces', symbol: 'fl oz (US)', ratioToBase: 0.0000295735295625, category: 'volume' },
    { id: 'us_tbsp', name: 'US Tablespoons', symbol: 'tbsp', ratioToBase: 0.00001478676478125, category: 'volume' },
    { id: 'us_tsp', name: 'US Teaspoons', symbol: 'tsp', ratioToBase: 0.00000492892159375, category: 'volume' },
    { id: 'imp_gal', name: 'Imperial Gallons', symbol: 'gal (Imp)', ratioToBase: 0.00454609, category: 'volume' },
    { id: 'imp_floz', name: 'Imperial Fluid Ounces', symbol: 'fl oz (Imp)', ratioToBase: 0.0000284130625, category: 'volume' },
    { id: 'cu_ft', name: 'Cubic Feet', symbol: 'ft³', ratioToBase: 0.028316846592, category: 'volume' },
    { id: 'cu_in', name: 'Cubic Inches', symbol: 'in³', ratioToBase: 0.000016387064, category: 'volume' }
  ]
};

