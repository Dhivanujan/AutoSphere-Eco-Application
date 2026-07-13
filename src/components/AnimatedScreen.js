import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

/**
 * AnimatedScreen — Reusable wrapper that provides smooth fade + slide
 * transitions when a screen mounts. Wrap any screen's root content
 * inside this component for consistent entry animations.
 *
 * @param {object}  props
 * @param {React.ReactNode} props.children   Screen content
 * @param {'fade'|'slideUp'|'slideLeft'} [props.animation='fade'] Animation type
 * @param {number}  [props.duration=300]     Duration in ms
 */
export default function AnimatedScreen({ children, animation = 'fade', duration = 300 }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(animation === 'slideUp' ? 30 : 0)).current;
  const translateX = useRef(new Animated.Value(animation === 'slideLeft' ? 40 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
