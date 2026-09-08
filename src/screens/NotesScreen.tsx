import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Note } from '../types';
import { formatReferenceFromId } from '../utils/helpers';

const NotesScreen = () => {
  const { notes, deleteNote } = useApp();

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderNote = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteRef}>{formatReferenceFromId(item.verseId)}</Text>
        <Text style={styles.noteDate}>{formatDate(item.updatedAt)}</Text>
      </View>
      <Text style={styles.noteContent} numberOfLines={4}>
        {item.content}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNote(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {sortedNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No Notes Yet</Text>
          <Text style={styles.emptyText}>
            Long-press a verse while reading to add notes and highlights.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedNotes}
          renderItem={renderNote}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.content}
        />
      )}
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
  },
  noteItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteRef: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
    flex: 1,
    marginRight: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#aaa',
  },
  noteContent: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: '#e74c3c',
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotesScreen;