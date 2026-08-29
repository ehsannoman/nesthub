import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { ManagerComplaint, ComplaintStatus } from '../../types';
import { getMyComplaints } from '../../api/complaintServiceReal';

const filters: (ComplaintStatus | 'All')[] = ['All', 'Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const priorityColor: Record<string, string> = { Low: colors.success, Medium: colors.warning, High: colors.danger };

export default function MaintenanceScreen() {
  const navigation = useNavigation<any>();
  const [complaints, setComplaints] = useState<ManagerComplaint[]>([]);
  const [filter, setFilter] = useState<ComplaintStatus | 'All'>('All');

  useEffect(() => {
    getMyComplaints().then((data) => {
      const normalized = data.map((c: any) => ({
        ...c,
        id: c._id,
        residentName: c.residentId?.name || 'Unknown',
      }));
      setComplaints(normalized);
    });
  }, []);

  const filtered = filter === 'All' ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Maintenance</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: spacing.sm }} contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.lg }}>
        {filters.map((f) => (
          <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
        {filtered.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.card}
            onPress={() => navigation.navigate('Dashboard', { screen: 'ComplaintManage', params: { complaintId: c.id } })}
          >
            <View style={styles.cardTopRow}>
              <Text style={styles.cardId}>{c.id} · {c.category}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor[c.priority]}20` }]}>
                <Text style={[styles.priorityText, { color: priorityColor[c.priority] }]}>{c.priority}</Text>
              </View>
            </View>
            <Text style={styles.cardDesc} numberOfLines={2}>{c.description}</Text>
            <View style={styles.cardBottomRow}>
              <Text style={styles.cardSub}>{c.residentName} · Flat {c.flat}</Text>
              <Text style={styles.cardStatus}>{c.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {filtered.length === 0 && <Text style={styles.emptyText}>No complaints in this status</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  filterChip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: colors.card },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  filterChipTextActive: { color: '#fff' },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardId: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  priorityBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 2 },
  priorityText: { fontSize: 11, fontWeight: '700' },
  cardDesc: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 6 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  cardSub: { fontSize: 12, color: colors.textMuted },
  cardStatus: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});