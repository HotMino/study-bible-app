import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, NativeStackNavigationProp } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { getBooks, getChapter, getInterlinearVerse } from '../services/bibleApi';
import { getCachedInterlinear, cacheInterlinear } from '../storage/interlinearStorage';
import { getHighlightsForChapter, getHighlightsForVerse, saveHighlight, deleteHighlight, getHighlightColors } from '../storage/highlightsStorage';
import { getNotesForVerse, deleteNotesForVerse } from '../storage/notesStorage';
import { Book, Highlight, InterlinearWord, Note, Verse } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';
import WordTapHandler from '../components/WordTapHandler';
import OriginalLanguageSheet from '../components/OriginalLanguageSheet';
import NoteEditor from '../components/NoteEditor';
import { formatReferenceFromId } from '../utils/helpers';

type VersesRoute = RouteProp<RootStackParamList, 'Verses'>;

const VersesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<VersesRoute>();
  const { bookId, chapter } = route.params;
  const { preferences, addNote } = useApp();
  const [book, setBook] = useState<Book | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interlinearCache, setInterlinearCache] = useState<Record<string, InterlinearWord[]>>({});
  const [highlights, setHighlights] = useState<Record<string, Highlight>>({});
  const [selectedWord, setSelectedWord] = useState<{
    word: string;
    verse: string;
    strongsNumber?: string;
  } | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [longPressedVerse, setLongPressedVerse] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteVerseId, setNoteVerseId] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  useEffect(() => {
    loadChapter();
    loadHighlights();
  }, [bookId, chapter, preferences.translation]);

  useEffect(() => {
    if (book) {
      navigation.setOptions({ title: `${book.name} ${chapter}` });
    }
  }, [book, chapter]);

  const loadChapterTitle = async () => {
    const books = await getBooks();
    const found = books.find(b => b.id === bookId);
    setBook(found || null);
  };

  const loadChapter = async () => {
    setLoading(true);
    setError(null);
    try {
      await loadChapterTitle();
      const chapterVerses = await getChapter(bookId, chapter, preferences.translation);
      setVerses(chapterVerses);
    } catch (e) {
      setError('Unable to load this chapter. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadHighlights = async () => {
    const chapterHighlights = await getHighlightsForChapter(bookId, chapter);
    const map: Record<string, Highlight> = {};
    chapterHighlights.forEach(h => {
      map[h.verseId] = h;
    });
    setHighlights(map);
  };

  const getVerseHighlight = async (verseId: string): Promise<Highlight | null> => {
    const highlights = await getHighlightsForVerse(verseId);
    return highlights[0] || null;
  };

  const handleWordPress = async (verseNumber: string, word: string, strongsNumber?: string) => {
    setSelectedWord({ word, verse: verseNumber, strongsNumber });
    setSheetVisible(true);
  };

  const handleLongPress = async (verseId: string) => {
    setLongPressedVerse(verseId);
    setShowActionMenu(true);
    // Load current highlight state
    const existing = await getVerseHighlight(verseId);
    setHighlights(prev => ({
      ...prev,
      [verseId]: existing || undefined as any,
    }));
  };

  const openHighlightPicker = () => {
    setShowActionMenu(false);
    setShowHighlightPicker(true);
  };

  const openNoteEditor = async (verseId: string) => {
    setNoteVerseId(verseId);
    const notes = await getNotesForVerse(verseId);
    setCurrentNote(notes[0] || null);
    setShowActionMenu(false);
    setShowNoteEditor(true);
  };

  const handleSaveNote = async (content: string) => {
    if (noteVerseId) {
      await addNote(noteVerseId, content);
    }
    setShowNoteEditor(false);
    setNoteVerseId(null);
    setCurrentNote(null);
    setLongPressedVerse(null);
  };

  const handleDeleteNote = async () => {
    if (noteVerseId) {
      await deleteNotesForVerse(noteVerseId);
    }
    setShowNoteEditor(false);
    setNoteVerseId(null);
    setCurrentNote(null);
    setLongPressedVerse(null);
  };

  const handleHighlightColor = async (color: string) => {
    if (longPressedVerse) {
      await saveHighlight(longPressedVerse, color);
      const updated = await getVerseHighlight(longPressedVerse);
      setHighlights(prev => ({
        ...prev,
        [longPressedVerse]: updated!,
      }));
    }
    setShowHighlightPicker(false);
    setLongPressedVerse(null);
  };

  const handleRemoveHighlight = async () => {
    if (longPressedVerse) {
      await deleteHighlight(longPressedVerse);
      setHighlights(prev => {
        const next = { ...prev };
        delete next[longPressedVerse];
        return next;
      });
    }
    setShowHighlightPicker(false);
    setLongPressedVerse(null);
  };

  const loadInterlinear = async (verse: Verse) => {
    const cached = await getCachedInterlinear(bookId, chapter, verse.verse);
    if (cached) {
      setInterlinearCache(prev => ({ ...prev, [verse.id]: cached }));
      return;
    }
    try {
      const words = await getInterlinearVerse(book!.name, chapter, verse.verse);
      setInterlinearCache(prev => ({ ...prev, [verse.id]: words }));
      await cacheInterlinear(bookId, chapter, verse.verse, words);
    } catch (e) {
      console.log('No interlinear data for verse', verse.id);
    }
  };

  const renderVerse = ({ item }: { item: Verse }) => {
    const id = `${bookId}-${chapter}-${item.verse}`;
    const interlinear = interlinearCache[id];
    const highlight = highlights[id];

    return (
      <View style={styles.verseRow}>
        <TouchableOpacity
          style={styles.verseContainer}
          activeOpacity={0.9}
          onLongPress={() => handleLongPress(id)}
          onPressIn={() => loadInterlinear(item)}
        >
          <WordTapHandler
            text={item.text}
            verseNumber={item.verse}
            interlinear={interlinear || null}
            onWordPress={handleWordPress}
            highlightColor={highlight?.color}
            fontSize={preferences.fontSize}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // Action menu on long press
  const ActionMenu = () => {
    if (!showActionMenu || !longPressedVerse) return null;
    return (
      <View style={styles.highlightOverlay}>
        <TouchableOpacity
          style={styles.highlightBackdrop}
          onPress={() => {
            setShowActionMenu(false);
            setLongPressedVerse(null);
          }}
        />
        <View style={styles.highlightPicker}>
          <Text style={styles.highlightTitle}>Verse Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={openHighlightPicker}
          >
            <Text style={styles.actionText}>{
              highlights[longPressedVerse] ? 'Change Highlight Color' : 'Add Highlight'
            }</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openNoteEditor(longPressedVerse)}
          >
            <Text style={styles.actionText}>Add / Edit Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Highlight picker modal as inline overlay
  const HighlightPicker = () => {
    if (!showHighlightPicker) return null;
    return (
      <View style={styles.highlightOverlay}>
        <TouchableOpacity
          style={styles.highlightBackdrop}
          onPress={() => setShowHighlightPicker(false)}
        />
        <View style={styles.highlightPicker}>
          <Text style={styles.highlightTitle}>Highlight Color</Text>
          <View style={styles.colorRow}>
            {getHighlightColors().map(color => (
              <TouchableOpacity
                key={color}
                style={[styles.colorCircle, { backgroundColor: color }]}
                onPress={() => handleHighlightColor(color)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveHighlight}
          >
            <Text style={styles.removeText}>Remove Highlight</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading chapter...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadChapter}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={verses}
        renderItem={renderVerse}
        keyExtractor={item => `${item.bookId}-${item.chapter}-${item.verse}`}
        contentContainerStyle={styles.content}
      />
      <ActionMenu />
      <HighlightPicker />
      <OriginalLanguageSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        word={selectedWord?.word || ''}
        verse={selectedWord?.verse || ''}
        strongsNumber={selectedWord?.strongsNumber}
      />
      <NoteEditor
        visible={showNoteEditor}
        onClose={() => {
          setShowNoteEditor(false);
          setNoteVerseId(null);
          setCurrentNote(null);
          setLongPressedVerse(null);
        }}
        onSave={handleSaveNote}
        onDelete={currentNote ? handleDeleteNote : undefined}
        reference={noteVerseId ? formatReferenceFromId(noteVerseId) : ''}
        initialContent={currentNote?.content || ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  verseRow: {
    marginBottom: 8,
  },
  verseContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 12,
    color: '#7f8c8d',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  highlightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  highlightBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  highlightPicker: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 30,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  removeButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  removeText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 15,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default VersesScreen;