import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getMyComplaints } from '../../api/complaintService';

const priorityColor: Record<string, string> = { Low: colors.success, Medium: colors.warning, High: colors.danger };

export default function MyComplaintsScreen() {
  const navigation = useNavigation<any>();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getMyComplaints()
        .then((data: any[]) => setComplaints(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Complaints</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ReportComplaint')}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 160, gap: spacing.sm }}>
          {complaints.length === 0 && <Text style={styles.emptyText}>No complaints yet. Tap + to report one.</Text>}
          {complaints.map((c) => (
            <TouchableOpacity
              key={c._id}
              style={styles.card}
              onPress={() => navigation.navigate('ComplaintDetail', { complaint: c, fromList: true })}
            >
              <View style={styles.topRow}>
                <Text style={styles.category}>{c.category}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor[c.priority]}20` }]}>
                  <Text style={[styles.priorityText, { color: priorityColor[c.priority] }]}>{c.priority}</Text>
                </View>
              </View>
              <Text style={styles.description} numberOfLines={2}>{c.description}</Text>
              <View style={styles.bottomRow}>
                <Text style={styles.date}>{new Date(c.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.status}>{c.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  addButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  priorityBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 2 },
  priorityText: { fontSize: 11, fontWeight: '700' },
  description: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 6 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  date: { fontSize: 12, color: colors.textMuted },
  status: { fontSize: 12, color: colors.primary, fontWeight: '700' },
});