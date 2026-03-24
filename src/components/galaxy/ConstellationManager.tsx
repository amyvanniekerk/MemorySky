import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { colors } from '../../theme/colors';
import { Constellation } from '../../types/Constellation';
import { Memory } from '../../types/Memory';
import ConstellationForm, { PALETTE } from './ConstellationForm';

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
        id: uuidv4(),
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
    <ConstellationForm
      mode={view as 'create' | 'edit'}
      name={name}
      color={color}
      selectedMemoryIds={selectedMemoryIds}
      visibleMemories={visibleMemories}
      onNameChange={setName}
      onColorChange={setColor}
      onToggleMemory={toggleMemory}
      onSave={handleSave}
      onBack={resetForm}
      onDelete={view === 'edit' && editingId ? () => handleDelete(editingId) : undefined}
    />
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
