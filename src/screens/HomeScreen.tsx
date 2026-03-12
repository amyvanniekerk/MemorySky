import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Memory, EmotionType, CategoryType, ImportanceLevel } from '../types/Memory';
import { colors, emotionColors } from '../theme/colors';


const EMOTIONS: { type: EmotionType; label: string; color: string }[] = [
  { type: 'happy', label: 'Happy', color: emotionColors.happy },
  { type: 'sad', label: 'Sad', color: emotionColors.sad },
  { type: 'nostalgic', label: 'Nostalgic', color: emotionColors.nostalgic },
  { type: 'grateful', label: 'Grateful', color: emotionColors.grateful },
  { type: 'excited', label: 'Excited', color: emotionColors.excited },
  { type: 'peaceful', label: 'Peaceful', color: emotionColors.peaceful },
  { type: 'bittersweet', label: 'Bittersweet', color: emotionColors.bittersweet },
];

const CATEGORIES: { type: CategoryType; label: string }[] = [
  { type: 'childhood', label: 'Childhood' },
  { type: 'career', label: 'Career' },
  { type: 'travel', label: 'Travel' },
  { type: 'family', label: 'Family' },
  { type: 'friendship', label: 'Friendship' },
  { type: 'romance', label: 'Romance' },
  { type: 'milestone', label: 'Milestone' },
  { type: 'everyday', label: 'Everyday' },
];

function getEmotionColor(emotion: EmotionType): string {
  return EMOTIONS.find((e) => e.type === emotion)?.color ?? '#FFFFFF';
}

