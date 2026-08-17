export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratioToBase?: number; // For linear conversions: baseValue = val * ratioToBase
  offsetFromBase?: number; // For affine conversions like temperature: baseValue = (val + offsetFromBase) * ratioToBase
  toBase?: (val: number) => number; // Custom forward function if non-linear
  fromBase?: (baseVal: number) => number; // Custom reverse function if non-linear
  description?: string;
  category: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  icon: string; // SVG icon path or emoji identifier
  description: string;
  defaultFromUnit: string;
  defaultToUnit: string;
  defaultInputValue?: string;
  units: UnitDefinition[];
  hasVisualizer?: boolean;
  visualizerType?: 'protractor' | 'thermometer' | 'coordinate' | 'color' | 'bitboard' | 'transfer' | 'none';
  customConverter?: boolean; // If category uses non-standard multi-input forms (like Lat/Long DD to DMS, or File Transfer Time)
}

export interface ConversionResult {
  fromValue: number | string;
  fromUnit: UnitDefinition;
  toValue: number | string;
  toUnit: UnitDefinition;
  formattedOutput: string;
  formulaDescription?: string;
  extraDetails?: Record<string, string | number>;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  categoryId: string;
  categoryName: string;
  fromValue: string;
  fromSymbol: string;
  toValue: string;
  toSymbol: string;
}

export type SupportedLanguage = 'en' | 'de' | 'es' | 'fr' | 'it';

export interface AppState {
  activeCategory: string;
  precision: number; // Decimal places (0 to 10)
  scientificNotation: boolean;
  theme: 'dark' | 'light' | 'pride';
  language: SupportedLanguage;
  favorites: string[]; // Category IDs or Unit Pair IDs
  history: HistoryItem[];
  lastSelectedUnits?: Record<string, { fromUnitId: string; toUnitId: string; inputValue?: string }>;
}
