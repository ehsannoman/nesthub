import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getMyVisitors } from '../../api/visitorService';

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  expected: { bg: '#FEF3E2', color: colors.warning, label: 'Expected' },
  entered: { bg: '#EAF7EE', color: colors.success, label: 'Inside' },
  exited: { bg: '#F0F1F1', color: colors.textMuted, label: 'Left' },
  rejected: { bg: '#FDECEC', color: colors.danger, label: 'Rejected' },
};

export default function MyVisitorsScreen() {
  const navigation = useNavigation<any>();
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getMyVisitors()
        .then((data: any[]) => setVisitors(data))
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
        <Text style={styles.headerTitle}>My Visitors</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('InviteVisitor')}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 160, gap: spacing.sm }}>
          {visitors.length === 0 && <Text style={styles.emptyText}>No visitors yet. Tap + to invite one.</Text>}
          {visitors.map((v) => {
            const cfg = statusConfig[v.status] || statusConfig.expected;
            return (
              <View key={v._id} style={styles.card}>
                <View style={styles.iconWrap}>
                  <Ionicons name="person-outline" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{v.name}</Text>
                  <Text style={styles.sub}>{v.visitDate} · {v.visitTime}</Text>
                  {v.vehicle ? <Text style={styles.sub}>Vehicle: {v.vehicle}</Text> : null}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
            );
          })}
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
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  statusBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
});