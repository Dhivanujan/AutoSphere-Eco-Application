import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { ScreenHeader, AnimatedScreen } from '../components';

export default function RegisterScreen() {
  const { registerUser, setCurrentScreen } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.length < 8) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!agree) {
      setError('You must agree to the Terms of Service.');
      return;
    }
    setError('');
    registerUser(name, email, phone, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Create Account"
        backLabel="← Login"
        onBack={() => setCurrentScreen('LOGIN')}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <AnimatedScreen animation="fade">
            <View style={styles.headerArea}>
              <Text style={styles.title}>Get Started</Text>
              <Text style={styles.subtitle}>Register your business to begin receiving customer requests</Text>
            </View>

            <View style={styles.formContainer}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Full Name</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="e.g. Alex Carter"
                  placeholderTextColor={colors.textLight}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Email Address</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="e.g. alex@example.com"
                  placeholderTextColor={colors.textLight}
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
                  placeholder="e.g. +1 (555) 789-0123"
                  placeholderTextColor={colors.textLight}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={globalStyles.inputGroup}>
                <Text style={globalStyles.inputLabel}>Password</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Terms and conditions toggle */}
              <TouchableOpacity style={styles.agreeRow} onPress={() => setAgree(!agree)}>
                <View style={[styles.checkbox, agree ? styles.checkboxChecked : null]}>
                  {agree ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={styles.agreeText}>
                  I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={globalStyles.btnPrimary} onPress={handleRegister}>
                <Text style={globalStyles.btnPrimaryText}>Create Account</Text>
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.hasAccountText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => setCurrentScreen('LOGIN')}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </AnimatedScreen>
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
    marginBottom: 20,
    alignItems: 'center',
  },
  logoImage: {
    width: 220,
    height: 110,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  subtitle: {
    fontSize: 13,
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
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  agreeText: {
    color: colors.textLight,
    fontSize: 13,
    flex: 1,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  hasAccountText: {
    color: colors.textLight,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  }
});
