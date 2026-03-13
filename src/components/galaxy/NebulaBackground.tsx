import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Blob {
  x: Animated.Value;
  y: Animated.Value;
  color: string;
  size: number;
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
      duration: 8000 + Math.random() * 12000,
      useNativeDriver: true,
    });
  };

  const loop = () => {
    Animated.parallel([
      drift(blob.x, width * 0.3, (width - blob.size) * Math.random()),
      drift(blob.y, height * 0.3, (height - blob.size) * Math.random()),
    ]).start(() => loop());
  };

  loop();
}

export default function NebulaBackground() {
  const blobs = useRef<Blob[]>([
    createBlob('#6b2fa0', width * 0.9, width * 0.1, height * 0.05),
    createBlob('#c060d0', width * 0.7, width * 0.3, height * 0.2),
    createBlob('#4ac8b0', width * 0.8, -width * 0.1, height * 0.4),
    createBlob('#3a2368', width * 1.0, width * 0.2, height * 0.6),
    createBlob('#8b5fbf', width * 0.6, width * 0.0, height * 0.1),
    createBlob('#60d0d0', width * 0.5, width * 0.4, height * 0.5),
  ]).current;

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
              opacity: 0.3,
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
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
  },
});
