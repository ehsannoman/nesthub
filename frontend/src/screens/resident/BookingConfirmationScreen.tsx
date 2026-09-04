import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';

export default function BookingConfirmationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const booking: any = route.params.booking;
  const isApproved = booking.status === 'approved';

  return (
    <View style={styles.container}>      
    <View style={[styles.iconWrap, isApproved && { backgroundColor: '#EAF7EE' }]}>
      <Ionicons name={isApproved ? 'checkmark-circle-outline' : 'time-outline'} size={40} color={isApproved ? colors.success : colors.warning} />
    </View>
    <Text style={styles.title}>{isApproved ? 'Booking Confirmed!' : 'Booking Requested'}</Text>
    <Text style={styles.subtitle}>
      {isApproved
        ? 'Your booking is confirmed. See you there!'
        : "Your request has been sent to the manager for approval. You'll get a notification once it's confirmed."}
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
        {booking.totalPrice !== undefined && (
          <View style={styles.row}>
            <Text style={styles.label}>Total Price</Text>
            <Text style={styles.value}>৳{booking.totalPrice}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <View style={[styles.statusBadge, isApproved && { backgroundColor: '#EAF7EE' }]}>
          <Text style={[styles.statusText, isApproved && { color: colors.success }]}>
            {isApproved ? 'Confirmed' : 'Pending Approval'}
          </Text>
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