import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

/**
 * MetricCard — Reusable KPI stat card with tap handler.
 *
 * @param {object}   props
 * @param {string}   props.label     Metric category label (e.g. 'Earnings')
 * @param {string|number} props.value Main display value
 * @param {string}   [props.sub]     Subtitle below value
 * @param {string}   [props.icon]    Optional emoji icon before value
 * @param {Function} [props.onPress] Tap handler
 * @param {string}   [props.accentColor] Override accent color for the value
 */
export default function MetricCard({ label, value, sub, icon, onPress, accentColor }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

  return (
    <Wrapper style={styles.card} {...wrapperProps}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, accentColor && { color: accentColor }]}>
        {icon ? `${icon} ` : ''}{value}
      </Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      },
    }),
  },
  label: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
    marginTop: 6,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  sub: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
});
