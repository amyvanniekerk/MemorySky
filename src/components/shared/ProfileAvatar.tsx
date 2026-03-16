import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

interface ProfileAvatarProps {
  name: string;
  size?: number;
  onPress?: () => void;
}

export default function ProfileAvatar({ name, size = 36, onPress }: ProfileAvatarProps) {
  const borderRadius = size / 2;
  const fontSize = size * 0.45;
  const borderWidth = size > 50 ? 2 : 1;

  const content = (
    <View style={[styles.avatar, { width: size, height: size, borderRadius, borderWidth }]}>
      <Text style={[styles.text, { fontSize }]}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }
  return content;
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.fabBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.accent,
  },
  text: {
    fontWeight: '700',
    color: colors.starWhite,
  },
});
