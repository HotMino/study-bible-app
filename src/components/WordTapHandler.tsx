import React from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

interface WordData {
  word: string;
  verse: string;
  strongsNumber?: string;
}

interface WordTapHandlerProps {
  text: string;
  verseNumber: number;
  interlinear: Array<{ strongsNumber: string; english: string }> | null;
  onWordPress: (verse: string, word: string, strongsNumber?: string) => void;
  highlightColor?: string;
  fontSize: number;
}

const WordTapHandler: React.FC<WordTapHandlerProps> = ({
  text,
  verseNumber,
  interlinear,
  onWordPress,
  highlightColor,
  fontSize,
}) => {
  if (!interlinear) {
    // If no interlinear data, the whole verse is tappable
    return (
      <View style={styles.verseContainer}>
        <Text style={styles.verseNumber}>{"\u00A0"} {verseNumber}</Text>
        <TouchableWithoutFeedback
          onPress={() => onWordPress(String(verseNumber), text)}
        >
          <Text style={[styles.verseText, { fontSize }]}>
            {highlightColor ? (
              <Text style={{ backgroundColor: highlightColor }}>{text}</Text>
            ) : (
              text
            )}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  // Split text into words and match with interlinear data by position
  const textWords = text.split(/\s+/);
  const interlinearWords = interlinear.slice(0, textWords.length);

  return (
    <View style={styles.verseContainer}>
      <Text style={styles.verseNumber}>{"\u00A0"} {verseNumber}</Text>
      <View style={styles.wordContainer}>
        {textWords.map((word, index) => {
          const strongData = interlinearWords[index];
          const underlined = strongData && strongData.strongsNumber;
          return (
            <TouchableWithoutFeedback
              key={`${verseNumber}-${index}`}
              onPress={() =>
                onWordPress(
                  String(verseNumber),
                  word,
                  strongData?.strongsNumber || undefined
                )
              }
            >
              <Text
                style={[
                  styles.verseText,
                  { fontSize },
                  underlined && { color: '#3498db' },
                ]}
              >
                {highlightColor ? (
                  <Text style={{ backgroundColor: highlightColor }}>{word}</Text>
                ) : (
                  word
                )}
                {' '}
              </Text>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  verseContainer: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  verseNumber: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 8,
    paddingTop: 2,
  },
  verseText: {
    color: '#2c3e50',
    lineHeight: 28,
  },
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
});

export default WordTapHandler;