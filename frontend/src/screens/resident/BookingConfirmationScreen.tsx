import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { Booking } from '../../types';

export default function BookingConfirmationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const booking: Booking = route.params.booking;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="time-outline" size={40} color={colors.warning} />
      </View>
      <Text style={styles.title}>Booking Requested</Text>
      <Text style={styles.subtitle}>
        Your request has been sent to the manager for approval. You'll get a notification once it's confirmed.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Facility</Text>
          <Text style={styles.value}>{booking.facilityName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{booking.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{booking.timeSlot}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Pending Approval</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.doneButton} onPress={() => navigation.popToTop()}>
        <Text style={styles.doneButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center' },
  iconWrap: {
    width: 72, height: 72, borderRadius: radius.full, backgroundColor: '#FEF3E2',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 19, marginBottom: spacing.lg },

  card: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, color: colors.textMuted },
  value: { fontSize: 13, fontWeight: '600', color: colors.text },
  statusBadge: { backgroundColor: '#FEF3E2', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: 12, fontWeight: '700', color: colors.warning },

  doneButton: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl,
  },
  doneButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});