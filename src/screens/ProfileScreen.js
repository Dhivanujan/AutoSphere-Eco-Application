import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function ProfileScreen() {
  const { profile, setProfile, providerType, setCurrentScreen } = useApp();

  const isBusiness = [
    'Taxi Company',
    'Garage',
    'Service Station',
    'Spare Parts Seller',
    'Vehicle Rental',
    'Bus Operator',
    'Parking Service',
    'Car Wash Service'
  ].includes(providerType);

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [businessName, setBusinessName] = useState(profile.businessName || '');
  const [address, setAddress] = useState(profile.address || '');
  const [workingHours, setWorkingHours] = useState(profile.workingHours || '');
  const [serviceArea, setServiceArea] = useState(profile.serviceArea || '');

  const handleUpdate = () => {
    setProfile(prev => ({
      ...prev,
      fullName,
      email,
      phone,
      businessName,
      address,
      workingHours,
      serviceArea
    }));
    alert('Profile updated successfully!');
    setCurrentScreen('DASHBOARD');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('DASHBOARD')}>
          <Text style={styles.backBtnText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.backBtn} onPress={handleUpdate}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner with profile initial */}
        <View style={styles.banner}>
          <View style={styles.bigAvatar}>
            <Text style={styles.avatarText}>
              {businessName ? businessName.substring(0, 1) : fullName.substring(0, 1)}
            </Text>
          </View>
          <Text style={styles.bannerName}>{businessName || fullName}</Text>
          <Text style={styles.bannerRole}>{providerType}</Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.formSectionTitle}>👤 Personal Information</Text>
          
          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.inputLabel}>Full Name</Text>
            <TextInput
              style={globalStyles.input}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.inputLabel}>Email Address</Text>
            <TextInput
              style={globalStyles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.inputLabel}>Phone Number</Text>
            <TextInput
              style={globalStyles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {isBusiness && (
            <>
              <View style={styles.spacer} />
              <Text style={styles.formSectionTitle}>🏢 Business Specifications</Text>

              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Business Name</Text>
                <TextInput
                  style={globalStyles.input}
                  value={businessName}
                  onChangeText={setBusinessName}
                />
              </View>

              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Physical Workshop Address</Text>
                <TextInput
                  style={globalStyles.input}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Operating Hours</Text>
                <TextInput
                  style={globalStyles.input}
                  value={workingHours}
                  onChangeText={setWorkingHours}
                />
              </View>

              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Target Logistics Area</Text>
                <TextInput
                  style={globalStyles.input}
                  value={serviceArea}
                  onChangeText={setServiceArea}
                />
              </View>
            </>
          )}

          <TouchableOpacity style={[globalStyles.btnPrimary, { marginTop: 15 }]} onPress={handleUpdate}>
            <Text style={globalStyles.btnPrimaryText}>Save Changes</Text>
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
  saveBtnText: {
    color: colors.success,
    fontWeight: '700',
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
  banner: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bigAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.textWhite,
    fontSize: 32,
    fontWeight: '800',
  },
  bannerName: {
    fontSize: 18,
    fontWeight: '750',
    color: colors.textWhite,
  },
  bannerRole: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '650',
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)' }
    })
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  spacer: {
    height: 10,
  }
});
