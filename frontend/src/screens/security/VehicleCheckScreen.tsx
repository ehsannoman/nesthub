import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';

export default function VehicleCheckScreen() {
  const navigation = useNavigation<any>();
  const [plate, setPlate] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<'found' | 'not-found' | null>(null);

  const handleCheck = async () => {
    if (!plate.trim() || checking) return;
    setChecking(true);
    setResult(null);
    // TODO (backend integration): replace করো — GET /api/vehicles?plate=...
    await new Promise((r) => setTimeout(r, 700));
    setResult(plate.trim().length % 2 === 0 ? 'found' : 'not-found');
    setChecking(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Check</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Vehicle Plate Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. DHA-1234"
          placeholderTextColor={colors.textMuted}
          value={plate}
          onChangeText={setPlate}
          autoCapitalize="characters"
        />

        <TouchableOpacity style={styles.checkButton} onPress={handleCheck} disabled={checking}>
          {checking ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkButtonText}>Check Vehicle</Text>}
        </TouchableOpacity>

        {result === 'found' && (
          <View style={[styles.resultCard, { backgroundColor: '#EAF7EE' }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={[styles.resultText, { color: colors.success }]}>Registered — Flat B-803, Owner: Rahat Ahmed</Text>
          </View>
        )}
        {result === 'not-found' && (
          <View style={[styles.resultCard, { backgroundColor: '#FDECEC' }]}>
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <Text style={[styles.resultText, { color: colors.danger }]}>No registered vehicle found with this plate</Text>
          </View>
        )}
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

  checkButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.lg },
  checkButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  resultCard: { flexDirection: 'row', gap: 8, alignItems: 'center', borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  resultText: { flex: 1, fontSize: 13, fontWeight: '600' },
});