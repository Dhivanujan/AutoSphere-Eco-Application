import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch, Platform, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { ScreenHeader, AnimatedScreen } from '../components';

export default function SettingsScreen() {
  const { settings, updateSettings, logout, setCurrentScreen } = useApp();

  const handleLanguageChange = () => {
    alert('Language options: English, Spanish, French, German, Arabic. (Mock only)');
  };

  const handleClearCache = () => {
    alert('App cache cleared successfully!');
  };

  const handleDeactivate = () => {
    const msg = 'Are you sure you want to deactivate your partner account? This action cannot be undone.';
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) {
        logout();
      }
    } else {
      Alert.alert(
        'Deactivate Account',
        msg,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Deactivate', style: 'destructive', onPress: logout }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScreenHeader
        title="System Settings"
        backLabel="← Home"
        onBack={() => setCurrentScreen('DASHBOARD')}
      />

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <AnimatedScreen animation="fade">
        
        {/* Account Shortcuts */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>👤 Account Settings</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={() => setCurrentScreen('PROFILE')}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Profile Information</Text>
              <Text style={styles.settingDesc}>Modify owner name, profile picture, and login email.</Text>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={() => setCurrentScreen('BUSINESS_SETUP')}>
            <View style={{ flex: 1 }}>
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
          
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDesc}>Switch to a dark color scheme for reduced eye strain.</Text>
            </View>
            <Switch
              value={settings.darkMode || false}
              onValueChange={(val) => updateSettings('darkMode', val)}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>

          <TouchableOpacity style={styles.settingRow} onPress={handleLanguageChange}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>System Language</Text>
              <Text style={styles.settingDesc}>Active Language: <Text style={{ fontWeight: 'bold', color: colors.primary }}>{settings.language}</Text></Text>
            </View>
            <Text style={styles.chevron}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={handleClearCache}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Clear Cache Storage</Text>
              <Text style={styles.settingDesc}>Wipe local document draft data and temporary images.</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionHeader}>ℹ️ About AutoSphere</Text>
          <Text style={styles.aboutText}>
            AutoSphere Eco is a unified digital logistics platform connecting vehicle service providers with customers. 
            From taxi drivers to garages, rental companies to emergency responders — one platform powers them all.
          </Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Platform</Text>
            <Text style={styles.aboutValue}>React Native + Expo</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Developer</Text>
            <Text style={styles.aboutValue}>AutoSphere Engineering</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>License</Text>
            <Text style={styles.aboutValue}>Proprietary</Text>
          </View>
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

        {/* Version Footer */}
        <View style={styles.versionFooter}>
          <Text style={styles.versionText}>AutoSphere Eco v1.0.0</Text>
          <Text style={styles.versionSubText}>Built with React Native • Expo SDK 54</Text>
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
  aboutText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aboutLabel: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '600',
  },
  aboutValue: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '700',
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
  },
  versionFooter: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textLight,
  },
  versionSubText: {
    fontSize: 11,
    color: 'rgba(148, 163, 184, 0.6)',
    marginTop: 4,
  }
});
