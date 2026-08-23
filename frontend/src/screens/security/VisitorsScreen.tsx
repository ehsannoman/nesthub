import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getExpectedVisitors, getCurrentlyInside, getTodayVisitors, approveExpectedVisitor, rejectExpectedVisitor, checkOutInsideVisitor } from '../../api/securityService';
import { ExpectedVisitor, InsideVisitor, TodayVisitor } from '../../types';

type Tab = 'expected' | 'inside' | 'history';

export default function VisitorsScreen() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<Tab>('expected');
  const [expected, setExpected] = useState<ExpectedVisitor[]>([]);
  const [inside, setInside] = useState<InsideVisitor[]>([]);
  const [history, setHistory] = useState<TodayVisitor[]>([]);
  const [search, setSearch] = useState('');

  const loadAll = () => {
    getExpectedVisitors().then(setExpected);
    getCurrentlyInside().then(setInside);
    getTodayVisitors().then(setHistory);
  };

  useEffect(() => { loadAll(); }, []);

  const filteredHistory = history.filter(
    (v) => v.name.toLowerCase().includes(search.toLowerCase()) || v.flat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitors</Text>
      </View>

      <View style={styles.tabRow}>
        {(['expected', 'inside', 'history'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={[styles.tabChip, tab === t && styles.tabChipActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabChipText, tab === t && styles.tabChipTextActive]}>
              {t === 'expected' ? 'Expected' : t === 'inside' ? 'Inside' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {tab === 'expected' && (
          <View style={styles.list}>
            {expected.length === 0 && <Text style={styles.emptyText}>No expected visitors</Text>}
            {expected.map((v) => (
              <View key={v.id} style={styles.expectedCard}>
                <View style={styles.expectedTopRow}>
                  <Text style={styles.expectedName}>{v.name}</Text>
                  <Text style={styles.expectedTime}>{v.expectedTime}</Text>
                </View>
                <Text style={styles.expectedSub}>Flat {v.flat} · {v.purpose}</Text>
                <View style={styles.expectedActions}>
                  <TouchableOpacity style={styles.approveButton} onPress={async () => { await approveExpectedVisitor(v.id); loadAll(); }}>
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={async () => { await rejectExpectedVisitor(v.id); loadAll(); }}>
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === 'inside' && (
          <View style={styles.list}>
            {inside.length === 0 && <Text style={styles.emptyText}>No one inside right now</Text>}
            {inside.map((v) => (
              <View key={v.id} style={styles.insideRow}>
                <View style={styles.insideIconWrap}>
                  <Ionicons name="person-outline" size={18} color={colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.insideName}>{v.name}</Text>
                  <Text style={styles.insideSub}>Flat {v.flat} · Entry {v.entryTime}</Text>
                </View>
                <TouchableOpacity style={styles.checkOutButton} onPress={async () => { await checkOutInsideVisitor(v.id); loadAll(); }}>
                  <Text style={styles.checkOutButtonText}>Check Out</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {tab === 'history' && (
          <View>
            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or flat"
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <View style={styles.list}>
              {filteredHistory.map((v) => (
                <View key={v.id} style={styles.historyRow}>
                  <View style={styles.insideIconWrap}>
                    <Ionicons name="person-outline" size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.insideName}>{v.name}</Text>
                    <Text style={styles.insideSub}>Flat {v.flat} · {v.time}</Text>
                  </View>
                  <Text style={styles.historyStatus}>{v.status}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },

  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  tabChip: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingVertical: 9, alignItems: 'center', backgroundColor: colors.card },
  tabChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  tabChipTextActive: { color: '#fff' },

  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  emptyText: { fontSize: 13, color: colors.textMuted },

  expectedCard: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  expectedTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  expectedName: { fontSize: 14, fontWeight: '700', color: colors.text },
  expectedTime: { fontSize: 12, color: colors.textMuted },
  expectedSub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  expectedActions: { flexDirection: 'row', gap: 8, marginTop: spacing.sm },
  approveButton: { flex: 1, backgroundColor: colors.success, borderRadius: radius.sm, paddingVertical: 9, alignItems: 'center' },
  approveButtonText: { color: '#fff', fontSize: 12.5, fontWeight: '700' },
  rejectButton: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.sm, paddingVertical: 9, alignItems: 'center' },
  rejectButtonText: { color: colors.danger, fontSize: 12.5, fontWeight: '700' },

  insideRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  insideIconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  insideName: { fontSize: 14, fontWeight: '600', color: colors.text },
  insideSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  checkOutButton: { backgroundColor: colors.primaryLight, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8 },
  checkOutButtonText: { color: colors.primary, fontSize: 12, fontWeight: '700' },

  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md, paddingHorizontal: spacing.sm, borderWidth: 1, borderColor: colors.border, height: 44, marginBottom: spacing.sm },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  historyStatus: { fontSize: 11, color: colors.textMuted, fontWeight: '600', textTransform: 'capitalize' },
});