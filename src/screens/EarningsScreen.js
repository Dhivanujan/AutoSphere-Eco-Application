import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function EarningsScreen() {
  const { earnings, setCurrentScreen } = useApp();

  const handleRequestPayout = () => {
    alert('Requesting Bank Payout for: $' + earnings.weekly.toFixed(2) + '\nThis will settle in 2 business days.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('DASHBOARD')}>
          <Text style={styles.backBtnText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings Report</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main balance card */}
        <View style={[globalStyles.card, { backgroundColor: colors.secondary }]}>
          <Text style={styles.balanceLabel}>CURRENT BALANCE (UNSETTLED)</Text>
          <Text style={styles.balanceAmount}>${earnings.weekly.toFixed(2)}</Text>
          <Text style={styles.balanceSub}>Cycle: July 1 - July 7</Text>
          
          <TouchableOpacity style={styles.payoutBtn} onPress={handleRequestPayout}>
            <Text style={styles.payoutBtnText}>Payout to Bank Account</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings breakdown grid */}
        <View style={styles.breakdownRow}>
          <View style={[globalStyles.card, styles.breakdownCard]}>
            <Text style={styles.breakdownLabel}>Today</Text>
            <Text style={styles.breakdownVal}>${earnings.daily.toFixed(2)}</Text>
          </View>
          <View style={[globalStyles.card, styles.breakdownCard]}>
            <Text style={styles.breakdownLabel}>This Month</Text>
            <Text style={styles.breakdownVal}>${earnings.monthly.toFixed(2)}</Text>
          </View>
        </View>

        {/* Weekly Activity Simulator Bar Chart */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>📊 Weekly Activity Chart</Text>
          <View style={styles.chartContainer}>
            {[
              { day: 'Mon', val: 80, valText: '$80' },
              { day: 'Tue', val: 120, valText: '$120' },
              { day: 'Wed', val: 180, valText: '$180' },
              { day: 'Thu', val: 95, valText: '$95' },
              { day: 'Fri', val: 210, valText: '$210' },
              { day: 'Sat', val: 0, valText: '$0' },
              { day: 'Sun', val: 0, valText: '$0' },
            ].map((d) => (
              <View key={d.day} style={styles.chartBarCol}>
                <Text style={styles.chartBarValText}>{d.valText}</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { height: `${(d.val / 220) * 100}%` }]} />
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
              <View>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.txAmount, tx.amount < 0 ? styles.txNegative : null]}>
                  {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                </Text>
                <Text style={styles.txStatus}>{tx.status}</Text>
              </View>
            </View>
          ))}
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
  }
});
