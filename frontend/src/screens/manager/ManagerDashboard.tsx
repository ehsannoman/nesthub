import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getUsers } from '../../api/userService';
import { getTodayVisitors } from '../../api/visitorService';

/* =========================================================
   DATA
========================================================= */

const quickActions = [
  { label: 'Add Notice', icon: 'megaphone-outline' as const },
  { label: 'Add User', icon: 'person-add-outline' as const },
  { label: 'Create Bill', icon: 'receipt-outline' as const },
  { label: 'Visitor Log', icon: 'people-outline' as const },
  { label: 'Add Complaint', icon: 'document-text-outline' as const },
  { label: 'Maintenance Request', icon: 'construct-outline' as const },
  { label: 'Facility Booking', icon: 'calendar-outline' as const },
  { label: 'Generate Report', icon: 'bar-chart-outline' as const },
];

const recentActivities = [
  { title: 'New payment received', body: 'Flat B-803 • Maintenance', time: '10:42 AM', icon: 'person-outline' as const, iconBg: '#E6F5F4', iconColor: colors.primary },
  { title: 'Complaint #C-32 updated', body: 'Water leakage in Block A', time: '09:15 AM', icon: 'shield-checkmark-outline' as const, iconBg: '#EAF2FF', iconColor: colors.info },
  { title: 'Visitor check-in', body: 'Rahat Ahmed • Flat B-803', time: 'Yesterday', icon: 'people-outline' as const, iconBg: '#E6F5F4', iconColor: colors.primary },
  { title: 'Notice published', body: 'Lift maintenance on May 22', time: 'Yesterday', icon: 'document-text-outline' as const, iconBg: '#EAF2FF', iconColor: colors.info },
];

