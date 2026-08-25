import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';

const services = [
  { label: 'Invite Visitor', icon: 'person-add-outline' as const, route: 'InviteVisitor' },
  { label: 'Report Complaint', icon: 'build-outline' as const, route: 'ReportComplaint' },
  { label: 'Book Facility', icon: 'calendar-outline' as const, route: 'BookFacility' },
  { label: 'View Bills', icon: 'document-text-outline' as const, route: 'Bills' },
  { label: 'Notices', icon: 'megaphone-outline' as const, route: 'Notices' },
  { label: 'My Vehicles', icon: 'car-outline' as const, route: 'Vehicles' },
  { label: 'Family Members', icon: 'people-outline' as const, route: 'FamilyMembers' },
];

export default function ServicesScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
        {services.map((s) => (
          <TouchableOpacity
            key={s.label}
            style={styles.row}
            onPress={() => navigation.navigate('Home', { screen: s.route })}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={s.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.label}>{s.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
});