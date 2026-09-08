import AsyncStorage from '@react-native-async-storage/async-storage';
import { StrongEntry } from '../types';

const STORAGE_KEY = '@study_bible/strongs';

export const getCachedStrongEntry = async (strongsNumber: string): Promise<StrongEntry | null> => {
  try {
    const data = await AsyncStorage.getItem(`${STORAGE_KEY}:${strongsNumber}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading Strong\'s cache:', error);
    return null;
  }
};

export const cacheStrongEntry = async (entry: StrongEntry): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEY}:${entry.strongsNumber}`,
      JSON.stringify(entry)
    );
  } catch (error) {
    console.error('Error caching Strong\'s entry:', error);
  }
};