import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function RequestDetailsScreen() {
  const { 
    selectedRequest, 
    acceptRequest, 
    rejectRequest, 
    startService, 
    completeService, 
    setCurrentScreen 
  } = useApp();

  if (!selectedRequest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('REQUEST_LIST')}>
            <Text style={styles.backBtnText}>← List</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Detail</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>No Request Selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { id, customerName, customerPhone, serviceDetails, vehicleDetails, pickupLocation, dropoffLocation, time, notes, fare, status, history, partNumber } = selectedRequest;

  const handleCall = () => {
    alert(`Calling Customer: ${customerPhone}`);
  };

  const handleMessage = () => {
    alert(`Opening Chat Messenger with ${customerName}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('REQUEST_LIST')}>
          <Text style={styles.backBtnText}>← Jobs</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('DASHBOARD')}>
          <Text style={styles.backBtnText}>Home</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={globalStyles.card}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.label}>REQUEST ID</Text>
              <Text style={styles.value}>{id}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              status === 'Pending' ? styles.badgePending :
              status === 'Accepted' ? styles.badgeAccepted :
              status === 'In Progress' ? styles.badgeActive :
              status === 'Completed' ? styles.badgeCompleted : styles.badgeCancelled
            ]}>
              <Text style={styles.badgeLabel}>{status}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.metaRow}>
            <View>
              <Text style={styles.label}>ESTIMATED PAYOUT</Text>
              <Text style={styles.fareAmount}>${fare.toFixed(2)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>TIMELINE</Text>
              <Text style={styles.timeValue}>{time}</Text>
            </View>
          </View>
        </View>

        {/* Customer Profile Card */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>👤 Customer Profile</Text>
          <View style={styles.customerInfoRow}>
            <View style={styles.custAvatar}>
              <Text style={styles.avatarLetter}>{customerName.substring(0, 1)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.custName}>{customerName}</Text>
              <Text style={styles.custPhone}>{customerPhone}</Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity style={styles.contactBtn} onPress={handleMessage}>
                <Text style={styles.contactIcon}>💬</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
                <Text style={styles.contactIcon}>📞</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Job Details Card */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>📋 Service Specifications</Text>
          <Text style={styles.serviceTitle}>{serviceDetails}</Text>
          
          {partNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Part Number:</Text>
              <Text style={styles.detailValue}>{partNumber}</Text>
            </View>
          )}

          {vehicleDetails && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vehicle details:</Text>
              <Text style={styles.detailValue}>{vehicleDetails}</Text>
            </View>
          )}

          {notes && (
            <View style={styles.notesBox}>
              <Text style={styles.notesTitle}>Customer Notes:</Text>
              <Text style={styles.notesText}>"{notes}"</Text>
            </View>
          )}
        </View>

        {/* Map / Navigation Card */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>📍 Location / Navigation</Text>
          <View style={styles.locBlock}>
            <Text style={styles.locType}>A (Source / Base)</Text>
            <Text style={styles.locVal}>{pickupLocation}</Text>
          </View>
          {dropoffLocation && (
            <View style={[styles.locBlock, { marginTop: 10 }]}>
              <Text style={styles.locType}>B (Destination / Dropoff)</Text>
              <Text style={styles.locVal}>{dropoffLocation}</Text>
            </View>
          )}
          <View style={styles.miniMap}>
            <Text style={styles.mapEmoji}>🗺️</Text>
            <Text style={styles.mapText}>Live GPS Navigation Routing</Text>
          </View>
        </View>

        {/* Activity log */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>🕒 Job Activity Log</Text>
          {history && history.map((h, i) => (
            <View key={i} style={styles.historyItem}>
              <Text style={styles.historyTime}>{h.time}</Text>
              <Text style={styles.historyEvent}>● {h.event}</Text>
            </View>
          ))}
        </View>

        {/* Dynamic Action Buttons */}
        <View style={styles.actionContainer}>
          {status === 'Pending' && (
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.declineBtn]} 
                onPress={() => rejectRequest(id)}
              >
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.acceptBtn]} 
                onPress={() => acceptRequest(id)}
              >
                <Text style={styles.acceptBtnText}>Accept Job</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === 'Accepted' && (
            <TouchableOpacity 
              style={[globalStyles.btnPrimary, styles.fullWidthBtn]} 
              onPress={() => startService(id)}
            >
              <Text style={globalStyles.btnPrimaryText}>Start Service Job</Text>
            </TouchableOpacity>
          )}

          {status === 'In Progress' && (
            <TouchableOpacity 
              style={[globalStyles.btnPrimary, { backgroundColor: colors.success }, styles.fullWidthBtn]} 
              onPress={() => completeService(id)}
            >
              <Text style={globalStyles.btnPrimaryText}>Complete Service Job ✓</Text>
            </TouchableOpacity>
          )}

          {(status === 'Completed' || status === 'Cancelled') && (
            <TouchableOpacity 
              style={[globalStyles.btnSecondary, styles.fullWidthBtn]} 
              onPress={() => setCurrentScreen('REQUEST_LIST')}
            >
              <Text style={globalStyles.btnSecondaryText}>Return to Queue</Text>
            </TouchableOpacity>
          )}
        </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  customerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  custAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    color: colors.textWhite,
    fontSize: 20,
    fontWeight: '800',
  },
  custName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },
  custPhone: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 1,
  },
  contactActions: {
    flexDirection: 'row',
  },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  contactIcon: {
    fontSize: 16,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textLight,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
  },
  notesBox: {
    marginTop: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  notesText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  locBlock: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 10,
  },
  locType: {
    fontSize: 10,
    fontWeight: '750',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  locVal: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: 2,
  },
  miniMap: {
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  mapEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  mapText: {
    fontSize: 12,
    fontWeight: '750',
    color: colors.secondary,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  historyTime: {
    width: 50,
    fontSize: 11,
    color: colors.textLight,
  },
  historyEvent: {
    flex: 1,
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },
  actionContainer: {
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  declineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  declineBtnText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
  acceptBtn: {
    backgroundColor: colors.primary,
  },
  acceptBtnText: {
    color: colors.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
  fullWidthBtn: {
    width: '100%',
    paddingVertical: 15,
  }
});
