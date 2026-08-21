import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();

  const handleLogin = () => {
    login({
      id: '1',
      name: 'Test User',
      email,
      role: 'resident',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>

        {/* Logo */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>N</Text>
        </View>

        {/* Brand */}
        <Text style={styles.brand}>NestHub</Text>

        {/* Heading */}
        <View style={styles.headingSection}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>
            Sign in to your community account
          </Text>
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          style={styles.forgotButton}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotText}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        {/* Sign In */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            Sign In
          </Text>

          <View style={styles.buttonArrow}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Security */}
        <View style={styles.security}>
          <Text style={styles.securityIcon}>✓</Text>

          <Text style={styles.securityText}>
            Your account is securely protected
          </Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  /* ---------- Brand ---------- */

  logo: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.primary,

    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '700',
  },

  brand: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
  },

  /* ---------- Heading ---------- */

  headingSection: {
    marginTop: 38,
    marginBottom: 25,
  },

  heading: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 6,
  },

  subheading: {
    color: colors.textMuted,
    fontSize: 14,
  },

  /* ---------- Fields ---------- */

  field: {
    marginBottom: 17,
  },

  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 52,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.md,

    paddingHorizontal: 15,

    color: colors.text,
    fontSize: 15,
  },

  /* ---------- Forgot ---------- */

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -3,
    marginBottom: 22,
  },

  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  /* ---------- Button ---------- */

  button: {
    height: 54,

    backgroundColor: colors.primary,

    borderRadius: radius.md,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  buttonArrow: {
    position: 'absolute',
    right: 7,

    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: 'rgba(255,255,255,0.16)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 27,
    lineHeight: 29,
    fontWeight: '300',
  },

  /* ---------- Security ---------- */

  security: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 25,
  },

  securityIcon: {
    width: 18,
    height: 18,

    borderRadius: 9,

    backgroundColor: colors.primaryLight,

    color: colors.primary,

    textAlign: 'center',
    lineHeight: 18,

    fontSize: 11,
    fontWeight: '700',

    marginRight: 7,
  },

  securityText: {
    color: colors.textMuted,
    fontSize: 11,
  },
});