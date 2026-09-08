export interface Book {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters: number;
}

export interface Chapter {
  number: number;
  verses: number;
}

export interface Verse {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface InterlinearWord {
  strongsNumber: string;
  originalWord: string;
  transliteration: string;
  english: string;
  morphology: string;
}

export interface StrongEntry {
  strongsNumber: string;
  language: 'hebrew' | 'greek';
  originalWord: string;
  transliteration: string;
  pronunciation: string;
  partOfSpeech: string;
  lexicalSummary: string;
  definitions: {
    strongsExhaustive?: string;
    nas?: string;
    brownDriverBriggs?: string;
    thayers?: string;
  };
  wordOrigin: string;
  concordance: Array<{ reference: string; text: string }>;
}

export interface Note {
  id: string;
  verseId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Highlight {
  verseId: string;
  color: string;
  createdAt: Date;
}

export interface SearchResult {
  verse: Verse;
  relevance: number;
}

export interface CrossReference {
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text?: string;
  topic?: string;
}

export interface UserPreferences {
  translation: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  lastReadPosition?: {
    bookId: string;
    chapter: number;
    verse: number;
  };
}