import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityScreen() {
  const { isOnline, setIsOnline, profile, setProfile, setCurrentScreen } = useApp();

  const [workingDays, setWorkingDays] = useState(profile.workingDays || []);
  const [workingHours, setWorkingHours] = useState(profile.workingHours || '08:00 AM - 06:00 PM');
  const [lunchBreak, setLunchBreak] = useState(true);

  const toggleDay = (day) => {
    setWorkingDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      workingDays,
      workingHours
    }));
    alert('Availability settings saved successfully!');
    setCurrentScreen('DASHBOARD');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('DASHBOARD')}>
          <Text style={styles.backBtnText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Availability Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Status Toggle */}
        <View style={globalStyles.card}>
          <View style={styles.statusRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>Accepting Bookings</Text>
              <Text style={styles.statusDesc}>Toggle online to receive customer ride requests or service jobs.</Text>
            </View>
            <Switch 
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={isOnline ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.statusIndicatorRow}>
            <View style={[styles.dot, isOnline ? styles.dotOnline : styles.dotOffline]} />
            <Text style={styles.statusLabel}>
              Currently: <Text style={{ fontWeight: 'bold' }}>{isOnline ? 'Online & Visible' : 'Offline & Hidden'}</Text>
            </Text>
          </View>
        </View>

        {/* Operating Hours Card */}
        <View style={globalStyles.card}>
          <Text style={styles.cardSectionHeader}>⏰ Regular Operating Hours</Text>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Working Hours Range</Text>
            <TouchableOpacity style={styles.timeSelectBtn} onPress={() => alert('Change working hours')}>
              <Text style={styles.timeSelectBtnText}>{workingHours}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.statusRow, { paddingVertical: 10, marginTop: 10 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bodyText}>Include Lunch Break (1 Hour)</Text>
              <Text style={styles.subtext}>Automatically block 12:00 PM - 01:00 PM</Text>
            </View>
            <Switch 
              value={lunchBreak}
              onValueChange={setLunchBreak}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
        </View>

        {/* Operating Days Card */}
        <View style={globalStyles.card}>
          <Text style={styles.cardSectionHeader}>📅 Active Working Days</Text>
          <Text style={styles.subtitle}>Select the days when your service is active and open for bookings.</Text>
          
          <View style={styles.daysList}>
            {DAYS_OF_WEEK.map(day => {
              const isActive = workingDays.includes(day);
              return (
                <TouchableOpacity 
                  key={day} 
                  style={[styles.dayItem, isActive ? styles.dayItemActive : null]}
                  onPress={() => toggleDay(day)}
                >
                  <View style={[styles.checkbox, isActive ? styles.checkboxActive : null]}>
                    {isActive && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.dayName, isActive ? styles.dayNameActive : null]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={globalStyles.btnPrimary} onPress={handleSave}>
          <Text style={globalStyles.btnPrimaryText}>Save Schedule</Text>
        </TouchableOpacity>
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  statusDesc: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    paddingRight: 10,
    lineHeight: 16,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dotOnline: {
    backgroundColor: colors.success,
  },
  dotOffline: {
    backgroundColor: colors.danger,
  },
  statusLabel: {
    fontSize: 13,
    color: colors.secondary,
  },
  cardSectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  timeSelectBtn: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  timeSelectBtnText: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 13,
  },
  bodyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  subtext: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
    marginBottom: 15,
  },
  daysList: {
    marginTop: 5,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayItemActive: {
    borderBottomColor: 'rgba(249, 115, 22, 0.2)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayName: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  dayNameActive: {
    color: colors.primary,
    fontWeight: '700',
  }
});
