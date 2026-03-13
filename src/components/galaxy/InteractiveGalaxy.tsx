import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import {
  PinchGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { Memory } from '../../types/Memory';
import GalaxyView from './GalaxyView';
import useGalaxyGestures from '../../hooks/useGalaxyGestures';

interface InteractiveGalaxyProps {
  memories: Memory[];
  onStarPress: (memory: Memory) => void;
  onHiddenStarPress?: (x: number, y: number) => void;
}

export default function InteractiveGalaxy({
  memories,
  onStarPress,
  onHiddenStarPress,
}: InteractiveGalaxyProps) {
  const {
    pinchRef,
    scale,
    rotation,
    onPinchEvent,
    onPinchStateChange,
    onDoubleTap,
    onStarDragStart,
    onStarDragMove,
  } = useGalaxyGestures();

  return (
    <PinchGestureHandler
      ref={pinchRef}
      onGestureEvent={onPinchEvent}
      onHandlerStateChange={onPinchStateChange}
    >
      <Animated.View style={styles.container}>
        <TapGestureHandler
          numberOfTaps={2}
          onHandlerStateChange={onDoubleTap}
        >
          <Animated.View
            style={[
              styles.container,
              { transform: [{ scale }, { rotate: rotation }] },
            ]}
          >
            <GalaxyView
              memories={memories}
              onStarPress={onStarPress}
              onHiddenStarPress={onHiddenStarPress}
              onStarDragStart={onStarDragStart}
              onStarDragMove={onStarDragMove}
            />
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
