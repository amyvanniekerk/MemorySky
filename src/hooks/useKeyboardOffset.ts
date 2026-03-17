import { useEffect, useRef } from 'react';
import { Animated, Keyboard, Platform } from 'react-native';

/**
 * Returns an Animated.Value that smoothly transitions when the keyboard
 * shows/hides. Use it as translateY on your content container.
 * `factor` controls how much of the keyboard height to offset (0.0–1.0).
 */
export default function useKeyboardOffset(factor = 0.4) {
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      Animated.spring(offset, {
        toValue: -e.endCoordinates.height * factor,
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start();
    });

    const onHide = Keyboard.addListener(hideEvent, () => {
      Animated.spring(offset, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start();
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [offset, factor]);

  return offset;
}
