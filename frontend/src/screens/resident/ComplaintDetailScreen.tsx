import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { ComplaintStatus } from '../../types';

const timelineSteps: ComplaintStatus[] = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

const priorityColor: Record<string, string> = {
  Low: colors.success,
  Medium: colors.warning,
  High: colors.danger,
};

export default function ComplaintDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const rawComplaint = route.params.complaint;
  const complaint = {
      ...rawComplaint,
      id: rawComplaint.id || rawComplaint._id,
  };

  const currentStepIndex = timelineSteps.indexOf(complaint.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint {complaint.id}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.successBanner}>
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        <Text style={styles.successText}>Complaint submitted successfully</Text>
      </View>

      {/* Summary card */}
      <View style={styles.card}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Category</Text>
          <Text style={styles.summaryValue}>{complaint.category}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Priority</Text>
          <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor[complaint.priority]}20` }]}>
            <Text style={[styles.priorityText, { color: priorityColor[complaint.priority] }]}>
              {complaint.priority}
            </Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Flat</Text>
          <Text style={styles.summaryValue}>{complaint.flat}</Text>
        </View>
        <Text style={styles.descriptionText}>{complaint.description}</Text>
        {complaint.photoUrl ? (
          <Image source={{ uri: complaint.photoUrl }} style={styles.photo} />
        ) : null}
      </View>

      {/* Timeline */}
      <Text style={styles.sectionTitle}>Status Timeline</Text>
      <View style={styles.card}>
        {timelineSteps.map((step, index) => {
          const isDone = index <= currentStepIndex;
          const isLast = index === timelineSteps.length - 1;
          return (
            <View key={step} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, isDone && styles.timelineDotActive]}>
                  {isDone && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                {!isLast && <View style={[styles.timelineLine, isDone && styles.timelineLineActive]} />}
              </View>
              <Text style={[styles.timelineLabel, isDone && styles.timelineLabelActive]}>{step}</Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={styles.doneButton} onPress={() => navigation.popToTop()}>
        <Text style={styles.doneButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md,
  },
  backButton: {
    width: 40, height: 40, borderRadius: radius.full,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#EAF7EE', marginHorizontal: spacing.lg, borderRadius: radius.md,
    padding: spacing.sm, marginBottom: spacing.md,
  },
  successText: { color: colors.success, fontSize: 13, fontWeight: '600' },

  card: {
    backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: colors.textMuted },
  summaryValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  priorityBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 2 },
  priorityText: { fontSize: 12, fontWeight: '700' },
  descriptionText: { fontSize: 13, color: colors.text, marginTop: 8, lineHeight: 19 },
  photo: { width: '100%', height: 160, borderRadius: radius.md, marginTop: spacing.sm },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginHorizontal: spacing.lg, marginBottom: spacing.sm },

  timelineRow: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineLeft: { alignItems: 'center', width: 24 },
  timelineDot: {
    width: 20, height: 20, borderRadius: radius.full, backgroundColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  timelineDotActive: { backgroundColor: colors.primary },
  timelineLine: { width: 2, height: 28, backgroundColor: colors.border },
  timelineLineActive: { backgroundColor: colors.primary },
  timelineLabel: { fontSize: 14, color: colors.textMuted, marginLeft: 12, marginTop: 1, marginBottom: 20 },
  timelineLabelActive: { color: colors.text, fontWeight: '700' },

  doneButton: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center', marginHorizontal: spacing.lg, marginTop: spacing.sm,
  },
  doneButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});