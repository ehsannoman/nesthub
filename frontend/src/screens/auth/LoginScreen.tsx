import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { colors, radius } from '../../constants/theme';
import { login as loginApi } from '../../api/authService';
import KeyboardScreen from '../../components/KeyboardScreen';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim() || submitting) return;
    setSubmitting(true);
    try {
      const data = await loginApi(email, password);
      await login(data.user, data.token);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardScreen contentContainerStyle={styles.container}>

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
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
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
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
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
          </>
        )}
      </TouchableOpacity>

      {/* Signup link — শুধু Manager/Owner দের জন্য */}

      <TouchableOpacity
        style={styles.signupLink}
        onPress={() => navigation.navigate('Signup')}
        activeOpacity={0.7}
      >
        <Text style={styles.signupLinkText}>
          Registering a new building? <Text style={styles.signupLinkBold}>Sign up as Manager</Text>
        </Text>
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

    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 100,
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

  /* ================= SIGNUP LINK ================= */

  signupLink: {
    alignItems: 'center',
    marginTop: 20,
  },

  signupLinkText: {
    color: colors.textMuted,
    fontSize: 13,
  },

  signupLinkBold: {
    color: colors.primary,
    fontWeight: '700',
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