import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const DEFAULT_COLORS = ['#6b2fa0', '#c060d0', '#4ac8b0'];

interface Blob {
  x: Animated.Value;
  y: Animated.Value;
  color: string;
  size: number;
}

interface NebulaBackgroundProps {
  blobColors?: string[];
}

function createBlob(color: string, size: number, startX: number, startY: number): Blob {
  return {
    x: new Animated.Value(startX),
    y: new Animated.Value(startY),
    color,
    size,
  };
}

function animateBlob(blob: Blob) {
  const drift = (axis: Animated.Value, range: number, base: number) => {
    const to = base + (Math.random() - 0.5) * range;
    return Animated.timing(axis, {
      toValue: to,
      duration: 15000 + Math.random() * 15000,
      useNativeDriver: true,
    });
  };

  const loop = () => {
    Animated.parallel([
      drift(blob.x, width * 0.2, (width - blob.size) * 0.5),
      drift(blob.y, height * 0.2, (height - blob.size) * 0.5),
    ]).start(() => loop());
  };

  loop();
}

const SIZES = [width * 1.2, width * 1.0, width * 0.9];
const POSITIONS: [number, number][] = [
  [-width * 0.15, -height * 0.1],
  [width * 0.2, height * 0.35],
  [-width * 0.05, height * 0.6],
];

export default function NebulaBackground({ blobColors }: NebulaBackgroundProps) {
  const palette = (blobColors ?? DEFAULT_COLORS).slice(0, 3);

  const blobs = useRef<Blob[]>(
    palette.map((color, i) => createBlob(
      color,
      SIZES[i],
      POSITIONS[i][0],
      POSITIONS[i][1],
    ))
  ).current;

  useEffect(() => {
    blobs.forEach(animateBlob);
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {blobs.map((blob, i) => (
        <Animated.View
          key={i}
          style={[
            styles.blob,
            {
              width: blob.size,
              height: blob.size,
              borderRadius: blob.size / 2,
              backgroundColor: blob.color,
              opacity: 0.15,
              transform: [
                { translateX: blob.x },
                { translateY: blob.y },
              ],
            },
          ]}
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
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
  },
});
