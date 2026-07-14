import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Easing, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../services/AppContext';

export default function SplashScreen() {
  const { setCurrentScreen } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const footerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance Animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Continuous Pulsing Glow Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Continuous Gentle Floating Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 4. Progress Bar Animation (lasts 2.1s, finishes just before navigation)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // 5. Delayed Footer Entrance
    Animated.timing(footerFadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // 6. Navigation Timeout
    const timer = setTimeout(() => {
      setCurrentScreen('INTRO');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const glowScaleAnim = glowAnim.interpolate({
    inputRange: [0.2, 0.8],
    outputRange: [0.95, 1.15],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            opacity: fadeAnim, 
            transform: [
              { scale: scaleAnim },
              { translateY: floatAnim }
            ] 
          }
        ]}
      >
        {/* Animated ambient glow behind logo */}
        <Animated.View 
          style={[
            styles.logoGlow, 
            { 
              opacity: glowAnim,
              transform: [{ scale: glowScaleAnim }]
            }
          ]} 
        />
        
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
        
        <Text style={styles.subtitle}>Partner & Provider Workspace</Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: footerFadeAnim }]}>
        {/* Futuristic progress bar indicator */}
        <View style={styles.progressBarTrack}>
          <Animated.View 
            style={[
              styles.progressBarFill, 
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }) 
              }
            ]} 
          />
        </View>
        
        <Text style={styles.footerText}>Secure Digital Logistics Ecosystem</Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary, // Deep Navy fallback
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    ...Platform.select({
      web: {
        backgroundImage: `radial-gradient(circle at center, #1E293B 0%, ${colors.secondary} 75%)`,
      }
    })
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    top: -30,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 60,
      },
      android: {
        elevation: 25,
      },
      web: {
        boxShadow: `0 0 100px 30px ${colors.primary}33`,
      }
    })
  },
  logoImage: {
    width: 300,
    height: 150,
    marginBottom: 5,
    zIndex: 2,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  progressBarTrack: {
    width: 220,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    ...Platform.select({
      web: {
        boxShadow: `0 0 8px ${colors.primary}`,
      }
    })
  },
  footerText: {
    fontSize: 11,
    color: colors.textLight,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  versionText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.25)',
    marginTop: 6,
    letterSpacing: 1,
    fontWeight: '600',
  }
});
