import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getMonthAvailability, submitBooking, timeSlots } from '../../api/facilityService';
import { DayStatus } from '../../types';

const statusColor: Record<DayStatus, string> = {
  available: colors.success,
  booked: colors.danger,
  pending: colors.warning,
};

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function FacilityCalendarScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { facilityId, facilityName } = route.params;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [availability, setAvailability] = useState<Record<string, DayStatus>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSelectedDate(null);
    setSelectedSlot(null);
    getMonthAvailability(facilityId, viewYear, viewMonth).then((data) => {
      setAvailability(data);
      setLoading(false);
    });
  }, [viewYear, viewMonth]);

  const changeMonth = (delta: number) => {
    let newMonth = viewMonth + delta;
    let newYear = viewYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const dateStr = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const handleSelectDay = (day: number) => {
    const ds = dateStr(day);
    if (availability[ds] !== 'available') return;
    setSelectedDate(ds);
    setSelectedSlot(null);
  };

  const handleRequestBooking = async () => {
    if (!selectedDate || !selectedSlot || submitting) return;
    setSubmitting(true);
    try {
      const booking = await submitBooking({
        facilityId,
        facilityName,
        date: selectedDate,
        timeSlot: selectedSlot,
      });
      navigation.replace('BookingConfirmation', { booking });
    } catch (err) {
      console.log('Failed to submit booking', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{facilityName}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Month navigator */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthArrow}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthArrow}>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {(['available', 'booked', 'pending'] as DayStatus[]).map((s) => (
          <View key={s} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: statusColor[s] }]} />
            <Text style={styles.legendText}>{s === 'pending' ? 'Pending Approval' : s[0].toUpperCase() + s.slice(1)}</Text>
          </View>
        ))}
      </View>

      {/* Calendar */}
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <View style={styles.calendarCard}>
          <View style={styles.weekRow}>
            {weekDays.map((d, i) => (
              <Text key={i} style={styles.weekDayLabel}>{d}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {cells.map((day, i) => {
              if (day === null) return <View key={i} style={styles.cell} />;
              const ds = dateStr(day);
              const status = availability[ds];
              const isSelected = selectedDate === ds;
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.cell}
                  onPress={() => handleSelectDay(day)}
                  disabled={status !== 'available'}
                >
                  <View style={[
                    styles.dayCircle,
                    isSelected && styles.dayCircleSelected,
                  ]}>
                    <Text style={[
                      styles.dayText,
                      status !== 'available' && styles.dayTextDisabled,
                      isSelected && styles.dayTextSelected,
                    ]}>
                      {day}
                    </Text>
                  </View>
                  {status && !isSelected && (
                    <View style={[styles.statusDot, { backgroundColor: statusColor[status] }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Time slots */}
      {selectedDate && (
        <View style={styles.slotsSection}>
          <Text style={styles.slotsTitle}>Select a time slot</Text>
          <View style={styles.slotsGrid}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotChip, selectedSlot === slot && styles.slotChipActive]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.slotChipText, selectedSlot === slot && styles.slotChipTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.requestButton, (!selectedSlot || submitting) && styles.requestButtonDisabled]}
            onPress={handleRequestBooking}
            disabled={!selectedSlot || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.requestButtonText}>Request Booking</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  monthArrow: {
    width: 34, height: 34, borderRadius: radius.full, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  monthLabel: { fontSize: 15, fontWeight: '700', color: colors.text },

  legend: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: radius.full },
  legendText: { fontSize: 11, color: colors.textMuted },

  calendarCard: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekDayLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: colors.textMuted },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', alignItems: 'center', marginBottom: 6 },
  dayCircle: {
    width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center',
  },
  dayCircleSelected: { backgroundColor: colors.primary },
  dayText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  dayTextDisabled: { color: colors.border },
  dayTextSelected: { color: '#fff' },
  statusDot: { width: 4, height: 4, borderRadius: radius.full, marginTop: 2 },

  slotsSection: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  slotsTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.card,
  },
  slotChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  slotChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  slotChipTextActive: { color: '#fff' },

  requestButton: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl,
  },
  requestButtonDisabled: { opacity: 0.5 },
  requestButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});