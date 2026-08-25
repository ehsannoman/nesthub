import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../constants/theme';

const menuItems = [
  { label: 'Family Members', icon: 'people-outline' as const, route: 'FamilyMembers' },
  { label: 'My Vehicles', icon: 'car-outline' as const, route: 'Vehicles' },
  { label: 'Settings', icon: 'settings-outline' as const, route: 'Settings' },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('')}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.flat}>Flat B-803 · Green Valley Residency</Text>
      </View>

      <View style={styles.menuList}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.row}
            onPress={() => navigation.navigate('Home', { screen: item.route })}
          >
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  profileCard: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  flat: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  menuList: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  logoutButton: { marginHorizontal: spacing.lg, marginTop: spacing.xl, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: colors.danger, fontSize: 14, fontWeight: '700' },
});