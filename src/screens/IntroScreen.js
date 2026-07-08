import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../services/AppContext';

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

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      setCurrentScreen('LOGIN');
    }
  };

  const handleSkip = () => {
    setCurrentScreen('LOGIN');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        {activeSlide < slides.length - 1 ? (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 20 }} />
        )}
      </View>

      {/* Main Slide Carousel Area */}
      <View style={styles.slideArea}>
        <Text style={styles.slideIcon}>{slides[activeSlide].icon}</Text>
        <Text style={styles.slideTitle}>{slides[activeSlide].title}</Text>
        <Text style={styles.slideDescription}>{slides[activeSlide].description}</Text>
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
    width: 24,
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
