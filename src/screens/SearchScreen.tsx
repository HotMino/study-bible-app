import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation, NativeStackNavigationProp } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { searchVerses } from '../services/bibleApi';
import { SearchResult } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

const SearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { preferences } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setSearching(true);
    setError(null);
    try {
      const searchResults = await searchVerses(query.trim(), preferences.translation);
      setResults(searchResults);
      setHasSearched(true);
    } catch (e) {
      setError('Search failed. Check your connection and try again.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const navigateToVerse = (result: SearchResult) => {
    navigation.navigate('Verses', {
      bookId: result.verse.bookId,
      chapter: result.verse.chapter,
    });
  };

  const renderResult = ({ item }: { item: SearchResult }) => {
    const { verse } = item;
    // Highlight the search term in text
    const highlightTerm = (text: string) => {
      if (!query.trim()) return text;
      const regex = new RegExp(`(${query.trim()})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, index) =>
        regex.test(part) ? (
          <Text key={index} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      );
    };

    return (
      <TouchableOpacity style={styles.resultItem} onPress={() => navigateToVerse(item)}>
        <Text style={styles.resultRef}>
          {verse.bookId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}{' '}
          {verse.chapter}:{verse.verse}
        </Text>
        <Text style={styles.resultText} numberOfLines={3}>
          {highlightTerm(verse.text)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search the Bible..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {searching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {!searching && !error && hasSearched && results.length === 0 && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No results found</Text>
        </View>
      )}

      {!searching && results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(item) => `${item.verse.bookId}-${item.verse.chapter}-${item.verse.verse}`}
          contentContainerStyle={styles.results}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {!searching && !hasSearched && !error && (
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>Search Tips</Text>
          <Text style={styles.tipText}>
            Search for words or phrases across the entire Bible. Results will
            appear in the current translation ({preferences.translation.toUpperCase()}).
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2c3e50',
  },
  searchButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#7f8c8d',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    padding: 20,
  },
  noResults: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  results: {
    padding: 16,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resultRef: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  highlight: {
    backgroundColor: '#fff3cd',
    fontWeight: 'bold',
  },
  tipContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SearchScreen;