import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface GalaxyToastProps {
  visible: boolean;
  message: string;
  x: number;
  y: number;
}

export default function GalaxyToast({ visible, message, x, y }: GalaxyToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      translateY.setValue(30);
      glowPulse.setValue(0);

      // Slide up + fade in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();

      // Soft glow pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowPulse, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowPulse, {
            toValue: 0,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Fade out — slide down gently
      const fadeTimer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 600,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 20,
            duration: 600,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }, 1500);

      return () => clearTimeout(fadeTimer);
    }
  }, [visible]);

  if (!visible) return null;

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.4],
  });

  // Position above the star, clamped so it stays on screen
  const toastWidth = 150;
  const left = Math.max(10, Math.min(x - toastWidth / 2, SCREEN_W - toastWidth - 10));
  const top = Math.max(50, y - 45);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left,
          top,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Soft glow behind */}
      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

      {/* Gradient pill */}
      <LinearGradient
        colors={['rgba(123, 75, 191, 0.35)', 'rgba(75, 30, 130, 0.2)', 'rgba(13, 18, 48, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.Text style={styles.star}>◌</Animated.Text>
        <Animated.Text style={styles.message}>{message}</Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 130,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accentGlow,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(192, 96, 208, 0.15)',
    gap: 5,
  },
  star: {
    fontSize: 10,
    color: colors.accent,
  },
  message: {
    fontSize: 11,
    color: 'rgba(210, 210, 230, 0.9)',
    letterSpacing: 0.2,
  },
});
