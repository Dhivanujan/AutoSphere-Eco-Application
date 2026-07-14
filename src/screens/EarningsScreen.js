import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { ScreenHeader, AnimatedScreen } from '../components';
import { formatCurrency } from '../utils/helpers';

export default function EarningsScreen() {
  const { earnings, setCurrentScreen, requestPayout } = useApp();

  const completedTx = earnings.history.filter(tx => tx.status === 'Completed');
  const completedTxCount = completedTx.length;
  const completedTxSum = completedTx.reduce((acc, tx) => acc + tx.amount, 0);

  const settledPayouts = earnings.history.filter(tx => tx.status === 'Settled' || (tx.title && tx.title.includes('Payout')));
  const settledSum = settledPayouts.reduce((acc, tx) => acc + tx.amount, 0);

  const pendingSum = earnings.weekly;

  const getDynamicWeeklyCycle = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(new Date().setDate(diffToMonday));
    const endOfWeek = new Date(new Date().setDate(diffToMonday + 6));
    
    const options = { month: 'short', day: 'numeric' };
    return `Cycle: ${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', options)}`;
  };

  const handleRequestPayout = () => {
    if (earnings.weekly <= 0) {
      alert('No unsettled balance available for payout!');
      return;
    }

    const confirmMsg = `Do you want to transfer your unsettled balance of ${formatCurrency(earnings.weekly)} to your bank account?`;
    
    const performPayout = async () => {
      const success = await requestPayout(earnings.weekly);
      if (success) {
        alert('Payout request submitted successfully!\nBalance transfer is now processing.');
      } else {
        alert('Payout transfer failed. Please try again.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        performPayout();
      }
    } else {
      Alert.alert(
        'Confirm Payout',
        confirmMsg,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Transfer', onPress: performPayout }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScreenHeader
        title="Earnings Report"
        backLabel="← Home"
        onBack={() => setCurrentScreen('DASHBOARD')}
      />

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <AnimatedScreen animation="fade">
        {/* Main balance card */}
        <View style={[globalStyles.card, { backgroundColor: colors.secondary }]}>
          <Text style={styles.balanceLabel}>CURRENT BALANCE (UNSETTLED)</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(earnings.weekly)}</Text>
          <Text style={styles.balanceSub}>{getDynamicWeeklyCycle()}</Text>
          
          <TouchableOpacity style={styles.payoutBtn} onPress={handleRequestPayout}>
            <Text style={styles.payoutBtnText}>Payout to Bank Account</Text>
          </TouchableOpacity>
        </View>
 
        {/* Earnings breakdown grid */}
        <View style={styles.breakdownRow}>
          <View style={[globalStyles.card, styles.breakdownCard]}>
            <Text style={styles.breakdownLabel}>Today</Text>
            <Text style={styles.breakdownVal}>{formatCurrency(earnings.daily)}</Text>
          </View>
          <View style={[globalStyles.card, styles.breakdownCard]}>
            <Text style={styles.breakdownLabel}>This Month</Text>
            <Text style={styles.breakdownVal}>{formatCurrency(earnings.monthly)}</Text>
          </View>
        </View>

        {/* Reports: Statement breakdown */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>📋 Statement Breakdown Report</Text>
          <View style={styles.reportRow}>
            <View style={styles.reportItem}>
              <View style={[styles.reportBadge, { backgroundColor: colors.successLight }]}>
                <Text style={[styles.reportIcon, { color: colors.success }]}>✓</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.reportLabel}>Completed Services</Text>
                <Text style={styles.reportDesc}>{completedTxCount} jobs successfully completed</Text>
              </View>
              <Text style={[styles.reportVal, { color: colors.success }]}>+{formatCurrency(completedTxSum)}</Text>
            </View>

            <View style={styles.reportItem}>
              <View style={[styles.reportBadge, { backgroundColor: colors.infoLight }]}>
                <Text style={[styles.reportIcon, { color: colors.info }]}>🏦</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.reportLabel}>Payments Received (Settled)</Text>
                <Text style={styles.reportDesc}>Transferred successfully to bank account</Text>
              </View>
              <Text style={[styles.reportVal, { color: colors.info }]}>{formatCurrency(settledSum)}</Text>
            </View>

            <View style={styles.reportItem}>
              <View style={[styles.reportBadge, { backgroundColor: colors.pendingLight }]}>
                <Text style={[styles.reportIcon, { color: colors.pending }]}>⏳</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.reportLabel}>Pending Payments (Unsettled)</Text>
                <Text style={styles.reportDesc}>Accrued balance awaiting weekly payout</Text>
              </View>
              <Text style={[styles.reportVal, { color: colors.pending }]}>{formatCurrency(pendingSum)}</Text>
            </View>
          </View>
        </View>

        {/* Weekly Activity Simulator Bar Chart */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>📊 Weekly Activity Chart</Text>
          <View style={styles.chartContainer}>
            {[
              { day: 'Mon', val: 8000, valText: 'Rs. 8k' },
              { day: 'Tue', val: 12000, valText: 'Rs. 12k' },
              { day: 'Wed', val: 18000, valText: 'Rs. 18k' },
              { day: 'Thu', val: 9500, valText: 'Rs. 9.5k' },
              { day: 'Fri', val: 21000, valText: 'Rs. 21k' },
              { day: 'Sat', val: 0, valText: 'Rs. 0' },
              { day: 'Sun', val: 0, valText: 'Rs. 0' },
            ].map((d) => (
              <View key={d.day} style={styles.chartBarCol}>
                <Text style={styles.chartBarValText}>{d.valText}</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { height: `${(d.val / 22000) * 100}%` }]} />
                </View>
                <Text style={styles.chartBarLabel}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Transaction log */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>💳 Transaction History</Text>
          
          {earnings.history && earnings.history.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                <Text style={[styles.txAmount, tx.amount < 0 ? styles.txNegative : null]}>
                  {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(Math.abs(tx.amount))}`}
                </Text>
                <Text style={styles.txStatus}>{tx.status}</Text>
              </View>
            </View>
          ))}
        </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  balanceLabel: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textWhite,
    marginTop: 8,
  },
  balanceSub: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginTop: 4,
  },
  payoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  payoutBtnText: {
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 14,
  },
  breakdownLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  breakdownVal: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.secondary,
    marginTop: 6,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 20,
    paddingHorizontal: 8,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarValText: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
  },
  chartBarTrack: {
    width: 14,
    height: 90,
    backgroundColor: colors.background,
    borderRadius: 7,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    backgroundColor: colors.primary,
    borderRadius: 7,
  },
  chartBarLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '600',
    marginTop: 6,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  txDate: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.success,
  },
  txNegative: {
    color: colors.danger,
  },
  txStatus: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
  reportRow: {
    marginTop: 5,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reportBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reportLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
  },
  reportDesc: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
  reportVal: {
    fontSize: 14,
    fontWeight: '800',
  }
});
