import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { Memory } from '../types/Memory';
import { colors, emotionColors } from '../theme/colors';
import { calculateStarPositions, StarPosition } from '../utils/galaxyLayout';

const { width, height } = Dimensions.get('window');
const GALAXY_SIZE = Math.min(width, height) - 40;
const CENTER = GALAXY_SIZE / 2;

interface GalaxyViewProps {
  memories: Memory[];
  onStarPress: (memory: Memory) => void;
}

function Star({
  star,
  index,
  onPress,
}: {
  star: StarPosition;
  index: number;
  onPress: () => void;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const color = emotionColors[star.memory.emotion];

  useEffect(() => {
    const duration = 2000 + (index % 5) * 800;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.starTouch,
        {
          left: star.x - star.size * 2,
          top: star.y - star.size * 2,
          width: star.size * 4,
          height: star.size * 4,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={styles.starTouchArea}
        activeOpacity={0.7}
      >
        {/* Glow */}
        <View
          style={[
            styles.starGlow,
            {
              width: star.size * 4,
              height: star.size * 4,
              borderRadius: star.size * 2,
              backgroundColor: color,
              opacity: 0.15,
            },
          ]}
        />
        {/* Core */}
        <View
          style={[
            styles.starCore,
            {
              width: star.size * 2,
              height: star.size * 2,
              borderRadius: star.size,
              backgroundColor: color,
            },
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

// Constellation line rendered as a rotated thin View
function ConstellationLine({
  x1,
  y1,
  x2,
  y2,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  return (
    <View
      style={[
        styles.constellationLine,
        {
          width: length,
          left: x1,
          top: y1,
          backgroundColor: color,
          transform: [
            { translateY: -0.5 },
            { rotate: `${angle}rad` },
          ],
          transformOrigin: 'left center',
        },
      ]}
    />
  );
}

export default function GalaxyView({ memories, onStarPress }: GalaxyViewProps) {
  const stars = useMemo(
    () => calculateStarPositions(memories, CENTER, CENTER, CENTER * 0.9),
    [memories]
  );

  // Connect memories in same category by date order
  const constellationLines = useMemo(() => {
    const byCategory: Record<string, StarPosition[]> = {};
    stars.forEach((s) => {
      const cat = s.memory.category;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(s);
    });

    const lines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
    Object.values(byCategory).forEach((group) => {
      if (group.length < 2) return;
      const sorted = [...group].sort(
        (a, b) => a.memory.date.getTime() - b.memory.date.getTime()
      );
      for (let i = 0; i < sorted.length - 1; i++) {
        lines.push({
          x1: sorted[i].x,
          y1: sorted[i].y,
          x2: sorted[i + 1].x,
          y2: sorted[i + 1].y,
          color: emotionColors[sorted[i].memory.emotion],
        });
      }
    });
    return lines;
  }, [stars]);

  return (
    <View style={styles.container}>
      {/* Galaxy core glow */}
      <View style={styles.coreGlow} />
      <View style={styles.coreGlowInner} />

      {/* Constellation lines */}
      {constellationLines.map((line, i) => (
        <ConstellationLine key={i} {...line} />
      ))}

      {/* Stars */}
      {stars.map((star, i) => (
        <Star
          key={star.memory.id}
          star={star}
          index={i}
          onPress={() => onStarPress(star.memory)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: GALAXY_SIZE,
    height: GALAXY_SIZE,
    alignSelf: 'center',
  },
  coreGlow: {
    position: 'absolute',
    width: CENTER * 0.8,
    height: CENTER * 0.8,
    borderRadius: CENTER * 0.4,
    backgroundColor: colors.fabBg,
    opacity: 0.15,
    left: CENTER - CENTER * 0.4,
    top: CENTER - CENTER * 0.4,
  },
  coreGlowInner: {
    position: 'absolute',
    width: CENTER * 0.3,
    height: CENTER * 0.3,
    borderRadius: CENTER * 0.15,
    backgroundColor: colors.accent,
    opacity: 0.2,
    left: CENTER - CENTER * 0.15,
    top: CENTER - CENTER * 0.15,
  },
  constellationLine: {
    position: 'absolute',
    height: 1,
    opacity: 0.15,
  },
  starTouch: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starTouchArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starGlow: {
    position: 'absolute',
  },
  starCore: {},
});
