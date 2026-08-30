import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../constants/theme';
import {
  getSecurityOverview, getExpectedVisitors, getCurrentlyInside, getRecentActivity,
  approveExpectedVisitor, rejectExpectedVisitor, checkOutInsideVisitor,
} from '../../api/securityService';
import { SecurityOverview, ExpectedVisitor, InsideVisitor, SecurityActivity } from '../../types';
import { getTodayVisitors as getRealTodayVisitors, getInsideVisitors as getRealInsideVisitors } from '../../api/visitorService';

const quickActions = [
  { label: 'Register\nVisitor', icon: 'person-add-outline' as const, route: 'AddVisitor' },
  { label: 'Check\nIn', icon: 'qr-code-outline' as const, route: 'QRScanner' },
  { label: 'Check\nOut', icon: 'log-out-outline' as const, route: 'Visitors' },
  { label: 'Vehicle\nEntry', icon: 'car-outline' as const, route: 'VehicleCheck' },
  { label: 'Delivery\nEntry', icon: 'cube-outline' as const, route: 'AddPackage' },
  { label: 'Emergency\nAlert', icon: 'warning-outline' as const, route: 'EmergencyAlert' },
  { label: 'Visitor\nHistory', icon: 'time-outline' as const, route: 'Visitors' },
  { label: 'Report\nIncident', icon: 'document-text-outline' as const, route: 'ReportIncident' },
];

const activityIcon: Record<SecurityActivity['type'], { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  visitor_in: { icon: 'person-outline', color: colors.success },
  visitor_out: { icon: 'exit-outline', color: colors.textMuted },
  vehicle_in: { icon: 'car-outline', color: colors.info },
  delivery_in: { icon: 'cube-outline', color: colors.purple },
};

