import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Memory, EmotionType } from '../../types/Memory';
import { colors, emotionColors } from '../../theme/colors';

function getEmotionColor(emotion: EmotionType): string {
  return emotionColors[emotion] ?? '#FFFFFF';
}

interface MemoryCardProps {
  memory: Memory;
  onPress: (memory: Memory) => void;
  onLongPress: (memory: Memory) => void;
}

export default function MemoryCard({ memory, onPress, onLongPress }: MemoryCardProps) {
  const starColor = getEmotionColor(memory.emotion);

  const cardContent = (
    <>
      <View style={styles.header}>
        <Text style={[styles.star, { color: starColor, fontSize: 16 + memory.importance * 4 }]}>★</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{memory.title}</Text>
          <Text style={[styles.date, memory.photoUri && styles.textOnImage]}>
            {memory.date.toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text style={[styles.description, memory.photoUri && styles.textOnImage]} numberOfLines={2}>
        {memory.description}
      </Text>
      <View style={styles.tags}>
        <View style={[styles.tag, { borderColor: starColor }, memory.photoUri && styles.tagOnImage]}>
          <Text style={[styles.tagText, { color: starColor }]}>{memory.emotion}</Text>
        </View>
        <View style={[styles.tag, memory.photoUri && styles.tagOnImage]}>
          <Text style={styles.tagText}>{memory.category}</Text>
        </View>
        {memory.location && (
          <View style={[styles.tag, memory.photoUri && styles.tagOnImage]}>
            <Text style={styles.tagText}>📍 {memory.location}</Text>
          </View>
        )}
      </View>
    </>
  );

  if (memory.photoUri) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(memory)}
        onLongPress={() => onLongPress(memory)}
      >
        <ImageBackground
          source={{ uri: memory.photoUri }}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <View style={styles.cardOverlay}>{cardContent}</View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(memory)}
      onLongPress={() => onLongPress(memory)}
    >
      {cardContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImage: {
    borderRadius: 16,
  },
  cardOverlay: {
    backgroundColor: 'rgba(5, 5, 16, 0.45)',
    borderRadius: 16,
    padding: 16,
  },
  textOnImage: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  tagOnImage: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  star: {
    fontSize: 24,
    marginRight: 10,
  },
  titleRow: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
});
