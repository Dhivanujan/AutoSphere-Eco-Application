import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

/**
 * ScreenHeader — Reusable header bar for all screens.
 *
 * @param {object}  props
 * @param {string}  props.title            Header title text
 * @param {string}  [props.backLabel]      Back button label (e.g. '← Home'). If omitted, no back button shown.
 * @param {Function} [props.onBack]        Callback when back button pressed
 * @param {string}  [props.rightLabel]     Right-side action label (e.g. 'Save')
 * @param {Function} [props.onRight]       Callback for right action
 * @param {React.ReactNode} [props.rightComponent]  Custom right component (overrides rightLabel)
 * @param {string}  [props.subtitle]       Optional subtitle below the title
 */
export default function ScreenHeader({
  title,
  backLabel,
  onBack,
  rightLabel,
  onRight,
  rightComponent,
  subtitle,
}) {
  return (
    <View style={styles.header}>
      {/* Left side — Back button */}
      {backLabel && onBack ? (
        <TouchableOpacity style={styles.sideBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.sideBtnText}>{backLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sideBtn} />
      )}

      {/* Center — Title */}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>

      {/* Right side — Action or custom component */}
      {rightComponent ? (
        <View style={styles.sideBtn}>{rightComponent}</View>
      ) : rightLabel && onRight ? (
        <TouchableOpacity style={styles.sideBtn} onPress={onRight} activeOpacity={0.7}>
          <Text style={styles.sideBtnText}>{rightLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sideBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
      },
    }),
  },
  sideBtn: {
    minWidth: 60,
    paddingVertical: 5,
  },
  sideBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  subtitle: {
    color: colors.textLight,
    fontSize: 11,
    marginTop: 1,
  },
});
