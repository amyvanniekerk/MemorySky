import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface StarFieldProps {
  count?: number;
}

interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDuration: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
}

const generateStars = (count: number): StarData[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * (SCREEN_W + 80) - 40,
    y: Math.random() * (SCREEN_H + 80) - 40,
    size: Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1.2,
    opacity: Math.random() * 0.55 + 0.2,
    twinkleDuration: 2000 + Math.random() * 4000,
    driftX: (Math.random() - 0.5) * 80,
    driftY: (Math.random() - 0.5) * 60,
    driftDuration: 15000 + Math.random() * 25000,
  }));

function DriftingStar({ star }: { star: StarData }) {
  const twinkle = useRef(new Animated.Value(star.opacity)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Twinkle
    const minOpacity = star.opacity * 0.3;
    Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, {
          toValue: minOpacity,
          duration: star.twinkleDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(twinkle, {
          toValue: star.opacity,
          duration: star.twinkleDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Drift
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: star.driftDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: star.driftDuration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const translateX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, star.driftX],
  });
  const translateY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, star.driftY],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: star.x,
        top: star.y,
        width: star.size,
        height: star.size,
        borderRadius: star.size,
        backgroundColor: '#fff',
        opacity: twinkle,
        transform: [{ translateX }, { translateY }],
      }}
    />
  );
}

export default function StarField({ count = 50 }: StarFieldProps) {
  const stars = useMemo(() => generateStars(count), [count]);

  return (
    <Animated.View style={styles.container} pointerEvents="none">
      {stars.map((s) => (
        <DriftingStar key={s.id} star={s} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});
