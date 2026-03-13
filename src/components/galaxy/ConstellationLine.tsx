import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ConstellationLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export default function ConstellationLine({ x1, y1, x2, y2, color }: ConstellationLineProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  return (
    <>
      <View
        style={[
          styles.line,
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
          styles.line,
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

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
  },
});
