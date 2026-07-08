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
        {/* Animated Brand Mark */}
        <View style={styles.brandMark}>
          <Text style={styles.brandIcon}>⚙️</Text>
        </View>
        
        <Text style={styles.title}>
          <Text style={styles.titlePrimary}>AutoSphere</Text>
          <Text style={styles.titleSecondary}> Eco</Text>
        </Text>
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
  brandMark: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  brandIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  titlePrimary: {
    color: colors.textWhite,
  },
  titleSecondary: {
    color: colors.primary, // Vibrant Orange
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
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
