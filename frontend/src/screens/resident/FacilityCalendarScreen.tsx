import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getAvailability, createBooking } from '../../api/bookingService';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function FacilityCalendarScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { facilityId, facilityName, pricePerHour } = route.params;

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [hourlyAvailability, setHourlyAvailability] = useState<any[]>([]);
  const [loadingHours, setLoadingHours] = useState(false);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingHours(true);
    setStartHour(null);
    setEndHour(null);
    getAvailability(facilityId, selectedDate).then((data) => {
      setHourlyAvailability(data.hourlyAvailability);
      setLoadingHours(false);
    });
  }, [selectedDate]);

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

  const isPastDate = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const handleHourPress = (hour: number) => {
    const slot = hourlyAvailability.find((h) => h.hour === hour);
    if (!slot || slot.isFull) return;

    if (startHour === null) {
      setStartHour(hour);
      setEndHour(hour + 1);
    } else if (endHour === null || hour < startHour) {
      setStartHour(hour);
      setEndHour(hour + 1);
    } else {
      // range extend করছি, কিন্তু মাঝে কোনো full hour থাকলে আটকাবো
      const newEnd = hour + 1;
      for (let h = startHour; h < newEnd; h++) {
        const s = hourlyAvailability.find((x) => x.hour === h);
        if (!s || s.isFull) {
          setStartHour(hour);
          setEndHour(hour + 1);
          return;
        }
      }
      setEndHour(newEnd);
    }
  };

  const totalHours = startHour !== null && endHour !== null ? endHour - startHour : 0;
  const totalPrice = totalHours * pricePerHour;

  const handleConfirm = async () => {
    if (!selectedDate || startHour === null || endHour === null || submitting) return;
    setSubmitting(true);
    try {
      const booking = await createBooking({ facilityId, date: selectedDate, startHour, endHour });
      navigation.replace('BookingConfirmation', {
      booking: {
        facilityName, date: selectedDate,
        timeSlot: `${formatHour(startHour)} - ${formatHour(endHour)}`,
        totalPrice: booking.totalPrice,
        status: booking.status, // 'approved' বা 'pending' — backend থেকে যেটা আসে
      },
    });
    } catch (err: any) {
      alert(err.message || 'Could not create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 160 }}>
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

      {/* Calendar */}
      <View style={styles.calendarCard}>
        <View style={styles.weekRow}>
          {weekDays.map((d, i) => <Text key={i} style={styles.weekDayLabel}>{d}</Text>)}
        </View>
        <View style={styles.grid}>
          {cells.map((day, i) => {
            if (day === null) return <View key={i} style={styles.cell} />;
            const ds = toDateStr(viewYear, viewMonth, day);
            const isSelected = selectedDate === ds;
            const disabled = isPastDate(day);
            return (
              <TouchableOpacity key={i} style={styles.cell} onPress={() => !disabled && setSelectedDate(ds)} disabled={disabled}>
                <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}>
                  <Text style={[styles.dayText, disabled && styles.dayTextDisabled, isSelected && styles.dayTextSelected]}>
                    {day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Hourly availability + range picker */}
      {selectedDate && (
        <View style={styles.hoursSection}>
          <Text style={styles.hoursTitle}>Select Hours — {selectedDate}</Text>

          {loadingHours ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.md }} />
          ) : (
            <>
              <View style={styles.legend}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.border }]} /><Text style={styles.legendText}>Available</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.warning }]} /><Text style={styles.legendText}>Pending</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.danger }]} /><Text style={styles.legendText}>Booked</Text></View>
              </View>

              <View style={styles.hourGrid}>
                {hourlyAvailability.map((slot) => {
                  const isInRange = startHour !== null && endHour !== null && slot.hour >= startHour && slot.hour < endHour;
                  return (
                    <TouchableOpacity
                      key={slot.hour}
                      style={[
                        styles.hourChip,
                        slot.status === 'booked' && styles.hourChipFull,
                        slot.status === 'pending' && styles.hourChipPending,
                        isInRange && styles.hourChipSelected,
                      ]}
                      onPress={() => handleHourPress(slot.hour)}
                      disabled={slot.isFull}
                    >
                      <Text style={[
                        styles.hourChipText,
                        slot.status === 'booked' && styles.hourChipTextFull,
                        slot.status === 'pending' && styles.hourChipTextPending,
                        isInRange && styles.hourChipTextSelected,
                      ]}>
                        {formatHour(slot.hour)}
                      </Text>
                      <Text style={[
                        styles.hourChipSub,
                        slot.status === 'pending' && styles.hourChipTextPending,
                        isInRange && styles.hourChipTextSelected,
                      ]}>
                        {slot.status === 'booked' ? 'Booked' : slot.status === 'pending' ? 'Pending' : `${slot.remaining} left`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {totalHours > 0 && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>{formatHour(startHour!)} - {formatHour(endHour!)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>{totalHours} hour{totalHours > 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Price</Text>
                <Text style={styles.summaryPrice}>৳{totalPrice}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.confirmButton, (totalHours === 0 || submitting) && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={totalHours === 0 || submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmButtonText}>Request Booking</Text>}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function formatHour(h: number) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${period}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm,
  },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  monthArrow: { width: 34, height: 34, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  monthLabel: { fontSize: 15, fontWeight: '700', color: colors.text },

  calendarCard: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekDayLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', alignItems: 'center', marginBottom: 6 },
  dayCircle: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  dayCircleSelected: { backgroundColor: colors.primary },
  dayText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  dayTextDisabled: { color: colors.border },
  dayTextSelected: { color: '#fff' },

  hoursSection: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  hoursTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },

  legend: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: radius.full },
  legendText: { fontSize: 11, color: colors.textMuted },

  hourGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hourChip: {
    width: '30%', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: 10, alignItems: 'center', backgroundColor: colors.card,
  },
  hourChipFull: { backgroundColor: '#FDECEC', borderColor: '#FDECEC' },
  hourChipPending: { backgroundColor: '#FEF3E2', borderColor: '#FEF3E2' },
  hourChipTextPending: { color: colors.warning },
  hourChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  hourChipText: { fontSize: 12.5, fontWeight: '700', color: colors.text },
  hourChipTextFull: { color: colors.danger },
  hourChipTextSelected: { color: '#fff' },
  hourChipSub: { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  summaryCard: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginTop: spacing.lg, gap: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13, color: colors.textMuted },
  summaryValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  summaryPrice: { fontSize: 16, fontWeight: '700', color: colors.primary },

  confirmButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.lg },
  confirmButtonDisabled: { opacity: 0.5 },
  confirmButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});