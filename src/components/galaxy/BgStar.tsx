import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface BgStarProps {
  x: number;
  y: number;
  size: number;
  opacity: number;
  index: number;
}

export default function BgStar({ x, y, size, opacity, index }: BgStarProps) {
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
