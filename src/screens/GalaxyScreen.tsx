import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';
import { Memory } from '../types/Memory';
import { colors, emotionColors } from '../theme/colors';
import useMemoryStorage from '../hooks/useMemoryStorage';
import useConstellationStorage from '../hooks/useConstellationStorage';
import InteractiveGalaxy from '../components/galaxy/InteractiveGalaxy';
import GalaxyShareCapture from '../components/galaxy/GalaxyShareCapture';
import GalaxyToast from '../components/galaxy/GalaxyToast';
import ConstellationManager from '../components/galaxy/ConstellationManager';
import MemoryDetailModal from '../components/galaxy/MemoryDetailModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Galaxy'>;

export default function GalaxyScreen({ navigation }: Props) {
  const { memories, reload } = useMemoryStorage();
  const { constellations, save: saveConstellations, reload: reloadConstellations } = useConstellationStorage();
  const [constellationManagerVisible, setConstellationManagerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      reload();
      reloadConstellations();
    }, [reload, reloadConstellations])
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
                <View style={styles.headerRight}>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => setConstellationManagerVisible(true)}
                  >
                    <Text style={styles.headerButtonText}>⟡</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={onShare}
                  >
                    <Text style={styles.headerButtonText}>↗</Text>
                  </TouchableOpacity>
                </View>
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
                <InteractiveGalaxy memories={memories} constellations={constellations} onStarPress={setSelectedMemory} onHiddenStarPress={handleHiddenStarPress} />
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
          <MemoryDetailModal
            memory={selectedMemory}
            onClose={() => setSelectedMemory(null)}
          />

          {/* Constellation manager */}
          <ConstellationManager
            visible={constellationManagerVisible}
            constellations={constellations}
            memories={memories}
            onSave={saveConstellations}
            onClose={() => setConstellationManagerVisible(false)}
          />

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
  headerRight: {
    flexDirection: 'row',
    gap: 8,
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
});
