import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getAISummary, generateNoticeFromDraft } from '../../api/managerService';
import { AISummaryData } from '../../types';

const suggestedPrompts = [
  'How is my community doing today?',
  "Give me this month's summary",
  'Any complaints I should worry about?',
];

export default function AIAssistantScreen() {
  const navigation = useNavigation<any>();
  const [summary, setSummary] = useState<AISummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);

  // Notice generator
  const [draft, setDraft] = useState('');
  const [generatedNotice, setGeneratedNotice] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAsked(true);
    const data = await getAISummary();
    setSummary(data);
    setLoading(false);
  };

  const handleGenerateNotice = async () => {
    if (!draft.trim() || generating) return;
    setGenerating(true);
    const notice = await generateNoticeFromDraft(draft);
    setGeneratedNotice(notice);
    setGenerating(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask NestHub AI</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Ask section */}
      <View style={styles.askCard}>
        <View style={styles.aiIconWrap}>
          <Ionicons name="sparkles" size={22} color="#fff" />
        </View>
        <Text style={styles.askTitle}>How is my community doing today?</Text>
        <Text style={styles.askSubtitle}>AI will analyse complaints, maintenance, visitors, and occupancy data.</Text>

        <View style={styles.promptChips}>
          {suggestedPrompts.map((p) => (
            <TouchableOpacity key={p} style={styles.promptChip} onPress={handleAsk}>
              <Text style={styles.promptChipText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.askButton} onPress={handleAsk} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.askButtonText}>Ask</Text>}
        </TouchableOpacity>
      </View>

      {asked && summary && !loading && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Community Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLine}>• {summary.openComplaints} complaints are currently open.</Text>
            <Text style={styles.summaryLine}>• {summary.pendingMaintenance} maintenance requests are pending.</Text>
            <Text style={styles.summaryLine}>• {summary.todayVisitors} visitors have entered today.</Text>
            <Text style={styles.summaryLine}>• {summary.occupancyRate}% of flats are occupied.</Text>
          </View>
          {summary.insight && (
            <View style={styles.insightBox}>
              <Ionicons name="warning" size={16} color={colors.warning} />
              <Text style={styles.insightText}>{summary.insight}</Text>
            </View>
          )}
        </View>
      )}

      {/* Notice generator */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Smart Notice Generator</Text>
      </View>
      <View style={styles.noticeCard}>
        <Text style={styles.label}>Write a short note, AI will polish it</Text>
        <TextInput
          style={styles.textArea}
          placeholder="e.g. আগামীকাল সকাল ১০টা থেকে Block A lift maintenance হবে"
          placeholderTextColor={colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.generateButton, (!draft.trim() || generating) && styles.generateButtonDisabled]}
          onPress={handleGenerateNotice}
          disabled={!draft.trim() || generating}
        >
          {generating ? <ActivityIndicator color="#fff" /> : <Text style={styles.generateButtonText}>Generate Notice</Text>}
        </TouchableOpacity>

        {generatedNotice && (
          <View style={styles.generatedBox}>
            <Text style={styles.generatedText}>{generatedNotice}</Text>
            <TouchableOpacity style={styles.publishButton}>
              <Text style={styles.publishButtonText}>Publish Notice</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  askCard: { backgroundColor: colors.primary, marginHorizontal: spacing.lg, borderRadius: radius.lg, padding: spacing.lg },
  aiIconWrap: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  askTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  askSubtitle: { color: '#CFE8E6', fontSize: 12, marginTop: 4, marginBottom: spacing.md },
  promptChips: { gap: 8, marginBottom: spacing.md },
  promptChip: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.md, padding: spacing.sm },
  promptChipText: { color: '#fff', fontSize: 12.5 },
  askButton: { backgroundColor: '#fff', borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  askButtonText: { color: colors.primary, fontWeight: '700', fontSize: 14 },

  summaryCard: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginTop: spacing.md },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  summaryRow: { gap: 4 },
  summaryLine: { fontSize: 13, color: colors.text, lineHeight: 20 },
  insightBox: { flexDirection: 'row', gap: 8, backgroundColor: '#FEF3E2', borderRadius: radius.md, padding: spacing.sm, marginTop: spacing.sm, alignItems: 'flex-start' },
  insightText: { flex: 1, fontSize: 12, color: colors.warning, fontWeight: '600' },

  sectionHeader: { marginHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },

  noticeCard: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 8 },
  textArea: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, fontSize: 14, backgroundColor: colors.background, color: colors.text, minHeight: 80 },
  generateButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm },
  generateButtonDisabled: { opacity: 0.5 },
  generateButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  generatedBox: { backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.sm, marginTop: spacing.md },
  generatedText: { fontSize: 13, color: colors.text, lineHeight: 20 },
  publishButton: { backgroundColor: colors.success, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center', marginTop: spacing.sm },
  publishButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});