import React, { useRef, useCallback } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import {
  PinchGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
  State,
  PinchGestureHandlerStateChangeEvent,
  PanGestureHandlerStateChangeEvent,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { Memory } from '../types/Memory';
import GalaxyView, { GALAXY_SIZE } from './GalaxyView';

interface InteractiveGalaxyProps {
  memories: Memory[];
  onStarPress: (memory: Memory) => void;
}

// Wrap value into range [-half, half) so the galaxy loops like a sphere
function wrap(value: number, range: number): number {
  const half = range / 2;
  return ((((value + half) % range) + range) % range) - half;
}

export default function InteractiveGalaxy({
  memories,
  onStarPress,
}: InteractiveGalaxyProps) {
  const pinchRef = useRef(null);
  const panRef = useRef(null);
  const doubleTapRef = useRef(null);

  // Scale
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const scale = Animated.multiply(baseScale, pinchScale);
  const lastScale = useRef(1);

  // Translation — no limits, wraps like a sphere
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  // Pinch handler
  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: true }
  );

  const onPinchStateChange = useCallback(
    (event: PinchGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const newScale = lastScale.current * event.nativeEvent.scale;
        const clamped = Math.max(0.8, Math.min(4, newScale));
        lastScale.current = clamped;
        baseScale.setValue(clamped);
        pinchScale.setValue(1);

        if (clamped < 1) {
          lastScale.current = 1;
          Animated.spring(baseScale, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      }
    },
    []
  );

  // Pan handler — infinite panning with wrap
  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onPanStateChange = useCallback(
    (event: PanGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.BEGAN) {
        translateX.setOffset(lastTranslateX.current);
        translateX.setValue(0);
        translateY.setOffset(lastTranslateY.current);
        translateY.setValue(0);
      } else if (event.nativeEvent.oldState === State.ACTIVE) {
        // Accumulate position
        const rawX = lastTranslateX.current + event.nativeEvent.translationX;
        const rawY = lastTranslateY.current + event.nativeEvent.translationY;

        // Wrap so the galaxy loops seamlessly
        lastTranslateX.current = wrap(rawX, GALAXY_SIZE);
        lastTranslateY.current = wrap(rawY, GALAXY_SIZE);

        // Set the wrapped position
        translateX.setOffset(lastTranslateX.current);
        translateX.setValue(0);
        translateY.setOffset(lastTranslateY.current);
        translateY.setValue(0);
        translateX.flattenOffset();
        translateY.flattenOffset();
      }
    },
    []
  );

  // Double-tap to toggle zoom
  const onDoubleTap = useCallback(
    (event: TapGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        if (lastScale.current > 1.1) {
          lastScale.current = 1;
          lastTranslateX.current = 0;
          lastTranslateY.current = 0;
          translateX.setOffset(0);
          translateY.setOffset(0);
          Animated.spring(baseScale, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else {
          lastScale.current = 2.5;
          Animated.spring(baseScale, {
            toValue: 2.5,
            useNativeDriver: true,
          }).start();
        }
      }
    },
    []
  );

  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={panRef}
      onGestureEvent={onPinchEvent}
      onHandlerStateChange={onPinchStateChange}
    >
      <Animated.View style={styles.container}>
        <TapGestureHandler
          ref={doubleTapRef}
          numberOfTaps={2}
          onHandlerStateChange={onDoubleTap}
        >
          <Animated.View style={styles.container}>
            <PanGestureHandler
              ref={panRef}
              simultaneousHandlers={pinchRef}
              minPointers={1}
              maxPointers={2}
              onGestureEvent={onPanEvent}
              onHandlerStateChange={onPanStateChange}
            >
              <Animated.View
                style={[
                  styles.container,
                  {
                    transform: [
                      { translateX },
                      { translateY },
                      { scale },
                    ],
                  },
                ]}
              >
                <GalaxyView memories={memories} onStarPress={onStarPress} />
              </Animated.View>
            </PanGestureHandler>
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
