import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { reportIncident } from '../../api/securityService';
import { IncidentType } from '../../types';

const incidentTypes: { label: IncidentType; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Security Issue', icon: 'shield-outline' },
  { label: 'Fire', icon: 'flame-outline' },
  { label: 'Medical Emergency', icon: 'medkit-outline' },
  { label: 'Suspicious Activity', icon: 'eye-outline' },
  { label: 'Property Damage', icon: 'hammer-outline' },
  { label: 'Other', icon: 'ellipsis-horizontal-outline' },
];

export default function ReportIncidentScreen() {
  const navigation = useNavigation<any>();
  const [type, setType] = useState<IncidentType | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = type && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await reportIncident({ type: type!, description });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIconWrap}>
          <Ionicons name="checkmark-circle" size={44} color={colors.success} />
        </View>
        <Text style={styles.successTitle}>Incident Reported</Text>
        <Text style={styles.successSubtitle}>The manager has been notified and will review this shortly.</Text>
        <TouchableOpacity style={styles.doneButton} onPress={() => navigation.navigate('SecurityDashboard')}>
          <Text style={styles.doneButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report an Incident</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Incident Type</Text>
        <View style={styles.typeGrid}>
          {incidentTypes.map((t) => (
            <TouchableOpacity
              key={t.label}
              style={[styles.typeChip, type === t.label && styles.typeChipActive]}
              onPress={() => setType(t.label)}
            >
              <Ionicons name={t.icon} size={16} color={type === t.label ? '#fff' : colors.danger} />
              <Text style={[styles.typeChipText, type === t.label && styles.typeChipTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe what happened..."
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.submitButton, (!canSubmit || submitting) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Report</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  form: { paddingHorizontal: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: spacing.md },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: colors.card },
  typeChipActive: { backgroundColor: colors.danger, borderColor: colors.danger },
  typeChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  typeChipTextActive: { color: '#fff' },

  textArea: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text, minHeight: 110 },

  submitButton: { backgroundColor: colors.danger, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  successContainer: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center', alignItems: 'center' },
  successIconWrap: { width: 80, height: 80, borderRadius: radius.full, backgroundColor: '#EAF7EE', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  successTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  successSubtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: spacing.lg },
  doneButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: spacing.xl },
  doneButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});