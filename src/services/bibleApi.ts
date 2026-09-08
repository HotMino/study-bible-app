import { Book, Chapter, Verse, InterlinearWord, StrongEntry, SearchResult, CrossReference } from '../types';
import { config, isBibleHubConfigured, getBibleHubAuthHeader } from '../config';

// Bible book data
const BIBLE_BOOKS: Book[] = [
  // Old Testament
  { id: 'genesis', name: 'Genesis', testament: 'old', chapters: 50 },
  { id: 'exodus', name: 'Exodus', testament: 'old', chapters: 40 },
  { id: 'leviticus', name: 'Leviticus', testament: 'old', chapters: 27 },
  { id: 'numbers', name: 'Numbers', testament: 'old', chapters: 36 },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'old', chapters: 34 },
  { id: 'joshua', name: 'Joshua', testament: 'old', chapters: 24 },
  { id: 'judges', name: 'Judges', testament: 'old', chapters: 21 },
  { id: 'ruth', name: 'Ruth', testament: 'old', chapters: 4 },
  { id: '1-samuel', name: '1 Samuel', testament: 'old', chapters: 31 },
  { id: '2-samuel', name: '2 Samuel', testament: 'old', chapters: 24 },
  { id: '1-kings', name: '1 Kings', testament: 'old', chapters: 22 },
  { id: '2-kings', name: '2 Kings', testament: 'old', chapters: 25 },
  { id: '1-chronicles', name: '1 Chronicles', testament: 'old', chapters: 29 },
  { id: '2-chronicles', name: '2 Chronicles', testament: 'old', chapters: 36 },
  { id: 'ezra', name: 'Ezra', testament: 'old', chapters: 10 },
  { id: 'nehemiah', name: 'Nehemiah', testament: 'old', chapters: 13 },
  { id: 'esther', name: 'Esther', testament: 'old', chapters: 10 },
  { id: 'job', name: 'Job', testament: 'old', chapters: 42 },
  { id: 'psalms', name: 'Psalms', testament: 'old', chapters: 150 },
  { id: 'proverbs', name: 'Proverbs', testament: 'old', chapters: 31 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'old', chapters: 12 },
  { id: 'song-of-solomon', name: 'Song of Solomon', testament: 'old', chapters: 8 },
  { id: 'isaiah', name: 'Isaiah', testament: 'old', chapters: 66 },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'old', chapters: 52 },
  { id: 'lamentations', name: 'Lamentations', testament: 'old', chapters: 5 },
  { id: 'ezekiel', name: 'Ezekiel', testament: 'old', chapters: 48 },
  { id: 'daniel', name: 'Daniel', testament: 'old', chapters: 12 },
  { id: 'hosea', name: 'Hosea', testament: 'old', chapters: 14 },
  { id: 'joel', name: 'Joel', testament: 'old', chapters: 3 },
  { id: 'amos', name: 'Amos', testament: 'old', chapters: 9 },
  { id: 'obadiah', name: 'Obadiah', testament: 'old', chapters: 1 },
  { id: 'jonah', name: 'Jonah', testament: 'old', chapters: 4 },
  { id: 'micah', name: 'Micah', testament: 'old', chapters: 7 },
  { id: 'nahum', name: 'Nahum', testament: 'old', chapters: 3 },
  { id: 'habakkuk', name: 'Habakkuk', testament: 'old', chapters: 3 },
  { id: 'zephaniah', name: 'Zephaniah', testament: 'old', chapters: 3 },
  { id: 'haggai', name: 'Haggai', testament: 'old', chapters: 2 },
  { id: 'zechariah', name: 'Zechariah', testament: 'old', chapters: 14 },
  { id: 'malachi', name: 'Malachi', testament: 'old', chapters: 4 },
  // New Testament
  { id: 'matthew', name: 'Matthew', testament: 'new', chapters: 28 },
  { id: 'mark', name: 'Mark', testament: 'new', chapters: 16 },
  { id: 'luke', name: 'Luke', testament: 'new', chapters: 24 },
  { id: 'john', name: 'John', testament: 'new', chapters: 21 },
  { id: 'acts', name: 'Acts', testament: 'new', chapters: 28 },
  { id: 'romans', name: 'Romans', testament: 'new', chapters: 16 },
  { id: '1-corinthians', name: '1 Corinthians', testament: 'new', chapters: 16 },
  { id: '2-corinthians', name: '2 Corinthians', testament: 'new', chapters: 13 },
  { id: 'galatians', name: 'Galatians', testament: 'new', chapters: 6 },
  { id: 'ephesians', name: 'Ephesians', testament: 'new', chapters: 6 },
  { id: 'philippians', name: 'Philippians', testament: 'new', chapters: 4 },
  { id: 'colossians', name: 'Colossians', testament: 'new', chapters: 4 },
  { id: '1-thessalonians', name: '1 Thessalonians', testament: 'new', chapters: 5 },
  { id: '2-thessalonians', name: '2 Thessalonians', testament: 'new', chapters: 3 },
  { id: '1-timothy', name: '1 Timothy', testament: 'new', chapters: 6 },
  { id: '2-timothy', name: '2 Timothy', testament: 'new', chapters: 4 },
  { id: 'titus', name: 'Titus', testament: 'new', chapters: 3 },
  { id: 'philemon', name: 'Philemon', testament: 'new', chapters: 1 },
  { id: 'hebrews', name: 'Hebrews', testament: 'new', chapters: 13 },
  { id: 'james', name: 'James', testament: 'new', chapters: 5 },
  { id: '1-peter', name: '1 Peter', testament: 'new', chapters: 5 },
  { id: '2-peter', name: '2 Peter', testament: 'new', chapters: 3 },
  { id: '1-john', name: '1 John', testament: 'new', chapters: 5 },
  { id: '2-john', name: '2 John', testament: 'new', chapters: 1 },
  { id: '3-john', name: '3 John', testament: 'new', chapters: 1 },
  { id: 'jude', name: 'Jude', testament: 'new', chapters: 1 },
  { id: 'revelation', name: 'Revelation', testament: 'new', chapters: 22 },
];

