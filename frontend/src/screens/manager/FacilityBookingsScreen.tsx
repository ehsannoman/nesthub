import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getBookingRequests, approveBookingRequest, rejectBookingRequest } from '../../api/managerService';
import { BookingRequest } from '../../types';

export default function FacilityBookingsScreen() {
  const navigation = useNavigation<any>();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  const load = () => getBookingRequests().then(setBookings);
  useEffect(() => { load(); }, []);

  const pending = bookings.filter((b) => b.status === 'pending');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Facility Bookings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
        {pending.length === 0 && <Text style={styles.emptyText}>No pending booking requests</Text>}
        {pending.map((b) => (
          <View key={b.id} style={styles.card}>
            <Text style={styles.facilityName}>{b.facilityName}</Text>
            <Text style={styles.sub}>{b.residentName} · Flat {b.flat}</Text>
            <Text style={styles.sub}>{b.date} · {b.timeSlot}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.approveButton} onPress={async () => { await approveBookingRequest(b.id); load(); }}>
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={async () => { await rejectBookingRequest(b.id); load(); }}>
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  facilityName: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8, marginTop: spacing.sm },
  approveButton: { flex: 1, backgroundColor: colors.success, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  approveButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  rejectButton: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  rejectButtonText: { color: colors.danger, fontSize: 13, fontWeight: '700' },
});