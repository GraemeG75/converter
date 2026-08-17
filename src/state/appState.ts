import type { AppState, HistoryItem } from '../engines/types';

const STORAGE_KEY = 'converter_app_state_v1';

const defaultState: AppState = {
  activeCategory: 'length',
  precision: 4,
  scientificNotation: false,
  theme: 'dark',
  language: 'en',
  favorites: ['length', 'temperatures', 'coordinates', 'color', 'number_bases'],
  history: [],
  lastSelectedUnits: {}
};

class StateManager {
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];

  constructor() {
    this.state = this.loadFromStorage();
  }

  public getState(): AppState {
    return { ...this.state };
  }

  public setState(partial: Partial<AppState>): void {
    this.state = { ...this.state, ...partial };
    this.saveToStorage();
    this.notify();
  }

  public subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: Date.now()
    };
    // Keep max 30 history items
    const updatedHistory = [newItem, ...this.state.history.slice(0, 29)];
    this.setState({ history: updatedHistory });
  }

  public clearHistory(): void {
    this.setState({ history: [] });
  }

  public toggleFavorite(categoryId: string): void {
    const favs = [...this.state.favorites];
    const idx = favs.indexOf(categoryId);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(categoryId);
    }
    this.setState({ favorites: favs });
  }

  public setCategoryUnits(catId: string, fromUnitId: string, toUnitId: string, inputValue?: string): void {
    const updated = {
      ...(this.state.lastSelectedUnits || {}),
      [catId]: { fromUnitId, toUnitId, inputValue }
    };
    this.setState({ lastSelectedUnits: updated });
  }

  private notify(): void {
    this.listeners.forEach(l => l(this.state));
  }

  private loadFromStorage(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultState, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load local state', e);
    }
    return defaultState;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save local state', e);
    }
  }
}

export const appStateManager = new StateManager();
