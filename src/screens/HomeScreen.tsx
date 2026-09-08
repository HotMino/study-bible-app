import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NativeStackNavigationProp } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { getBooks } from '../services/bibleApi';
import { Book } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { preferences } = useApp();
  const [books, setBooks] = useState<Book[]>([]);
  const [lastRead, setLastRead] = useState(preferences.lastReadPosition);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const allBooks = await getBooks();
    setBooks(allBooks);
    setLastRead(preferences.lastReadPosition);
  };

  const navigateToBook = (bookId: string, chapter: number) => {
    navigation.navigate('Chapters', { bookId });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Study Bible</Text>

      {lastRead && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToBook(lastRead.bookId, lastRead.chapter)}
        >
          <Text style={styles.cardTitle}>Continue Reading</Text>
          <Text style={styles.cardText}>
            {lastRead.bookId.charAt(0).toUpperCase() + lastRead.bookId.slice(1)}{' '}
            {lastRead.chapter}:{lastRead.verse}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Old Testament</Text>
      <View style={styles.bookGrid}>
        {books
          .filter(b => b.testament === 'old')
          .map(book => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => navigateToBook(book.id, 1)}
            >
              <Text style={styles.bookName}>{book.name}</Text>
            </TouchableOpacity>
          ))}
      </View>

      <Text style={styles.sectionTitle}>New Testament</Text>
      <View style={styles.bookGrid}>
        {books
          .filter(b => b.testament === 'new')
          .map(book => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => navigateToBook(book.id, 1)}
            >
              <Text style={styles.bookName}>{book.name}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  bookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  bookItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bookName: {
    fontSize: 14,
    color: '#34495e',
  },
});

export default HomeScreen;