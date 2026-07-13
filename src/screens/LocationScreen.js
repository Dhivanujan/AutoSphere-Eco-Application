import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Switch, Platform, Image, Linking } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { api } from '../services/api';

// Reusable Live Map Component
const InteractiveMap = ({ latitude, longitude }) => {
  if (Platform.OS === 'web') {
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    return (
      <iframe
        src={mapUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '10px'
        }}
        title="Location Settings GPS Map"
      />
    );
  } else {
    const staticMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${longitude},${latitude}&spn=0.016,0.016&l=map&size=450,200`;
    return (
      <TouchableOpacity 
        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
        onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)}
      >
        <Image 
          source={{ uri: staticMapUrl }} 
          style={{ width: '100%', height: '100%', borderRadius: 10 }} 
        />
        <View style={{ position: 'absolute', backgroundColor: 'rgba(13, 17, 23, 0.75)', padding: 6, borderRadius: 6 }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>📍 Open in System Maps ↗</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

export default function LocationScreen() {
  const { location, setLocation, setCurrentScreen, profile, currentUser } = useApp();

  const [address, setAddress] = useState(profile.address || location.address);
  const [radius, setRadius] = useState(location.radius);
  const [liveTracking, setLiveTracking] = useState(location.liveTracking);

  const handleSave = async () => {
    if (currentUser) {
      try {
        const updatedLocation = {
          ...location,
          address,
          radius,
          liveTracking
        };
        await api.profile.updateProfile(currentUser.uid, {
          address,
          location: updatedLocation
        });
        alert('Location configuration updated successfully!');
        setCurrentScreen('DASHBOARD');
      } catch (err) {
        alert('Failed to save location settings: ' + err.message);
      }
    } else {
      setLocation(prev => ({
        ...prev,
        address,
        radius,
        liveTracking
      }));
      alert('Location configuration updated successfully (local)!');
      setCurrentScreen('DASHBOARD');
    }
  };

  const handleSimulateGPS = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          let addressString = 'GPS Location Selected';
          try {
            // Free Nominatim OSM Geocoding Lookup
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
              headers: {
                'User-Agent': 'autosphere-eco-app/1.0'
              }
            });
            const data = await res.json();
            if (data && data.display_name) {
              addressString = data.display_name.split(',').slice(0, 3).join(', '); // Clean first 3 address components
            }
          } catch (err) {
            console.warn('Geocoding error:', err);
          }

          setLocation(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            address: addressString
          }));
          setAddress(addressString);
          alert('GPS coordinates calibrated and address resolved successfully:\n' + addressString);
        },
        (error) => {
          // Fallback to random offset simulation
          const latOffset = (Math.random() - 0.5) * 0.02;
          const lngOffset = (Math.random() - 0.5) * 0.02;
          setLocation(prev => ({
            ...prev,
            latitude: prev.latitude + latOffset,
            longitude: prev.longitude + lngOffset,
          }));
          alert('Device GPS unavailable. Recalibrated via simulator offsets.');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
      );
    } else {
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      setLocation(prev => ({
        ...prev,
        latitude: prev.latitude + latOffset,
        longitude: prev.longitude + lngOffset,
      }));
      alert('GPS location recalibrated successfully via simulation!');
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('DASHBOARD')}>
          <Text style={styles.backBtnText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        {/* Map Simulator Card */}
        <View style={globalStyles.card}>
          <Text style={styles.cardHeader}>🗺️ Active Dispatch Map</Text>
          <View style={styles.mapArea}>
            <InteractiveMap latitude={location.latitude} longitude={location.longitude} />
          </View>
          <TouchableOpacity style={[globalStyles.btnSecondary, { marginTop: 12 }]} onPress={handleSimulateGPS}>
            <Text style={globalStyles.btnSecondaryText}>Recalibrate GPS Coordinates</Text>
          </TouchableOpacity>
        </View>

        {/* Operating Area Address */}
        <View style={globalStyles.card}>
          <Text style={styles.cardHeader}>🏠 Base Service Location</Text>
          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.inputLabel}>Physical Address or Hub Center</Text>
            <TextInput
              style={globalStyles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. 742 Evergreen Terrace, Springfield"
            />
          </View>
        </View>

        {/* Dispatch Radius Configuration */}
        <View style={globalStyles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardHeader}>🚗 Service dispatch radius</Text>
            <Text style={styles.radiusVal}>{radius} Miles</Text>
          </View>
          <Text style={styles.subtitle}>
            Adjust how far from your base location you are willing to accept customer bookings or dispatch services.
          </Text>
          
          <View style={styles.sliderContainer}>
            {/* Mock slider for prototype */}
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${(radius / 50) * 100}%` }]} />
              <View style={[styles.sliderThumb, { left: `${(radius / 50) * 100 - 3}%` }]} />
            </View>
            <View style={styles.sliderRangeRow}>
              {[5, 10, 15, 20, 30, 40, 50].map((val) => (
                <TouchableOpacity key={val} style={styles.rangeBtn} onPress={() => setRadius(val)}>
                  <Text style={[styles.rangeBtnText, radius === val ? styles.rangeBtnTextActive : null]}>
                    {val}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Live Location dispatch toggle */}
        <View style={globalStyles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.liveTitle}>Live GPS Dispatching</Text>
              <Text style={styles.subtitle}>
                Send live coordinate updates when running service tasks. Enables real-time tracking for customers.
              </Text>
            </View>
            <Switch
              value={liveTracking}
              onValueChange={setLiveTracking}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
        </View>

        <TouchableOpacity style={globalStyles.btnPrimary} onPress={handleSave}>
          <Text style={globalStyles.btnPrimaryText}>Save Location Settings</Text>
        </TouchableOpacity>
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
    height: 56,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backBtn: {
    paddingVertical: 5,
  },
  backBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  headerTitle: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  mapArea: {
    height: 180,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapEmoji: {
    fontSize: 32,
    zIndex: 10,
  },
  coordinates: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: colors.textLight,
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  radiusCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radiusVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 15,
  },
  sliderContainer: {
    marginVertical: 10,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    position: 'relative',
    marginBottom: 20,
  },
  sliderFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#ffffff',
    position: 'absolute',
    top: -6,
  },
  sliderRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rangeBtnText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '700',
  },
  rangeBtnTextActive: {
    color: colors.primary,
  },
  liveTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  }
});
