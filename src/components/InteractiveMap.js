import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Linking } from 'react-native';
import { colors } from '../theme/colors';

/**
 * InteractiveMap — Cross-platform map component.
 *
 * On web: renders a Google Maps iframe embed.
 * On native: renders a static map image with tap-to-open in system maps.
 *
 * @param {object}  props
 * @param {number}  props.latitude   Map center latitude
 * @param {number}  props.longitude  Map center longitude
 * @param {number}  [props.height=140]  Container height
 * @param {string}  [props.label]    Optional overlay label
 */
export default function InteractiveMap({ latitude, longitude, height = 140, label }) {
  if (Platform.OS === 'web') {
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    return (
      <View style={[styles.container, { height }]}>
        <iframe
          src={mapUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '10px',
          }}
          title="Interactive GPS Map"
        />
        {label && (
          <View style={styles.labelOverlay}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
        )}
      </View>
    );
  }

  // Native: static map image with tap-to-open
  const staticMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${longitude},${latitude}&spn=0.016,0.016&l=map&size=450,200`;
  return (
    <TouchableOpacity
      style={[styles.container, { height }]}
      onPress={() =>
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        )
      }
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: staticMapUrl }}
        style={styles.mapImage}
        resizeMode="cover"
      />
      <View style={styles.nativeOverlay}>
        <Text style={styles.nativeOverlayText}>📍 {label || 'Open in Maps'} ↗</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  labelOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(13, 17, 23, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  labelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  nativeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeOverlayText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: 'rgba(13, 17, 23, 0.75)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
