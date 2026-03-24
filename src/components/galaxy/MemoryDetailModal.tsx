import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { Memory } from '../../types/Memory';
import { colors, emotionColors } from '../../theme/colors';
import StarField from '../shared/StarField';

interface Props {
  memory: Memory | null;
  onClose: () => void;
}

export default function MemoryDetailModal({ memory, onClose }: Props) {
  return (
    <Modal
      visible={memory !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {memory && (
          <View style={styles.card}>
            {/* Photo hero — takes up most of the card when present */}
            {memory.photoUri ? (
              <View style={styles.photoWrap}>
                <Image
                  source={{ uri: memory.photoUri }}
                  style={styles.photo}
                  resizeMode="cover"
                />
                {/* Gradient overlay on photo for text readability */}
                <View style={styles.photoOverlay} />
                {/* Title overlaid on photo */}
                <View style={styles.photoTitle}>
                  <Text
                    style={[
                      styles.star,
                      {
                        color: emotionColors[memory.emotion],
                        fontSize: 18 + memory.importance * 3,
                      },
                    ]}
                  >
                    ★
                  </Text>
                  <Text style={styles.titleOverPhoto} numberOfLines={2}>
                    {memory.title}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.noPhotoHeader}>
                <View
                  style={[
                    styles.accent,
                    { backgroundColor: emotionColors[memory.emotion] },
                  ]}
                />
                <View style={styles.header}>
                  <Text
                    style={[
                      styles.star,
                      {
                        color: emotionColors[memory.emotion],
                        fontSize: 20 + memory.importance * 4,
                      },
                    ]}
                  >
                    ★
                  </Text>
                  <Text style={styles.title}>{memory.title}</Text>
                </View>
              </View>
            )}

            {/* Card body */}
            <View style={styles.content}>
              <Text style={styles.meta}>
                {memory.date.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                · {memory.category}
              </Text>
              <View style={styles.emotionRow}>
                <View
                  style={[
                    styles.emotionBadge,
                    { backgroundColor: emotionColors[memory.emotion] + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.emotionText,
                      { color: emotionColors[memory.emotion] },
                    ]}
                  >
                    {memory.emotion}
                  </Text>
                </View>
                {memory.location && (
                  <Text style={styles.location}>
                    📍 {memory.location}
                  </Text>
                )}
              </View>
              {memory.description ? (
                <Text style={styles.description}>
                  {memory.description}
                </Text>
              ) : null}
            </View>
            {/* Starry night overlay */}
            <StarField count={50} />
          </View>
        )}
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 16, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#0b0e1f',
    borderRadius: 24,
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(100, 80, 160, 0.25)',
    ...Platform.select({
      ios: {
        shadowColor: '#6a3fcf',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  accent: {
    height: 3,
    width: '100%',
  },
  photoWrap: {
    width: '100%',
    height: Dimensions.get('window').height * 0.45,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(11,14,31,0.75)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  photoTitle: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleOverPhoto: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 28,
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  noPhotoHeader: {
    width: '100%',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  star: {
    marginRight: 10,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 28,
    flex: 1,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'capitalize',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 14,
  },
  emotionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  emotionBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  emotionText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  location: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
