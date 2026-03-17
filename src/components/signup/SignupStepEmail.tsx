import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';

interface SignupStepEmailProps {
  onNext: (email: string, password: string) => Promise<string | null>;
  onLogin: () => void;
}

export default function SignupStepEmail({ onNext, onLogin }: SignupStepEmailProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleNext = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setBusy(true);
    const err = await onNext(email.trim().toLowerCase(), password);
    setBusy(false);
    if (err) {
      setError(err);
    } else {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>✉</Text>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a confirmation link to
        </Text>
        <Text style={styles.emailHighlight}>{email}</Text>
        <Text style={styles.hint}>
          Confirm your email, then come back and log in.
        </Text>

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Go to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.emoji}>✦</Text>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Your memories deserve a safe home</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textSubtle}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textSubtle}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor={colors.textSubtle}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        textContentType="newPassword"
        onSubmitEditing={handleNext}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, busy && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color={colors.starWhite} size="small" />
        ) : (
          <Text style={styles.buttonText}>Sign up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={onLogin}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginTextBold}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
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
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.starWhite,
    marginBottom: 12,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.fabBg,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.starWhite,
  },
  loginLink: {
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginTextBold: {
    color: colors.accent,
    fontWeight: '600',
  },
  emailHighlight: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center' as const,
    marginBottom: 32,
  },
});
