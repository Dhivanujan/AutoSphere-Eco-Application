import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function SettingsScreen() {
  const { settings, updateSettings, logout, setCurrentScreen } = useApp();

  const handleLanguageChange = () => {
    alert('Language options: English, Spanish, French, German, Arabic. (Mock only)');
  };

  const handleClearCache = () => {
    alert('App cache cleared successfully!');
  };

  const handleDeactivate = () => {
    const conf = confirm('Are you sure you want to deactivate your partner account? This action cannot be undone.');
    if (conf) {
      logout();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('DASHBOARD')}>
          <Text style={styles.backBtnText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Account Shortcuts */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>👤 Account Settings</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={() => setCurrentScreen('PROFILE')}>
            <View>
              <Text style={styles.settingTitle}>Profile Information</Text>
              <Text style={styles.settingDesc}>Modify owner name, profile picture, and login email.</Text>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={() => setCurrentScreen('BUSINESS_SETUP')}>
            <View>
              <Text style={styles.settingTitle}>Business Operations Details</Text>
              <Text style={styles.settingDesc}>Update business logo, working hours, and service area details.</Text>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>
        </View>

        {/* System & Notification Toggles */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>🔔 Alert Notifications</Text>
          
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Push Notification Alerts</Text>
              <Text style={styles.settingDesc}>Receive immediate popup notifications for incoming job requests.</Text>
            </View>
            <Switch
              value={settings.pushNotifications}
              onValueChange={(val) => updateSettings('pushNotifications', val)}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Email Receipts & Updates</Text>
              <Text style={styles.settingDesc}>Get weekly statement breakdowns and logs delivered to your inbox.</Text>
            </View>
            <Switch
              value={settings.emailNotifications}
              onValueChange={(val) => updateSettings('emailNotifications', val)}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
        </View>

        {/* Security & Access */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>🔒 Privacy & Access</Text>
          
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>GPS Location Permissions</Text>
              <Text style={styles.settingDesc}>Allow background location tracking to automatically detect nearby requests.</Text>
            </View>
            <Switch
              value={settings.locationAccess}
              onValueChange={(val) => updateSettings('locationAccess', val)}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Biometric Secure Login</Text>
              <Text style={styles.settingDesc}>Use FaceID / Fingerprint security to open the workspace portal.</Text>
            </View>
            <Switch
              value={settings.biometrics}
              onValueChange={(val) => updateSettings('biometrics', val)}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
        </View>

        {/* App Preferences */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>⚙️ App Preferences</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={handleLanguageChange}>
            <View>
              <Text style={styles.settingTitle}>System Language</Text>
              <Text style={styles.settingDesc}>Active Language: <Text style={{ fontWeight: 'bold', color: colors.primary }}>{settings.language}</Text></Text>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={handleClearCache}>
            <View>
              <Text style={styles.settingTitle}>Clear Cache Storage</Text>
              <Text style={styles.settingDesc}>Wipe local document draft data and temporary images.</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Session / Safety */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[globalStyles.btnSecondary, styles.fullWidthBtn]} onPress={logout}>
            <Text style={globalStyles.btnSecondaryText}>Log Out Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deactivateBtn} onPress={handleDeactivate}>
            <Text style={styles.deactivateText}>Deactivate Partner Account</Text>
          </TouchableOpacity>
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
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  settingDesc: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    lineHeight: 15,
    maxWidth: '90%',
  },
  chevron: {
    fontSize: 18,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  fullWidthBtn: {
    width: '100%',
    paddingVertical: 15,
  },
  deactivateBtn: {
    marginTop: 20,
    paddingVertical: 8,
  },
  deactivateText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  }
});
