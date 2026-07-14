import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { useApp } from '../services/AppContext';
import { AnimatedScreen } from '../components';

export default function LoginScreen() {
  const { loginUser, setCurrentScreen } = useApp();
  const [email, setEmail] = useState('roshan.ranasinghe@autosphere.eco');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (e) {
      // error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address first to reset your password.');
      return;
    }
    setError('');
    alert('Password reset link and OTP instructions sent to: ' + email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.responsiveWrapper}>
            <AnimatedScreen animation="fade">
              <View style={styles.headerArea}>
                <Image 
                  source={require('../assets/logo.png')} 
                  style={styles.logoImage} 
                  resizeMode="contain"
                />
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
                    editable={!loading}
                  />
                </View>

                <View style={globalStyles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={globalStyles.inputLabel}>Password</Text>
                    <TouchableOpacity onPress={handleForgotPassword}>
                      <Text style={styles.forgotText}>Forgot?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={[globalStyles.input, { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
                      placeholder="Enter password"
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
                </View>

                <TouchableOpacity 
                  style={[globalStyles.btnPrimary, loading && globalStyles.btnDisabled]} 
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={globalStyles.btnPrimaryText}>Log In</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.registerRow}>
                  <Text style={styles.noAccountText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => setCurrentScreen('REGISTER')}>
                    <Text style={styles.registerLink}>Sign Up</Text>
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
    marginBottom: 30,
    alignItems: 'center',
  },
  logoImage: {
    width: 220,
    height: 110,
    marginBottom: 10,
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
});
