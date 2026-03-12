import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';
import { Memory } from '../types/Memory';
import { colors, emotionColors } from '../theme/colors';
import useMemoryStorage from '../hooks/useMemoryStorage';
import InteractiveGalaxy from '../components/InteractiveGalaxy';

type Props = NativeStackScreenProps<RootStackParamList, 'Galaxy'>;

export default function GalaxyScreen({ navigation }: Props) {
  const { memories } = useMemoryStorage();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header — minimal, floating over galaxy */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your Galaxy</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Galaxy */}
        {memories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✦</Text>
            <Text style={styles.emptyText}>Your sky awaits</Text>
            <Text style={styles.emptySubtext}>
              Add memories to watch your galaxy come alive
            </Text>
          </View>
        ) : (
          <View style={styles.galaxyContainer}>
            <InteractiveGalaxy memories={memories} onStarPress={setSelectedMemory} />
          </View>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.entries(emotionColors).map(([emotion, color]) => (
              <View key={emotion} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendLabel}>{emotion}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Memory detail popup */}
      <Modal
        visible={selectedMemory !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMemory(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedMemory(null)}
        >
          {selectedMemory && (
            <View style={styles.detailCard}>
              {/* Colored accent bar */}
              <View
                style={[
                  styles.detailAccent,
                  { backgroundColor: emotionColors[selectedMemory.emotion] },
                ]}
              />
              <View style={styles.detailContent}>
                <View style={styles.detailHeader}>
                  <Text
                    style={[
                      styles.detailStar,
                      {
                        color: emotionColors[selectedMemory.emotion],
                        fontSize: 20 + selectedMemory.importance * 4,
                      },
                    ]}
                  >
                    ★
                  </Text>
                  <View style={styles.detailTitleWrap}>
                    <Text style={styles.detailTitle}>{selectedMemory.title}</Text>
                    <Text style={styles.detailMeta}>
                      {selectedMemory.date.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      · {selectedMemory.category}
                    </Text>
                  </View>
                </View>
                <Text style={styles.detailDescription}>
                  {selectedMemory.description}
                </Text>
                <View style={styles.detailFooter}>
                  <View
                    style={[
                      styles.detailEmotionBadge,
                      { backgroundColor: emotionColors[selectedMemory.emotion] + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.detailEmotionText,
                        { color: emotionColors[selectedMemory.emotion] },
                      ]}
                    >
                      {selectedMemory.emotion}
                    </Text>
                  </View>
                  {selectedMemory.location && (
                    <Text style={styles.detailLocation}>
                      📍 {selectedMemory.location}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.detailHint}>tap anywhere to close</Text>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  safeArea: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  memoryCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  memoryCountText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  // Galaxy
  galaxyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Empty
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    color: colors.borderLight,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
  },
  // Legend
  legend: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  // Detail modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 16, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  detailCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 24,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  detailAccent: {
    height: 3,
    width: '100%',
  },
  detailContent: {
    padding: 24,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailStar: {
    marginRight: 12,
    marginTop: 2,
  },
  detailTitleWrap: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  detailMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  detailDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailEmotionBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailEmotionText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detailLocation: {
    fontSize: 13,
    color: colors.textMuted,
  },
  detailHint: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    paddingBottom: 16,
    opacity: 0.5,
  },
});
