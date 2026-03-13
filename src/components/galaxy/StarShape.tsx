import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, View, StyleSheet } from 'react-native';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { emotionColors } from '../../theme/colors';
import { StarPosition } from '../../utils/galaxyLayout';

interface StarShapeProps {
  star: StarPosition;
  index: number;
  onPress: () => void;
  onHiddenPress?: (x: number, y: number) => void;
  onStarDragStart?: (absoluteX: number, absoluteY: number) => void;
  onStarDragMove?: (absoluteX: number, absoluteY: number) => void;
}

export default function StarShape({
  star,
  index,
  onPress,
  onHiddenPress,
  onStarDragStart,
  onStarDragMove,
}: StarShapeProps) {
  const isHidden = star.memory.hidden === true;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const color = emotionColors[star.memory.emotion];

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: isHidden ? 0.25 : 1,
      duration: 600,
      delay: index * 80,
      useNativeDriver: true,
    }).start();

    if (!isHidden) {
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
    }
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
            if (isHidden) {
              onHiddenPress?.(e.nativeEvent.absoluteX, e.nativeEvent.absoluteY);
            } else {
              onPress();
            }
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
              {/* Glow halo — dimmed for hidden */}
              <View
                style={{
                  position: 'absolute',
                  width: star.size * 3,
                  height: star.size * 3,
                  borderRadius: star.size * 1.5,
                  backgroundColor: isHidden ? '#888' : color,
                  opacity: isHidden ? 0.05 : 0.1,
                }}
              />
              {/* 4-pointed star SVG */}
              <View
                style={{
                  position: 'absolute',
                  ...Platform.select({
                    ios: {
                      shadowColor: isHidden ? '#888' : color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: isHidden ? 0.3 : 0.9,
                      shadowRadius: star.size * (isHidden ? 1 : 2),
                    },
                  }),
                }}
              >
                <Svg width={star.size * 3} height={star.size * 3} viewBox="0 0 100 100">
                  <Path
                    d="M50 0 C50 30, 70 50, 100 50 C70 50, 50 70, 50 100 C50 70, 30 50, 0 50 C30 50, 50 30, 50 0Z"
                    fill={isHidden ? '#666' : color}
                  />
                  <Path
                    d="M50 30 C50 42, 58 50, 70 50 C58 50, 50 58, 50 70 C50 58, 42 50, 30 50 C42 50, 50 42, 50 30Z"
                    fill="#ffffff"
                    opacity={isHidden ? 0.2 : 0.6}
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

const styles = StyleSheet.create({
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
