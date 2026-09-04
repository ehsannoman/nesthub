import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getBookings } from '../../api/bookingService';

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  approved: { bg: '#EAF7EE', color: colors.success, label: 'Confirmed' },
  pending: { bg: '#FEF3E2', color: colors.warning, label: 'Pending Approval' },
  rejected: { bg: '#FDECEC', color: colors.danger, label: 'Rejected' },
};

export default function MyBookingsScreen() {
  const navigation = useNavigation<any>();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
          {bookings.length === 0 && <Text style={styles.emptyText}>No bookings yet</Text>}
          {bookings.map((b) => {
            const cfg = statusConfig[b.status] || statusConfig.pending;
            return (
              <View key={b._id} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={b.facilityId?.icon || 'business-outline'} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.facilityName}>{b.facilityId?.name}</Text>
                    <Text style={styles.dateText}>{b.date} · {formatHour(b.startHour)} - {formatHour(b.endHour)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Total</Text>
                  <Text style={styles.priceValue}>৳{b.totalPrice}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

function formatHour(h: number) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${period}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },

  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  facilityName: { fontSize: 15, fontWeight: '700', color: colors.text },
  dateText: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  statusBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  priceLabel: { fontSize: 12, color: colors.textMuted },
  priceValue: { fontSize: 13, fontWeight: '700', color: colors.primary },
});