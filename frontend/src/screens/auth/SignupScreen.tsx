import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing } from '../../constants/theme';
import { registerManager } from '../../api/authService';

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [buildingName, setBuildingName] = useState('');
  const [buildingAddress, setBuildingAddress] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [totalFlats, setTotalFlats] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim() && email.trim() && password.trim().length >= 6 && buildingName.trim() && buildingAddress.trim();

  const handleSignup = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const data = await registerManager({
        name,
        email,
        phone: phone || undefined,
        password,
        buildingName,
        buildingAddress,
        totalFloors: totalFloors ? parseInt(totalFloors, 10) : undefined,
        totalFlats: totalFlats ? parseInt(totalFlats, 10) : undefined,
      });

      await login(data.user, data.token);
    } catch (err: any) {
      Alert.alert('Signup Failed', err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.brandSection}>
          <View style={styles.logo}>
            <Ionicons name="business" size={25} color="#FFFFFF" />
          </View>
          <Text style={styles.brand}>NestHub</Text>
        </View>

        <View style={styles.headingSection}>
          <Text style={styles.heading}>Register Your Building</Text>
          <Text style={styles.subheading}>Create your manager account and set up your community</Text>
        </View>

        <Text style={styles.sectionLabel}>Your Details</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={19} color={colors.textMuted} />
            <TextInput style={styles.input} placeholder="Your name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={19} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone (Optional)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={19} color={colors.textMuted} />
            <TextInput style={styles.input} placeholder="017XXXXXXXX" placeholderTextColor={colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={19} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Building Details</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Building Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={19} color={colors.textMuted} />
            <TextInput style={styles.input} placeholder="e.g. Green Valley Residency" placeholderTextColor={colors.textMuted} value={buildingName} onChangeText={setBuildingName} />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Building Address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={19} color={colors.textMuted} />
            <TextInput style={styles.input} placeholder="Road, Block, City" placeholderTextColor={colors.textMuted} value={buildingAddress} onChangeText={setBuildingAddress} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.half]}>
            <Text style={styles.label}>Total Floors</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="12" placeholderTextColor={colors.textMuted} value={totalFloors} onChangeText={setTotalFloors} keyboardType="numeric" />
            </View>
          </View>
          <View style={[styles.field, styles.half]}>
            <Text style={styles.label}>Total Flats</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="60" placeholderTextColor={colors.textMuted} value={totalFlats} onChangeText={setTotalFlats} keyboardType="numeric" />
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, !canSubmit && styles.buttonDisabled]} onPress={handleSignup} disabled={!canSubmit || submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text></Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },

  brandSection: { alignItems: 'center', marginBottom: 24 },
  logo: {
    width: 58, height: 58, borderRadius: 19, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  brand: { color: colors.text, fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },

  headingSection: { marginBottom: 20 },
  heading: { color: colors.text, fontSize: 24, fontWeight: '700', textAlign: 'center' },
  subheading: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 },

  sectionLabel: { fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: 12, marginBottom: 6, textTransform: 'uppercase' },

  field: { marginBottom: 14 },
  label: { color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 7 },
  inputContainer: {
    height: 52, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, gap: 10,
  },
  input: { flex: 1, height: '100%', color: colors.text, fontSize: 15 },

  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },

  button: {
    height: 54, backgroundColor: colors.primary, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  loginLink: { alignItems: 'center', marginTop: 20 },
  loginLinkText: { color: colors.textMuted, fontSize: 13 },
  loginLinkBold: { color: colors.primary, fontWeight: '700' },
});