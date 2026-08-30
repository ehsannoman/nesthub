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
import { colors, spacing, radius, typography } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getMyVisitors } from '../../api/visitorService';
import { getMyComplaints } from '../../api/complaintService';

const quickActions = [
  {
    label: 'Invite\nVisitor',
    icon: 'person-add-outline' as const,
  },
  {
    label: 'Report\nComplaint',
    icon: 'build-outline' as const,
  },
  {
    label: 'Book\nFacility',
    icon: 'calendar-outline' as const,
  },
  {
    label: 'View\nBills',
    icon: 'document-text-outline' as const,
  },
];

const recentNotices = [
  {
    title: 'Water Supply Maintenance',
    body: 'Water supply will be interrupted on 12 Aug from 10:00 AM to 4:00 PM.',
    time: '2h ago',
    icon: 'megaphone-outline' as const,
  },
  {
    title: 'Eid Celebration',
    body: 'Eid get together on 18 Aug at Community Hall.',
    time: '1d ago',
    icon: 'people-outline' as const,
  },
];

export default function ResidentDashboard() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [visitorsToday, setVisitorsToday] = useState(0);
  const [openComplaints, setOpenComplaints] = useState(0);

  useEffect(() => {
    getMyVisitors().then((visitors: any[]) => {
      const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '/');
      setVisitorsToday(visitors.filter((v) => v.visitDate === today).length);
    }).catch(() => {});

    getMyComplaints().then((complaints: any[]) => {
      setOpenComplaints(complaints.filter((c: any) => c.status !== 'Resolved' && c.status !== 'Closed').length);
    }).catch(() => {});
  }, []);

    const overviewItems = [
    { label: 'Visitors', sub: 'Today', value: visitorsToday, icon: 'people-outline' as const, bg: '#E6F4F4', tint: colors.primary },
    { label: 'My Complaints', sub: 'Open', value: openComplaints, icon: 'build-outline' as const, bg: '#FEF3E2', tint: colors.warning },
    { label: 'Facility Bookings', sub: 'Upcoming', value: 1, icon: 'calendar-outline' as const, bg: '#EAF2FF', tint: colors.info },
    { label: 'My Packages', sub: 'New', value: 1, icon: 'cube-outline' as const, bg: '#F3ECFF', tint: colors.primary },
    { label: 'Notices', sub: 'Unread', value: 3, icon: 'megaphone-outline' as const, bg: '#EAF7EE', tint: colors.success },
    { label: 'My Vehicles', sub: 'Registered', value: 1, icon: 'car-outline' as const, bg: '#E6F4F4', tint: colors.primary },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              Good Morning,
            </Text>

            <Text style={styles.name}>
              {user?.name || 'Rahat Ahmed'}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location"
                size={17}
                color={colors.primary}
              />

              <Text style={styles.location}>
                Green Valley Residency
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="notifications-outline"
                size={23}
                color={colors.text}
              />

              <View style={styles.notificationDot} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= BILL CARD ================= */}

        <View style={styles.billCard}>
          {/* LEFT */}

          <View style={styles.billLeft}>
            <Text style={styles.billLabel}>
              Total Due
            </Text>

            <Text style={styles.billAmount}>
              ৳5,600
            </Text>

            <View style={styles.dueBadge}>
              <Text style={styles.dueBadgeText}>
                Due on 10 Aug 2025
              </Text>
            </View>

            <TouchableOpacity
              style={styles.payButton}
              activeOpacity={0.85}
            >
              <Text style={styles.payButtonText}>
                Pay Now
              </Text>

              <View style={styles.payArrow}>
                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* DIVIDER */}

          <View style={styles.billDivider} />

          {/* RIGHT */}

          <View style={styles.billRight}>
            <Text style={styles.billLabel}>
              Status
            </Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                Unpaid
              </Text>
            </View>

            <Text style={styles.monthLabel}>
              This Month
            </Text>

            <View style={styles.monthRow}>
              <Text style={styles.monthText}>
                Aug 2025
              </Text>

              <Ionicons
                name="calendar-outline"
                size={17}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.billBottomDivider} />

            <TouchableOpacity
              style={styles.detailsButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Bills')}
            >
              <Text style={styles.detailsText}>
                View Bill Details
              </Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= QUICK ACTIONS ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Quick Actions
          </Text>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsRow}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() => {
                if (item.label.includes('Invite')) {
                  navigation.navigate('InviteVisitor');
                }else if (item.label.includes('Complaint')) {
                  navigation.navigate('ReportComplaint');
                }else if (item.label.includes('Facility')) {
                  navigation.navigate('BookFacility');
                } else if (item.label.includes('Bills')) {
                  navigation.navigate('Bills');
                }
              }}
            >
              <View style={styles.quickActionIconWrap}>
                <Ionicons
                  name={item.icon}
                  size={27}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.quickActionLabel}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ================= OVERVIEW ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Overview
          </Text>
        </View>

        <View style={styles.overviewGrid}>
          {overviewItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.overviewCard}
              activeOpacity={0.8}
            >
              {/* ICON + ARROW */}

              <View style={styles.overviewTopRow}>
                <View
                  style={[
                    styles.overviewIconWrap,
                    {
                      backgroundColor: item.bg,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={23}
                    color={item.tint}
                  />
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </View>

              {/* TEXT */}

              <View style={styles.overviewContent}>
                <Text
                  style={styles.overviewLabel}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>

                <Text style={styles.overviewSub}>
                  {item.sub}
                </Text>

                <Text
                  style={[
                    styles.overviewValue,
                    {
                      color: item.tint,
                    },
                  ]}
                >
                  {item.value}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ================= RECENT NOTICES ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Notices
          </Text>

          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Notices')}>
          <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noticeList}>
          {recentNotices.map((notice, index) => (
            <TouchableOpacity
              key={notice.title}
              style={[
                styles.noticeRow,
                index !== recentNotices.length - 1 &&
                  styles.noticeBorder,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.noticeIconWrap}>
                <Ionicons
                  name={notice.icon}
                  size={23}
                  color={colors.primary}
                />
              </View>

              <View style={styles.noticeContent}>
                <View style={styles.noticeTopRow}>
                  <Text
                    style={styles.noticeTitle}
                    numberOfLines={1}
                  >
                    {notice.title}
                  </Text>

                  <Text style={styles.noticeTime}>
                    {notice.time}
                  </Text>
                </View>

                <Text
                  style={styles.noticeBody}
                  numberOfLines={2}
                >
                  {notice.body}
                </Text>
              </View>

              <View style={styles.unreadDot} />
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
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  /* ================= HEADER ================= */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },

  headerLeft: {
    flex: 1,
  },

  greeting: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.text,
  },

  name: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  location: {
    fontSize: 15,
    color: colors.textMuted,
    marginLeft: 5,
  },

  headerActions: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 3,
    marginLeft: 8,
  },

  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: colors.card,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#EEF1F1',
  },

  notificationDot: {
    position: 'absolute',

    width: 9,
    height: 9,
    borderRadius: 5,

    backgroundColor: colors.primary,

    top: 9,
    right: 10,

    borderWidth: 1.5,
    borderColor: colors.card,
  },

  /* ================= BILL CARD ================= */

  billCard: {
    backgroundColor: colors.primary,

    marginHorizontal: 16,

    borderRadius: radius.lg,

    padding: spacing.lg,

    flexDirection: 'row',

    minHeight: 218,

    overflow: 'hidden',
  },

  billLeft: {
    flex: 1,
    paddingRight: 14,
  },

  billRight: {
    flex: 1,
    paddingLeft: 14,
  },

  billDivider: {
    width: 1,

    backgroundColor: 'rgba(255,255,255,0.28)',

    marginVertical: 5,
  },

  billLabel: {
    color: '#D8F0F0',

    fontSize: 14,
    fontWeight: '500',
  },

  billAmount: {
    color: '#FFFFFF',

    fontSize: 34,
    lineHeight: 40,

    fontWeight: '700',

    marginTop: 4,
  },

  dueBadge: {
    alignSelf: 'flex-start',

    backgroundColor: 'rgba(255,255,255,0.14)',

    borderRadius: 20,

    paddingHorizontal: 11,
    paddingVertical: 6,

    marginTop: 8,
  },

  dueBadgeText: {
    color: '#FFFFFF',

    fontSize: 12,
    fontWeight: '500',
  },

  payButton: {
    height: 50,

    backgroundColor: '#FFFFFF',

    borderRadius: 26,

    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',

    paddingLeft: 18,
    paddingRight: 5,

    marginTop: 15,
  },

  payButtonText: {
    color: colors.text,

    fontSize: 15,
    fontWeight: '600',
  },

  payArrow: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: colors.primaryLight,

    alignItems: 'center',
    justifyContent: 'center',
  },

  statusBadge: {
    alignSelf: 'flex-start',

    backgroundColor: '#FFFFFF',

    borderRadius: 20,

    paddingHorizontal: 12,
    paddingVertical: 6,

    marginTop: 7,
  },

  statusBadgeText: {
    color: colors.primary,

    fontSize: 13,
    fontWeight: '700',
  },

  monthLabel: {
    color: '#D8F0F0',

    fontSize: 14,

    marginTop: 17,
  },

  monthRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 3,
  },

  monthText: {
    color: '#FFFFFF',

    fontSize: 15,
    fontWeight: '600',
  },

  billBottomDivider: {
    height: 1,

    backgroundColor: 'rgba(255,255,255,0.28)',

    marginTop: 10,
  },

  detailsButton: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 9,
  },

  detailsText: {
    color: '#FFFFFF',

    fontSize: 13,
    fontWeight: '500',
  },

  /* ================= SECTION ================= */

  sectionHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginHorizontal: 16,

    marginTop: spacing.lg,

    marginBottom: spacing.sm,
  },

  sectionTitle: {
    fontSize: 21,
    lineHeight: 27,

    fontWeight: '700',

    color: colors.text,
  },

  viewAll: {
    fontSize: 14,

    fontWeight: '600',

    color: colors.primary,
  },

  /* ================= QUICK ACTIONS ================= */

  quickActionsRow: {
    flexDirection: 'row',

    paddingHorizontal: 16,

    gap: 8,
  },

  quickActionCard: {
    flex: 1,

    minHeight: 134,

    backgroundColor: colors.card,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: '#E9EEEE',

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 5,
  },

  quickActionIconWrap: {
    width: 56,
    height: 56,

    borderRadius: 17,

    backgroundColor: colors.primaryLight,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 11,
  },

  quickActionLabel: {
    color: colors.text,

    fontSize: 13,
    lineHeight: 18,

    fontWeight: '600',

    textAlign: 'center',
  },

  /* ================= OVERVIEW ================= */

  overviewGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    paddingHorizontal: 16,

    gap: 8,
  },

  overviewCard: {
    width: '48%',

    minHeight: 112,

    backgroundColor: colors.card,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: '#E9EEEE',

    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  overviewTopRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  overviewIconWrap: {
    width: 46,
    height: 46,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',
  },

  overviewContent: {
    marginTop: 9,
  },

  overviewLabel: {
    color: colors.text,

    fontSize: 14,

    fontWeight: '600',
  },

  overviewSub: {
    color: colors.textMuted,

    fontSize: 12,

    marginTop: 2,
  },

  overviewValue: {
    fontSize: 24,

    lineHeight: 28,

    fontWeight: '700',

    marginTop: 1,
  },

  /* ================= RECENT NOTICES ================= */

  noticeList: {
    backgroundColor: colors.card,

    marginHorizontal: 16,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: '#E9EEEE',

    overflow: 'hidden',
  },

  noticeRow: {
    flexDirection: 'row',

    padding: 14,

    minHeight: 90,

    alignItems: 'flex-start',
  },

  noticeBorder: {
    borderBottomWidth: 1,

    borderBottomColor: '#EDF0F0',
  },

  noticeIconWrap: {
    width: 48,
    height: 48,

    borderRadius: 15,

    backgroundColor: colors.primaryLight,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  noticeContent: {
    flex: 1,
  },

  noticeTopRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  noticeTitle: {
    flex: 1,

    color: colors.text,

    fontSize: 14,

    fontWeight: '700',

    marginRight: 7,
  },

  noticeTime: {
    color: colors.textMuted,

    fontSize: 11,
  },

  noticeBody: {
    color: colors.textMuted,

    fontSize: 12,

    lineHeight: 18,

    marginTop: 4,

    paddingRight: 3,
  },

  unreadDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: colors.primary,

    marginTop: 24,

    marginLeft: 5,
  },
});