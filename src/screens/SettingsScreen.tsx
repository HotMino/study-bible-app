import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { isBibleHubConfigured } from '../config';

const TRANSLATIONS = [
  { id: 'kjv', name: 'King James Version' },
  { id: 'esv', name: 'English Standard Version' },
  { id: 'niv', name: 'New International Version' },
  { id: 'nkjv', name: 'New King James Version' },
  { id: 'nasb', name: 'New American Standard Bible' },
  { id: 'web', name: 'World English Bible' },
];

const FONT_SIZES = [14, 16, 18, 20, 22, 24];

const SettingsScreen = () => {
  const { preferences, updatePreferences } = useApp();

  const selectTranslation = async (translationId: string) => {
    await updatePreferences({ translation: translationId });
  };

  const handleFontChange = async (size: number) => {
    await updatePreferences({ fontSize: size });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Translation</Text>
      <View style={styles.section}>
        {TRANSLATIONS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.option,
              preferences.translation === t.id && styles.optionSelected,
            ]}
            onPress={() => selectTranslation(t.id)}
          >
            <Text
              style={[
                styles.optionText,
                preferences.translation === t.id && styles.optionTextSelected,
              ]}
            >
              {t.name}
            </Text>
            {preferences.translation === t.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Font Size</Text>
      <View style={styles.section}>
        <View style={styles.fontSizeRow}>
          {FONT_SIZES.map(size => (
            <TouchableOpacity
              key={size}
              style={[
                styles.fontOption,
                preferences.fontSize === size && styles.fontOptionSelected,
              ]}
              onPress={() => handleFontChange(size)}
            >
              <Text
                style={[
                  styles.fontLabel,
                  { fontSize: size },
                  preferences.fontSize === size && styles.fontLabelSelected,
                ]}
              >
                A
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.currentFontSize}>
          Current size: {preferences.fontSize}px
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Original Language Study</Text>
      <View style={styles.section}>
        <View style={[styles.featureInfo, styles.statusRow]}>
          <View style={styles.statusIconWrap}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isBibleHubConfigured() ? '#27ae60' : '#e67e22' },
              ]}
            />
          </View>
          <View style={styles.statusTextWrap}>
            <Text style={styles.featureTitle}>
              {isBibleHubConfigured() ? 'BibleHub API Configured' : 'BibleHub API Not Configured'}
            </Text>
            <Text style={styles.featureDescription}>
              {isBibleHubConfigured()
                ? 'Hebrew/Greek word study is active. Tap any word in a verse for its Strong\'s definition.'
                : 'Add EXPO_PUBLIC_BIBLEHUB_API_KEY to your .env file (see .env.example) to enable Hebrew/Greek word study.'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Features</Text>
      <View style={styles.section}>
        <View style={styles.featureInfo}>
          <Text style={styles.featureTitle}>Original Language Study</Text>
          <Text style={styles.featureDescription}>
            Tap any word in a verse to see its original Hebrew or Greek word,
            Strong's number, and definition.
          </Text>
        </View>
        <View style={styles.featureInfo}>
          <Text style={styles.featureTitle}>Notes & Highlights</Text>
          <Text style={styles.featureDescription}>
            Long-press a verse to highlight it or add personal notes.
          </Text>
        </View>
      </View>

      <Text style={styles.version}>Study Bible v1.0.0</Text>
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
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: '#e8f4fd',
  },
  optionText: {
    fontSize: 15,
    color: '#2c3e50',
  },
  optionTextSelected: {
    color: '#3498db',
    fontWeight: '600',
  },
  checkmark: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fontSizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontOption: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontOptionSelected: {
    backgroundColor: '#e8f4fd',
  },
  fontLabel: {
    color: '#2c3e50',
  },
  fontLabelSelected: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  currentFontSize: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
    textAlign: 'center',
  },
  featureInfo: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconWrap: {
    padding: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  version: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 12,
    marginTop: 24,
  },
});

export default SettingsScreen;