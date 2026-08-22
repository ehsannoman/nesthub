import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getBills } from '../../api/billService';
import { Bill } from '../../types';

export default function BillsScreen() {
  const navigation = useNavigation<any>();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBills().then((data) => {
      setBills(data);
      setLoading(false);
    });
  }, []);

  const currentBill = bills.find((b) => b.status === 'unpaid') || bills[0];
  const historyBills = bills.filter((b) => b.id !== currentBill?.id);

  if (loading) {
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
        <Text style={styles.headerTitle}>Bills</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Current bill */}
      {currentBill && (
        <TouchableOpacity
          style={styles.currentCard}
          onPress={() => navigation.navigate('BillDetail', { billId: currentBill.id })}
        >
          <View style={styles.currentTopRow}>
            <View>
              <Text style={styles.currentLabel}>{currentBill.month}</Text>
              <Text style={styles.currentAmount}>৳{currentBill.totalAmount.toLocaleString()}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              currentBill.status === 'paid' ? styles.statusPaid : styles.statusUnpaid,
            ]}>
              <Text style={[
                styles.statusBadgeText,
                currentBill.status === 'paid' ? styles.statusPaidText : styles.statusUnpaidText,
              ]}>
                {currentBill.status === 'paid' ? 'Paid' : 'Unpaid'}
              </Text>
            </View>
          </View>
          <Text style={styles.currentDue}>Due on {currentBill.dueDate}</Text>
          <View style={styles.currentDetailsRow}>
            <Text style={styles.currentDetailsText}>View Bill Details</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </View>
        </TouchableOpacity>
      )}

      {/* Payment history */}
      <Text style={styles.sectionTitle}>Payment History</Text>
      <View style={styles.historyList}>
        {historyBills.map((bill) => (
          <TouchableOpacity
            key={bill.id}
            style={styles.historyRow}
            onPress={() => navigation.navigate('BillDetail', { billId: bill.id })}
          >
            <View style={styles.historyIconWrap}>
              <Ionicons name="receipt-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyMonth}>{bill.month}</Text>
              <Text style={styles.historySub}>
                {bill.status === 'paid' ? `Paid on ${bill.paidDate}` : `Due ${bill.dueDate}`}
              </Text>
            </View>
            <Text style={styles.historyAmount}>৳{bill.totalAmount.toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
      </View>
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

  currentCard: {
    backgroundColor: colors.primary, marginHorizontal: spacing.lg, borderRadius: radius.lg,
    padding: spacing.lg, marginTop: spacing.sm,
  },
  currentTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  currentLabel: { color: '#CFE8E6', fontSize: 13 },
  currentAmount: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 2 },
  statusBadge: { borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  statusPaid: { backgroundColor: 'rgba(255,255,255,0.9)' },
  statusUnpaid: { backgroundColor: '#fff' },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },
  statusPaidText: { color: colors.success },
  statusUnpaidText: { color: colors.primary },
  currentDue: { color: '#CFE8E6', fontSize: 12, marginTop: 8 },
  currentDetailsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: spacing.md, paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)',
  },
  currentDetailsText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.sm },
  historyList: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  historyRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  historyIconWrap: {
    width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  historyMonth: { fontSize: 14, fontWeight: '600', color: colors.text },
  historySub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  historyAmount: { fontSize: 14, fontWeight: '700', color: colors.text },
});