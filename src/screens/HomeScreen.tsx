import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';
import { Memory } from '../types/Memory';
import { colors } from '../theme/colors';
import useMemoryStorage from '../hooks/useMemoryStorage';
import EmptyState from '../components/memory/EmptyState';
import MemoryCard from '../components/memory/MemoryCard';
import MemoryFormModal from '../components/memory/MemoryFormModal';

const SAMPLE_MEMORIES: Memory[] = [
  { id: '1', title: 'Graduated university', date: new Date('2020-06-15'), description: 'Walked across the stage and felt like I could take on the world. Four years of late nights finally paid off.', emotion: 'excited', category: 'milestone', importance: 5 },
  { id: '2', title: 'Road trip to Big Sur', date: new Date('2022-09-03'), description: 'Drove down the Pacific Coast Highway with the windows down. Stopped at every overlook.', emotion: 'peaceful', category: 'travel', importance: 4, location: 'Big Sur, CA' },
  { id: '3', title: 'Lost my dog Max', date: new Date('2021-11-20'), description: 'He was 14. I held him at the vet and told him he was the best boy. He was.', emotion: 'sad', category: 'family', importance: 5 },
  { id: '4', title: 'First day at new job', date: new Date('2023-03-06'), description: 'Nervous but excited. Everyone was so welcoming. Free snacks in the kitchen.', emotion: 'excited', category: 'career', importance: 3 },
  { id: '5', title: 'Cooked dinner for friends', date: new Date('2024-01-14'), description: 'Made pasta from scratch for the first time. It was messy but everyone loved it.', emotion: 'happy', category: 'friendship', importance: 2 },
  { id: '6', title: 'Watched the sunrise alone', date: new Date('2023-08-22'), description: 'Couldn\'t sleep, so I drove to the hilltop. The sky turned pink and gold. Felt small in the best way.', emotion: 'peaceful', category: 'everyday', importance: 3, location: 'Griffith Observatory' },
  { id: '7', title: 'Found old childhood photos', date: new Date('2024-12-25'), description: 'Mom pulled out a box of photos from the attic. I barely recognized myself but I remembered every moment.', emotion: 'nostalgic', category: 'childhood', importance: 3 },
  { id: '8', title: 'First kiss', date: new Date('2019-07-04'), description: 'Fireworks in the sky, fireworks in my chest. Corny but true.', emotion: 'bittersweet', category: 'romance', importance: 4 },
  { id: '9', title: 'Got the apartment', date: new Date('2023-01-10'), description: 'Signed the lease on my first solo apartment. Sat on the empty floor and just smiled.', emotion: 'grateful', category: 'milestone', importance: 4 },
  { id: '10', title: 'Ran my first 10K', date: new Date('2024-04-07'), description: 'Didn\'t think I could do it. Legs were screaming by mile 4 but I crossed that finish line.', emotion: 'happy', category: 'milestone', importance: 3, location: 'Central Park, NYC' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { memories, save } = useMemoryStorage();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  const handleLoadSamples = () => save(SAMPLE_MEMORIES);

  const handleSaveMemory = (data: Omit<Memory, 'id'> & { id?: string }) => {
    if (data.id) {
      const newList = memories.map((m) =>
        m.id === data.id ? { ...data, id: data.id } as Memory : m
      );
      save(newList);
    } else {
      const newMemory: Memory = { ...data, id: Date.now().toString() } as Memory;
      save([newMemory, ...memories]);
    }
    setEditingMemory(null);
    setModalVisible(false);
  };

  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setModalVisible(true);
  };

  const handleDeleteMemory = (memory: Memory) => {
    Alert.alert('Delete Memory', `Are you sure you want to delete "${memory.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => save(memories.filter((m) => m.id !== memory.id)),
      },
    ]);
  };

  const handleOpenNew = () => {
    setEditingMemory(null);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>MemorySky</Text>
          <Text style={styles.subtitle}>Your galaxy of memories</Text>
        </View>
        {memories.length > 0 && (
          <TouchableOpacity
            style={styles.galaxyButton}
            onPress={() => navigation.navigate('Galaxy')}
          >
            <Text style={styles.galaxyButtonText}>✦</Text>
          </TouchableOpacity>
        )}
      </View>

      {memories.length === 0 ? (
        <EmptyState onLoadSamples={handleLoadSamples} />
      ) : (
        <FlatList
          data={memories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MemoryCard
              memory={item}
              onPress={handleEditMemory}
              onLongPress={handleDeleteMemory}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleOpenNew}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <MemoryFormModal
        visible={modalVisible}
        editingMemory={editingMemory}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveMemory}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  galaxyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galaxyButtonText: {
    fontSize: 18,
    color: colors.accent,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.fabBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.fabShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  addButtonText: {
    fontSize: 28,
    color: colors.starWhite,
    fontWeight: '300',
    marginTop: -2,
  },
});
