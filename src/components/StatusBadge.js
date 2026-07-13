import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/**
 * StatusBadge — Reusable color-coded status chip.
 *
 * @param {object} props
 * @param {'Pending'|'Accepted'|'In Progress'|'Completed'|'Cancelled'|'Processing'|'Approved'|'Rejected'} props.status
 * @param {'small'|'medium'} [props.size='medium']
 */
export default function StatusBadge({ status, size = 'medium' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  const isSmall = size === 'small';

  return (
    <View style={[
      styles.badge,
      { backgroundColor: config.bg },
      isSmall && styles.badgeSmall,
    ]}>
      <Text style={[
        styles.text,
        { color: config.color },
        isSmall && styles.textSmall,
      ]}>
        {config.icon} {status}
      </Text>
    </View>
  );
}

const STATUS_CONFIG = {
  'Pending': {
    bg: colors.pendingLight,
    color: colors.pending,
    icon: '⏳',
  },
  'Accepted': {
    bg: colors.infoLight,
    color: colors.info,
    icon: '✓',
  },
  'In Progress': {
    bg: colors.successLight,
    color: colors.success,
    icon: '⚡',
  },
  'Completed': {
    bg: 'rgba(16, 185, 129, 0.1)',
    color: colors.success,
    icon: '✅',
  },
  'Cancelled': {
    bg: colors.dangerLight,
    color: colors.danger,
    icon: '✕',
  },
  'Processing': {
    bg: colors.infoLight,
    color: colors.info,
    icon: '⏱️',
  },
  'Approved': {
    bg: colors.successLight,
    color: colors.success,
    icon: '✓',
  },
  'Rejected': {
    bg: colors.dangerLight,
    color: colors.danger,
    icon: '✕',
  },
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  textSmall: {
    fontSize: 9,
  },
});
