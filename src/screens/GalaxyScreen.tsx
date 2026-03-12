import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';
import { Memory } from '../types/Memory';
import { colors, emotionColors } from '../theme/colors';
import useMemoryStorage from '../hooks/useMemoryStorage';
import GalaxyView from '../components/GalaxyView';

type Props = NativeStackScreenProps<RootStackParamList, 'Galaxy'>;

export default function GalaxyScreen({ navigation }: Props) {
  const { memories } = useMemoryStorage();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Galaxy</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Galaxy */}
      {memories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Add some memories to see your galaxy</Text>
        </View>
      ) : (
        <View style={styles.galaxyContainer}>
          <GalaxyView memories={memories} onStarPress={setSelectedMemory} />
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Emotions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.entries(emotionColors).map(([emotion, color]) => (
            <View key={emotion} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendLabel}>{emotion}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

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
              <View style={styles.detailHeader}>
                <Text
                  style={[
                    styles.detailStar,
                    { color: emotionColors[selectedMemory.emotion] },
                  ]}
                >
                  ★
                </Text>
                <Text style={styles.detailTitle}>{selectedMemory.title}</Text>
              </View>
              <Text style={styles.detailDate}>
                {selectedMemory.date.toLocaleDateString()} · {selectedMemory.category}
              </Text>
              <Text style={styles.detailDescription}>
                {selectedMemory.description}
              </Text>
              {selectedMemory.location && (
                <Text style={styles.detailLocation}>
                  📍 {selectedMemory.location}
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: {
    fontSize: 16,
    color: colors.teal,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 50,
  },
  galaxyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  // Legend
  legend: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  legendTitle: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  // Detail modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 16, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  detailCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailStar: {
    fontSize: 24,
    marginRight: 10,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  detailDate: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  detailDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  detailLocation: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 12,
  },
});
