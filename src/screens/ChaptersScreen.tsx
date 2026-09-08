import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, NativeStackNavigationProp } from '@react-navigation/native';
import { getBooks } from '../services/bibleApi';
import { Book } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type ChaptersRoute = RouteProp<RootStackParamList, 'Chapters'>;

const ChaptersScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ChaptersRoute>();
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    setLoading(true);
    try {
      const books = await getBooks();
      const foundBook = books.find(b => b.id === bookId);
      setBook(foundBook || null);
      // Set navigation title
      if (foundBook) {
        navigation.setOptions({ title: foundBook.name });
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToVerses = (chapter: number) => {
    navigation.navigate('Verses', { bookId, chapter });
  };

  const renderChapter = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={styles.chapterButton}
      onPress={() => navigateToVerses(item)}
    >
      <Text style={styles.chapterNumber}>{item}</Text>
    </TouchableOpacity>
  );

  if (loading || !book) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={chapters}
      renderItem={renderChapter}
      keyExtractor={item => String(item)}
      numColumns={4}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 16,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 12,
  },
  chapterButton: {
    flex: 1,
    minWidth: 60,
    maxWidth: 70,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
});

export default ChaptersScreen;