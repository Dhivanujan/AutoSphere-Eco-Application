import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { api } from '../services/api';

export default function ProfileScreen() {
  const { profile, setProfile, providerType, setCurrentScreen, uploadProfilePhoto, uploadBusinessLogo, currentUser } = useApp();

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

  const handleUpdate = async () => {
    if (currentUser) {
      const updatedFields = {
        fullName,
        email,
        phone,
        businessName,
        address,
        workingHours,
        serviceArea
      };
      try {
        await api.profile.updateProfile(currentUser.uid, updatedFields);
        alert('Profile updated successfully!');
        setCurrentScreen('DASHBOARD');
      } catch (err) {
        alert('Failed to update profile: ' + err.message);
      }
    } else {
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
      alert('Profile updated successfully (local)!');
      setCurrentScreen('DASHBOARD');
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
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

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        {/* Banner with profile initial */}
        <View style={styles.banner}>
          <View style={styles.bigAvatar}>
            {isBusiness 
              ? renderImagePreview(profile.businessLogo, '🏢')
              : renderImagePreview(profile.profilePhoto, '👤')
            }
          </View>
          <Text style={styles.bannerName}>{businessName || fullName}</Text>
          <Text style={styles.bannerRole}>{providerType}</Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          {/* Actual Photo / Logo Uploader */}
          <View style={styles.uploaderGroup}>
            <Text style={styles.formSectionTitle}>
              {isBusiness ? '🏢 Business Logo' : '👤 Profile Photo'}
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
    overflow: 'hidden',
  },
  avatarText: {
    color: colors.textWhite,
    fontSize: 32,
    fontWeight: '800',
  },
  bannerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textWhite,
  },
  bannerRole: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '600',
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
