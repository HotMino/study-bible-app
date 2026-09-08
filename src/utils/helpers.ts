import { Book } from '../types';

export const getBookName = (bookId: string): string => {
  const name = bookId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return name;
};

export const getBookById = (bookId: string): Book | undefined => {
  const { BIBLE_BOOKS } = require('../services/bibleApi');
  return BIBLE_BOOKS.find((b: Book) => b.id === bookId);
};

export const formatReference = (bookName: string, chapter: number, verse: number): string => {
  return `${bookName} ${chapter}:${verse}`;
};

export const formatReferenceFromId = (verseId: string): string => {
  // verseId format: bookId-chapter-verse (e.g. "1-samuel-2-5", "song-of-solomon-1-2")
  const parts = verseId.split('-');
  if (parts.length < 3) return verseId.replace(/-/g, ' ');
  const chapterNum = parts[parts.length - 2];
  const verseNum = parts[parts.length - 1];
  const bookName = parts
    .slice(0, -2)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return `${bookName} ${chapterNum}:${verseNum}`;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};