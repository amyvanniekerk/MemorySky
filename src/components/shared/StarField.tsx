import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';

interface StarFieldProps {
  count?: number;
}

interface StarData {
  id: number;
  left: DimensionValue;
  top: DimensionValue;
  size: number;
  opacity: number;
}

const generateStars = (count: number): StarData[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.floor(Math.random() * 96) + 2}%` as DimensionValue,
    top: `${Math.floor(Math.random() * 96) + 2}%` as DimensionValue,
    size: Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1.2,
    opacity: Math.random() * 0.55 + 0.2,
  }));

// Pre-generate to avoid re-renders
const DEFAULT_STARS = generateStars(50);

export default function StarField({ count }: StarFieldProps) {
  const stars = count && count !== 50 ? generateStars(count) : DEFAULT_STARS;

  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map((s) => (
        <View
          key={s.id}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: s.size,
            backgroundColor: '#fff',
            opacity: s.opacity,
          }}
        />
      ))}
    </View>
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
