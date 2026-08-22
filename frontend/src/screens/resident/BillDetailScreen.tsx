import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getBills, payBill } from '../../api/billService';
import { Bill } from '../../types';

export default function BillDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { billId } = route.params;

  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    getBills().then((bills) => {
      setBill(bills.find((b) => b.id === billId) || null);
      setLoading(false);
    });
  }, [billId]);

  const handlePay = async () => {
    if (!bill || paying) return;
    setPaying(true);
    const updated = await payBill(bill.id);
    setBill({ ...updated });
    setPaying(false);
  };

  if (loading || !bill) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {bill.status === 'paid' && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.successText}>Paid on {bill.paidDate}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.month}>{bill.month}</Text>
        <Text style={styles.totalAmount}>৳{bill.totalAmount.toLocaleString()}</Text>
        <Text style={styles.dueText}>
          {bill.status === 'paid' ? 'Payment complete' : `Due on ${bill.dueDate}`}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Breakdown</Text>
      <View style={styles.card}>
        {bill.items.map((item, i) => (
          <View
            key={item.label}
            style={[styles.itemRow, i !== bill.items.length - 1 && styles.itemRowBorder]}
          >
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemAmount}>৳{item.amount.toLocaleString()}</Text>
          </View>
        ))}
        <View style={[styles.itemRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>৳{bill.totalAmount.toLocaleString()}</Text>
        </View>
      </View>

      {bill.status === 'unpaid' && (
        <TouchableOpacity style={styles.payButton} onPress={handlePay} disabled={paying}>
          {paying ? <ActivityIndicator color="#fff" /> : <Text style={styles.payButtonText}>Pay Now</Text>}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#EAF7EE', marginHorizontal: spacing.lg, borderRadius: radius.md,
    padding: spacing.sm, marginBottom: spacing.md,
  },
  successText: { color: colors.success, fontSize: 13, fontWeight: '600' },

  card: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
  },
  month: { fontSize: 14, color: colors.textMuted },
  totalAmount: { fontSize: 30, fontWeight: '700', color: colors.text, marginTop: 4 },
  dueText: { fontSize: 12, color: colors.textMuted, marginTop: 4 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginHorizontal: spacing.lg, marginBottom: spacing.sm },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  itemLabel: { fontSize: 13, color: colors.textMuted },
  itemAmount: { fontSize: 13, fontWeight: '600', color: colors.text },
  totalRow: { paddingTop: spacing.sm },
  totalLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 14, fontWeight: '700', color: colors.primary },

  payButton: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 16, alignItems: 'center', marginHorizontal: spacing.lg, marginTop: spacing.md,
  },
  payButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});