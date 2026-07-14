import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Linking, TextInput, Modal, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { ScreenHeader, AnimatedScreen, StatusBadge, InteractiveMap, EmptyState } from '../components';
import { formatCurrency } from '../utils/helpers';

export default function RequestDetailsScreen() {
  const { 
    selectedRequest, 
    acceptRequest, 
    rejectRequest, 
    startService, 
    completeService, 
    documents,
    setCurrentScreen,
    activeChatMessages,
    sendChatMessage
  } = useApp();

  const [chatVisible, setChatVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef(null);

  if (documents.status !== 'Approved') {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Job Detail"
          backLabel="← Home"
          onBack={() => setCurrentScreen('DASHBOARD')}
        />
        <EmptyState
          icon="🔒"
          title="Verification Locked"
          subtitle="You cannot access customer job details until your account is approved."
        />
      </SafeAreaView>
    );
  }

  if (!selectedRequest) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Job Detail"
          backLabel="← List"
          onBack={() => setCurrentScreen('REQUEST_LIST')}
        />
        <EmptyState
          icon="📭"
          title="No Request Selected"
        />
      </SafeAreaView>
    );
  }

  const { id, customerName, customerPhone, serviceDetails, vehicleDetails, pickupLocation, dropoffLocation, time, notes, fare, status, history, partNumber } = selectedRequest;

  // Progress stepper steps
  const STEPS = ['Pending', 'Accepted', 'In Progress', 'Completed'];
  const currentStepIndex = STEPS.indexOf(status === 'Cancelled' ? 'Pending' : status);

  // Confirmation dialog helper — uses Alert on native, window.confirm on web
  const confirmAction = (title, message, onConfirm) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
    } else {
      Alert.alert(title, message, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: onConfirm },
      ]);
    }
  };

  const handleAccept = () => confirmAction('Accept Job', `Are you sure you want to accept the job from ${customerName}?`, () => acceptRequest(id));
  const handleReject = () => confirmAction('Decline Job', `Are you sure you want to decline the job from ${customerName}? This cannot be undone.`, () => rejectRequest(id));
  const handleStart = () => confirmAction('Start Service', 'Are you sure you want to start this service job?', () => startService(id));
  const handleComplete = () => confirmAction('Complete Job', 'Mark this job as completed? This will finalize the transaction.', () => completeService(id));

  const handleCall = () => {
    Linking.openURL(`tel:${customerPhone}`).catch(() => {
      alert(`Could not trigger phone call. Contact number: ${customerPhone}`);
    });
  };

  const handleMessage = () => {
    setChatVisible(true);
  };

  const handleSend = () => {
    if (messageText.trim()) {
      sendChatMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScreenHeader
        title="Job Details"
        backLabel="← Jobs"
        onBack={() => setCurrentScreen('REQUEST_LIST')}
        rightLabel="Home"
        onRight={() => setCurrentScreen('DASHBOARD')}
      />

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <AnimatedScreen animation="fade">
          {/* Progress Stepper */}
          <View style={styles.stepperContainer}>
            {STEPS.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <React.Fragment key={step}>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepCircle, isActive && styles.stepCircleActive, isCurrent && styles.stepCircleCurrent]}>
                      <Text style={[styles.stepCircleText, isActive && styles.stepCircleTextActive]}>
                        {isActive ? '✓' : index + 1}
                      </Text>
                    </View>
                    <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{step}</Text>
                  </View>
                  {index < STEPS.length - 1 && (
                    <View style={[styles.stepLine, isActive && styles.stepLineActive]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* Status Card */}
          <View style={globalStyles.card}>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.label}>REQUEST ID</Text>
                <Text style={styles.value}>{id}</Text>
              </View>
              <StatusBadge status={status} />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.metaRow}>
              <View>
                <Text style={styles.label}>ESTIMATED PAYOUT</Text>
                <Text style={styles.fareAmount}>{formatCurrency(fare)}</Text>
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
              <Text style={styles.avatarLetter}>{(customerName || 'C').substring(0, 1)}</Text>
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
          <View style={{ marginTop: 16 }}>
            <InteractiveMap latitude={6.9271} longitude={79.8612} height={120} label="Live GPS Navigation Routing" />
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
                onPress={handleReject}
              >
                <Text style={styles.declineBtnText}>✕  Decline</Text>
              </TouchableOpacity>
              <View style={{ width: 12 }} />
              <TouchableOpacity 
                style={[styles.actionBtn, styles.acceptBtn]} 
                onPress={handleAccept}
              >
                <Text style={styles.acceptBtnText}>✓  Accept Job</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === 'Accepted' && (
            <TouchableOpacity 
              style={[globalStyles.btnPrimary, styles.fullWidthBtn]} 
              onPress={handleStart}
            >
              <Text style={globalStyles.btnPrimaryText}>🚀  Start Service Job</Text>
            </TouchableOpacity>
          )}

          {status === 'In Progress' && (
            <TouchableOpacity 
              style={[globalStyles.btnPrimary, { backgroundColor: colors.success }, styles.fullWidthBtn]} 
              onPress={handleComplete}
            >
              <Text style={globalStyles.btnPrimaryText}>✅  Complete Service Job</Text>
            </TouchableOpacity>
          )}

          {(status === 'Completed' || status === 'Cancelled') && (
            <TouchableOpacity 
              style={[globalStyles.btnSecondary, styles.fullWidthBtn]} 
              onPress={() => setCurrentScreen('REQUEST_LIST')}
            >
              <Text style={globalStyles.btnSecondaryText}>← Return to Queue</Text>
            </TouchableOpacity>
          )}
        </View>
        </AnimatedScreen>
      </ScrollView>

      {/* Dynamic Chat Messenger Modal */}
      <Modal
        visible={chatVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setChatVisible(false)}
      >
        <SafeAreaView style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity style={styles.chatCloseBtn} onPress={() => setChatVisible(false)}>
              <Text style={styles.chatCloseBtnText}>✕ Close</Text>
            </TouchableOpacity>
            <Text style={styles.chatHeaderTitle}>{customerName}</Text>
            <View style={{ width: 60 }} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <FlatList
              data={activeChatMessages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatMessagesList}
              renderItem={({ item }) => {
                const isMe = item.sender === 'Provider';
                return (
                  <View style={[styles.msgWrapper, isMe ? styles.msgWrapperMe : styles.msgWrapperOther]}>
                    <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleOther]}>
                      <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>{item.text}</Text>
                      <Text style={[styles.msgTime, isMe ? styles.msgTimeMe : styles.msgTimeOther]}>{item.time}</Text>
                    </View>
                  </View>
                );
              }}
              ref={flatListRef}
              onContentSizeChange={() => {
                if (activeChatMessages && activeChatMessages.length > 0) {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }
              }}
            />

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type your message here..."
                placeholderTextColor="#94A3B8"
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSend}>
                <Text style={styles.chatSendBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
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
    fontWeight: '700',
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
    fontWeight: '700',
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
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: colors.primary,
  },
  stepCircleCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepCircleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
  },
  stepCircleTextActive: {
    color: colors.primary,
  },
  stepLabel: {
    fontSize: 8,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 56,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.border,
    marginBottom: 14,
    marginHorizontal: 2,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  actionContainer: {
    marginVertical: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  lockContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: colors.background,
  },
  lockIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  lockTextTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 8,
  },
  lockTextDesc: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatHeader: {
    height: 56,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  chatCloseBtn: {
    paddingVertical: 5,
  },
  chatCloseBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  chatHeaderTitle: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  chatMessagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  msgWrapper: {
    marginVertical: 6,
    flexDirection: 'row',
    width: '100%',
  },
  msgWrapperMe: {
    justifyContent: 'flex-end',
  },
  msgWrapperOther: {
    justifyContent: 'flex-start',
  },
  msgBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '75%',
  },
  msgBubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  msgBubbleOther: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 18,
  },
  msgTextMe: {
    color: colors.textWhite,
  },
  msgTextOther: {
    color: colors.secondary,
  },
  msgTime: {
    fontSize: 9,
    marginTop: 4,
    textAlign: 'right',
  },
  msgTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  msgTimeOther: {
    color: colors.textLight,
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: colors.background,
    color: colors.secondary,
  },
  chatSendBtn: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  chatSendBtnText: {
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 13,
  }
});
