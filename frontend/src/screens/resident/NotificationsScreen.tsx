import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/theme';
import { getNotifications } from '../../api/residentService';
import { AppNotification } from '../../types';
import { useNavigation } from '@react-navigation/native';

const typeIcon: Record<AppNotification['type'], { icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }> = {
  visitor: { icon: 'person-outline', bg: '#E6F4F4', color: colors.primary },
  complaint: { icon: 'build-outline', bg: '#FEF3E2', color: colors.warning },
  bill: { icon: 'receipt-outline', bg: '#F1E9FC', color: colors.purple },
  booking: { icon: 'calendar-outline', bg: '#EAF2FF', color: colors.info },
  notice: { icon: 'megaphone-outline', bg: '#EAF7EE', color: colors.success },
  package: { icon: 'cube-outline', bg: '#F1E9FC', color: colors.purple },
};

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => { getNotifications().then(setNotifications); }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
        {notifications.map((n) => {
          const cfg = typeIcon[n.type];
          return (
            <TouchableOpacity key={n.id} style={[styles.row, !n.read && styles.rowUnread]}>
              <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon} size={18} color={cfg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.body}>{n.body}</Text>
                <Text style={styles.time}>{n.time}</Text>
              </View>
              {!n.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  row: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, alignItems: 'flex-start' },
  rowUnread: { borderColor: colors.primary },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  body: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  time: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: radius.full, backgroundColor: colors.primary, marginTop: 4 },
});