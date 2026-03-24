import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { Memory } from '../../types/Memory';

const PALETTE = [
  '#c060d0', '#FFD93D', '#4A90E2', '#6BCB77',
  '#FF8C42', '#A8E6CF', '#D47B8A', '#E63946',
  '#4ac8b0', '#C8A2C8',
];

interface Props {
  mode: 'create' | 'edit';
  name: string;
  color: string;
  selectedMemoryIds: string[];
  visibleMemories: Memory[];
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onToggleMemory: (memoryId: string) => void;
  onSave: () => void;
  onBack: () => void;
  onDelete?: () => void;
}

export { PALETTE };

export default function ConstellationForm({
  mode,
  name,
  color,
  selectedMemoryIds,
  visibleMemories,
  onNameChange,
  onColorChange,
  onToggleMemory,
  onSave,
  onBack,
  onDelete,
}: Props) {
  return (
    <>
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>
          {mode === 'create' ? 'New Constellation' : 'Edit Constellation'}
        </Text>
        <View style={{ width: 50 }} />
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={onNameChange}
        placeholder="e.g. Summer 2025"
        placeholderTextColor={colors.textSubtle}
        autoFocus={mode === 'create'}
      />

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {PALETTE.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorSwatch,
              { backgroundColor: c },
              color === c && styles.colorSelected,
            ]}
            onPress={() => onColorChange(c)}
          />
        ))}
      </View>

      <Text style={styles.label}>
        Memories ({selectedMemoryIds.length} selected)
      </Text>
      <ScrollView style={styles.memoryList}>
        {visibleMemories.map((m) => {
          const isSelected = selectedMemoryIds.includes(m.id);
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.memoryItem, isSelected && styles.memoryItemSelected]}
              onPress={() => onToggleMemory(m.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  isSelected && { backgroundColor: color, borderColor: color },
                ]}
              >
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.memoryInfo}>
                <Text style={styles.memoryTitle} numberOfLines={1}>
                  {m.title}
                </Text>
                <Text style={styles.memoryDate}>
                  {m.date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.formActions}>
        {mode === 'edit' && onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
          onPress={onSave}
          disabled={!name.trim()}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: colors.accent,
    width: 50,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.bgInput,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  memoryList: {
    maxHeight: 200,
  },
  memoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memoryItemSelected: {
    backgroundColor: 'rgba(123, 75, 191, 0.08)',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
  },
  memoryInfo: {
    flex: 1,
  },
  memoryTitle: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  memoryDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E63946',
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E63946',
  },
  saveButton: {
    flex: 2,
    backgroundColor: colors.fabBg,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
