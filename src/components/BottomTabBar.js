import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

/**
 * BottomTabBar — Persistent 5-tab navigation bar.
 *
 * Tabs: Home | Requests | Earnings | Notifications | Profile
 *
 * @param {object}   props
 * @param {string}   props.currentScreen     Current active screen identifier
 * @param {Function} props.onNavigate        Called with screen name when a tab is tapped
 * @param {number}   [props.unreadCount=0]   Badge count for Notifications tab
 * @param {string}   [props.providerType]    Current provider type (for adaptive icons)
 */
export default function BottomTabBar({ currentScreen, onNavigate, unreadCount = 0, providerType }) {
  const tabs = [
    {
      key: 'DASHBOARD',
      label: 'Home',
      icon: '🏠',
      activeIcon: '🏡',
    },
    {
      key: 'REQUEST_LIST',
      label: getRequestLabel(providerType),
      icon: '📋',
      activeIcon: '📥',
    },
    {
      key: 'EARNINGS',
      label: 'Earnings',
      icon: '💰',
      activeIcon: '💳',
    },
    {
      key: 'NOTIFICATIONS',
      label: 'Alerts',
      icon: '🔔',
      activeIcon: '🔔',
      badge: unreadCount,
    },
    {
      key: 'PROFILE',
      label: 'Profile',
      icon: '👤',
      activeIcon: '👤',
    },
  ];

  // Determine which tab is active based on current screen
  const getActiveTab = () => {
    const screenTabMap = {
      'DASHBOARD': 'DASHBOARD',
      'REQUEST_LIST': 'REQUEST_LIST',
      'REQUEST_DETAILS': 'REQUEST_LIST',
      'EARNINGS': 'EARNINGS',
      'NOTIFICATIONS': 'NOTIFICATIONS',
      'PROFILE': 'PROFILE',
      'SETTINGS': 'PROFILE',
      'AVAILABILITY': 'DASHBOARD',
      'LOCATION': 'DASHBOARD',
      'CUSTOMER_LIST': 'DASHBOARD',
      'REVIEWS': 'DASHBOARD',
    };
    return screenTabMap[currentScreen] || 'DASHBOARD';
  };

  const activeTab = getActiveTab();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onNavigate(tab.key)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View style={styles.iconWrapper}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>
                {isActive ? tab.activeIcon : tab.icon}
              </Text>
              {tab.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/** Returns a contextual label for the Requests tab based on provider type */
function getRequestLabel(providerType) {
  switch (providerType) {
    case 'Garage':
    case 'Service Station':
    case 'Car Wash Service':
      return 'Jobs';
    case 'Spare Parts Seller':
      return 'Orders';
    case 'Taxi Driver':
    case 'Taxi Company':
    case 'Bus Operator':
      return 'Rides';
    case 'Vehicle Rental':
      return 'Bookings';
    case 'Parking Service':
      return 'Slots';
    default:
      return 'Requests';
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 -3px 12px rgba(0,0,0,0.08)',
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 2,
  },
  icon: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: colors.danger,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  badgeText: {
    color: colors.textWhite,
    fontSize: 8,
    fontWeight: '800',
  },
});
