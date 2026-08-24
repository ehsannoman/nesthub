import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { generateBill } from '../../api/managerService';
import { BillLineItem } from '../../types';

const defaultItems: BillLineItem[] = [
  { label: 'Maintenance Fee', amount: 3500 },
  { label: 'Lift Charge', amount: 800 },
  { label: 'Generator Charge', amount: 600 },
  { label: 'Water Bill', amount: 700 },
];

export default function CreateBillScreen() {
  const navigation = useNavigation<any>();
  const [flat, setFlat] = useState('');
  const [month, setMonth] = useState('September 2025');
  const [items, setItems] = useState<BillLineItem[]>(defaultItems);
  const [generating, setGenerating] = useState(false);

  const total = items.reduce((sum, i) => sum + i.amount, 0);

  const updateAmount = (index: number, value: string) => {
    const amount = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, amount } : item)));
  };

  const handleGenerate = async () => {
    if (!flat.trim() || generating) return;
    setGenerating(true);
    await generateBill(flat, month, items);
    setGenerating(false);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Bill</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Flat Number</Text>
        <TextInput style={styles.input} placeholder="e.g. B-803" placeholderTextColor={colors.textMuted} value={flat} onChangeText={setFlat} />

        <Text style={styles.label}>Billing Month</Text>
        <TextInput style={styles.input} value={month} onChangeText={setMonth} />

        <Text style={styles.label}>Breakdown</Text>
        <View style={styles.itemsCard}>
          {items.map((item, i) => (
            <View key={item.label} style={styles.itemRow}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <TextInput style={styles.itemInput} keyboardType="numeric" value={String(item.amount)} onChangeText={(v) => updateAmount(i, v)} />
            </View>
          ))}
          <View style={[styles.itemRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>৳{total.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.generateButton, (!flat.trim() || generating) && styles.generateButtonDisabled]} onPress={handleGenerate} disabled={!flat.trim() || generating}>
          {generating ? <ActivityIndicator color="#fff" /> : <Text style={styles.generateButtonText}>Generate & Send Bill</Text>}
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
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text },
  itemsCard: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  itemLabel: { fontSize: 13, color: colors.textMuted, flex: 1 },
  itemInput: { fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'right', minWidth: 70 },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 4, paddingTop: 10 },
  totalLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 14, fontWeight: '700', color: colors.primary },
  generateButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl },
  generateButtonDisabled: { opacity: 0.5 },
  generateButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});