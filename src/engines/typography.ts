import type { CategoryDefinition } from './types';

export const typographyCategory: CategoryDefinition = {
  id: 'typography',
  name: 'Typography & CSS Units',
  icon: 'type',
  description: 'Convert Web/CSS layout units, pixels, REM, EM, points, and viewport percentages (assuming 16px base font & 1920x1080 viewport).',
  defaultFromUnit: 'px',
  defaultToUnit: 'rem',
  defaultInputValue: '24',
  units: [
    { id: 'px', name: 'Pixels (px)', symbol: 'px', ratioToBase: 1, category: 'typography' },
    { id: 'rem', name: 'REM (Root EM - 16px)', symbol: 'rem', ratioToBase: 16, category: 'typography' },
    { id: 'em', name: 'EM (Relative - 16px)', symbol: 'em', ratioToBase: 16, category: 'typography' },
    { id: 'pt', name: 'Points (1/72 in)', symbol: 'pt', ratioToBase: 96 / 72, category: 'typography' },
    { id: 'pc', name: 'Picas (12 pt)', symbol: 'pc', ratioToBase: 16, category: 'typography' },
    { id: 'percent', name: 'Percent (% of 16px)', symbol: '%', ratioToBase: 0.16, category: 'typography' },
    { id: 'vw', name: 'Viewport Width (vw of 1920px)', symbol: 'vw', ratioToBase: 19.2, category: 'typography' },
    { id: 'vh', name: 'Viewport Height (vh of 1080px)', symbol: 'vh', ratioToBase: 10.8, category: 'typography' }
  ]
};
