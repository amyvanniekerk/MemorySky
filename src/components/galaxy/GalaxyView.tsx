import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Memory } from '../../types/Memory';
import { colors, emotionColors } from '../../theme/colors';
import { calculateStarPositions, StarPosition } from '../../utils/galaxyLayout';
import BgStar from './BgStar';
import StarShape from './StarShape';
import ConstellationLine from './ConstellationLine';

const { width, height } = Dimensions.get('window');
export const GALAXY_SIZE = Math.min(width, height) - 20;
const CENTER = GALAXY_SIZE / 2;

// Wide background star field — extends well beyond the galaxy
const BG_FIELD = GALAXY_SIZE * 3;
const BG_OFFSET = -GALAXY_SIZE;

function generateBackgroundStars(count: number) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * BG_FIELD + BG_OFFSET,
      y: Math.random() * BG_FIELD + BG_OFFSET,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
    });
  }
  return stars;
}

const BG_STARS = generateBackgroundStars(400);

interface GalaxyViewProps {
  memories: Memory[];
  onStarPress: (memory: Memory) => void;
  onHiddenStarPress?: (x: number, y: number) => void;
  onStarDragStart?: (absoluteX: number, absoluteY: number) => void;
  onStarDragMove?: (absoluteX: number, absoluteY: number) => void;
}

export default function GalaxyView({ memories, onStarPress, onHiddenStarPress, onStarDragStart, onStarDragMove }: GalaxyViewProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const stars = useMemo(
    () => calculateStarPositions(memories, CENTER, CENTER, CENTER * 0.85),
    [memories]
  );

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

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 120000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.outerContainer}>
      {BG_STARS.map((s, i) => (
        <BgStar key={i} {...s} index={i} />
      ))}

      <Animated.View
        style={[styles.galaxyLayer, { transform: [{ rotate: rotation }] }]}
      >
        <View style={[styles.nebulaLayer, styles.nebulaOuter]} />
        <View style={[styles.nebulaLayer, styles.nebulaMid]} />
        <View style={[styles.nebulaLayer, styles.nebulaCore]} />
        <View style={[styles.nebulaLayer, styles.nebulaBright]} />

        {constellationLines.map((line, i) => (
          <ConstellationLine key={i} {...line} />
        ))}

        {[...stars]
          .sort((a, b) => a.memory.date.getTime() - b.memory.date.getTime())
          .map((star, i) => (
            <StarShape
              key={star.memory.id}
              star={star}
              index={i}
              onPress={() => onStarPress(star.memory)}
              onHiddenPress={onHiddenStarPress}
              onStarDragStart={onStarDragStart}
              onStarDragMove={onStarDragMove}
            />
          ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: GALAXY_SIZE,
    height: GALAXY_SIZE,
    overflow: 'visible',
  },
  galaxyLayer: {
    width: GALAXY_SIZE,
    height: GALAXY_SIZE,
  },
  nebulaLayer: {
    position: 'absolute',
    borderRadius: 9999,
  },
  nebulaOuter: {
    width: CENTER * 1.6,
    height: CENTER * 1.6,
    left: CENTER - CENTER * 0.8,
    top: CENTER - CENTER * 0.8,
    backgroundColor: '#3a2368',
    opacity: 0.08,
  },
  nebulaMid: {
    width: CENTER * 1.0,
    height: CENTER * 1.0,
    left: CENTER - CENTER * 0.5,
    top: CENTER - CENTER * 0.5,
    backgroundColor: colors.fabBg,
    opacity: 0.12,
  },
  nebulaCore: {
    width: CENTER * 0.5,
    height: CENTER * 0.5,
    left: CENTER - CENTER * 0.25,
    top: CENTER - CENTER * 0.25,
    backgroundColor: colors.accent,
    opacity: 0.15,
  },
  nebulaBright: {
    width: CENTER * 0.15,
    height: CENTER * 0.15,
    left: CENTER - CENTER * 0.075,
    top: CENTER - CENTER * 0.075,
    backgroundColor: '#ffffff',
    opacity: 0.1,
  },
});
