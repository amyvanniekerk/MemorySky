import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { getNebulaBlobColors } from '../../utils/birthdayColors';

interface SignupStepDoneProps {
  name: string;
  birthday: Date;
  onEnter: () => void;
}

export default function SignupStepDone({ name, birthday, onEnter }: SignupStepDoneProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const starPulse = useRef(new Animated.Value(0.6)).current;

  const nebulaColors = getNebulaBlobColors(birthday);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing star glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(starPulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(starPulse, {
          toValue: 0.6,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const formattedDate = birthday.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn, transform: [{ scale }] }]}>
      {/* Nebula color preview dots */}
      <View style={styles.nebulaPreview}>
        {nebulaColors.slice(0, 4).map((c, i) => (
          <Animated.View
            key={i}
            style={[
              styles.nebulaDot,
              {
                backgroundColor: c,
                opacity: starPulse,
                width: 24 - i * 3,
                height: 24 - i * 3,
                borderRadius: 12 - i * 1.5,
              },
            ]}
          />
        ))}
      </View>

      <Animated.Text style={[styles.star, { opacity: starPulse }]}>★</Animated.Text>
      <Text style={styles.title}>Your galaxy is ready, {name}</Text>
      <Text style={styles.subtitle}>
        Your first star was born on {formattedDate}
      </Text>
      <Text style={styles.hint}>
        It now shines at the heart of your nebula
      </Text>

      <TouchableOpacity style={styles.button} onPress={onEnter}>
        <Text style={styles.buttonText}>Enter your galaxy</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  nebulaPreview: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  nebulaDot: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  star: {
    fontSize: 64,
    color: colors.accent,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 48,
  },
  button: {
    backgroundColor: colors.fabBg,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.starWhite,
    letterSpacing: 0.5,
  },
});
