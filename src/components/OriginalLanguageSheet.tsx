import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { InterlinearWord, StrongEntry } from '../types';
import { getStrongEntry } from '../services/bibleApi';
import { getCachedStrongEntry, cacheStrongEntry } from '../storage/strongsStorage';

interface OriginalLanguageSheetProps {
  visible: boolean;
  onClose: () => void;
  word: string;
  verse: string;
  strongsNumber?: string;
}

const OriginalLanguageSheet: React.FC<OriginalLanguageSheetProps> = ({
  visible,
  onClose,
  word,
  verse,
  strongsNumber,
}) => {
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<StrongEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && strongsNumber) {
      loadEntry();
    } else if (visible) {
      // No Strong's number available
      setLoading(false);
      setEntry(null);
      setError('No original language data available for this word.');
    }
  }, [visible, strongsNumber]);

  const loadEntry = async () => {
    setLoading(true);
    setError(null);
    setEntry(null);
    try {
      if (!strongsNumber) return;
      const cached = await getCachedStrongEntry(strongsNumber);
      if (cached) {
        setEntry(cached);
        return;
      }
      const data = await getStrongEntry(strongsNumber);
      setEntry(data);
      await cacheStrongEntry(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '';
      setError(
        message ||
          'Unable to load word data. Check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDefinitionItem = (label: string, value?: string) => {
    if (!value) return null;
    return (
      <View style={styles.definitionSection}>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionText}>{value}</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity style={styles.sheet} activeOpacity={1}>
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={styles.content} bounces={false}>
            <Text style={styles.selectedWordTitle}>Selected Word</Text>
            <Text style={styles.selectedWord}>{word}</Text>
            <Text style={styles.verseText}>"{verse}"</Text>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Loading original language...</Text>
              </View>
            )}

            {error && !loading && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {entry && (
              <>
                <View style={styles.headerRow}>
                  <Text style={styles.strongsBadge}>{entry.strongsNumber}</Text>
                  <Text style={styles.languageLabel}>
                    {entry.language === 'hebrew' ? 'Hebrew' : 'Greek'}
                  </Text>
                </View>

                <View style={styles.originalWordSection}>
                  <Text style={styles.originalWord}>
                    {entry.originalWord}
                  </Text>
                  <Text style={styles.transliteration}>
                    {entry.transliteration}
                    {entry.pronunciation ? ` (${entry.pronunciation})` : ''}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Part of Speech</Text>
                  <Text style={styles.detailValue}>{entry.partOfSpeech || 'Unknown'}</Text>
                </View>

                {entry.lexicalSummary && (
                  <View style={styles.definitionSection}>
                    <Text style={styles.sectionLabel}>Lexical Summary</Text>
                    <Text style={styles.sectionText}>{entry.lexicalSummary}</Text>
                  </View>
                )}

                {entry.wordOrigin && (
                  <View style={styles.definitionSection}>
                    <Text style={styles.sectionLabel}>Word Origin</Text>
                    <Text style={styles.sectionText}>{entry.wordOrigin}</Text>
                  </View>
                )}

                {renderDefinitionItem(
                  'Strong\'s Exhaustive Concordance',
                  entry.definitions.strongsExhaustive
                )}
                {renderDefinitionItem('NAS Definition', entry.definitions.nas)}
                {renderDefinitionItem(
                  entry.language === 'hebrew'
                    ? 'Brown-Driver-Briggs'
                    : "Thayer's Greek Lexicon",
                  entry.language === 'hebrew'
                    ? entry.definitions.brownDriverBriggs
                    : entry.definitions.thayers
                )}

                {entry.concordance.length > 0 && (
                  <View style={styles.definitionSection}>
                    <Text style={styles.sectionLabel}>Concordance Usage</Text>
                    {entry.concordance.map((item, index) => (
                      <View key={index} style={styles.concordanceItem}>
                        <Text style={styles.concordanceRef}>{item.reference}</Text>
                        <Text style={styles.concordanceText}>{item.text}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '50%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  selectedWordTitle: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  selectedWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  verseText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
    paddingLeft: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  strongsBadge: {
    backgroundColor: '#3498db',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  languageLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  originalWordSection: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  originalWord: {
    fontSize: 36,
    color: '#2c3e50',
    fontWeight: '600',
  },
  transliteration: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  definitionSection: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
  concordanceItem: {
    marginBottom: 10,
  },
  concordanceRef: {
    fontSize: 13,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 2,
  },
  concordanceText: {
    fontSize: 13,
    color: '#34495e',
    lineHeight: 18,
  },
});

export default OriginalLanguageSheet;