import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function VerificationStatusScreen() {
  const { documents, setCurrentScreen, providerType, profile, setDocuments, setNotifications } = useApp();
  const { status, reviewNotes } = documents;

  // Fix Defect: Prototype auto-approval timer (12 seconds)
  useEffect(() => {
    if (status === 'Pending') {
      const timer = setTimeout(() => {
        forceApprove();
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleAction = () => {
    if (status === 'Approved') {
      setCurrentScreen('DASHBOARD');
    } else if (status === 'Rejected') {
      setCurrentScreen('DOCUMENT_UPLOAD');
    }
  };

  // Helper for demo verification force-approving
  const forceApprove = () => {
    setDocuments(prev => ({
      ...prev,
      status: 'Approved',
      reviewNotes: 'Verified via Quick Dev Tools.'
    }));
    setNotifications(prev => [
      {
        id: 'nt-sys-approve',
        title: 'Account Approved!',
        body: 'Your credentials have been verified. You can now go online and accept requests.',
        time: 'Just now',
        read: false,
        type: 'system'
      },
      ...prev
    ]);
  };

  const forceReject = () => {
    setDocuments(prev => ({
      ...prev,
      status: 'Rejected',
      reviewNotes: 'The business registration document is illegible. Please re-upload a clear copy.'
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.headerLogo} 
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.statusBox}>
          {status === 'Pending' && (
            <>
              <Text style={styles.statusIcon}>⏳</Text>
              <Text style={[styles.statusText, styles.statusPending]}>Verification Pending</Text>
              <Text style={styles.companyName}>{profile.businessName || profile.fullName}</Text>
              <Text style={styles.detailsText}>{reviewNotes}</Text>
              
              <View style={styles.demoTip}>
                <Text style={styles.demoTipTitle}>💡 DEMO MODE TIP</Text>
                <Text style={styles.demoTipText}>This prototype auto-approves this screen after 12 seconds! Or click "Force Approve" below to bypass wait instantly.</Text>
                <View style={styles.forceRow}>
                  <TouchableOpacity style={styles.forceBtn} onPress={forceApprove}>
                    <Text style={styles.forceBtnText}>Force Approve ✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.forceBtn, styles.forceBtnReject]} onPress={forceReject}>
                    <Text style={styles.forceBtnText}>Force Reject ✗</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {status === 'Approved' && (
            <>
              <Text style={styles.statusIcon}>✅</Text>
              <Text style={[styles.statusText, styles.statusApproved]}>Account Approved!</Text>
              <Text style={styles.companyName}>{profile.businessName || profile.fullName}</Text>
              <Text style={styles.detailsText}>
                Your documents have been verified. Your partner profile is fully active on the AutoSphere Eco platform.
              </Text>
              
              <TouchableOpacity style={[globalStyles.btnPrimary, styles.fullWidthBtn]} onPress={handleAction}>
                <Text style={globalStyles.btnPrimaryText}>Go to Dashboard</Text>
              </TouchableOpacity>
            </>
          )}

          {status === 'Rejected' && (
            <>
              <Text style={styles.statusIcon}>❌</Text>
              <Text style={[styles.statusText, styles.statusRejected]}>Verification Rejected</Text>
              <Text style={styles.companyName}>{profile.businessName || profile.fullName}</Text>
              <Text style={styles.detailsText}>
                Reason: <Text style={styles.rejectionReason}>{reviewNotes}</Text>
              </Text>
              
              <TouchableOpacity style={[globalStyles.btnPrimary, styles.fullWidthBtn]} onPress={handleAction}>
                <Text style={globalStyles.btnPrimaryText}>Update Documents</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.infoFooter}>
          <Text style={styles.footerLabel}>Registered service type:</Text>
          <Text style={styles.footerValue}>{providerType}</Text>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  headerLogo: {
    width: 130,
    height: 38,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  statusIcon: {
    fontSize: 72,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  statusPending: {
    color: colors.pending,
  },
  statusApproved: {
    color: colors.success,
  },
  statusRejected: {
    color: colors.danger,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 15,
  },
  detailsText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
    marginBottom: 20,
  },
  rejectionReason: {
    color: colors.danger,
    fontWeight: '600',
  },
  fullWidthBtn: {
    width: '100%',
    maxWidth: 300,
    paddingVertical: 15,
  },
  infoFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  footerLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 2,
  },
  demoTip: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  demoTipTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.pending,
    marginBottom: 4,
  },
  demoTipText: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 12,
  },
  forceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  forceBtn: {
    flex: 1,
    backgroundColor: colors.success,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  forceBtnReject: {
    backgroundColor: colors.danger,
  },
  forceBtnText: {
    color: colors.textWhite,
    fontSize: 11,
    fontWeight: '700',
  }
});
