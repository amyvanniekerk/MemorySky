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
  LayoutAnimation,
  UIManager,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Memory, EmotionType, CategoryType, ImportanceLevel } from '../../types/Memory';
import { colors, emotionColors } from '../../theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EMOTIONS: { type: EmotionType; label: string; icon: string; color: string }[] = [
  { type: 'happy', label: 'Happy', icon: '☀', color: emotionColors.happy },
  { type: 'sad', label: 'Sad', icon: '🌧', color: emotionColors.sad },
  { type: 'nostalgic', label: 'Nostalgic', icon: '🌙', color: emotionColors.nostalgic },
  { type: 'grateful', label: 'Grateful', icon: '✧', color: emotionColors.grateful },
  { type: 'excited', label: 'Excited', icon: '⚡', color: emotionColors.excited },
  { type: 'peaceful', label: 'Peaceful', icon: '☁', color: emotionColors.peaceful },
  { type: 'bittersweet', label: 'Bittersweet', icon: '🥀', color: emotionColors.bittersweet },
  { type: 'angry', label: 'Angry', icon: '🔥', color: emotionColors.angry },
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
  const [hidden, setHidden] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  useEffect(() => {
    if (editingMemory) {
      setTitle(editingMemory.title);
      setDescription(editingMemory.description);
      setEmotion(editingMemory.emotion);
      setCategory(editingMemory.category);
      setImportance(editingMemory.importance);
      setPhotoUri(editingMemory.photoUri);
      setLocation(editingMemory.location ?? '');
      setHidden(editingMemory.hidden ?? false);
      setDate(editingMemory.date);
      setShowDetails(true);
    } else {
      setTitle('');
      setDescription('');
      setEmotion('happy');
      setCategory('everyday');
      setImportance(3);
      setPhotoUri(undefined);
      setLocation('');
      setHidden(false);
      setDate(new Date());
      setShowDetails(false);
    }
  }, [editingMemory, visible]);

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Failed to pick photo:', err);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
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
      hidden,
    });
  };

  const toggleDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDetails(!showDetails);
  };

  const canSave = title.trim().length > 0;

  const detailsSummary = [
    category !== 'everyday' ? category : null,
    importance !== 3 ? `${importance}★` : null,
    location.trim() ? location.trim() : null,
    photoUri ? 'photo' : null,
  ].filter(Boolean);

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
            <TouchableOpacity onPress={handleSave} disabled={!canSave}>
              <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title — large, prominent */}
          <TextInput
            style={styles.titleInput}
            placeholder="What happened?"
            placeholderTextColor={colors.textSubtle}
            value={title}
            onChangeText={setTitle}
            autoFocus={!editingMemory}
          />

          {/* Description — optional, conversational */}
          <TextInput
            style={styles.descriptionInput}
            placeholder="Tell the story... (optional)"
            placeholderTextColor={colors.textSubtle}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          {/* Emotion — always visible, fun to pick */}
          <Text style={styles.sectionLabel}>How did it feel?</Text>
          <View style={styles.emotionGrid}>
            {EMOTIONS.map((e) => {
              const isSelected = emotion === e.type;
              return (
                <TouchableOpacity
                  key={e.type}
                  style={[
                    styles.emotionChip,
                    isSelected && {
                      backgroundColor: e.color + '25',
                      borderColor: e.color,
                    },
                  ]}
                  onPress={() => setEmotion(e.type)}
                >
                  <Text style={styles.emotionIcon}>{e.icon}</Text>
                  <Text
                    style={[
                      styles.emotionLabel,
                      isSelected && { color: e.color, fontWeight: '600' },
                    ]}
                  >
                    {e.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Expandable details */}
          <TouchableOpacity style={styles.detailsToggle} onPress={toggleDetails}>
            <View style={styles.detailsToggleLeft}>
              <Text style={styles.detailsToggleText}>
                {showDetails ? 'Less details' : 'More details'}
              </Text>
              {!showDetails && detailsSummary.length > 0 && (
                <Text style={styles.detailsSummary}>
                  {detailsSummary.join(' · ')}
                </Text>
              )}
            </View>
            <View style={styles.detailsChevronWrap}>
              <Text style={styles.detailsChevron}>{showDetails ? '−' : '+'}</Text>
            </View>
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.detailsSection}>
              {/* Date */}
              <Text style={styles.detailLabel}>Date</Text>
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="compact"
                  maximumDate={new Date()}
                  onChange={onDateChange}
                  themeVariant="dark"
                  accentColor={colors.teal}
                  style={styles.datePicker}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      maximumDate={new Date()}
                      onChange={onDateChange}
                    />
                  )}
                </>
              )}

              {/* Category */}
              <Text style={styles.detailLabel}>Category</Text>
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
              <Text style={styles.detailLabel}>Importance</Text>
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

              {/* Photo */}
              <Text style={styles.detailLabel}>Photo</Text>
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

              {/* Location */}
              <Text style={styles.detailLabel}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Where did this happen?"
                placeholderTextColor={colors.textSubtle}
                value={location}
                onChangeText={setLocation}
              />

              {/* Hide toggle — only show when editing */}
              {editingMemory && (
                <>
                  <Text style={styles.detailLabel}>Visibility</Text>
                  <TouchableOpacity
                    style={[styles.hideToggle, hidden && styles.hideToggleActive]}
                    onPress={() => setHidden(!hidden)}
                  >
                    <Text style={styles.hideToggleText}>
                      {hidden ? '◌  Hidden from galaxy' : '★  Visible in galaxy'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
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
    marginBottom: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  cancelText: {
    fontSize: 16,
    color: colors.cancel,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.teal,
  },
  saveTextDisabled: {
    opacity: 0.3,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.starWhite,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  descriptionInput: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    minHeight: 60,
    paddingVertical: 8,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  emotionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  emotionIcon: {
    fontSize: 14,
  },
  emotionLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  detailsToggleLeft: {
    flex: 1,
  },
  detailsToggleText: {
    fontSize: 14,
    color: colors.teal,
    fontWeight: '600',
  },
  detailsSummary: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  detailsChevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsChevron: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.teal,
  },
  detailsSection: {
    paddingTop: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.teal,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 20,
  },
  datePicker: {
    alignSelf: 'flex-start',
  },
  dateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.starWhite,
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
    paddingVertical: 24,
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
  hideToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  hideToggleActive: {
    backgroundColor: 'rgba(230, 57, 70, 0.15)',
    borderColor: 'rgba(230, 57, 70, 0.3)',
  },
  hideToggleText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