export default function HomeScreen() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emotion, setEmotion] = useState<EmotionType>('happy');
  const [category, setCategory] = useState<CategoryType>('everyday');
  const [importance, setImportance] = useState<ImportanceLevel>(3);
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [location, setLocation] = useState('');

  const loadSampleMemories = () => {
    const samples: Memory[] = [
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
    setMemories(samples);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEmotion('happy');
    setCategory('everyday');
    setImportance(3);
    setPhotoUri(undefined);
    setLocation('');
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleAddMemory = () => {
    if (!title.trim() || !description.trim()) return;

    const newMemory: Memory = {
      id: Date.now().toString(),
      title: title.trim(),
      date: new Date(),
      description: description.trim(),
      emotion,
      category,
      importance,
      photoUri,
      location: location.trim() || undefined,
    };

    setMemories((prev) => [newMemory, ...prev]);
    resetForm();
    setModalVisible(false);
  };

  const renderMemoryCard = ({ item }: { item: Memory }) => {
    const starColor = getEmotionColor(item.emotion);
    const cardContent = (
      <>
        <View style={styles.cardHeader}>
          <Text style={[styles.star, { color: starColor, fontSize: 16 + item.importance * 4 }]}>★</Text>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={[styles.cardDate, item.photoUri && styles.cardTextOnImage]}>
              {item.date.toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Text style={[styles.cardDescription, item.photoUri && styles.cardTextOnImage]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardTags}>
          <View style={[styles.tag, { borderColor: starColor }, item.photoUri && styles.tagOnImage]}>
            <Text style={[styles.tagText, { color: starColor }]}>
              {item.emotion}
            </Text>
          </View>
          <View style={[styles.tag, item.photoUri && styles.tagOnImage]}>
            <Text style={styles.tagText}>{item.category}</Text>
          </View>
          {item.location && (
            <View style={[styles.tag, item.photoUri && styles.tagOnImage]}>
              <Text style={styles.tagText}>📍 {item.location}</Text>
            </View>
          )}
        </View>
      </>
    );

    if (item.photoUri) {
      return (
        <TouchableOpacity activeOpacity={0.7}>
          <ImageBackground
            source={{ uri: item.photoUri }}
            style={styles.memoryCard}
            imageStyle={styles.memoryCardImage}
          >
            <View style={styles.memoryCardOverlay}>
              {cardContent}
            </View>
          </ImageBackground>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.memoryCard} activeOpacity={0.7}>
        {cardContent}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>MemorySky</Text>
        <Text style={styles.subtitle}>Your galaxy of memories</Text>
      </View>

      {/* Memory list or empty state */}
      {memories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStarIcon}>✦</Text>
          <Text style={styles.emptyTitle}>Your sky is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add your first memory to light up your galaxy
          </Text>
          <TouchableOpacity style={styles.sampleButton} onPress={loadSampleMemories}>
            <Text style={styles.sampleButtonText}>Load sample memories</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={memories}
          keyExtractor={(item) => item.id}
          renderItem={renderMemoryCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Memory Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Memory</Text>
              <TouchableOpacity onPress={handleAddMemory}>
                <Text
                  style={[
                    styles.saveText,
                    (!title.trim() || !description.trim()) &&
                      styles.saveTextDisabled,
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="What happened?"
              placeholderTextColor={colors.textSubtle}
              value={title}
              onChangeText={setTitle}
            />

            {/* Photo */}
            <Text style={styles.label}>Photo (optional)</Text>
            {photoUri ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                <TouchableOpacity
                  style={styles.photoRemove}
                  onPress={() => setPhotoUri(undefined)}
                >
                  <Text style={styles.photoRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.photoPickerButton} onPress={pickPhoto}>
                <Text style={styles.photoPickerIcon}>📷</Text>
                <Text style={styles.photoPickerText}>Add a photo</Text>
              </TouchableOpacity>
            )}

            {/* Description */}
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell the story..."
              placeholderTextColor={colors.textSubtle}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Emotion */}
            <Text style={styles.label}>Emotion</Text>
            <View style={styles.optionRow}>
              {EMOTIONS.map((e) => (
                <TouchableOpacity
                  key={e.type}
                  style={[
                    styles.optionChip,
                    emotion === e.type && {
                      backgroundColor: e.color + '30',
                      borderColor: e.color,
                    },
                  ]}
                  onPress={() => setEmotion(e.type)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      emotion === e.type && { color: e.color },
                    ]}
                  >
                    {e.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.optionRow}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c.type}
                  style={[
                    styles.optionChip,
                    category === c.type && styles.optionChipSelected,
                  ]}
                  onPress={() => setCategory(c.type)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      category === c.type && styles.optionChipTextSelected,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Importance */}
            <Text style={styles.label}>Importance</Text>
            <View style={styles.importanceRow}>
              {([1, 2, 3, 4, 5] as ImportanceLevel[]).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={styles.importanceStar}
                  onPress={() => setImportance(level)}
                >
                  <Text
                    style={[
                      styles.importanceStarText,
                      { color: level <= importance ? colors.accentGlow : colors.border },
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
              <Text style={styles.importanceLabel}>
                {importance === 1 ? 'Minor' : importance === 2 ? 'Small' : importance === 3 ? 'Moderate' : importance === 4 ? 'Major' : 'Life-changing'}
              </Text>
            </View>

            {/* Location */}
            <Text style={styles.label}>Location (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Where did this happen?"
              placeholderTextColor={colors.textSubtle}
              value={location}
              onChangeText={setLocation}
            />
          </ScrollView>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
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
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyStarIcon: {
    fontSize: 64,
    color: colors.borderLight,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSubtle,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  // List
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  // Memory card — image variants
  memoryCardImage: {
    borderRadius: 16,
  },
  memoryCardOverlay: {
    backgroundColor: 'rgba(5, 5, 16, 0.45)',
    borderRadius: 16,
    padding: 16,
  },
  cardTextOnImage: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  tagOnImage: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  // Memory card
  memoryCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  star: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitleRow: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  cardTags: {
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
  // Add button
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
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.bgModal,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 48,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  cancelText: {
    fontSize: 16,
    color: colors.cancel,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.starWhite,
    letterSpacing: 0.5,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.teal,
  },
  saveTextDisabled: {
    opacity: 0.3,
  },
  // Form
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.starWhite,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    ...Platform.select({
      ios: {
        shadowColor: colors.accentGlow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  textArea: {
    minHeight: 110,
    paddingTop: 16,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  optionChipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  optionChipSelected: {
    backgroundColor: 'rgba(192, 96, 208, 0.2)',
    borderColor: colors.accent,
  },
  optionChipTextSelected: {
    color: colors.starWhite,
    fontWeight: '600',
  },
  // Importance
  importanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  importanceStar: {
    padding: 4,
  },
  importanceStarText: {
    fontSize: 28,
  },
  importanceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 10,
    fontStyle: 'italic',
  },
  // Photo picker
  photoPickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 16,
    borderStyle: 'dashed',
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  photoPickerIcon: {
    fontSize: 20,
  },
  photoPickerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  photoPreviewContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  photoRemove: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: {
    color: colors.starWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  sampleButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sampleButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
