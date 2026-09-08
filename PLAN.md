# Study Bible App - Development Plan

## Overview
A React Native mobile app for studying the Bible with features for reading, searching, note-taking, and cross-references.

## Technology Stack
- **Framework**: React Native with Expo (managed workflow)
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: React Context + useReducer
- **Local Storage**: AsyncStorage (notes, highlights, preferences)
- **API**: bible-api.com for Bible text
- **UI Library**: React Native Paper or custom components

## App Structure

### Screens
1. **HomeScreen** - Dashboard with quick access, reading plans, recent
2. **BooksScreen** - List of Bible books (Old & New Testament)
3. **ChaptersScreen** - Chapters for selected book
4. **VerseScreen** - Chapter content with verse display
5. **SearchScreen** - Full-text search across translations
6. **NotesScreen** - Personal notes and highlights
7. **SettingsScreen** - Translation selection, theme, preferences

### Key Components
- `BookList` - Scrollable list of Bible books
- `ChapterList` - Grid/list of chapters
- `VerseDisplay` - Individual verse with tap interactions
- `WordTapHandler` - Detects word taps, fetches Strong's data
- `OriginalLanguageSheet` - Bottom sheet showing Hebrew/Greek word details
- `SearchBar` - Search input with filters
- `NoteEditor` - Create/edit notes
- `HighlightPicker` - Color selection for highlights
- `TranslationSelector` - Switch between translations
- `CrossReferencePanel` - Related verses display

## Data Layer

### API Service (`src/services/bibleApi.ts`)
```typescript
// Endpoints to implement:
- getBooks(): Promise<Book[]>
- getChapters(bookId: string): Promise<Chapter[]>
- getChapter(bookId: string, chapter: number): Promise<Verse[]>
- searchVerses(query: string, translation?: string): Promise<SearchResult[]>
- getCrossReferences(verseId: string): Promise<CrossReference[]>
- getInterlinearVerse(book: string, chapter: number, verse: number): Promise<InterlinearWord[]>
- getStrong'sEntry(strongsNumber: string): Promise<Strong'sEntry>
```

### Local Storage (`src/storage/`)
- `notesStorage.ts` - CRUD for personal notes
- `highlightsStorage.ts` - Verse highlights with colors
- `preferencesStorage.ts` - User settings, last read position
- `interlinearStorage.ts` - Cache interlinear verse data for offline use
- `strongsStorage.ts` - Cache Strong's lexicon entries

### Data Models (`src/types/`)
```typescript
interface Book {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters: number;
}

interface Verse {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

interface InterlinearWord {
  strongsNumber: string;
  originalWord: string; // Hebrew/Greek script
  transliteration: string;
  english: string; // gloss/translation
  morphology: string;
}

interface Strong'sEntry {
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
    brownDriverBriggs?: string; // Hebrew only
    thayers?: string; // Greek only
  };
  wordOrigin: string;
  concordance: Array<{ reference: string; text: string }>;
}

interface Note {
  id: string;
  verseId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Highlight {
  verseId: string;
  color: string;
  createdAt: Date;
}
```

## Features Implementation

### 1. Bible Reading
- Book → Chapter → Verse navigation
- Smooth scrolling through chapters
- Remember last read position
- Day/night mode

### 0. Original Language Study (Hebrew/Greek)
- **Tap any word** in a verse to see its original language
- Display **Strong's number**, **original word** (Hebrew/Greek script), **transliteration**, and **definition**
- Show **part of speech**, **pronunciation**, and **word origin**
- Include **Brown-Driver-Briggs** (Hebrew) or **Thayer's** (Greek) lexicon entries
- Show **concordance usage** - other verses where this word appears
- **Bottom sheet UI** that slides up when word is tapped
- **Offline support** - cache interlinear data locally after first fetch

#### Data Source
- Use **BibleHub API** (via Parse.bot) for interlinear verse data
- Endpoint: `get_interlinear_verse` - returns word-by-word Strong's numbers
- Endpoint: `get_hebrew_lexicon` / `get_greek_lexicon` - full definitions
- Cache responses in AsyncStorage for offline use

### 2. Search
- Full-text search across all books
- Filter by book, testament, translation
- Highlight search results in context
- Recent searches

### 3. Notes & Highlights
- Long-press verse to highlight or add note
- Color-coded highlights (5+ colors)
- Rich text notes (basic formatting)
- Filter notes by book/chapter

### 4. Cross-References
- Tap verse to see related verses
- Grouped by topic/theme
- Quick navigation to referenced verses

### 5. Multiple Translations
- Default: KJV (public domain)
- Add ESV, NIV via API (if available)
- Parallel view option
- Translation comparison

## File Structure
```
AIDE/
├── app.json
├── package.json
├── tsconfig.json
├── src/
│   ├── components/
│   │   ├── BookList.tsx
│   │   ├── ChapterList.tsx
│   │   ├── VerseDisplay.tsx
│   │   ├── WordTapHandler.tsx
│   │   ├── OriginalLanguageSheet.tsx
│   │   ├── SearchBar.tsx
│   │   ├── NoteEditor.tsx
│   │   └── HighlightPicker.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── BooksScreen.tsx
│   │   ├── ChaptersScreen.tsx
│   │   ├── VerseScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── NotesScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/
│   │   └── bibleApi.ts
│   ├── storage/
│   │   ├── notesStorage.ts
│   │   ├── highlightsStorage.ts
│   │   ├── preferencesStorage.ts
│   │   ├── interlinearStorage.ts
│   │   └── strongsStorage.ts
│   ├── types/
│   │   └── index.ts
│   ├── context/
│   │   └── AppContext.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── utils/
│       └── helpers.ts
├── assets/
│   └── icons/
└── App.tsx
```

## Implementation Order

### Phase 1: Core Setup (Steps 1-3)
1. Initialize Expo project with TypeScript
2. Install dependencies (navigation, async-storage, etc.)
3. Set up project structure and types

### Phase 2: Bible Reading (Steps 4-6)
4. Create API service layer
5. Build book/chapter/verse screens
6. Implement navigation flow

### Phase 3: Original Language Study (Steps 7-8)
7. Add interlinear verse API integration
8. Build word tap handler and bottom sheet UI

### Phase 4: Search (Step 9)
9. Add search screen with API integration

### Phase 5: Personalization (Steps 10-11)
10. Implement notes and highlights
11. Add local storage persistence

### Phase 6: Enhanced Features (Steps 12-13)
12. Add cross-references
13. Implement multiple translations

### Phase 7: Polish (Step 14)
14. Style UI, add animations, test on device

## API Considerations
- bible-api.com may have rate limits
- Cache responses locally for offline use
- Handle API errors gracefully
- Consider adding fallback translations
- **BibleHub API key** is required for Hebrew/Greek word study:
  - Add `EXPO_PUBLIC_BIBLEHUB_API_KEY=pmx_...` to a `.env` file (see `.env.example`)
  - Create a key at parse.bot → Settings → API Keys
  - Sent as `X-API-Key` header to `https://api.parse.bot/scraper/0a2a8344-f84d-41c5-9ec5-793cc6306540/*`
  - Missing/invalid keys produce clear error messages in the original-language bottom sheet
  - Status shown in Settings → Original Language Study

## Next Steps
1. Confirm this plan looks good
2. Start with Phase 1: Project setup
3. Build incrementally, testing each feature