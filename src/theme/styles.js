import { StyleSheet, Platform } from 'react-native';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
  // Main Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  
  // Headers
  header: {
    backgroundColor: colors.secondary,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
      }
    })
  },
  headerTitle: {
    color: colors.textWhite,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  headerSubtitle: {
    color: colors.textLight,
    fontSize: 12,
  },

  // Typography
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
    marginVertical: 12,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textLight,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },

  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
      }
    })
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },

  // Buttons
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }
    })
  },
  btnPrimaryText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    marginTop: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      }
    })
  },
  btnSecondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  btnDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  btnDisabledText: {
    color: colors.textLight,
  },

  // Form Controls
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textDark,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputErrorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },

  // Badges / Tags
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Layout utilities
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Tab Bar Style
  tabBar: {
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    color: colors.textLight,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  }
});
