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
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import { colors, radius } from '../../constants/theme';
import { UserRole } from '../../types';

const roles: { label: string; value: UserRole; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Resident', value: 'resident', icon: 'home-outline' },
  { label: 'Security', value: 'security', icon: 'shield-outline' },
  { label: 'Manager', value: 'manager', icon: 'briefcase-outline' },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('resident');

  const { login } = useAuth();

  const handleLogin = () => {
    // backend connect হওয়ার আগ পর্যন্ত role manually select করে test করছি
    const names: Record<string, string> = {
      resident: 'Rahat Ahmed',
      security: 'Rahim',
      manager: 'Shahid Ahmed',
    };
    login({
      id: '1',
      name: names[selectedRole],
      email,
      role: selectedRole,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>

        {/* Brand */}

        <View style={styles.brandSection}>
          <View style={styles.logo}>
            <Ionicons
              name="home"
              size={25}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.brand}>
            NestHub
          </Text>
        </View>

        {/* Heading */}

        <View style={styles.headingSection}>
          <Text style={styles.heading}>
            Welcome back
          </Text>

          <Text style={styles.subheading}>
            Sign in to continue to your community
          </Text>
        </View>

        {/* Email */}

        <View style={styles.field}>
          <Text style={styles.label}>
            Email address
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={19}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Password */}

        <View style={styles.field}>
          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={19}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  showPassword
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Role selector — test only, backend connect হলে সরিয়ে দেওয়া হবে */}

        <View style={styles.field}>
          <Text style={styles.label}>
            Login as (test only)
          </Text>

          <View style={styles.roleRow}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[
                  styles.roleChip,
                  selectedRole === r.value && styles.roleChipActive,
                ]}
                onPress={() => setSelectedRole(r.value)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={r.icon}
                  size={14}
                  color={selectedRole === r.value ? '#FFFFFF' : colors.textMuted}
                />
                <Text
                  style={[
                    styles.roleChipText,
                    selectedRole === r.value && styles.roleChipTextActive,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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

          <View style={styles.buttonIcon}>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.primary}
            />
          </View>
        </TouchableOpacity>

        {/* Security */}

        <View style={styles.security}>
          <Ionicons
            name="shield-checkmark-outline"
            size={15}
            color={colors.primary}
          />

          <Text style={styles.securityText}>
            Secure and private community access
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

  /* ================= BRAND ================= */

  brandSection: {
    alignItems: 'center',
    marginBottom: 42,
  },

  logo: {
    width: 58,
    height: 58,

    borderRadius: 19,

    backgroundColor: colors.primary,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,

    elevation: 4,
  },

  brand: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  /* ================= HEADING ================= */

  headingSection: {
    marginBottom: 28,
  },

  heading: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.7,
  },

  subheading: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
  },

  /* ================= INPUT ================= */

  field: {
    marginBottom: 18,
  },

  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  inputContainer: {
    height: 54,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 15,

    paddingHorizontal: 15,

    gap: 10,
  },

  input: {
    flex: 1,

    height: '100%',

    color: colors.text,

    fontSize: 15,
  },

  /* ================= ROLE SELECTOR ================= */

  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,

    paddingHorizontal: 13,
    paddingVertical: 9,

    backgroundColor: '#FFFFFF',
  },

  roleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  roleChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textMuted,
  },

  roleChipTextActive: {
    color: '#FFFFFF',
  },

  /* ================= FORGOT ================= */

  forgotButton: {
    alignSelf: 'flex-end',

    marginTop: -3,
    marginBottom: 24,
  },

  forgotText: {
    color: colors.primary,

    fontSize: 13,

    fontWeight: '600',
  },

  /* ================= BUTTON ================= */

  button: {
    height: 56,

    backgroundColor: colors.primary,

    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',
  },

  buttonText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '700',

    letterSpacing: 0.1,
  },

  buttonIcon: {
    position: 'absolute',

    right: 7,

    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ================= SECURITY ================= */

  security: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 24,
  },

  securityText: {
    color: colors.textMuted,

    fontSize: 11,

    marginLeft: 6,
  },
});