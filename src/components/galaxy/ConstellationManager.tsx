import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { Constellation } from '../../types/Constellation';
import { Memory } from '../../types/Memory';

const PALETTE = [
  '#c060d0', '#FFD93D', '#4A90E2', '#6BCB77',
  '#FF8C42', '#A8E6CF', '#D47B8A', '#E63946',
  '#4ac8b0', '#C8A2C8',
];

interface Props {
  visible: boolean;
  constellations: Constellation[];
  memories: Memory[];
  onSave: (constellations: Constellation[]) => void;
  onClose: () => void;
}

type ManagerView = 'list' | 'create' | 'edit';

export default function ConstellationManager({
  visible,
  constellations,
  memories,
  onSave,
  onClose,
}: Props) {
  const [view, setView] = useState<ManagerView>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PALETTE[0]);
  const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([]);

  const visibleMemories = memories.filter((m) => !m.hidden);

  const resetForm = () => {
    setName('');
    setColor(PALETTE[0]);
    setSelectedMemoryIds([]);
    setEditingId(null);
    setView('list');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = () => {
    setName('');
    setColor(PALETTE[0]);
    setSelectedMemoryIds([]);
    setView('create');
  };

  const handleEdit = (c: Constellation) => {
    setEditingId(c.id);
    setName(c.name);
    setColor(c.color);
    setSelectedMemoryIds([...c.memoryIds]);
    setView('edit');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Constellation', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          onSave(constellations.filter((c) => c.id !== id));
          resetForm();
        },
      },
    ]);
  };

  const toggleMemory = (memoryId: string) => {
    setSelectedMemoryIds((prev) =>
      prev.includes(memoryId)
        ? prev.filter((id) => id !== memoryId)
        : [...prev, memoryId]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (view === 'create') {
      const newConstellation: Constellation = {
        id: Date.now().toString(),
        name: name.trim(),
        color,
        memoryIds: selectedMemoryIds,
      };
      onSave([...constellations, newConstellation]);
    } else if (view === 'edit' && editingId) {
      onSave(
        constellations.map((c) =>
          c.id === editingId
            ? { ...c, name: name.trim(), color, memoryIds: selectedMemoryIds }
            : c
        )
      );
    }
    resetForm();
  };

  const renderList = () => (
    <>
      <Text style={styles.heading}>Constellations</Text>
      {constellations.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No constellations yet</Text>
          <Text style={styles.emptySubtext}>
            Group your memories into constellations
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {constellations.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.listItem}
              onPress={() => handleEdit(c)}
            >
              <View style={[styles.listDot, { backgroundColor: c.color }]} />
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{c.name}</Text>
                <Text style={styles.listCount}>
                  {c.memoryIds.length} {c.memoryIds.length === 1 ? 'star' : 'stars'}
                </Text>
              </View>
              <Text style={styles.listArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>+ New Constellation</Text>
      </TouchableOpacity>
    </>
  );

  const renderForm = () => (
    <>
      <View style={styles.formHeader}>
        <TouchableOpacity onPress={resetForm}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>
          {view === 'create' ? 'New Constellation' : 'Edit Constellation'}
        </Text>
        <View style={{ width: 50 }} />
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Summer 2025"
        placeholderTextColor={colors.textSubtle}
        autoFocus={view === 'create'}
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
            onPress={() => setColor(c)}
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
              onPress={() => toggleMemory(m.id)}
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
        {view === 'edit' && editingId && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(editingId)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!name.trim()}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {view === 'list' ? renderList() : renderForm()}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(5, 5, 16, 0.6)',
  },
  sheet: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: colors.borderLight,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    alignSelf: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
  },
  list: {
    maxHeight: 250,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  listCount: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  listArrow: {
    fontSize: 22,
    color: colors.textMuted,
  },
  createButton: {
    backgroundColor: colors.fabBg,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
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
  closeButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  closeText: {
    fontSize: 15,
    color: colors.textMuted,
  },
});
