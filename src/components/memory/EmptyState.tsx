import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface EmptyStateProps {
  onLoadSamples: () => void;
}

export default function EmptyState({ onLoadSamples }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.starIcon}>✦</Text>
      <Text style={styles.title}>Your sky is empty</Text>
      <Text style={styles.subtitle}>
        Add your first memory to light up your galaxy
      </Text>
      <TouchableOpacity style={styles.sampleButton} onPress={onLoadSamples}>
        <Text style={styles.sampleButtonText}>Load sample memories</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  starIcon: {
    fontSize: 64,
    color: colors.borderLight,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSubtle,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
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
