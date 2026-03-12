import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
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

interface MemoryFormModalProps {
  visible: boolean;
  editingMemory: Memory | null;
  onClose: () => void;
  onSave: (memory: Omit<Memory, 'id'> & { id?: string }) => void;
}

export default function MemoryFormModal({ visible, editingMemory, onClose, onSave }: MemoryFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emotion, setEmotion] = useState<EmotionType>('happy');
  const [category, setCategory] = useState<CategoryType>('everyday');
  const [importance, setImportance] = useState<ImportanceLevel>(3);
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (editingMemory) {
      setTitle(editingMemory.title);
      setDescription(editingMemory.description);
      setEmotion(editingMemory.emotion);
      setCategory(editingMemory.category);
      setImportance(editingMemory.importance);
      setPhotoUri(editingMemory.photoUri);
      setLocation(editingMemory.location ?? '');
      setDate(editingMemory.date);
    } else {
      setTitle('');
      setDescription('');
      setEmotion('happy');
      setCategory('everyday');
      setImportance(3);
      setPhotoUri(undefined);
      setLocation('');
      setDate(new Date());
    }
  }, [editingMemory, visible]);

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

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;
    onSave({
      id: editingMemory?.id,
      title: title.trim(),
      date,
      description: description.trim(),
      emotion,
      category,
      importance,
      photoUri,
      location: location.trim() || undefined,
    });
  };

  const canSave = title.trim() && description.trim();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingMemory ? 'Edit Memory' : 'New Memory'}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgModal,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  header: {
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
});
