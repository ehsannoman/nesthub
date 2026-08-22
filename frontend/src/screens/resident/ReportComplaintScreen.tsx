import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius } from '../../constants/theme';
import { ComplaintCategory } from '../../types';
import { submitComplaint } from '../../api/complaintService';

const categories: { label: ComplaintCategory; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Electrical', icon: 'flash-outline' },
  { label: 'Plumbing', icon: 'water-outline' },
  { label: 'Elevator', icon: 'swap-vertical-outline' },
  { label: 'Cleaning', icon: 'sparkles-outline' },
  { label: 'Security', icon: 'shield-outline' },
  { label: 'Internet', icon: 'wifi-outline' },
  { label: 'Others', icon: 'ellipsis-horizontal-outline' },
];

export default function ReportComplaintScreen() {
  const navigation = useNavigation<any>();
  const [category, setCategory] = useState<ComplaintCategory | null>(null);
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = category && description.trim().length > 0;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const complaint = await submitComplaint({
        category: category!,
        description,
        photoUri,
        flat: 'B-803',
      });
      navigation.replace('ComplaintDetail', { complaint });
    } catch (err) {
      // TODO (backend integration): এখানে proper error handling / toast বসাবে
      console.log('Failed to submit complaint', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Complaint</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.label}
              style={[styles.categoryChip, category === c.label && styles.categoryChipActive]}
              onPress={() => setCategory(c.label)}
            >
              <Ionicons
                name={c.icon}
                size={16}
                color={category === c.label ? '#fff' : colors.primary}
              />
              <Text style={[styles.categoryChipText, category === c.label && styles.categoryChipTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the issue in detail..."
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Photo (Optional)</Text>
        {photoUri ? (
          <View style={styles.photoPreviewWrap}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.removePhotoButton} onPress={() => setPhotoUri(null)}>
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
            <Ionicons name="camera-outline" size={22} color={colors.textMuted} />
            <Text style={styles.photoPickerText}>Add a photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.submitButton, (!canSubmit || submitting) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Complaint</Text>
          )}
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
  backButton: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  form: { paddingHorizontal: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: spacing.md },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.full,
    paddingHorizontal: 13, paddingVertical: 9, backgroundColor: colors.card,
  },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  categoryChipTextActive: { color: '#fff' },

  textArea: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text,
    minHeight: 110,
  },

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

  submitButton: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});