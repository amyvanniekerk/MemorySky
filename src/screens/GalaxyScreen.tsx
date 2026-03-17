import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';
import { Memory } from '../types/Memory';
import { colors, emotionColors } from '../theme/colors';
import useMemoryStorage from '../hooks/useMemoryStorage';
import InteractiveGalaxy from '../components/galaxy/InteractiveGalaxy';
import GalaxyShareCapture from '../components/galaxy/GalaxyShareCapture';
import GalaxyToast from '../components/galaxy/GalaxyToast';
import StarField from '../components/shared/StarField';

type Props = NativeStackScreenProps<RootStackParamList, 'Galaxy'>;

export default function GalaxyScreen({ navigation }: Props) {
  const { memories, reload } = useMemoryStorage();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [hiddenToast, setHiddenToast] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHiddenStarPress = (x: number, y: number) => {
    if (hiddenToast.visible) return;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setHiddenToast({ visible: true, x, y });
    toastTimer.current = setTimeout(() => {
      setHiddenToast((prev) => ({ ...prev, visible: false }));
      toastTimer.current = null;
    }, 2200);
  };

  return (
    <GalaxyShareCapture style={styles.container}>
      {(isCapturing, onShare) => (
        <>
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
              {!isCapturing ? (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.headerButtonText}>★</Text>
                </TouchableOpacity>
              ) : <View style={styles.headerSpacer} />}
              <Text style={styles.title}>Your Galaxy</Text>
              {!isCapturing ? (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={onShare}
                >
                  <Text style={styles.headerButtonText}>↗</Text>
                </TouchableOpacity>
              ) : <View style={styles.headerSpacer} />}
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
                <InteractiveGalaxy memories={memories} onStarPress={setSelectedMemory} onHiddenStarPress={handleHiddenStarPress} />
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
                  {/* Photo hero — takes up most of the card when present */}
                  {selectedMemory.photoUri ? (
                    <View style={styles.detailPhotoWrap}>
                      <Image
                        source={{ uri: selectedMemory.photoUri }}
                        style={styles.detailPhoto}
                        resizeMode="cover"
                      />
                      {/* Gradient overlay on photo for text readability */}
                      <View style={styles.detailPhotoOverlay} />
                      {/* Title overlaid on photo */}
                      <View style={styles.detailPhotoTitle}>
                        <Text
                          style={[
                            styles.detailStar,
                            {
                              color: emotionColors[selectedMemory.emotion],
                              fontSize: 18 + selectedMemory.importance * 3,
                            },
                          ]}
                        >
                          ★
                        </Text>
                        <Text style={styles.detailTitleOverPhoto} numberOfLines={2}>
                          {selectedMemory.title}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.detailNoPhotoHeader}>
                      <View
                        style={[
                          styles.detailAccent,
                          { backgroundColor: emotionColors[selectedMemory.emotion] },
                        ]}
                      />
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
                        <Text style={styles.detailTitle}>{selectedMemory.title}</Text>
                      </View>
                    </View>
                  )}

                  {/* Card body */}
                  <View style={styles.detailContent}>
                    <Text style={styles.detailMeta}>
                      {selectedMemory.date.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      · {selectedMemory.category}
                    </Text>
                    <View style={styles.detailEmotionRow}>
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
                    {selectedMemory.description ? (
                      <Text style={styles.detailDescription}>
                        {selectedMemory.description}
                      </Text>
                    ) : null}
                  </View>
                  {/* Starry night overlay */}
                  <StarField count={50} />
                </View>
              )}
            </TouchableOpacity>
          </Modal>

          {/* Hidden star toast */}
          <GalaxyToast visible={hiddenToast.visible} message="This memory is hidden" x={hiddenToast.x} y={hiddenToast.y} />
        </>
      )}
    </GalaxyShareCapture>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  galaxyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 16, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  detailCard: {
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
  detailAccent: {
    height: 3,
    width: '100%',
  },
  detailPhotoWrap: {
    width: '100%',
    height: Dimensions.get('window').height * 0.45,
    position: 'relative',
  },
  detailPhoto: {
    width: '100%',
    height: '100%',
  },
  detailPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(11,14,31,0.75)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  detailPhotoTitle: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTitleOverPhoto: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 28,
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  detailNoPhotoHeader: {
    width: '100%',
  },
  detailContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  detailStar: {
    marginRight: 10,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 28,
    flex: 1,
  },
  detailMeta: {
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'capitalize',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  detailDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 14,
  },
  detailEmotionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
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
});
