import AsyncStorage from '@react-native-async-storage/async-storage';
import { Highlight } from '../types';

const STORAGE_KEY = '@study_bible/highlights';

const HIGHLIGHT_COLORS = ['#FFEB3B', '#FF9800', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0'];

export const getHighlightColors = (): string[] => HIGHLIGHT_COLORS;

export const getHighlights = async (): Promise<Highlight[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading highlights:', error);
    return [];
  }
};

export const getHighlightsForVerse = async (verseId: string): Promise<Highlight[]> => {
  const highlights = await getHighlights();
  return highlights.filter(h => h.verseId === verseId);
};

export const getHighlightsForChapter = async (bookId: string, chapter: number): Promise<Highlight[]> => {
  const highlights = await getHighlights();
  return highlights.filter(h => h.verseId.startsWith(`${bookId}-${chapter}-`));
};

export const saveHighlight = async (verseId: string, color: string): Promise<Highlight> => {
  const highlights = await getHighlights();
  const existing = highlights.find(h => h.verseId === verseId);
  
  if (existing) {
    existing.color = color;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(highlights));
    return existing;
  }
  
  const highlight: Highlight = {
    verseId,
    color,
    createdAt: new Date(),
  };
  highlights.push(highlight);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(highlights));
  return highlight;
};

export const deleteHighlight = async (verseId: string): Promise<void> => {
  const highlights = await getHighlights();
  const filtered = highlights.filter(h => h.verseId !== verseId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const clearHighlights = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};