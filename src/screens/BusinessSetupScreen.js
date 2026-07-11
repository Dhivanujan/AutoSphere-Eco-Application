import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function BusinessSetupScreen() {
  const { providerType, profile, saveBusinessProfile, setCurrentScreen, uploadProfilePhoto, uploadBusinessLogo } = useApp();

  // Determine if it is a Business vs Individual Provider
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

  // States
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [businessName, setBusinessName] = useState(profile.businessName || '');
  const [address, setAddress] = useState(profile.address || '');
  const [workingHours, setWorkingHours] = useState(profile.workingHours || '08:00 AM - 06:00 PM');
  const [serviceRadius, setServiceRadius] = useState(profile.serviceRadius.toString());
  const [serviceArea, setServiceArea] = useState(profile.serviceArea || '');
  const [error, setError] = useState('');

  const handlePickImage = (type) => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64Data = event.target.result;
            if (type === 'logo') {
              uploadBusinessLogo(base64Data);
            } else {
              uploadProfilePhoto(base64Data);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      const presets = type === 'logo' 
        ? ['🏢', '🛠️', '🚗', '📦', '🧼'] 
        : ['👨‍✈️', '👩‍✈️', '👨‍🔧', '👩‍🔧', '👤'];
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      if (type === 'logo') {
        uploadBusinessLogo(randomPreset);
      } else {
        uploadProfilePhoto(randomPreset);
      }
      alert('Native Image Picker: Selected mock preset ' + randomPreset);
    }
  };

  const renderImagePreview = (value, placeholder) => {
    if (!value) {
      return <Text style={styles.previewIconPlaceholder}>{placeholder}</Text>;
    }
    if (value.startsWith('data:image/') || value.startsWith('http')) {
      return <Image source={{ uri: value }} style={styles.uploadedImagePreview} />;
    }
    return <Text style={styles.previewIcon}>{value}</Text>;
  };

  const handleSave = () => {
    if (isBusiness) {
      if (!businessName || !address || !workingHours) {
        setError('Please fill in all business details.');
        return;
      }
    } else {
      if (!fullName || !phone) {
        setError('Please fill in all personal details.');
        return;
      }
    }
    setError('');
    
    saveBusinessProfile({
      fullName,
      phone,
      businessName: isBusiness ? businessName : fullName,
      address: address || 'Current Location',
      workingHours,
      serviceRadius: parseInt(serviceRadius) || 10,
      serviceArea: serviceArea || 'City Limits',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('TYPE_SELECTION')}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Setup</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{providerType}</Text>
          </View>
          <Text style={styles.badgeLabel}>
            {isBusiness ? '🏢 Business Account' : '👤 Individual Account'}
          </Text>
        </View>

        <Text style={styles.title}>
          {isBusiness ? 'Setup Business Profile' : 'Setup Provider Profile'}
        </Text>
        <Text style={styles.subtitle}>
          Configure your services and settings. This information will be displayed to your customers.
        </Text>

        <View style={styles.formCard}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Actual Photo / Logo Uploader */}
          <View style={styles.uploaderGroup}>
            <Text style={globalStyles.inputLabel}>
              {isBusiness ? 'Business Logo' : 'Profile Photo'}
            </Text>
            <View style={styles.uploaderRow}>
              <View style={styles.previewContainer}>
                {isBusiness 
                  ? renderImagePreview(profile.businessLogo, '🏢')
                  : renderImagePreview(profile.profilePhoto, '👤')
                }
              </View>
              <View style={styles.uploaderButtons}>
                <Text style={styles.uploaderInstructions}>
                  {isBusiness 
                    ? 'Upload a company logo icon for your customers to identify your business.' 
                    : 'Upload a clear profile photo of yourself.'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <TouchableOpacity 
                    style={[globalStyles.btnPrimary, { marginTop: 0, paddingVertical: 8, paddingHorizontal: 12, marginRight: 10 }]}
                    onPress={() => handlePickImage(isBusiness ? 'logo' : 'avatar')}
                  >
                    <Text style={[globalStyles.btnPrimaryText, { fontSize: 12 }]}>Upload Image</Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 11, color: colors.textLight }}>Or select preset below:</Text>
                </View>
                <View style={[styles.mockSelectorRow, { marginTop: 8 }]}>
                  {isBusiness ? (
                    ['🏢', '🛠️', '🚗', '📦', '🧼'].map(logo => (
                      <TouchableOpacity 
                        key={logo} 
                        style={[
                          styles.mockSelectorBtn, 
                          profile.businessLogo === logo ? styles.mockSelectorBtnActive : null
                        ]}
                        onPress={() => uploadBusinessLogo(logo)}
                      >
                        <Text style={styles.mockSelectorText}>{logo}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    ['👨‍✈️', '👩‍✈️', '👨‍🔧', '👩‍🔧', '👤'].map(avatar => (
                      <TouchableOpacity 
                        key={avatar} 
                        style={[
                          styles.mockSelectorBtn, 
                          profile.profilePhoto === avatar ? styles.mockSelectorBtnActive : null
                        ]}
                        onPress={() => uploadProfilePhoto(avatar)}
                      >
                        <Text style={styles.mockSelectorText}>{avatar}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Common Fields */}
          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.inputLabel}>Full Name (Owner/Manager)</Text>
            <TextInput
              style={globalStyles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Alex Carter"
            />
          </View>

          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.inputLabel}>Contact Phone Number</Text>
            <TextInput
              style={globalStyles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. +1 (555) 789-0123"
              keyboardType="phone-pad"
            />
          </View>

          {/* Business-Only Fields */}
          {isBusiness && (
            <>
              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Registered Business Name</Text>
                <TextInput
                  style={globalStyles.input}
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholder="e.g. Carter Auto Repairs"
                />
              </View>

              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Business Address / Base Location</Text>
                <TextInput
                  style={globalStyles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="e.g. 742 Evergreen Terrace, Springfield"
                />
              </View>

              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Working Hours</Text>
                <TextInput
                  style={globalStyles.input}
                  value={workingHours}
                  onChangeText={setWorkingHours}
                  placeholder="e.g. 08:00 AM - 06:00 PM"
                />
              </View>
            </>
          )}

          {/* Service Area Specifics */}
          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.inputLabel}>Service radius (in miles)</Text>
            <TextInput
              style={globalStyles.input}
              value={serviceRadius}
              onChangeText={setServiceRadius}
              placeholder="e.g. 15"
              keyboardType="numeric"
            />
          </View>

          <View style={globalStyles.inputGroup}>
            <Text style={globalStyles.inputLabel}>Service Area Name</Text>
            <TextInput
              style={globalStyles.input}
              value={serviceArea}
              onChangeText={setServiceArea}
              placeholder="e.g. Springfield Metro Area"
            />
          </View>

          <TouchableOpacity style={globalStyles.btnPrimary} onPress={handleSave}>
            <Text style={globalStyles.btnPrimaryText}>Save & Proceed</Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  badgeLabel: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 6,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
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
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 15,
    fontWeight: '500',
  },
  uploaderGroup: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 20,
  },
  uploaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  previewContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  uploadedImagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  previewIcon: {
    fontSize: 32,
  },
  previewIconPlaceholder: {
    fontSize: 32,
    color: colors.textLight,
    opacity: 0.6,
  },
  uploaderButtons: {
    flex: 1,
  },
  uploaderInstructions: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 15,
    marginBottom: 8,
  },
  mockSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mockSelectorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 6,
  },
  mockSelectorBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  mockSelectorText: {
    fontSize: 18,
  }
});