const reminders = [
  { date: '22', month: 'MAY', title: 'Lift Maintenance', subtitle: 'Block A • 10:00 AM - 2:00 PM', tag: 'Maintenance', tagBg: '#E6F5F4', tagColor: colors.primary },
  { date: '25', month: 'MAY', title: 'Monthly Maintenance Due', subtitle: 'Due date for May 2024', tag: 'Payment', tagBg: '#F2EAFF', tagColor: '#7C3AED' },
  { date: '28', month: 'MAY', title: 'Fire Safety Inspection', subtitle: 'All Blocks • 11:00 AM', tag: 'Inspection', tagBg: '#EAF2FF', tagColor: colors.info },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function ManagerDashboard() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [totalResidents, setTotalResidents] = useState(0);
  const [securityStaff, setSecurityStaff] = useState(0);
  const [maintenanceStaff, setMaintenanceStaff] = useState(0);
  const [activeVisitors, setActiveVisitors] = useState(0);

  useEffect(() => {
    getUsers().then((users: any[]) => {
      setTotalResidents(users.filter((u) => u.role === 'resident').length);
      setSecurityStaff(users.filter((u) => u.role === 'security').length);
      setMaintenanceStaff(users.filter((u) => u.role === 'maintenance').length);
    }).catch(() => {});

    getTodayVisitors().then((visitors: any[]) => {
      setActiveVisitors(visitors.filter((v) => v.status === 'entered').length);
    }).catch(() => {});
  }, []);

  const overviewStats = [
    { label: 'Total Residents', value: String(totalResidents), change: '' },
    { label: 'Security Staff', value: String(securityStaff), change: '' },
    { label: 'Maintenance Staff', value: String(maintenanceStaff), change: '' },
    { label: 'Active Visitors', value: String(activeVisitors), change: '' },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.name}>{user?.name || 'Manager'} 👋</Text>
            <View style={styles.locationRow}>
              <Ionicons name="business-outline" size={17} color={colors.primary} />
              <Text style={styles.location}>Green Valley Residency</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={23} color={colors.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
              <Ionicons name="person-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* =================================================
            COMMUNITY SUMMARY
        ================================================= */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summarySmallTitle}>Community Overview</Text>
              <Text style={styles.summaryTitle}>Today's Activity</Text>
            </View>
            <View style={styles.summaryIcon}>
              <Ionicons name="analytics-outline" size={23} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.statsRow}>
            {overviewStats.map((item, index) => (
              <React.Fragment key={item.label}>
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons
                      name={
                        index === 0 ? 'people-outline'
                        : index === 1 ? 'shield-checkmark-outline'
                        : index === 2 ? 'construct-outline'
                        : 'person-outline'
                      }
                      size={17}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.statLabel} numberOfLines={2}>{item.label}</Text>
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statChange}>{item.change}</Text>
                </View>
                {index !== overviewStats.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* =================================================
            USER MANAGEMENT
        ================================================= */}

        <TouchableOpacity
          style={styles.userMgmtCard}
          onPress={() => navigation.navigate('UserManagement')}
          activeOpacity={0.85}
        >
          <View style={styles.userMgmtIconWrap}>
            <Ionicons name="people-outline" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userMgmtTitle}>User Management</Text>
            <Text style={styles.userMgmtSubtitle}>Residents · Security · Staff</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* =================================================
            AI ASSISTANT
        ================================================= */}

        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => navigation.navigate('AIAssistant')}
          activeOpacity={0.85}
        >
          <View style={styles.aiIconWrap}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>Ask NestHub AI</Text>
            <Text style={styles.aiSubtitle}>"How is my community doing today?"</Text>
          </View>
          <View style={styles.aiAskButton}>
            <Text style={styles.aiAskButtonText}>Ask</Text>
          </View>
        </TouchableOpacity>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() => {
                if (item.label === 'Add User') navigation.navigate('UserManagement');
                else if (item.label === 'Add Notice') navigation.navigate('CreateNotice');
                else if (item.label === 'Create Bill') navigation.navigate('CreateBill');
                else if (item.label === 'Visitor Log') navigation.navigate('VisitorLog');
                else if (item.label === 'Add Complaint' || item.label === 'Maintenance Request') navigation.navigate('Maintenance');
                else if (item.label === 'Facility Booking') navigation.navigate('FacilityBookings');
                else if (item.label === 'Generate Report') navigation.navigate('AIAssistant');
                else if (item.label === 'Facility Booking') navigation.navigate('FacilityBookings');
              }}
            >
              <View style={styles.quickIcon}>
                <Ionicons name={item.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickLabel} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.85}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* =================================================
            FINANCIAL OVERVIEW
        ================================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          <TouchableOpacity style={styles.monthSelector}>
            <Text style={styles.monthText}>This Month</Text>
            <Ionicons name="chevron-down" size={15} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.financialCard}>
          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Income</Text>
            <Text style={styles.financeValue}>৳125,500</Text>
            <Text style={styles.financePositive}>↑ 20%</Text>
          </View>

          <View style={styles.financeDivider} />

          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Expenses</Text>
            <Text style={styles.financeValue}>৳68,300</Text>
            <Text style={styles.financeNegative}>↓ 8%</Text>
          </View>

          <View style={styles.financeDivider} />

          <View style={styles.financeItem}>
            <Text style={styles.financeLabel}>Outstanding</Text>
            <Text style={styles.financeValue}>৳57,200</Text>
            <Text style={styles.financePositive}>↑ 5%</Text>
          </View>
        </View>

        {/* =================================================
            RECENT ACTIVITIES
        ================================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {recentActivities.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.activityRow, index !== recentActivities.length - 1 && styles.activityBorder]}
              activeOpacity={0.8}
            >
              <View style={[styles.activityIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={21} color={item.iconColor} />
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.activityBody} numberOfLines={1}>{item.body}</Text>
              </View>

              <Text style={styles.activityTime}>{item.time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* =================================================
            UPCOMING REMINDERS
        ================================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reminderCard}>
          {reminders.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.reminderRow, index !== reminders.length - 1 && styles.reminderBorder]}
              activeOpacity={0.8}
            >
              <View style={styles.dateBox}>
                <Text style={styles.dateNumber}>{item.date}</Text>
                <Text style={styles.dateMonth}>{item.month}</Text>
              </View>

              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderSubtitle}>{item.subtitle}</Text>
              </View>

              <View style={[styles.reminderTag, { backgroundColor: item.tagBg }]}>
                <Text style={[styles.reminderTagText, { color: item.tagColor }]}>{item.tag}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 14, paddingTop: 48, paddingBottom: 30 },

  /* ================= HEADER ================= */
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 },
  headerText: { flex: 1, paddingRight: 10 },
  greeting: { fontSize: 16, lineHeight: 21, fontWeight: '600', color: colors.text },
  name: { marginTop: 2, fontSize: 28, lineHeight: 34, fontWeight: '700', color: colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7 },
  location: { marginLeft: 5, fontSize: 14, color: colors.textMuted },
  headerActions: { flexDirection: 'row', gap: 8, paddingTop: 2 },
  headerButton: {
    width: 47, height: 47, borderRadius: 24, backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E8EEEE',
  },
  notificationBadge: {
    position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  notificationBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },

  /* ================= SUMMARY ================= */
  summaryCard: { backgroundColor: colors.primary, borderRadius: 20, padding: 18, minHeight: 190 },
  summaryTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summarySmallTitle: { color: '#D8F0F0', fontSize: 13, fontWeight: '500' },
  summaryTitle: { marginTop: 3, color: '#FFFFFF', fontSize: 21, lineHeight: 27, fontWeight: '700' },
  summaryIcon: {
    width: 45, height: 45, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.22)', marginVertical: 15 },
  statsRow: { flexDirection: 'row', alignItems: 'stretch' },
  statItem: { flex: 1, alignItems: 'center', minWidth: 0 },
  statIcon: {
    width: 34, height: 34, borderRadius: 12, backgroundColor: '#E6F5F4',
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  statLabel: {
    width: '100%', minHeight: 28, textAlign: 'center', color: '#E0F3F3',
    fontSize: 10.5, lineHeight: 13, fontWeight: '500',
  },
  statValue: { marginTop: 4, color: '#FFFFFF', fontSize: 22, lineHeight: 26, fontWeight: '700' },
  statChange: { marginTop: 1, color: '#A9E7D5', fontSize: 10, fontWeight: '600' },
  statDivider: { width: 1, height: 78, backgroundColor: 'rgba(255,255,255,0.20)', marginHorizontal: 3 },

  /* ================= USER MANAGEMENT ================= */
  userMgmtCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 17, borderWidth: 1, borderColor: '#E8EEEE',
    padding: 14, marginTop: 20,
  },
  userMgmtIconWrap: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  userMgmtTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  userMgmtSubtitle: { fontSize: 11.5, color: colors.textMuted, marginTop: 2 },

  /* ================= AI ASSISTANT ================= */
  aiCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.primary, borderRadius: 17,
    padding: 14, marginTop: 12,
  },
  aiIconWrap: {
    width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  aiTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  aiSubtitle: { fontSize: 11.5, color: '#CFE8E6', marginTop: 2 },
  aiAskButton: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  aiAskButtonText: { fontSize: 12.5, fontWeight: '700', color: colors.primary },

  /* ================= SECTION ================= */
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 24, marginBottom: 11,
  },
  sectionTitle: { fontSize: 19, lineHeight: 24, fontWeight: '700', color: colors.text },
  viewAll: { fontSize: 13, fontWeight: '600', color: colors.primary },

  /* ================= QUICK ACTIONS ================= */
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 9 },
  quickActionCard: {
    width: '23.7%', height: 116, backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: '#E8EEEE', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  quickIcon: {
    width: 48, height: 48, borderRadius: 15, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  quickLabel: {
    width: '100%', minHeight: 32, textAlign: 'center', color: colors.text,
    fontSize: 10.5, lineHeight: 14, fontWeight: '600',
  },

  /* ================= FINANCIAL ================= */
  monthSelector: {
    flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, height: 32,
    borderRadius: 9, borderWidth: 1, borderColor: '#E4E9E9', backgroundColor: colors.card,
  },
  monthText: { fontSize: 11, color: colors.textMuted },
  financialCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 17,
    borderWidth: 1, borderColor: '#E8EEEE', paddingVertical: 17, paddingHorizontal: 10,
  },
  financeItem: { flex: 1, paddingHorizontal: 5 },
  financeLabel: { color: colors.textMuted, fontSize: 11, marginBottom: 5 },
  financeValue: { color: colors.text, fontSize: 15, fontWeight: '700' },
  financePositive: { marginTop: 5, color: colors.success, fontSize: 10, fontWeight: '600' },
  financeNegative: { marginTop: 5, color: colors.danger, fontSize: 10, fontWeight: '600' },
  financeDivider: { width: 1, height: 58, backgroundColor: '#E7ECEC' },

  /* ================= ACTIVITIES ================= */
  activityCard: { backgroundColor: colors.card, borderRadius: 17, borderWidth: 1, borderColor: '#E8EEEE', overflow: 'hidden' },
  activityRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 9 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: '#EDF0F0' },
  activityIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  activityContent: { flex: 1, minWidth: 0 },
  activityTitle: { color: colors.text, fontSize: 12, fontWeight: '700' },
  activityBody: { marginTop: 3, color: colors.textMuted, fontSize: 10.5 },
  activityTime: { marginLeft: 7, color: colors.textMuted, fontSize: 9.5 },

  /* ================= REMINDERS ================= */
  reminderCard: { backgroundColor: colors.card, borderRadius: 17, borderWidth: 1, borderColor: '#E8EEEE', overflow: 'hidden' },
  reminderRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8 },
  reminderBorder: { borderBottomWidth: 1, borderBottomColor: '#EDF0F0' },
  dateBox: {
    width: 45, height: 51, borderRadius: 12, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  dateNumber: { color: colors.text, fontSize: 17, lineHeight: 19, fontWeight: '700' },
  dateMonth: { marginTop: 1, color: colors.primary, fontSize: 8, fontWeight: '700' },
  reminderContent: { flex: 1, minWidth: 0 },
  reminderTitle: { color: colors.text, fontSize: 12, fontWeight: '700' },
  reminderSubtitle: { marginTop: 3, color: colors.textMuted, fontSize: 10 },
  reminderTag: { borderRadius: 7, paddingHorizontal: 7, paddingVertical: 5, marginLeft: 5 },
  reminderTagText: { fontSize: 8, fontWeight: '600' },
});