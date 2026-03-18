import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { colors } from '../../theme/colors';

interface DailyCaptureToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

export default function DailyCaptureToggle({ enabled, onToggle }: DailyCaptureToggleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.label}>Daily Capture Reminder</Text>
        <Text style={styles.description}>
          Get a notification at a random time each day to capture a moment
        </Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.fabBg }}
        thumbColor={enabled ? colors.accent : colors.textMuted}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
