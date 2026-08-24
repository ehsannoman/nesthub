import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../constants/theme';

const menuItems = [
  { label: 'Facility Bookings', icon: 'calendar-outline' as const, route: 'FacilityBookings' },
  { label: 'Visitor Log', icon: 'people-outline' as const, route: 'VisitorLog' },
  { label: 'Generate Report', icon: 'bar-chart-outline' as const, route: 'AIAssistant' },
];

export default function ManagerMoreScreen() {
  const navigation = useNavigation<any>();
  const { logout, user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
        <Text style={styles.subtitle}>{user?.name}</Text>
      </View>

      <View style={styles.list}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.row} onPress={() => navigation.navigate('Dashboard', { screen: item.route })}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.label}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  logoutButton: { marginHorizontal: spacing.lg, marginTop: spacing.xl, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: colors.danger, fontSize: 14, fontWeight: '700' },
});