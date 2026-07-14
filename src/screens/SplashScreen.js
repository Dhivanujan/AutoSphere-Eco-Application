import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, ActivityIndicator, Easing } from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../services/AppContext';

export default function SplashScreen() {
  const { setCurrentScreen } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const footerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main logo entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Spring easing for a bouncier scale feel
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing glow animation on logo (loops continuously)
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle delayed fade-in for footer text
    Animated.timing(footerFadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 1200,
      useNativeDriver: true,
    }).start();

    // Auto navigate after 2.5 seconds
    const timer = setTimeout(() => {
      setCurrentScreen('INTRO');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Pulsing glow behind the logo */}
        <Animated.View style={[styles.logoGlow, { opacity: glowAnim }]} />
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Partner & Provider Workspace</Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: footerFadeAnim }]}>
        <ActivityIndicator size="small" color={colors.primary} style={{ marginBottom: 20 }} />
        <Text style={styles.footerText}>Secure Digital Logistics Ecosystem</Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary, // Deep Navy Background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
    opacity: 0.3,
    top: -10,
  },
  logoImage: {
    width: 260,
    height: 260,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 15,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: 5,
  }
});
