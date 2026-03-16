import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';

interface SignupStepNameProps {
  onNext: (name: string) => void;
}

export default function SignupStepName({ onNext }: SignupStepNameProps) {
  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim()) onNext(name.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>✦</Text>
      <Text style={styles.title}>Welcome to MemorySky</Text>
      <Text style={styles.subtitle}>What should we call you?</Text>

      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor={colors.textSubtle}
        value={name}
        onChangeText={setName}
        autoFocus
        returnKeyType="next"
        onSubmitEditing={handleNext}
      />

      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 56,
    color: colors.accent,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: colors.starWhite,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.fabBg,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.starWhite,
  },
});
