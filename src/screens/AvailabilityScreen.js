import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { api } from '../services/api';
import { ScreenHeader, AnimatedScreen } from '../components';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TIME_OPTIONS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', 
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
];

export default function AvailabilityScreen() {
  const { isOnline, setIsOnline, profile, setProfile, setCurrentScreen, currentUser } = useApp();

  const [workingDays, setWorkingDays] = useState(profile.workingDays || []);
  const [workingHours, setWorkingHours] = useState(profile.workingHours || '08:00 AM - 06:00 PM');
  const [lunchBreak, setLunchBreak] = useState(true);

  const initialHours = profile.workingHours || '08:00 AM - 06:00 PM';
  const parts = initialHours.split(' - ');
  const [startTime, setStartTime] = useState(parts[0] || '08:00 AM');
  const [endTime, setEndTime] = useState(parts[1] || '06:00 PM');

  const toggleDay = (day) => {
    setWorkingDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleTimeChange = (start, end) => {
    setStartTime(start);
    setEndTime(end);
    setWorkingHours(`${start} - ${end}`);
  };

  const handleSave = async () => {
    if (currentUser) {
      try {
        await api.profile.updateProfile(currentUser.uid, {
          workingDays,
          workingHours
        });
        alert('Availability settings saved successfully!');
        setCurrentScreen('DASHBOARD');
      } catch (err) {
        alert('Failed to save settings: ' + err.message);
      }
    } else {
      setProfile(prev => ({
        ...prev,
        workingDays,
        workingHours
      }));
      alert('Availability settings saved successfully (local)!');
      setCurrentScreen('DASHBOARD');
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScreenHeader
        title="Availability Settings"
        backLabel="← Home"
        onBack={() => setCurrentScreen('DASHBOARD')}
      />

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <AnimatedScreen animation="fade">
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
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: 11, color: colors.textLight, marginBottom: 4 }}>Start Time</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={startTime}
                  onChange={(e) => handleTimeChange(e.target.value, endTime)}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.secondary,
                    borderWidth: 1,
                    fontSize: 13,
                    width: '100%'
                  }}
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <TouchableOpacity 
                  style={styles.timeSelectBtn} 
                  onPress={() => {
                    const idx = TIME_OPTIONS.indexOf(startTime);
                    const next = TIME_OPTIONS[(idx + 1) % TIME_OPTIONS.length];
                    handleTimeChange(next, endTime);
                  }}
                >
                  <Text style={styles.timeSelectBtnText}>{startTime}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ fontSize: 11, color: colors.textLight, marginBottom: 4 }}>End Time</Text>
              {Platform.OS === 'web' ? (
                <select
                  value={endTime}
                  onChange={(e) => handleTimeChange(startTime, e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.secondary,
                    borderWidth: 1,
                    fontSize: 13,
                    width: '100%'
                  }}
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <TouchableOpacity 
                  style={styles.timeSelectBtn} 
                  onPress={() => {
                    const idx = TIME_OPTIONS.indexOf(endTime);
                    const next = TIME_OPTIONS[(idx + 1) % TIME_OPTIONS.length];
                    handleTimeChange(startTime, next);
                  }}
                >
                  <Text style={styles.timeSelectBtnText}>{endTime}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={[styles.statusRow, { paddingVertical: 10, marginTop: 15 }]}>
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