export default function SecurityDashboard() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [overview, setOverview] = useState<SecurityOverview | null>(null);
  const [expected, setExpected] = useState<ExpectedVisitor[]>([]);
  const [inside, setInside] = useState<InsideVisitor[]>([]);
  const [activity, setActivity] = useState<SecurityActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = () => {
    Promise.all([
      getSecurityOverview(),
      getExpectedVisitors(),
      getCurrentlyInside(),
      getRecentActivity(),
      getRealTodayVisitors().catch(() => []),
      getRealInsideVisitors().catch(() => []),
    ]).then(([o, e, i, a, realToday, realInside]: any) => {
      setOverview({
        ...o,
        visitorsToday: realToday.length,
        currentlyInside: realInside.length,
      });
      setExpected(e);
      setInside(i);
      setActivity(a);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleApprove = async (id: string) => {
    await approveExpectedVisitor(id);
    loadAll();
  };
  const handleReject = async (id: string) => {
    await rejectExpectedVisitor(id);
    loadAll();
  };
  const handleCheckOut = async (id: string) => {
    await checkOutInsideVisitor(id);
    loadAll();
  };

  if (loading || !overview) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.name}>{user?.name || 'Rahim'} 👋</Text>
          <Text style={styles.subtitle}>Green Valley Residency</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="person-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View>
            <Text style={styles.summaryLabel}>Community Security</Text>
            <Text style={styles.summaryTitle}>Today's Activity</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{overview.visitorsToday}</Text>
            <Text style={styles.statLabel}>Visitors</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{overview.currentlyInside}</Text>
            <Text style={styles.statLabel}>Inside</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{overview.vehiclesInside}</Text>
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{overview.deliveries}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.quickActionCard}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.quickActionIconWrap}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.quickActionLabel} numberOfLines={2}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Expected Visitors */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Expected Visitors</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Visitors')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      {expected.length === 0 ? (
        <Text style={styles.emptyText}>No expected visitors right now</Text>
      ) : (
        <View style={styles.cardList}>
          {expected.map((v) => (
            <View key={v.id} style={styles.expectedCard}>
              <View style={styles.expectedTopRow}>
                <Text style={styles.expectedName}>{v.name}</Text>
                <Text style={styles.expectedTime}>{v.expectedTime}</Text>
              </View>
              <Text style={styles.expectedSub}>Visiting: Flat {v.flat} · {v.purpose}</Text>
              <View style={styles.expectedActions}>
                <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(v.id)}>
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(v.id)}>
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Currently Inside */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Currently Inside</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Visitors')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      {inside.length === 0 ? (
        <Text style={styles.emptyText}>No visitors inside right now</Text>
      ) : (
        <View style={styles.cardList}>
          {inside.map((v) => (
            <View key={v.id} style={styles.insideRow}>
              <View style={styles.insideIconWrap}>
                <Ionicons name="person-outline" size={18} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.insideName}>{v.name}</Text>
                <Text style={styles.insideSub}>Flat {v.flat} · Entry {v.entryTime}</Text>
              </View>
              <TouchableOpacity style={styles.checkOutButton} onPress={() => handleCheckOut(v.id)}>
                <Text style={styles.checkOutButtonText}>Check Out</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Recent Activity */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Security Activity</Text>
      </View>
      <View style={styles.cardList}>
        {activity.map((a) => {
          const cfg = activityIcon[a.type];
          return (
            <View key={a.id} style={styles.activityRow}>
              <View style={[styles.activityIconWrap, { backgroundColor: `${cfg.color}20` }]}>
                <Ionicons name={cfg.icon} size={16} color={cfg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{a.title}</Text>
                <Text style={styles.activitySub}>{a.subtitle}</Text>
              </View>
              <Text style={styles.activityTime}>{a.time}</Text>
            </View>
          );
        })}
      </View>

      {/* Report Incident — prominent */}
      <TouchableOpacity style={styles.incidentCard} onPress={() => navigation.navigate('ReportIncident')}>
        <Ionicons name="warning" size={22} color="#fff" />
        <Text style={styles.incidentText}>Report an Incident</Text>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: spacing.lg, paddingTop: 60 },
  greeting: { fontSize: 15, color: colors.textMuted },
  name: { fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 2 },
  subtitle: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  headerIcons: { flexDirection: 'row', gap: spacing.sm },
  iconCircle: {
    width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  dot: { position: 'absolute', top: 8, right: 10, width: 7, height: 7, borderRadius: radius.full, backgroundColor: colors.primary },

  summaryCard: { backgroundColor: colors.primary, marginHorizontal: spacing.lg, borderRadius: radius.lg, padding: spacing.lg },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: '#CFE8E6', fontSize: 12 },
  summaryTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 2 },
  summaryIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: spacing.md },
  statsRow: { flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '700' },
  statLabel: { color: '#CFE8E6', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.2)' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  viewAll: { fontSize: 13, fontWeight: '600', color: colors.primary },
  emptyText: { fontSize: 13, color: colors.textMuted, marginHorizontal: spacing.lg },

  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.sm },
  quickActionCard: { width: '22.5%', backgroundColor: colors.card, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  quickActionIconWrap: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickActionLabel: { fontSize: 10, lineHeight: 13, color: colors.text, textAlign: 'center', fontWeight: '600' },

  cardList: { paddingHorizontal: spacing.lg, gap: spacing.sm },

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
  insideIconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: '#EAF7EE', alignItems: 'center', justifyContent: 'center' },
  insideName: { fontSize: 14, fontWeight: '600', color: colors.text },
  insideSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  checkOutButton: { backgroundColor: colors.primaryLight, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8 },
  checkOutButtonText: { color: colors.primary, fontSize: 12, fontWeight: '700' },

  activityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  activityIconWrap: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  activityTitle: { fontSize: 13, fontWeight: '600', color: colors.text },
  activitySub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  activityTime: { fontSize: 11, color: colors.textMuted },

  incidentCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.danger, marginHorizontal: spacing.lg, borderRadius: radius.md,
    padding: spacing.md, marginTop: spacing.lg,
  },
  incidentText: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '700' },
});