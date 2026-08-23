import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius } from '../../constants/theme';
import { registerWalkInVisitor } from '../../api/securityService';

export default function AddVisitorScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [flat, setFlat] = useState('');
  const [reason, setReason] = useState('');
  const [idPhotoUri, setIdPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim() && phone.trim() && flat.trim() && reason.trim();

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!result.canceled) setIdPhotoUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await registerWalkInVisitor({ name, phone, flat, reason, idPhotoUri });
    setSubmitting(false);
    navigation.navigate('SecurityDashboard');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Visitor (Walk-in)</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Visitor Name</Text>
        <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder="017XXXXXXXX" placeholderTextColor={colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Flat to Visit</Text>
        <TextInput style={styles.input} placeholder="e.g. B-803" placeholderTextColor={colors.textMuted} value={flat} onChangeText={setFlat} />

        <Text style={styles.label}>Reason for Visit</Text>
        <TextInput style={styles.input} placeholder="e.g. Guest, delivery, technician" placeholderTextColor={colors.textMuted} value={reason} onChangeText={setReason} />

        <Text style={styles.label}>ID Photo</Text>
        {idPhotoUri ? (
          <View style={styles.photoPreviewWrap}>
            <Image source={{ uri: idPhotoUri }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.removePhotoButton} onPress={() => setIdPhotoUri(null)}>
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
            <Ionicons name="camera-outline" size={22} color={colors.textMuted} />
            <Text style={styles.photoPickerText}>Take ID Photo</Text>
          </TouchableOpacity>
        )}

        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.info} />
          <Text style={styles.noteText}>Resident approval will be requested before entry is granted.</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (!canSubmit || submitting) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Register Visitor</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md,
  },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  form: { paddingHorizontal: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: spacing.md },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text },

  photoPicker: {
    borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radius.md,
    paddingVertical: spacing.lg, alignItems: 'center', gap: 6, backgroundColor: colors.card,
  },
  photoPickerText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  photoPreviewWrap: { position: 'relative', alignSelf: 'flex-start' },
  photoPreview: { width: 100, height: 100, borderRadius: radius.md },
  removePhotoButton: {
    position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: radius.full,
    backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center',
  },

  noteBox: {
    flexDirection: 'row', gap: 8, backgroundColor: '#EAF2FF', borderRadius: radius.md,
    padding: spacing.sm, marginTop: spacing.md, alignItems: 'flex-start',
  },
  noteText: { flex: 1, fontSize: 12, color: colors.info },

  submitButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});