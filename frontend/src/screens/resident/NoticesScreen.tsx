import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getNoticesForResident } from '../../api/residentService';

function timeAgo(ts: number) {
  const hrs = Math.floor((Date.now() - ts) / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NoticesScreen() {
  const navigation = useNavigation<any>();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoticesForResident().then((data) => { setNotices(data); setLoading(false); });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notices</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} /> : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
          {notices.map((n) => (
            <View key={n.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.iconWrap}>
                  <Ionicons name="megaphone-outline" size={18} color={colors.primary} />
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  time: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  body: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
});