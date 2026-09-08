import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, UserPreferences } from '../types';
import { getPreferences, savePreferences } from '../storage/preferencesStorage';
import { getNotes, saveNote as persistNote, deleteNote as removeNote } from '../storage/notesStorage';

interface AppContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  notes: Note[];
  addNote: (verseId: string, content: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    translation: 'kjv',
    theme: 'system',
    fontSize: 16,
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [prefs, allNotes] = await Promise.all([getPreferences(), getNotes()]);
      setPreferences(prefs);
      setNotes(allNotes);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    const updated = await savePreferences(prefs);
    setPreferences(updated);
  };

  const addNote = async (verseId: string, content: string) => {
    await persistNote(verseId, content);
    const updatedNotes = await getNotes();
    setNotes(updatedNotes);
  };

  const deleteNote = async (noteId: string) => {
    await removeNote(noteId);
    setNotes(await getNotes());
  };

  return (
    <AppContext.Provider
      value={{
        preferences,
        updatePreferences,
        notes,
        addNote,
        deleteNote,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};