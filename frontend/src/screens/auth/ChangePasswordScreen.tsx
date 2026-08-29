import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors, radius } from '../../constants/theme';
import { changePassword } from '../../api/authService';
import KeyboardScreen from '../../components/KeyboardScreen';

export default function ChangePasswordScreen() {
  const { user, login } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = newPassword.length >= 6 && newPassword === confirmPassword;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const data = await changePassword(newPassword);
      if (user) {
        await login({ ...user, ...data.user }, data.token);
      }
    } catch (err: any) {
      Alert.alert('Failed', err.message || 'Could not change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardScreen contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark-outline" size={36} color={colors.primary} />
      </View>

      <Text style={styles.title}>Set a New Password</Text>
      <Text style={styles.subtitle}>
        For your security, please create a new password before continuing.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={19} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="At least 6 characters"
            placeholderTextColor={colors.textMuted}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={19} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Re-enter new password"
            placeholderTextColor={colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>
        {confirmPassword.length > 0 && newPassword !== confirmPassword && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit || submitting}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Password</Text>}
      </TouchableOpacity>
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 100 },
  iconWrap: {
    width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 28, lineHeight: 19 },

  field: { marginBottom: 18 },
  label: { color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputContainer: {
    height: 54, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: colors.border, borderRadius: 15, paddingHorizontal: 15, gap: 10,
  },
  input: { flex: 1, height: '100%', color: colors.text, fontSize: 15 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 6 },

  button: {
    height: 56, backgroundColor: colors.primary, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});