import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getNotices } from '../../api/noticeService';
import { NoticeItem } from '../../types';


function timeAgo(ts: number) {
  const hrs = Math.floor((Date.now() - ts) / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NoticeScreen() {
  const navigation = useNavigation<any>();
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  useEffect(() => {
    getNotices().then((data: any[]) => {
      setNotices(data.map((n) => ({ ...n, id: n._id })));
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notices</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Dashboard', { screen: 'CreateNotice' })}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
        {notices.map((n) => (
          <View key={n.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={[styles.iconWrap, n.isEmergency && styles.iconWrapEmergency]}>
                <Ionicons name={n.isEmergency ? 'warning' : 'megaphone-outline'} size={18} color={n.isEmergency ? colors.danger : colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.time}>{timeAgo(n.publishedAt)}</Text>
              </View>
            </View>
            <Text style={styles.body}>{n.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  addButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  iconWrapEmergency: { backgroundColor: '#FDECEC' },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  time: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  body: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
});