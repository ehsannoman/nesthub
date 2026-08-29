import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { ManagerComplaint, ComplaintStatus } from '../../types';
import { getComplaintById, updateComplaintStatus as updateStatusReal, assignComplaint as assignComplaintReal } from '../../api/complaintService';

const statusOptions: ComplaintStatus[] = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

export default function ComplaintManageScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { complaintId } = route.params;

  const [complaint, setComplaint] = useState<ManagerComplaint | null>(null);
  const [staffName, setStaffName] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = () => {
    getComplaintById(complaintId).then((data: any) => {
      const normalized = { ...data, id: data._id, residentName: data.residentId?.name || 'Unknown' };
      setComplaint(normalized);
      setStaffName(normalized.assignedTo || '');
    });
  };

  useEffect(() => { load(); }, [complaintId]);

  const handleStatusChange = async (status: ComplaintStatus) => {
    if (!complaint || updating) return;
    setUpdating(true);
    await updateStatusReal(complaint.id, status);
    setUpdating(false);
    load();
  };

  const handleAssign = async () => {
    if (!complaint || !staffName.trim() || updating) return;
    setUpdating(true);
    await assignComplaintReal(complaint.id, staffName);
    setUpdating(false);
    load();
  };

  if (!complaint) {
    return <View style={styles.loadingContainer}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{complaint.id}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.category}>{complaint.category}</Text>
        <Text style={styles.description}>{complaint.description}</Text>
        <View style={styles.row}><Text style={styles.label}>Reported by</Text><Text style={styles.value}>{complaint.residentName}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Flat</Text><Text style={styles.value}>{complaint.flat}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Priority</Text><Text style={styles.value}>{complaint.priority}</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Update Status</Text>
      <View style={styles.statusGrid}>
        {statusOptions.map((s) => (
          <TouchableOpacity key={s} style={[styles.statusChip, complaint.status === s && styles.statusChipActive]} onPress={() => handleStatusChange(s)}>
            <Text style={[styles.statusChipText, complaint.status === s && styles.statusChipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Assign to Staff</Text>
      <View style={styles.assignRow}>
        <TextInput style={styles.input} placeholder="Staff name" placeholderTextColor={colors.textMuted} value={staffName} onChangeText={setStaffName} />
        <TouchableOpacity style={styles.assignButton} onPress={handleAssign} disabled={updating}>
          {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.assignButtonText}>Assign</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  card: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  category: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  description: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 4, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { fontSize: 13, color: colors.textMuted },
  value: { fontSize: 13, fontWeight: '600', color: colors.text },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.sm },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: spacing.lg },
  statusChip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: colors.card },
  statusChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  statusChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  statusChipTextActive: { color: '#fff' },
  assignRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  input: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 14, backgroundColor: colors.card, color: colors.text },
  assignButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  assignButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});