export const getBooks = async (): Promise<Book[]> => {
  return BIBLE_BOOKS;
};

const buildBibleHubUrl = (endpoint: string, params: Record<string, string>): string => {
  const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return `${config.biblehub.base}/scraper/${config.biblehub.scraperId}/${endpoint}${query ? `?${query}` : ''}`;
};

const bibleHubRequest = async (endpoint: string, params: Record<string, string>): Promise<any> => {
  if (!isBibleHubConfigured()) {
    throw new Error(
      'BibleHub API key is not configured. Add EXPO_PUBLIC_BIBLEHUB_API_KEY to your .env file.'
    );
  }
  try {
    const response = await fetch(buildBibleHubUrl(endpoint, params), {
      headers: getBibleHubAuthHeader(),
    });
    if (response.status === 401) {
      throw new Error('Invalid BibleHub API key. Check EXPO_PUBLIC_BIBLEHUB_API_KEY in your .env file.');
    }
    if (response.status === 429) {
      throw new Error('BibleHub API rate limit exceeded. Try again in a minute.');
    }
    if (!response.ok) {
      throw new Error(`BibleHub API error (HTTP ${response.status}).`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('BibleHub')) throw error;
    throw new Error('Network error contacting BibleHub. Check your connection.');
  }
};

export const getChapters = async (bookId: string): Promise<Chapter[]> => {
  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  if (!book) throw new Error('Book not found');
  
  const chapters: Chapter[] = [];
  for (let i = 1; i <= book.chapters; i++) {
    chapters.push({ number: i, verses: 0 }); // Verses will be fetched when chapter is loaded
  }
  return chapters;
};

export const getChapter = async (bookId: string, chapter: number, translation: string = 'kjv'): Promise<Verse[]> => {
  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  if (!book) throw new Error('Book not found');
  
  try {
    const response = await fetch(
      `${config.bibleApiBase}/${book.name}+${chapter}?translation=${translation}`
    );
    const data = await response.json();
    
    if (data.error) throw new Error(data.error);
    
    return data.verses.map((v: any) => ({
      id: `${bookId}-${chapter}-${v.verse}`,
      bookId,
      chapter,
      verse: v.verse,
      text: v.text.trim(),
      translation,
    }));
  } catch (error) {
    console.error('Error fetching chapter:', error);
    throw error;
  }
};

export const searchVerses = async (query: string, translation: string = 'kjv'): Promise<SearchResult[]> => {
  try {
    const response = await fetch(
      `${config.bibleApiBase}/search?q=${encodeURIComponent(query)}&translation=${translation}`
    );
    const data = await response.json();
    
    if (data.error) throw new Error(data.error);
    
    return data.map((result: any) => ({
      verse: {
        id: `${result.book_id}-${result.chapter}-${result.verse}`,
        bookId: result.book_id.toLowerCase().replace(/\s+/g, '-'),
        chapter: result.chapter,
        verse: result.verse,
        text: result.text,
        translation,
      },
      relevance: result.relevance || 1,
    }));
  } catch (error) {
    console.error('Error searching verses:', error);
    throw error;
  }
};

export const getInterlinearVerse = async (
  book: string,
  chapter: number,
  verse: number
): Promise<InterlinearWord[]> => {
  const data = await bibleHubRequest('get_interlinear_verse', {
    book: String(book),
    chapter: String(chapter),
    verse: String(verse),
  });

  if (!data.success) throw new Error('Failed to fetch interlinear data');

  return data.data.words.map((word: any) => ({
    strongsNumber: word.strongs_number,
    originalWord: word.word,
    transliteration: word.transliteration,
    english: word.english,
    morphology: word.morphology,
  }));
};

export const getStrongEntry = async (strongsNumber: string): Promise<StrongEntry> => {
  const isHebrew = strongsNumber.startsWith('H');
  const endpoint = isHebrew ? 'get_hebrew_lexicon' : 'get_greek_lexicon';
  const number = strongsNumber.replace(/[HG]/, '');

  const data = await bibleHubRequest(endpoint, {
    strongs_number: number,
  });

  if (!data.success) throw new Error('Failed to fetch Strong\'s entry');

  return {
    strongsNumber,
    language: isHebrew ? 'hebrew' : 'greek',
    originalWord: data.data.original_word,
    transliteration: data.data.transliteration,
    pronunciation: data.data.pronunciation || data.data.phonetic_spelling,
    partOfSpeech: data.data.part_of_speech,
    lexicalSummary: data.data.lexical_summary,
    definitions: {
      strongsExhaustive: data.data.definitions?.strongs_exhaustive,
      nas: data.data.definitions?.nas,
      brownDriverBriggs: data.data.brown_driver_briggs,
      thayers: data.data.thayers,
    },
    wordOrigin: data.data.word_origin,
    concordance: data.data.concordance || [],
  };
};

export const getCrossReferences = async (
  book: string,
  chapter: number,
  verse: number
): Promise<CrossReference[]> => {
  const data = await bibleHubRequest('get_cross_references', {
    book: String(book),
    chapter: String(chapter),
    verse: String(verse),
  });

  if (data && data.status === 'error') {
    throw new Error(data.message || 'Failed to fetch cross references');
  }

  const raw = data?.data ?? data;
  const list: any[] = Array.isArray(raw)
    ? raw
    : raw?.references ?? raw?.results ?? [];

  return list.map((item: any) => ({
    book: item.book || '',
    chapter: Number(item.chapter) || 0,
    verse: Number(item.verse) || 0,
    reference: item.reference || item.ref || '',
    text: item.text || '',
    topic: item.topic || item.theme || undefined,
  }));
};