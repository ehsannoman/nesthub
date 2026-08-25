import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/theme';
import { getActivity } from '../../api/residentService';
import { ActivityItem } from '../../types';

export default function ActivityScreen() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => { getActivity().then(setActivity); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120 }}>
        <View style={styles.timeline}>
          {activity.map((a, i) => (
            <View key={a.id} style={styles.row}>
              <View style={styles.timelineCol}>
                <View style={styles.dot} />
                {i !== activity.length - 1 && <View style={styles.line} />}
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>{a.title}</Text>
                <Text style={styles.subtitle}>{a.subtitle}</Text>
                <Text style={styles.time}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  timeline: {},
  row: { flexDirection: 'row' },
  timelineCol: { alignItems: 'center', width: 20 },
  dot: { width: 10, height: 10, borderRadius: radius.full, backgroundColor: colors.primary, marginTop: 4 },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 2 },
  content: { flex: 1, marginLeft: spacing.sm, paddingBottom: spacing.lg },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  time: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
});