import { useRef, useCallback } from 'react';
import { Animated, Dimensions } from 'react-native';
import {
  State,
  PinchGestureHandlerStateChangeEvent,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function useGalaxyGestures() {
  const pinchRef = useRef(null);

  // Scale
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const scale = Animated.multiply(baseScale, pinchScale);
  const lastScale = useRef(1);

  // Rotation — driven by dragging stars like turning a wheel
  const rotationValue = useRef(new Animated.Value(0)).current;
  const lastRotation = useRef(0);
  const prevAngle = useRef(0);

  const centerX = SCREEN_W / 2;
  const centerY = SCREEN_H / 2;

  const rotation = rotationValue.interpolate({
    inputRange: [-Math.PI, 0, Math.PI],
    outputRange: ['-180deg', '0deg', '180deg'],
    extrapolate: 'extend',
  });

  // Star drag → wheel rotation
  const onStarDragStart = useCallback((absoluteX: number, absoluteY: number) => {
    const dx = absoluteX - centerX;
    const dy = absoluteY - centerY;
    prevAngle.current = Math.atan2(dy, dx);
  }, []);

  const onStarDragMove = useCallback((absoluteX: number, absoluteY: number) => {
    const dx = absoluteX - centerX;
    const dy = absoluteY - centerY;
    const angle = Math.atan2(dy, dx);
    let delta = angle - prevAngle.current;
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    lastRotation.current += delta;
    rotationValue.setValue(lastRotation.current);
    prevAngle.current = angle;
  }, []);

  // Pinch to zoom
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

  // Double-tap to toggle zoom
  const onDoubleTap = useCallback(
    (event: TapGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        if (lastScale.current > 1.1) {
          lastScale.current = 1;
          Animated.spring(baseScale, {
            toValue: 1,
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

  return {
    pinchRef,
    scale,
    rotation,
    onPinchEvent,
    onPinchStateChange,
    onDoubleTap,
    onStarDragStart,
    onStarDragMove,
  };
}
