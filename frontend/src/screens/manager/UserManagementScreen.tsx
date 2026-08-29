import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getUsers, createUser } from '../../api/userService';
import { ManagedUser, AccountRole } from '../../types';

const roleFilters: { label: string; value: AccountRole | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Resident', value: 'resident' },
  { label: 'Security', value: 'security' },
  { label: 'Maintenance', value: 'maintenance' },
];

const roleOptions: AccountRole[] = ['resident', 'security', 'maintenance', 'manager'];

const roleBadgeColor: Record<AccountRole, { bg: string; color: string }> = {
  resident: { bg: '#EAF7EE', color: colors.success },
  security: { bg: '#EAF2FF', color: colors.info },
  maintenance: { bg: '#FEF3E2', color: colors.warning },
  manager: { bg: '#F1E9FC', color: colors.purple },
};

export default function UserManagementScreen() {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [filter, setFilter] = useState<AccountRole | 'all'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AccountRole>('resident');
  const [creating, setCreating] = useState(false);

  // Resident-only fields
  const [flat, setFlat] = useState('');
  const [ownershipType, setOwnershipType] = useState<'Owner' | 'Tenant'>('Owner');
  const [moveInDate, setMoveInDate] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');

  // Security/Maintenance-only fields
  const [employeeId, setEmployeeId] = useState('');
  const [joiningDate, setJoiningDate] = useState('');

  const loadUsers = () => {
    getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter((u) => {
    const matchesRole = filter === 'all' || u.role === filter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setRole('resident');
    setFlat(''); setOwnershipType('Owner'); setMoveInDate('');
    setEmergencyName(''); setEmergencyPhone(''); setEmergencyRelation('');
    setEmployeeId(''); setJoiningDate('');
  };

  const handleCreate = async () => {
    if (!name.trim() || !email.trim() || creating) return;
    setCreating(true);
    await createUser({
      name,
      email,
      phone: phone || undefined,
      role,
      flat: role === 'resident' ? flat || undefined : undefined,
      ownershipType: role === 'resident' ? ownershipType : undefined,
      moveInDate: role === 'resident' ? moveInDate || undefined : undefined,
      emergencyContactName: role === 'resident' ? emergencyName || undefined : undefined,
      emergencyContactPhone: role === 'resident' ? emergencyPhone || undefined : undefined,
      emergencyContactRelation: role === 'resident' ? emergencyRelation || undefined : undefined,
      employeeId: role === 'security' || role === 'maintenance' ? employeeId || undefined : undefined,
      joiningDate: role === 'security' || role === 'maintenance' ? joiningDate || undefined : undefined,
    });
    setCreating(false);
    setModalVisible(false);
    resetForm();
    loadUsers();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Users</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.lg }}>
        {roleFilters.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.filterChipText, filter === f.value && styles.filterChipTextActive]}>
              {f.label} {f.value !== 'all' ? `(${users.filter((u) => u.role === f.value).length})` : `(${users.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm, paddingTop: spacing.md }}>
          {filtered.map((u) => (
            <View key={u.id} style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{u.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{u.name}</Text>
                <Text style={styles.userEmail}>{u.email}</Text>
                {u.role === 'resident' && u.flat ? (
                  <Text style={styles.userMeta}>Flat {u.flat} · {u.ownershipType}</Text>
                ) : null}
                {(u.role === 'security' || u.role === 'maintenance') && u.employeeId ? (
                  <Text style={styles.userMeta}>ID: {u.employeeId}</Text>
                ) : null}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <View style={[styles.roleBadge, { backgroundColor: roleBadgeColor[u.role].bg }]}>
                  <Text style={[styles.roleBadgeText, { color: roleBadgeColor[u.role].color }]}>
                    {u.role[0].toUpperCase() + u.role.slice(1)}
                  </Text>
                </View>
                <View style={[styles.statusBadge, u.status === 'inactive' && styles.statusBadgeInactive]}>
                  <Text style={[styles.statusBadgeText, u.status === 'inactive' && styles.statusBadgeTextInactive]}>
                    {u.status === 'active' ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add User Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New User</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Role selector first — বাকি form টা এর ওপর নির্ভর করবে */}
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleGrid}>
                {roleOptions.map((r) => (
                  <TouchableOpacity key={r} style={[styles.roleOption, role === r && styles.roleOptionActive]} onPress={() => setRole(r)}>
                    <Text style={[styles.roleOptionText, role === r && styles.roleOptionTextActive]}>
                      {r[0].toUpperCase() + r.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="Enter full name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />

              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="Enter email address" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput style={styles.input} placeholder="017XXXXXXXX" placeholderTextColor={colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

              {/* ===== Resident-only fields ===== */}
              {role === 'resident' && (
                <>
                  <View style={styles.sectionDivider}>
                    <Text style={styles.sectionDividerText}>Resident Details</Text>
                  </View>

                  <Text style={styles.label}>Flat / Unit Number</Text>
                  <TextInput style={styles.input} placeholder="e.g. B-803" placeholderTextColor={colors.textMuted} value={flat} onChangeText={setFlat} />

                  <Text style={styles.label}>Ownership Type</Text>
                  <View style={styles.roleGrid}>
                    {(['Owner', 'Tenant'] as const).map((t) => (
                      <TouchableOpacity key={t} style={[styles.roleOption, ownershipType === t && styles.roleOptionActive]} onPress={() => setOwnershipType(t)}>
                        <Text style={[styles.roleOptionText, ownershipType === t && styles.roleOptionTextActive]}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>Move-in Date</Text>
                  <TextInput style={styles.input} placeholder="DD/MM/YYYY" placeholderTextColor={colors.textMuted} value={moveInDate} onChangeText={setMoveInDate} />

                  <Text style={styles.label}>Emergency Contact Name</Text>
                  <TextInput style={styles.input} placeholder="Contact person's name" placeholderTextColor={colors.textMuted} value={emergencyName} onChangeText={setEmergencyName} />

                  <Text style={styles.label}>Emergency Contact Phone</Text>
                  <TextInput style={styles.input} placeholder="017XXXXXXXX" placeholderTextColor={colors.textMuted} value={emergencyPhone} onChangeText={setEmergencyPhone} keyboardType="phone-pad" />

                  <Text style={styles.label}>Relation</Text>
                  <TextInput style={styles.input} placeholder="e.g. Spouse, Parent, Sibling" placeholderTextColor={colors.textMuted} value={emergencyRelation} onChangeText={setEmergencyRelation} />
                </>
              )}

              {/* ===== Security/Maintenance-only fields ===== */}
              {(role === 'security' || role === 'maintenance') && (
                <>
                  <View style={styles.sectionDivider}>
                    <Text style={styles.sectionDividerText}>Staff Details</Text>
                  </View>

                  <Text style={styles.label}>Employee ID</Text>
                  <TextInput style={styles.input} placeholder="e.g. EMP-0142" placeholderTextColor={colors.textMuted} value={employeeId} onChangeText={setEmployeeId} />

                  <Text style={styles.label}>Joining Date</Text>
                  <TextInput style={styles.input} placeholder="DD/MM/YYYY" placeholderTextColor={colors.textMuted} value={joiningDate} onChangeText={setJoiningDate} />
                </>
              )}

              <View style={styles.noteBox}>
                <Ionicons name="mail-outline" size={16} color={colors.info} />
                <Text style={styles.noteText}>Login credentials will be sent to this email automatically.</Text>
              </View>

              <TouchableOpacity
                style={[styles.createButton, (!name.trim() || !email.trim() || creating) && styles.createButtonDisabled]}
                onPress={handleCreate}
                disabled={!name.trim() || !email.trim() || creating}
              >
                {creating ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Create User</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  addButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },

  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md, paddingHorizontal: spacing.sm, borderWidth: 1, borderColor: colors.border, height: 44, marginBottom: spacing.sm },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },

  filterRow: { flexGrow: 0, marginBottom: spacing.sm },
  filterChip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: colors.card },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  filterChipTextActive: { color: '#fff' },

  userRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  userName: { fontSize: 14, fontWeight: '700', color: colors.text },
  userEmail: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  userMeta: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  roleBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  roleBadgeText: { fontSize: 10.5, fontWeight: '700' },
  statusBadge: { backgroundColor: '#EAF7EE', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusBadgeText: { fontSize: 10.5, fontWeight: '700', color: colors.success },
  statusBadgeInactive: { backgroundColor: '#FDECEC' },
  statusBadgeTextInactive: { color: colors.danger },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.background, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg, maxHeight: '88%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: spacing.sm },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text },

  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleOption: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: colors.card },
  roleOptionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleOptionText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  roleOptionTextActive: { color: '#fff' },

  sectionDivider: { marginTop: spacing.lg, marginBottom: spacing.xs, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  sectionDividerText: { fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },

  noteBox: { flexDirection: 'row', gap: 8, backgroundColor: '#EAF2FF', borderRadius: radius.md, padding: spacing.sm, marginTop: spacing.md, alignItems: 'flex-start' },
  noteText: { flex: 1, fontSize: 12, color: colors.info },

  createButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.lg },
  createButtonDisabled: { opacity: 0.5 },
  createButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});