import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types';

const STORAGE_KEY = '@study_bible/preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  translation: 'kjv',
  theme: 'system',
  fontSize: 16,
};

export const getPreferences = async (): Promise<UserPreferences> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error loading preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

export const savePreferences = async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
  const current = await getPreferences();
  const updated = { ...current, ...preferences };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const saveLastReadPosition = async (bookId: string, chapter: number, verse: number): Promise<void> => {
  const prefs = await getPreferences();
  prefs.lastReadPosition = { bookId, chapter, verse };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};