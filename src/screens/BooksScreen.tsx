import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { useNavigation, NativeStackNavigationProp } from '@react-navigation/native';
import { getBooks } from '../services/bibleApi';
import { Book } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

const BooksScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const allBooks = await getBooks();
    setBooks(allBooks);
  };

  const sections = [
    { title: 'Old Testament', data: books.filter(b => b.testament === 'old') },
    { title: 'New Testament', data: books.filter(b => b.testament === 'new') },
  ];

  const navigateToChapters = (book: Book) => {
    navigation.navigate('Chapters', { bookId: book.id });
  };

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookRow}
      onPress={() => navigateToChapters(item)}
    >
      <Text style={styles.bookName}>{item.name}</Text>
      <Text style={styles.chapterCount}>{item.chapters} chapters</Text>
    </TouchableOpacity>
  );

  return (
    <SectionList
      style={styles.container}
      sections={sections}
      renderItem={renderBook}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookName: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  chapterCount: {
    fontSize: 13,
    color: '#7f8c8d',
  },
});

export default BooksScreen;