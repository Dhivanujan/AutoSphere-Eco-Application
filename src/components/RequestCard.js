import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import StatusBadge from './StatusBadge';

/**
 * RequestCard — Reusable request/job card showing customer, service, fare, status.
 *
 * @param {object}   props
 * @param {object}   props.request    Request data object
 * @param {Function} [props.onPress]  Tap handler (navigate to details)
 */
export default function RequestCard({ request, onPress }) {
  const { customerName, serviceDetails, pickupLocation, fare, status, time } = request;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left: Customer & service info */}
      <View style={styles.left}>
        <View style={styles.nameRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(customerName || 'C').substring(0, 1)}
            </Text>
          </View>
          <View style={styles.nameInfo}>
            <Text style={styles.customerName} numberOfLines={1}>{customerName}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
        <Text style={styles.serviceDetails} numberOfLines={1}>{serviceDetails}</Text>
        {pickupLocation && (
          <Text style={styles.location} numberOfLines={1}>📍 {pickupLocation}</Text>
        )}
      </View>

      {/* Right: Fare & status */}
      <View style={styles.right}>
        <Text style={styles.fare}>${fare?.toFixed(2)}</Text>
        <StatusBadge status={status} size="small" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
      web: {
        cursor: 'pointer',
        transition: 'transform 0.12s ease, border-color 0.12s ease',
      },
    }),
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: '800',
  },
  nameInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  time: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 1,
  },
  serviceDetails: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
  location: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 3,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 70,
  },
  fare: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
});
