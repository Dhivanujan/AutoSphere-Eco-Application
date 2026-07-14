import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { ScreenHeader, AnimatedScreen, EmptyState } from '../components';

export default function NotificationsScreen() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications, setCurrentScreen } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (nt) => {
    markNotificationRead(nt.id);
    if (nt.type === 'request') {
      setCurrentScreen('REQUEST_LIST');
    }
  };

  const getEmojiForType = (type) => {
    switch (type) {
      case 'request': return '📥';
      case 'payment': return '💰';
      case 'review': return '⭐';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScreenHeader
        title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
        backLabel="← Home"
        onBack={() => setCurrentScreen('DASHBOARD')}
        rightLabel={notifications.length > 0 ? "Clear All" : undefined}
        onRight={notifications.length > 0 ? clearAllNotifications : undefined}
      />

      {/* Mark All Read bar */}
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBar} onPress={markAllNotificationsRead}>
          <Text style={styles.markAllText}>✓ Mark all {unreadCount} as read</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <AnimatedScreen animation="fade">
          {notifications.length === 0 ? (
            <EmptyState
              icon="🔔"
              title="All caught up!"
              subtitle="New alerts and booking updates will appear here."
            />
          ) : (
            notifications.map((nt) => (
              <TouchableOpacity 
                key={nt.id} 
                style={[styles.notificationCard, !nt.read ? styles.unreadCard : null]}
                onPress={() => handleNotificationClick(nt)}
              >
                <View style={styles.typeIconBox}>
                  <Text style={styles.typeIcon}>{getEmojiForType(nt.type)}</Text>
                </View>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={[styles.ntTitle, !nt.read ? styles.unreadText : null]}>{nt.title}</Text>
                    {!nt.read && <View style={styles.unreadBadge} />}
                  </View>
                  <Text style={styles.ntBody}>{nt.body}</Text>
                  <Text style={styles.ntTime}>{nt.time}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </AnimatedScreen>
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
  clearBtnText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 13,
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
  emptyContainer: {
    paddingVertical: 100,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  notificationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
  unreadCard: {
    borderColor: 'rgba(249, 115, 22, 0.25)',
    backgroundColor: 'rgba(249, 115, 22, 0.01)',
  },
  typeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeIcon: {
    fontSize: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ntTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  unreadText: {
    fontWeight: '800',
    color: colors.secondary,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  ntBody: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    lineHeight: 16,
  },
  ntTime: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 6,
  },
  markAllBar: {
    backgroundColor: 'rgba(249, 115, 22, 0.06)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(249, 115, 22, 0.12)',
    alignItems: 'center',
  },
  markAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  }
});
