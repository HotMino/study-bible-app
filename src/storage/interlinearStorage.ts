import AsyncStorage from '@react-native-async-storage/async-storage';
import { InterlinearWord } from '../types';

const STORAGE_KEY = '@study_bible/interlinear';

export const getCachedInterlinear = async (bookId: string, chapter: number, verse: number): Promise<InterlinearWord[] | null> => {
  try {
    const data = await AsyncStorage.getItem(`${STORAGE_KEY}:${bookId}-${chapter}-${verse}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading interlinear cache:', error);
    return null;
  }
};

export const cacheInterlinear = async (
  bookId: string,
  chapter: number,
  verse: number,
  words: InterlinearWord[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      `${STORAGE_KEY}:${bookId}-${chapter}-${verse}`,
      JSON.stringify(words)
    );
  } catch (error) {
    console.error('Error caching interlinear:', error);
  }
};