import AsyncStorage from '@react-native-async-storage/async-storage';
import { DistillationBatch, MOCK_BATCHES } from '../../data/mockData';

const BATCHES_STORAGE_KEY = '@nilamhub_distillation_batches';
const CALCULATOR_HISTORY_KEY = '@nilamhub_calc_history';

/**
 * Load saved distillation batches from persistent storage
 */
export const loadSavedBatches = async (): Promise<DistillationBatch[]> => {
  try {
    const raw = await AsyncStorage.getItem(BATCHES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Fallback to default mock data on first run
    await AsyncStorage.setItem(BATCHES_STORAGE_KEY, JSON.stringify(MOCK_BATCHES));
    return MOCK_BATCHES;
  } catch (error) {
    console.warn('Failed to load batches from AsyncStorage, using fallback', error);
    return MOCK_BATCHES;
  }
};

/**
 * Save new batches array to persistent storage
 */
export const saveBatches = async (batches: DistillationBatch[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BATCHES_STORAGE_KEY, JSON.stringify(batches));
  } catch (error) {
    console.error('Failed to save batches to AsyncStorage', error);
  }
};

export interface CalculatorHistoryItem {
  id: string;
  timestamp: string;
  dryLeavesKg: number;
  yieldRate: number;
  oilKg: number;
  totalCost: number;
  netProfit: number;
}

export const loadCalculatorHistory = async (): Promise<CalculatorHistoryItem[]> => {
  try {
    const raw = await AsyncStorage.getItem(CALCULATOR_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCalculatorHistory = async (items: CalculatorHistoryItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CALCULATOR_HISTORY_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save calc history', error);
  }
};

const NOTIFICATIONS_STORAGE_KEY = '@sulingtrace_notifications';

export const loadSavedNotifications = async (): Promise<any[]> => {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return [];
  } catch {
    return [];
  }
};

export const saveNotifications = async (items: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save notifications', error);
  }
};

