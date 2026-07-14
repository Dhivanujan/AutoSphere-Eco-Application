import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

/**
 * BottomTabBar — Persistent 5-tab navigation bar with professional vector icons.
 *
 * Tabs: Home | Requests | Earnings | Notifications | Profile
 *
 * @param {object}   props
 * @param {string}   props.currentScreen     Current active screen identifier
 * @param {Function} props.onNavigate        Called with screen name when a tab is tapped
 * @param {number}   [props.unreadCount=0]   Badge count for Notifications tab
 */
export default function BottomTabBar({ currentScreen, onNavigate, unreadCount = 0 }) {
  const tabs = [
    {
      key: 'DASHBOARD',
      icon: 'home-outline',
      activeIcon: 'home',
    },
    {
      key: 'REQUEST_LIST',
      icon: 'document-text-outline',
      activeIcon: 'document-text',
    },
    {
      key: 'EARNINGS',
      icon: 'wallet-outline',
      activeIcon: 'wallet',
    },
    {
      key: 'NOTIFICATIONS',
      icon: 'notifications-outline',
      activeIcon: 'notifications',
      badge: unreadCount,
    },
    {
      key: 'PROFILE',
      icon: 'person-outline',
      activeIcon: 'person',
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
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? colors.primary : 'rgba(255, 255, 255, 0.45)'}
              />
              {tab.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </Text>
                </View>
              )}
            </View>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12,
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
    paddingVertical: 6,
    position: 'relative',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: -10,
    width: 24,
    height: 3,
    borderRadius: 1.5,
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
