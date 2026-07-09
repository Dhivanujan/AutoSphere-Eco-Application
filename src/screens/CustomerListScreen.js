import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function CustomerListScreen() {
  const { requests, providerType, setCurrentScreen } = useApp();
  const [search, setSearch] = useState('');

  // Extract unique customers from provider's requests
  const providerRequests = requests.filter(r => r.type === providerType);
  
  // Create a unique set of customers
  const customersMap = {};
  providerRequests.forEach(req => {
    if (!customersMap[req.customerPhone]) {
      customersMap[req.customerPhone] = {
        name: req.customerName,
        phone: req.customerPhone,
        totalJobs: 1,
        totalSpent: req.fare,
        history: [{ date: req.time, service: req.serviceDetails, amount: req.fare, status: req.status }]
      };
    } else {
      customersMap[req.customerPhone].totalJobs += 1;
      customersMap[req.customerPhone].totalSpent += req.fare;
      customersMap[req.customerPhone].history.push({
        date: req.time,
        service: req.serviceDetails,
        amount: req.fare,
        status: req.status
      });
    }
  });

  const customersList = Object.values(customersMap);

  const filteredCustomers = customersList.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const handleContact = (name, phone) => {
    alert(`Calling Customer ${name}: ${phone}`);
  };

  const handleMessage = (name) => {
    alert(`Opening Chat Messenger with ${name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('DASHBOARD')}>
          <Text style={styles.backBtnText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Customers</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer name or phone..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.textLight}
          />
        </View>

        {filteredCustomers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No customers found</Text>
            <Text style={styles.emptySubtext}>Customers you complete services for will appear in this directory.</Text>
          </View>
        ) : (
          filteredCustomers.map((cust) => (
            <View key={cust.phone} style={globalStyles.card}>
              <View style={styles.customerHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(cust.name || 'C').substring(0, 1)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.custName}>{cust.name}</Text>
                  <Text style={styles.custPhone}>{cust.phone}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleMessage(cust.name)}>
                    <Text style={styles.actionIcon}>💬</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleContact(cust.name, cust.phone)}>
                    <Text style={styles.actionIcon}>📞</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Aggregated info */}
              <View style={styles.statsRow}>
                <View>
                  <Text style={styles.statLabel}>TOTAL JOBS</Text>
                  <Text style={styles.statVal}>{cust.totalJobs}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.statLabel}>TOTAL SPENT</Text>
                  <Text style={styles.statVal}>${cust.totalSpent.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Service History list */}
              <Text style={styles.historyLabel}>Recent Booking Activity</Text>
              {cust.history.map((h, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyService} numberOfLines={1}>{h.service}</Text>
                    <Text style={styles.historyDate}>{h.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.historyAmount}>${h.amount.toFixed(2)}</Text>
                    <Text style={[
                      styles.historyStatus, 
                      h.status === 'Completed' ? { color: colors.success } : { color: colors.pending }
                    ]}>{h.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
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
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.secondary,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  custName: {
    fontSize: 15,
    fontWeight: '750',
    color: colors.secondary,
  },
  custPhone: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  actionIcon: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.secondary,
    marginTop: 4,
  },
  historyLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.02)',
  },
  historyService: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
  },
  historyStatus: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  }
});
