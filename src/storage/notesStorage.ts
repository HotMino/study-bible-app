import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';

const STORAGE_KEY = '@study_bible/notes';

export const getNotes = async (): Promise<Note[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

export const getNotesForVerse = async (verseId: string): Promise<Note[]> => {
  const notes = await getNotes();
  return notes.filter(n => n.verseId === verseId);
};

export const saveNote = async (verseId: string, content: string): Promise<Note> => {
  const notes = await getNotes();
  const existing = notes.find(n => n.verseId === verseId);
  
  const now = new Date();
  let note: Note;
  
  if (existing) {
    note = { ...existing, content, updatedAt: now };
    const index = notes.findIndex(n => n.id === existing.id);
    notes[index] = note;
  } else {
    note = {
      id: `${verseId}-${now.getTime()}`,
      verseId,
      content,
      createdAt: now,
      updatedAt: now,
    };
    notes.push(note);
  }
  
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  return note;
};

export const deleteNote = async (noteId: string): Promise<void> => {
  const notes = await getNotes();
  const filtered = notes.filter(n => n.id !== noteId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const deleteNotesForVerse = async (verseId: string): Promise<void> => {
  const notes = await getNotes();
  const filtered = notes.filter(n => n.verseId !== verseId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};