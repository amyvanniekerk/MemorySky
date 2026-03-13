import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { Memory } from '../types/Memory';
import { colors, emotionColors } from '../theme/colors';
import { calculateStarPositions, StarPosition } from '../utils/galaxyLayout';

const { width, height } = Dimensions.get('window');
export const GALAXY_SIZE = Math.min(width, height) - 20;
const CENTER = GALAXY_SIZE / 2;

// Wide background star field — extends well beyond the galaxy
const BG_FIELD = GALAXY_SIZE * 3;
const BG_OFFSET = -GALAXY_SIZE; // shift so galaxy sits in the center of the field

function generateBackgroundStars(count: number) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * BG_FIELD + BG_OFFSET,
      y: Math.random() * BG_FIELD + BG_OFFSET,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    });
  }
  return stars;
}

const BG_STARS = generateBackgroundStars(200);

interface GalaxyViewProps {
  memories: Memory[];
  onStarPress: (memory: Memory) => void;
  onStarDragStart?: (absoluteX: number, absoluteY: number) => void;
  onStarDragMove?: (absoluteX: number, absoluteY: number) => void;
}

// Twinkling background star
function BgStar({ x, y, size, opacity, index }: {
  x: number; y: number; size: number; opacity: number; index: number;
}) {
  const twinkle = useRef(new Animated.Value(opacity)).current;

  useEffect(() => {
    const delay = (index * 200) % 3000;
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(twinkle, {
            toValue: opacity * 0.3,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(twinkle, {
            toValue: opacity,
            duration: 1500 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#ffffff',
        opacity: twinkle,
      }}
    />
  );
}

// Memory star with glow layers and pulse animation
function Star({
  star,
  index,
  onPress,
  onStarDragStart,
  onStarDragMove,
}: {
  star: StarPosition;
  index: number;
  onPress: () => void;
  onStarDragStart?: (absoluteX: number, absoluteY: number) => void;
  onStarDragMove?: (absoluteX: number, absoluteY: number) => void;
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const color = emotionColors[star.memory.emotion];

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      delay: index * 80,
      useNativeDriver: true,
    }).start();

    const duration = 2000 + (index % 7) * 600;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
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

  const touchSize = Math.max(star.size * 3, 24);

  return (
    <Animated.View
      style={[
        styles.starContainer,
        {
          left: star.x - touchSize / 2,
          top: star.y - touchSize / 2,
          width: touchSize,
          height: touchSize,
          opacity: fadeIn,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <TapGestureHandler
        onHandlerStateChange={(e: any) => {
          if (e.nativeEvent.state === State.ACTIVE) {
            onPress();
          }
        }}
      >
        <Animated.View style={styles.starTouchArea}>
          <PanGestureHandler
            activateAfterLongPress={300}
            onGestureEvent={(e: any) => onStarDragMove?.(e.nativeEvent.absoluteX, e.nativeEvent.absoluteY)}
            onHandlerStateChange={(e: any) => {
              if (e.nativeEvent.state === State.ACTIVE) {
                onStarDragStart?.(e.nativeEvent.absoluteX, e.nativeEvent.absoluteY);
              }
            }}
          >
            <Animated.View style={styles.starTouchArea}>
              {/* Glow halo */}
              <View
                style={{
                  position: 'absolute',
                  width: star.size * 3,
                  height: star.size * 3,
                  borderRadius: star.size * 1.5,
                  backgroundColor: color,
                  opacity: 0.1,
                }}
              />
              {/* 4-pointed star SVG */}
              <View
                style={{
                  position: 'absolute',
                  ...Platform.select({
                    ios: {
                      shadowColor: color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.9,
                      shadowRadius: star.size * 2,
                    },
                  }),
                }}
              >
                <Svg width={star.size * 3} height={star.size * 3} viewBox="0 0 100 100">
                  <Path
                    d="M50 0 C50 30, 70 50, 100 50 C70 50, 50 70, 50 100 C50 70, 30 50, 0 50 C30 50, 50 30, 50 0Z"
                    fill={color}
                  />
                  <Path
                    d="M50 30 C50 42, 58 50, 70 50 C58 50, 50 58, 50 70 C50 58, 42 50, 30 50 C42 50, 50 42, 50 30Z"
                    fill="#ffffff"
                    opacity={0.6}
                  />
                </Svg>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </Animated.View>
  );
}

// Constellation line with glow
function ConstellationLine({
  x1, y1, x2, y2, color,
}: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  return (
    <>
      <View
        style={[
          styles.constellationLine,
          {
            width: length,
            height: 3,
            left: x1,
            top: y1 - 1,
            backgroundColor: color,
            opacity: 0.06,
            transform: [{ rotate: `${angle}rad` }],
            transformOrigin: 'left center',
            borderRadius: 1.5,
          },
        ]}
      />
      <View
        style={[
          styles.constellationLine,
          {
            width: length,
            height: 1,
            left: x1,
            top: y1,
            backgroundColor: color,
            opacity: 0.2,
            transform: [{ rotate: `${angle}rad` }],
            transformOrigin: 'left center',
          },
        ]}
      />
    </>
  );
}

export default function GalaxyView({ memories, onStarPress, onStarDragStart, onStarDragMove }: GalaxyViewProps) {
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

  // Slow galaxy rotation
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
      {/* Wide background star field — extends beyond galaxy */}
      {BG_STARS.map((s, i) => (
        <BgStar key={i} {...s} index={i} />
      ))}

      {/* Rotating galaxy layer */}
      <Animated.View
        style={[
          styles.galaxyLayer,
          { transform: [{ rotate: rotation }] },
        ]}
      >
        {/* Nebula glow layers */}
        <View style={[styles.nebulaLayer, styles.nebulaOuter]} />
        <View style={[styles.nebulaLayer, styles.nebulaMid]} />
        <View style={[styles.nebulaLayer, styles.nebulaCore]} />
        <View style={[styles.nebulaLayer, styles.nebulaBright]} />

        {/* Constellation lines */}
        {constellationLines.map((line, i) => (
          <ConstellationLine key={i} {...line} />
        ))}

        {/* Memory stars — sorted oldest-first so newest render on top */}
        {[...stars]
          .sort((a, b) => a.memory.date.getTime() - b.memory.date.getTime())
          .map((star, i) => (
            <Star
              key={star.memory.id}
              star={star}
              index={i}
              onPress={() => onStarPress(star.memory)}
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
  constellationLine: {
    position: 'absolute',
  },
  starContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starTouchArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
