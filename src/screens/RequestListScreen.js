import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { ScreenHeader, AnimatedScreen, RequestCard, EmptyState } from '../components';

export default function RequestListScreen() {
  const { requests, providerType, documents, setCurrentScreen, setSelectedRequest } = useApp();
  const [activeTab, setActiveTab] = useState('Pending'); // Pending, Active, History

  // Filter requests by provider type and tab category
  const filteredRequests = requests.filter(req => {
    if (req.type !== providerType) return false;
    
    if (activeTab === 'Pending') {
      return req.status === 'Pending';
    } else if (activeTab === 'Active') {
      return req.status === 'Accepted' || req.status === 'In Progress';
    } else {
      return req.status === 'Completed' || req.status === 'Cancelled';
    }
  });

  const handleSelectRequest = (req) => {
    setSelectedRequest(req);
    setCurrentScreen('REQUEST_DETAILS');
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScreenHeader
        title="Job Requests"
        backLabel="← Home"
        onBack={() => setCurrentScreen('DASHBOARD')}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Pending', 'Active', 'History'].map(tab => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, isSelected ? styles.tabActive : null]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isSelected ? styles.tabTextActive : null]}>
                {tab === 'History' ? 'Completed' : tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Requests List */}
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <AnimatedScreen animation="fade">
          {documents.status !== 'Approved' ? (
            <View style={styles.lockContainer}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockTextTitle}>Verification Required</Text>
              <Text style={styles.lockTextDesc}>
                Your account status is currently {(documents.status || 'Pending').toUpperCase()}. You will be able to access the customer requests queue once approved.
              </Text>
              <TouchableOpacity 
                style={[globalStyles.btnSecondary, { marginTop: 15 }]}
                onPress={() => setCurrentScreen('VERIFICATION_STATUS')}
              >
                <Text style={globalStyles.btnSecondaryText}>View Verification Status</Text>
              </TouchableOpacity>
            </View>
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              icon="📂"
              title="No requests in this tab"
              subtitle="Requests matching this status will appear here."
            />
          ) : (
            filteredRequests.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                onPress={() => handleSelectRequest(req)}
              />
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
  headerTitle: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  requestCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reqId: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
  },
  reqTime: {
    fontSize: 11,
    color: colors.textLight,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  serviceDetails: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    fontSize: 12,
    color: colors.textLight,
  },
  fareText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePending: {
    backgroundColor: colors.pendingLight,
  },
  badgeAccepted: {
    backgroundColor: colors.infoLight,
  },
  badgeActive: {
    backgroundColor: colors.successLight,
  },
  badgeCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  badgeCancelled: {
    backgroundColor: colors.dangerLight,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  lockContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.danger,
    marginTop: 20,
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  lockTextTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 8,
  },
  lockTextDesc: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  }
});
