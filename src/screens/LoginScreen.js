import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';

export default function LoginScreen() {
  const { loginUser, setCurrentScreen } = useApp();
  const [email, setEmail] = useState('alex.carter@autosphere.eco');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    loginUser(email, password);
  };

  const handleForgotPassword = () => {
    alert('OTP reset instructions sent to: ' + email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.headerArea}>
            <Text style={styles.logoText}>⚙️ AutoSphere</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to manage your digital vehicle services</Text>
          </View>

          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <View style={globalStyles.inputGroup}>
              <Text style={globalStyles.inputLabel}>Email or Phone Number</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter email or phone"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={globalStyles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={globalStyles.inputLabel}>Password</Text>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter password"
                placeholderTextColor={colors.textLight}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={globalStyles.btnPrimary} onPress={handleLogin}>
              <Text style={globalStyles.btnPrimaryText}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => setCurrentScreen('REGISTER')}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Demo Assist */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>💡 Developer Demo Mode</Text>
            <Text style={styles.demoText}>Press "Log In" to proceed to onboarding. Bypass registration or selection via the floating Dev Tools overlay at any time.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerArea: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.secondary,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans, sans-serif' : 'System',
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)' }
    })
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  noAccountText: {
    color: colors.textLight,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  demoBox: {
    marginTop: 30,
    backgroundColor: 'rgba(249, 115, 22, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    borderRadius: 10,
    padding: 12,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 16,
  }
});
