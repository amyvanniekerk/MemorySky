import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
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
import ProfileAvatar from '../components/shared/ProfileAvatar';
import { SAMPLE_MEMORIES } from '../constants/sampleMemories';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  userName: string;
  avatarUrl?: string;
};

export default function HomeScreen({ navigation, route, userName, avatarUrl }: Props) {
  const { memories, save } = useMemoryStorage();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [initialPhotoUri, setInitialPhotoUri] = useState<string | undefined>();

  // Handle captured photo from CaptureScreen or notification
  useEffect(() => {
    const capturedPhotoUri = route.params?.capturedPhotoUri;
    if (capturedPhotoUri) {
      setEditingMemory(null);
      setInitialPhotoUri(capturedPhotoUri);
      setModalVisible(true);
      navigation.setParams({ capturedPhotoUri: undefined });
    }
  }, [route.params?.capturedPhotoUri]);

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
    save(memories.filter((m) => m.id !== memory.id));
  };

  const handleOpenNew = () => {
    setEditingMemory(null);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>MemorySky</Text>
          <Text style={styles.subtitle}>Your galaxy of memories</Text>
        </View>
        <View style={styles.headerRight}>
          {memories.length > 0 && (
            <TouchableOpacity
              style={styles.galaxyButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.galaxyButtonText}>✦</Text>
            </TouchableOpacity>
          )}
          <ProfileAvatar
            name={userName}
            avatarUrl={avatarUrl}
            size={36}
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
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

            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => navigation.navigate('Capture')}
      >
        <Text style={styles.captureButtonText}>📷</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={handleOpenNew}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <MemoryFormModal
        visible={modalVisible}
        editingMemory={editingMemory}
        initialPhotoUri={initialPhotoUri}
        onClose={() => {
          setModalVisible(false);
          setInitialPhotoUri(undefined);
        }}
        onSave={(data) => {
          handleSaveMemory(data);
          setInitialPhotoUri(undefined);
        }}
        onDelete={editingMemory ? () => {
          handleDeleteMemory(editingMemory);
          setEditingMemory(null);
          setModalVisible(false);
        } : undefined}
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
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  captureButton: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonText: {
    fontSize: 20,
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
