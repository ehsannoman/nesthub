import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getGeneratedBills } from '../../api/managerService';
import { GeneratedBill } from '../../types';

export default function FinanceScreen() {
  const navigation = useNavigation<any>();
  const [bills, setBills] = useState<GeneratedBill[]>([]);

  useEffect(() => { getGeneratedBills().then(setBills); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Dashboard', { screen: 'CreateBill' })}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120 }}>
        <View style={styles.financialCard}>
          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Income</Text>
            <Text style={styles.financeValue}>৳125,500</Text>
          </View>
          <View style={styles.financeDivider} />
          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Expenses</Text>
            <Text style={styles.financeValue}>৳68,300</Text>
          </View>
          <View style={styles.financeDivider} />
          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Outstanding</Text>
            <Text style={styles.financeValue}>৳57,200</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Generated Bills</Text>
        <View style={{ gap: spacing.sm }}>
          {bills.length === 0 && <Text style={styles.emptyText}>No bills generated yet</Text>}
          {bills.map((b) => (
            <View key={b.id} style={styles.billRow}>
              <View style={styles.billIconWrap}>
                <Ionicons name="receipt-outline" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.billFlat}>Flat {b.flat}</Text>
                <Text style={styles.billMonth}>{b.month}</Text>
              </View>
              <Text style={styles.billAmount}>৳{b.totalAmount.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  addButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  financialCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.lg },
  financeItem: { flex: 1 },
  financeLabel: { fontSize: 11, color: colors.textMuted },
  financeValue: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 },
  financeDivider: { width: 1, backgroundColor: colors.border, marginHorizontal: spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  emptyText: { fontSize: 13, color: colors.textMuted },
  billRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  billIconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  billFlat: { fontSize: 14, fontWeight: '600', color: colors.text },
  billMonth: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  billAmount: { fontSize: 14, fontWeight: '700', color: colors.text },
});