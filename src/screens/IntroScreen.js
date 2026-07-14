import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Platform, Animated, Easing } from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../services/AppContext';
import { AnimatedScreen } from '../components';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: '💡',
    title: 'One App, Infinite Services',
    description: 'AutoSphere Eco adapts automatically. Garage mechanics, taxi drivers, rental companies, or spare parts shops all use this single platform.'
  },
  {
    icon: '⚡',
    title: 'Real-time Request Hub',
    description: 'Receive, accept, and manage orders. Route to customer locations, set booking times, and track jobs step-by-step.'
  },
  {
    icon: '📊',
    title: 'Track Performance & Growth',
    description: 'Analyze daily, weekly, or monthly earnings, view customer ratings, check reviews, and update availability status.'
  }
];

export default function IntroScreen() {
  const { setCurrentScreen } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);
  const slideOpacity = useRef(new Animated.Value(1)).current;
  const slideTranslateY = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1 / slides.length)).current;

  // Animate progress bar when slide changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (activeSlide + 1) / slides.length,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [activeSlide]);

  const animateSlideTransition = (nextSlide) => {
    // Fade out + slide up current content
    Animated.parallel([
      Animated.timing(slideOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideTranslateY, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveSlide(nextSlide);
      // Reset position below and fade in
      slideTranslateY.setValue(20);
      Animated.parallel([
        Animated.timing(slideOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideTranslateY, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      animateSlideTransition(activeSlide + 1);
    } else {
      setCurrentScreen('LOGIN');
    }
  };

  const handleSkip = () => {
    setCurrentScreen('LOGIN');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <AnimatedScreen animation="fade">
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>

            <View style={styles.skipContainer}>
              {activeSlide < slides.length - 1 ? (
                <TouchableOpacity onPress={handleSkip}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ height: 20 }} />
              )}
            </View>

            {/* Main Slide Carousel Area with transition */}
            <Animated.View style={[styles.slideArea, { opacity: slideOpacity, transform: [{ translateY: slideTranslateY }] }]}>
              <Text style={styles.slideIcon}>{slides[activeSlide].icon}</Text>
              <Text style={styles.slideTitle}>{slides[activeSlide].title}</Text>
              <Text style={styles.slideDescription}>{slides[activeSlide].description}</Text>
            </Animated.View>

            {/* Slide Indicators */}
            <View style={styles.indicatorContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    activeSlide === index ? styles.indicatorActive : null
                  ]}
                />
              ))}
            </View>

            {/* Bottom Actions */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>
                  {activeSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedScreen>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  responsiveWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingVertical: 15,
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  skipText: {
    color: colors.textLight,
    fontWeight: '600',
    fontSize: 14,
  },
  slideArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  slideIcon: {
    fontSize: 72,
    marginBottom: 30,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  slideDescription: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 20 : 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 5,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
    width: 28,
    borderRadius: 5,
  },
  footer: {
    marginBottom: 30,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
  }
});
