import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function DocumentUploadScreen() {
  const { providerType, documents, uploadDocument, submitDocumentsForVerification, setCurrentScreen } = useApp();
  const [error, setError] = useState('');

  // Determine which docs are required
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

  const handlePickDocument = (key) => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          uploadDocument(key, file.name);
        }
      };
      input.click();
    } else {
      const defaultDocs = {
        identityDoc: 'my_government_id.pdf',
        businessReg: 'business_incorporation_license.pdf',
        license: 'operating_permit.pdf',
        certificates: 'liability_insurance.pdf'
      };
      const fname = defaultDocs[key] || 'uploaded_doc.pdf';
      uploadDocument(key, fname);
      alert('Selected document: ' + fname);
    }
  };

  const handleSubmit = () => {
    // Check if required documents are uploaded
    if (!documents.identityDoc) {
      setError('Please upload your Identity Document.');
      return;
    }
    if (!documents.license) {
      setError('Please upload your Professional/Operating License.');
      return;
    }
    if (isBusiness && !documents.businessReg) {
      setError('Please upload your Business Registration Document.');
      return;
    }
    
    setError('');
    submitDocumentsForVerification();
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentScreen('BUSINESS_SETUP')}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Upload</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Verification Documents</Text>
        <Text style={styles.subtitle}>
          Upload high-quality photos or PDF copies of your licenses and credentials. This ensures safety and trust on the AutoSphere network.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.docList}>
          {/* Document 1: ID */}
          <View style={styles.docItem}>
            <View style={styles.docInfo}>
              <Text style={styles.docName}>Identity Document (Required)</Text>
              <Text style={styles.docDesc}>Passport, Driver's License or National ID Card</Text>
              {documents.identityDoc && <Text style={styles.fileName}>✓ {documents.identityDoc}</Text>}
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, documents.identityDoc ? styles.uploadedBtn : null]}
              onPress={() => handlePickDocument('identityDoc')}
            >
              <Text style={[styles.uploadBtnText, documents.identityDoc ? styles.uploadedBtnText : null]}>
                {documents.identityDoc ? 'Replace' : 'Upload File'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Document 2: Business Registration */}
          {isBusiness && (
            <View style={styles.docItem}>
              <View style={styles.docInfo}>
                <Text style={styles.docName}>Business Registration Certificate (Required)</Text>
                <Text style={styles.docDesc}>Official business incorporation paperwork or tax license</Text>
                {documents.businessReg && <Text style={styles.fileName}>✓ {documents.businessReg}</Text>}
              </View>
              <TouchableOpacity 
                style={[styles.uploadBtn, documents.businessReg ? styles.uploadedBtn : null]}
                onPress={() => handlePickDocument('businessReg')}
              >
                <Text style={[styles.uploadBtnText, documents.businessReg ? styles.uploadedBtnText : null]}>
                  {documents.businessReg ? 'Replace' : 'Upload File'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Document 3: Operating License */}
          <View style={styles.docItem}>
            <View style={styles.docInfo}>
              <Text style={styles.docName}>Professional License (Required)</Text>
              <Text style={styles.docDesc}>
                {isBusiness ? 'Commercial service license or permit' : 'Driver license or certified mechanic credentials'}
              </Text>
              {documents.license && <Text style={styles.fileName}>✓ {documents.license}</Text>}
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, documents.license ? styles.uploadedBtn : null]}
              onPress={() => handlePickDocument('license')}
            >
              <Text style={[styles.uploadBtnText, documents.license ? styles.uploadedBtnText : null]}>
                {documents.license ? 'Replace' : 'Upload File'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Document 4: Certificates */}
          <View style={styles.docItem}>
            <View style={styles.docInfo}>
              <Text style={styles.docName}>Liability Insurance / Certificates (Optional)</Text>
              <Text style={styles.docDesc}>Insurance cover or specialized vehicle training certificates</Text>
              {documents.certificates && <Text style={styles.fileName}>✓ {documents.certificates}</Text>}
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, documents.certificates ? styles.uploadedBtn : null]}
              onPress={() => handlePickDocument('certificates')}
            >
              <Text style={[styles.uploadBtnText, documents.certificates ? styles.uploadedBtnText : null]}>
                {documents.certificates ? 'Replace' : 'Upload File'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, globalStyles.btnPrimary]} 
          onPress={handleSubmit}
        >
          <Text style={globalStyles.btnPrimaryText}>Submit for Review</Text>
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
    padding: 20,
    paddingBottom: 40,
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
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 15,
    fontWeight: '500',
  },
  docList: {
    marginBottom: 24,
  },
  docItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  docInfo: {
    flex: 1,
    marginRight: 10,
  },
  docName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  docDesc: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
    lineHeight: 15,
  },
  fileName: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '700',
    marginTop: 6,
  },
  uploadBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  uploadBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  uploadedBtn: {
    backgroundColor: colors.primaryLight,
    borderColor: 'transparent',
  },
  uploadedBtnText: {
    color: colors.primary,
  },
  submitButton: {
    marginTop: 10,
    paddingVertical: 15,
  }
});
