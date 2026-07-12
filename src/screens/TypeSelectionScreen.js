import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

const serviceOptions = [
  { type: 'Taxi Driver', icon: '🚗', desc: 'Drive passengers, accept immediate ride requests' },
  { type: 'Taxi Company', icon: '🏢', desc: 'Fleet owner managing multiple cars & drivers' },
  { type: 'Garage', icon: '🛠️', desc: 'Car maintenance, mechanics, and physical workshop' },
  { type: 'Service Station', icon: '🛢️', desc: 'Quick oil change, alignment, fluids and tires' },
  { type: 'Spare Parts Seller', icon: '📦', desc: 'Retail store selling OEM/Aftermarket auto parts' },
  { type: 'Vehicle Rental', icon: '🔑', desc: 'Rent out standard, luxury, or heavy-duty vehicles' },
  { type: 'Bus Operator', icon: '🚌', desc: 'Scheduled public transit or private hire coach lines' },
  { type: 'Emergency Provider', icon: '🚨', desc: 'Towing assistance, battery jump-starts, road assistance' },
  { type: 'Fuel Service', icon: '⛽', desc: 'Gas station or mobile fuel delivery logistics' },
  { type: 'Parking Service', icon: '🅿️', desc: 'Manage commercial parking structures or valet service' },
  { type: 'Car Wash Service', icon: '🧼', desc: 'Mobile washing, detailing, and automated wash tunnels' }
];

export default function TypeSelectionScreen() {
  const { selectProviderType, providerType, setCurrentScreen } = useApp();

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.headerLogo} 
          resizeMode="contain"
        />
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <View style={styles.introArea}>
          <Text style={styles.title}>What service do you provide?</Text>
          <Text style={styles.subtitle}>
            Select your primary business type. Your workspace tools and dashboard will adapt dynamically to this choice.
          </Text>
        </View>

        <View style={styles.grid}>
          {serviceOptions.map((item) => {
            const isSelected = providerType === item.type;
            return (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionCardSelected : null
                ]}
                onPress={() => selectProviderType(item.type)}
              >
                <View style={[styles.iconBox, isSelected ? styles.iconBoxSelected : null]}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={[styles.optionTitle, isSelected ? styles.optionTitleSelected : null]}>
                    {item.type}
                  </Text>
                  <Text style={styles.optionDesc} numberOfLines={2}>
                    {item.desc}
                  </Text>
                </View>
                {isSelected ? (
                  <View style={styles.radioSelected}>
                    <View style={styles.radioDot} />
                  </View>
                ) : (
                  <View style={styles.radioUnselected} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLogo: {
    width: 130,
    height: 38,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  introArea: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '90%',
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  grid: {
    flexDirection: 'column',
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.15s, border-color 0.15s',
      }
    })
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(249, 115, 22, 0.02)',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxSelected: {
    backgroundColor: colors.primaryLight,
  },
  icon: {
    fontSize: 24,
  },
  infoBox: {
    flex: 1,
    paddingRight: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  optionTitleSelected: {
    color: colors.primary,
  },
  optionDesc: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
    lineHeight: 16,
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  }
});
