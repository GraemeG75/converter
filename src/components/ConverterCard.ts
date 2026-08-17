import type { CategoryDefinition, ConversionResult } from '../engines/types';
import { performConversion } from '../engines/registry';
import { appStateManager } from '../state/appState';
import { showToast } from './Toast';

// Visualizers
import { renderProtractorVisualizer } from '../visualizers/protractorVisualizer';
import { renderThermometerVisualizer } from '../visualizers/thermometerVisualizer';
import { renderCoordinateVisualizer } from '../visualizers/coordinateVisualizer';
import { renderColorVisualizer } from '../visualizers/colorVisualizer';
import { renderBitBoardVisualizer } from '../visualizers/bitBoardVisualizer';
import { renderUuidVisualizer } from '../visualizers/uuidVisualizer';
import { calculateTransferTime } from '../engines/data';
import { parseColorInput } from '../engines/color';

export function renderConverterCard(
  container: HTMLElement,
  category: CategoryDefinition,
  currentFromUnitId?: string,
  currentToUnitId?: string,
  currentInputValue?: string
): void {
  const state = appStateManager.getState();
  const fromId = currentFromUnitId || category.defaultFromUnit;
  const toId = currentToUnitId || category.defaultToUnit;
  const inputVal = currentInputValue !== undefined ? currentInputValue : (category.defaultInputValue || '100');
  const isFav = state.favorites.includes(category.id);

  // Perform calculation
  const result: ConversionResult = performConversion(
    category,
    fromId,
    toId,
    inputVal,
    state.precision,
    state.scientificNotation
  );

  container.innerHTML = `
    <div class="converter-card glass-panel">
      <!-- Category Card Header -->
      <div class="card-header">
        <div class="card-header-main">
          <h2>${category.name}</h2>
          <p class="category-desc">${category.description}</p>
        </div>
        <button id="favToggleBtn" class="fav-btn ${isFav ? 'favorited' : ''}" title="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}">
          ★
        </button>
      </div>

      <!-- Main Input / Output Controls Grid -->
      <div class="converter-grid">
        <!-- Left Side: From Input -->
        <div class="converter-section">
          <label class="section-label" for="fromValInput">Input Value</label>
          <div class="input-group">
            <input
              type="text"
              id="fromValInput"
              class="glass-input"
              value="${escapeHtml(inputVal)}"
              placeholder="Enter value..."
              autocomplete="off"
            />
          </div>
          <div class="select-group">
            <label class="unit-label" for="fromUnitSelect">From Unit</label>
            <select id="fromUnitSelect" class="glass-select">
              ${category.units.map(u => `
                <option value="${u.id}" ${u.id === fromId ? 'selected' : ''}>
                  ${u.name} (${u.symbol})
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Middle: Swap Button -->
        <div class="swap-divider">
          <button id="swapUnitsBtn" class="swap-btn glass-btn" title="Swap From and To Units (Key: S)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="17 1 21 5 17 9"></polyline>
              <line x1="3" y1="5" x2="21" y2="5"></line>
              <polyline points="7 23 3 19 7 15"></polyline>
              <line x1="21" y1="19" x2="3" y2="19"></line>
            </svg>
          </button>
        </div>

        <!-- Right Side: Output Display -->
        <div class="converter-section">
          <label class="section-label">Converted Output</label>
          <div class="output-box glass-output" id="outputBox">
            <span class="output-value">${escapeHtml(result.formattedOutput)}</span>
            <button id="copyOutputBtn" class="copy-btn glass-btn" title="Copy Result to Clipboard">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <div class="select-group">
            <label class="unit-label" for="toUnitSelect">To Unit</label>
            <select id="toUnitSelect" class="glass-select">
              ${category.units.map(u => `
                <option value="${u.id}" ${u.id === toId ? 'selected' : ''}>
                  ${u.name} (${u.symbol})
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Conversion Options & Formula Details -->
      <div class="card-footer">
        <div class="formula-info">
          <span class="formula-icon">💡</span>
          <span class="formula-text">${result.formulaDescription || ''}</span>
        </div>

        <div class="precision-controls">
          <label for="precisionSelect" class="control-label">Decimals:</label>
          <select id="precisionSelect" class="glass-select-sm">
            ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => `
              <option value="${p}" ${p === state.precision ? 'selected' : ''}>${p}</option>
            `).join('')}
          </select>

          <label class="checkbox-label" title="Force Scientific Notation (e.g. 1.23e+4)">
            <input type="checkbox" id="scientificCheck" ${state.scientificNotation ? 'checked' : ''} />
            <span>Scientific (1e+N)</span>
          </label>
        </div>
      </div>

      <!-- Special Category Visualizer Slot -->
      <div id="visualizerSlot" class="visualizer-slot"></div>
    </div>
  `;

  // Attach Event Handlers
  const fromInput = container.querySelector('#fromValInput') as HTMLInputElement;
  const fromSelect = container.querySelector('#fromUnitSelect') as HTMLSelectElement;
  const toSelect = container.querySelector('#toUnitSelect') as HTMLSelectElement;
  const swapBtn = container.querySelector('#swapUnitsBtn') as HTMLButtonElement;
  const copyBtn = container.querySelector('#copyOutputBtn') as HTMLButtonElement;
  const favBtn = container.querySelector('#favToggleBtn') as HTMLButtonElement;
  const precisionSel = container.querySelector('#precisionSelect') as HTMLSelectElement;
  const sciCheck = container.querySelector('#scientificCheck') as HTMLInputElement;

  const triggerUpdate = (preserveFocus = false) => {
    const focusedEl = document.activeElement as HTMLElement | null;
    const isInputFocused = focusedEl === fromInput;
    const selStart = isInputFocused ? fromInput.selectionStart : null;
    const selEnd = isInputFocused ? fromInput.selectionEnd : null;

    renderConverterCard(container, category, fromSelect.value, toSelect.value, fromInput.value);

    if (preserveFocus && isInputFocused) {
      const newFromInput = container.querySelector('#fromValInput') as HTMLInputElement | null;
      if (newFromInput) {
        newFromInput.focus();
        if (selStart !== null && selEnd !== null) {
          try {
            newFromInput.setSelectionRange(selStart, selEnd);
          } catch {
            // Ignore for inputs that do not support selection
          }
        }
      }
    }
  };

  const updateOutputOnly = () => {
    const currentResult = performConversion(
      category,
      fromSelect.value,
      toSelect.value,
      fromInput.value,
      appStateManager.getState().precision,
      appStateManager.getState().scientificNotation
    );

    const outputValEl = container.querySelector('#outputBox .output-value');
    if (outputValEl) {
      outputValEl.textContent = currentResult.formattedOutput;
    }

    const formulaTextEl = container.querySelector('.formula-text');
    if (formulaTextEl) {
      formulaTextEl.textContent = currentResult.formulaDescription || '';
    }

    const visualizerSlot = container.querySelector('#visualizerSlot') as HTMLElement;
    if (visualizerSlot) {
      renderCategoryVisualizer(visualizerSlot, category.id, currentResult, fromInput.value, fromInput, () => triggerUpdate(true));
    }
  };

  fromInput.addEventListener('input', () => {
    updateOutputOnly();
  });

  fromSelect.addEventListener('change', () => {
    appStateManager.addHistoryItem({
      categoryId: category.id,
      categoryName: category.name,
      fromValue: fromInput.value,
      fromSymbol: fromSelect.options[fromSelect.selectedIndex].text,
      toValue: result.formattedOutput,
      toSymbol: toSelect.options[toSelect.selectedIndex].text
    });
    triggerUpdate(true);
  });
  toSelect.addEventListener('change', () => triggerUpdate(true));

  swapBtn.addEventListener('click', () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    triggerUpdate(true);
  });

  copyBtn.addEventListener('click', () => {
    const currentOutput = container.querySelector('#outputBox .output-value')?.textContent || result.formattedOutput;
    navigator.clipboard.writeText(currentOutput).then(() => {
      showToast(`Copied "${currentOutput}" to clipboard`);
    }).catch(() => {
      showToast(`Copied result!`);
    });
  });

  favBtn.addEventListener('click', () => {
    appStateManager.toggleFavorite(category.id);
    triggerUpdate(true);
  });

  precisionSel.addEventListener('change', () => {
    appStateManager.setState({ precision: parseInt(precisionSel.value, 10) });
    triggerUpdate(true);
  });

  sciCheck.addEventListener('change', () => {
    appStateManager.setState({ scientificNotation: sciCheck.checked });
    triggerUpdate(true);
  });

  // Render Category-Specific Visualizer
  const visualizerSlot = container.querySelector('#visualizerSlot') as HTMLElement;
  if (visualizerSlot) {
    renderCategoryVisualizer(visualizerSlot, category.id, result, inputVal, fromInput, () => triggerUpdate(true));
  }
}

function renderCategoryVisualizer(
  slot: HTMLElement,
  catId: string,
  result: ConversionResult,
  inputVal: string,
  fromInputEl: HTMLInputElement,
  triggerUpdate: () => void
): void {
  if (catId === 'angles') {
    const degVal = typeof result.fromValue === 'number' ? (result.fromUnit.id === 'deg' ? result.fromValue : result.toValue as number) : parseFloat(inputVal);
    renderProtractorVisualizer(slot, isNaN(degVal) ? 45 : degVal);
  } else if (catId === 'temperatures') {
    const num = typeof result.fromValue === 'number' ? result.fromValue : parseFloat(inputVal);
    // Convert to celsius base if needed
    const celsius = result.fromUnit.toBase ? result.fromUnit.toBase(isNaN(num) ? 25 : num) : 25;
    renderThermometerVisualizer(slot, celsius);
  } else if (catId === 'coordinates') {
    const parts = inputVal.split(',').map(s => parseFloat(s.trim()));
    const lat = parts[0] || 37.7749;
    const lng = parts[1] || -122.4194;
    renderCoordinateVisualizer(slot, lat, lng);
  } else if (catId === 'color') {
    const colorInfo = parseColorInput(inputVal);
    if (colorInfo) {
      renderColorVisualizer(slot, colorInfo.hex, colorInfo.rgb);
    }
  } else if (catId === 'number_bases') {
    let bigVal = 0n;
    try {
      if (typeof result.fromValue === 'string') {
        bigVal = BigInt(result.fromValue);
      }
    } catch {
      bigVal = 255n;
    }
    renderBitBoardVisualizer(slot, bigVal, (newBigVal) => {
      fromInputEl.value = newBigVal.toString(10);
      triggerUpdate();
    });
  } else if (catId === 'data_rate') {
    const fileMb = 1000; // 1 GB test file
    const speedBps = typeof result.toValue === 'number' ? result.toValue * (result.toUnit.ratioToBase || 1) : 1e6;
    const estTime = calculateTransferTime(fileMb * 1e6, speedBps);

    slot.innerHTML = `
      <div class="visualizer-card glass-panel">
        <div class="visualizer-header">
          <span class="visualizer-title">Estimated Download Time (1 GB File): ${estTime}</span>
        </div>
      </div>
    `;
  } else if (catId === 'uuid_guid') {
    renderUuidVisualizer(slot, (selectedUuid) => {
      fromInputEl.value = selectedUuid;
      triggerUpdate();
    });
  }
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
