import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { ScreenHeader, AnimatedScreen } from '../components';
import { PROVIDER_TYPES } from '../config/constants';

const SERVICE_ICONS = {
  'Taxi Driver': '🚕',
  'Taxi Company': '🚖',
  'Garage': '🔧',
  'Service Station': '⛽',
  'Spare Parts Seller': '📦',
  'Vehicle Rental': '🚙',
  'Bus Operator': '🚌',
  'Emergency Provider': '🚨',
  'Fuel Service': '⛽',
  'Parking Service': '🅿️',
  'Car Wash Service': '🧼',
};

const SERVICE_DESCRIPTIONS = {
  'Taxi Driver': 'Individual ride-hailing driver',
  'Taxi Company': 'Fleet management & dispatch',
  'Garage': 'Vehicle repair & maintenance workshop',
  'Service Station': 'Full-service vehicle maintenance center',
  'Spare Parts Seller': 'Auto parts retail & wholesale',
  'Vehicle Rental': 'Car, van & bike rental services',
  'Bus Operator': 'Bus route & charter management',
  'Emergency Provider': 'Roadside assistance & towing',
  'Fuel Service': 'Mobile fuel delivery services',
  'Parking Service': 'Parking lot & valet management',
  'Car Wash Service': 'Car wash & detailing services',
};

export default function TypeSelectionScreen() {
  const { selectProviderType, setCurrentScreen } = useApp();
  const [selected, setSelected] = useState(null);

  const handleConfirm = () => {
    if (selected) {
      selectProviderType(selected);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScreenHeader
        title="Select Service Type"
        backLabel="← Back"
        onBack={() => setCurrentScreen('LOGIN')}
      />

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <AnimatedScreen animation="fade">
          <Text style={styles.title}>What service do you provide?</Text>
          <Text style={styles.subtitle}>
            Your dashboard, tools, and customer experience will be customized for your selected category.
          </Text>

          <View style={styles.optionGrid}>
            {PROVIDER_TYPES.map(type => {
              const isSelected = selected === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected
                  ]}
                  onPress={() => setSelected(type)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionTopRow}>
                    <Text style={styles.optionIcon}>{SERVICE_ICONS[type] || '🚗'}</Text>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkIcon}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>{type}</Text>
                  <Text style={styles.optionDesc}>{SERVICE_DESCRIPTIONS[type] || 'Vehicle service provider'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </AnimatedScreen>
      </ScrollView>

      {/* Sticky Continue button */}
      <View style={styles.bottomBar}>
        {selected ? (
          <Text style={styles.selectedLabel}>Selected: <Text style={styles.selectedValue}>{selected}</Text></Text>
        ) : (
          <Text style={styles.selectedLabel}>Tap a service type above to continue</Text>
        )}
        <TouchableOpacity
          style={[globalStyles.btnPrimary, styles.continueBtn, !selected && styles.continueBtnDisabled]}
          onPress={handleConfirm}
          disabled={!selected}
        >
          <Text style={globalStyles.btnPrimaryText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 180,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 6,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.border,
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)' }
    })
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionIcon: {
    fontSize: 28,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 3,
  },
  optionNameSelected: {
    color: colors.primary,
  },
  optionDesc: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 15,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    ...Platform.select({
      web: { boxShadow: '0 -4px 12px rgba(15, 23, 42, 0.08)' }
    })
  },
  selectedLabel: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  selectedValue: {
    fontWeight: '700',
    color: colors.primary,
  },
  continueBtn: {
    paddingVertical: 16,
    marginTop: 0,
  },
  continueBtnDisabled: {
    opacity: 0.4,
  }
});
