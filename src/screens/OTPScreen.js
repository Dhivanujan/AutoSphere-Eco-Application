import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function OTPScreen() {
  const { verifyOTP, profile, setCurrentScreen } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    if (code.length < 4) {
      setError('Please enter the 4-digit code.');
      return;
    }
    setError('');
    const success = verifyOTP(code);
    if (!success) {
      setError('Invalid code. Try "1234" for testing.');
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(59);
      alert('Verification code resent to ' + profile.phone);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('REGISTER')}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.headerArea}>
            <Text style={styles.otpIcon}>📱</Text>
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>
              We sent a 4-digit verification code to your phone number: {'\n'}
              <Text style={styles.phoneNumber}>{profile.phone || '+1 (555) 789-0123'}</Text>
            </Text>
          </View>

          <View style={styles.card}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.otpInputContainer}>
              {/* For mock prototype, single input styled like digits is clean and works across web/mobile */}
              <TextInput
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={4}
                value={code}
                onChangeText={setCode}
                placeholder="0000"
                placeholderTextColor="rgba(15, 23, 42, 0.15)"
                autoFocus
              />
            </View>

            <Text style={styles.hintText}>Demo code is "1234" or any 4 digits</Text>

            <TouchableOpacity style={globalStyles.btnPrimary} onPress={handleVerify}>
              <Text style={globalStyles.btnPrimaryText}>Verify & Continue</Text>
            </TouchableOpacity>

            <View style={styles.resendRow}>
              <Text style={styles.resendLabel}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                <Text style={[styles.resendLink, timer > 0 ? styles.resendDisabled : null]}>
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 30,
  },
  otpIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  phoneNumber: {
    fontWeight: '700',
    color: colors.secondary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'stretch',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)' }
    })
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  otpInputContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 10,
    paddingVertical: 12,
    width: 180,
    color: colors.secondary,
    backgroundColor: colors.background,
  },
  hintText: {
    fontSize: 12,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendLabel: {
    color: colors.textLight,
    fontSize: 14,
  },
  resendLink: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  resendDisabled: {
    color: colors.textLight,
    fontWeight: '500',
  },
});
