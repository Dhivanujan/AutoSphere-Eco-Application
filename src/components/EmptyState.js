import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

/**
 * EmptyState — Reusable empty/placeholder view with icon, message, and optional CTA.
 *
 * @param {object}   props
 * @param {string}   props.icon        Emoji icon
 * @param {string}   props.title       Primary message text
 * @param {string}   [props.subtitle]  Secondary descriptive text
 * @param {string}   [props.actionLabel] CTA button label
 * @param {Function} [props.onAction]   CTA callback
 */
export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 30,
    lineHeight: 18,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  actionBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  actionBtnText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
});
