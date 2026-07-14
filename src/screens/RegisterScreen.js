import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'transparent', width: '0%' };
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = (password.length >= 8 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasLower ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);
    
    if (password.length < 4) return { label: 'Too Short', color: colors.danger, width: '15%' };
    if (score <= 2) return { label: 'Weak', color: colors.danger, width: '33%' };
    if (score <= 3) return { label: 'Medium', color: colors.pending, width: '60%' };
    return { label: 'Strong', color: colors.success, width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleRegister = async () => {
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
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agree) {
      setError('You must agree to the Terms of Service.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await registerUser(name, email, phone, password);
    } catch (e) {
      // handled in context
    } finally {
      setLoading(false);
    }
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
          <View style={styles.responsiveWrapper}>
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
                    editable={!loading}
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
                    editable={!loading}
                  />
                </View>

                <View style={globalStyles.inputGroup}>
                  <Text style={globalStyles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="e.g. +94 77 123 4567"
                    placeholderTextColor={colors.textLight}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    editable={!loading}
                  />
                </View>

                <View style={globalStyles.inputGroup}>
                  <Text style={globalStyles.inputLabel}>Password</Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={[globalStyles.input, { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
                      placeholder="At least 6 characters"
                      placeholderTextColor={colors.textLight}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity 
                      style={styles.eyeBtn}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Password strength meter */}
                  {password.length > 0 && (
                    <View style={styles.strengthContainer}>
                      <View style={styles.strengthTrack}>
                        <View style={[styles.strengthFill, { backgroundColor: strength.color, width: strength.width }]} />
                      </View>
                      <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity 
                  style={styles.agreeRow} 
                  onPress={() => setAgree(!agree)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, agree ? styles.checkboxChecked : null]}>
                    {agree && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.agreeText}>
                    I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[globalStyles.btnPrimary, loading && globalStyles.btnDisabled]} 
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={globalStyles.btnPrimaryText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.loginRow}>
                  <Text style={styles.hasAccountText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => setCurrentScreen('LOGIN')}>
                    <Text style={styles.loginLink}>Log In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </AnimatedScreen>
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
  responsiveWrapper: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  headerArea: {
    marginBottom: 20,
    alignItems: 'center',
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: colors.border,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 18,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginRight: 10,
    overflow: 'hidden',
  },
  strengthFill: {
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '700',
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
