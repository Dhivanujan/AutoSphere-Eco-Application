import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../services/AppContext';

export default function SplashScreen() {
  const { setCurrentScreen } = useApp();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after 2.5 seconds
    const timer = setTimeout(() => {
      setCurrentScreen('INTRO');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Partner & Provider Workspace</Text>
      </Animated.View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} style={{ marginBottom: 20 }} />
        <Text style={styles.footerText}>Secure Digital Logistics Ecosystem</Text>
        <Text style={styles.versionText}>v1.0.0 (Expo SDK 57)</Text>
      </View>
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
