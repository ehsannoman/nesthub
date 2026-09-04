import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getFacilities } from '../../api/facilityService';

export default function BookFacilityScreen() {
  const navigation = useNavigation<any>();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacilities().then((data) => {
      setFacilities(data);
      setLoading(false);
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Facility</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>Choose a facility to check availability</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <View style={styles.list}>
          {facilities.length === 0 && (
            <Text style={styles.emptyText}>No facilities available yet. Contact your manager.</Text>
          )}
          {facilities.map((f) => (
            <TouchableOpacity
              key={f._id}
              style={styles.card}
              onPress={() => navigation.navigate('FacilityCalendar', { facilityId: f._id, facilityName: f.name, pricePerHour: f.pricePerHour })}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={f.icon} size={24} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{f.name}</Text>
                <Text style={styles.cardDesc}>
                  {f.bookingType === 'exclusive' ? `Up to ${f.maxCapacity} guests` : `${f.maxCapacity} slots/hour`} · ৳{f.pricePerHour}/hour
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
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
  subtitle: { fontSize: 13, color: colors.textMuted, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  emptyText: { fontSize: 13, color: colors.textMuted, paddingHorizontal: spacing.lg },

  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  iconWrap: {
    width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});