import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Switch,Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { publishNotice } from '../../api/noticeService';
import { generateNoticeFromDraft } from '../../api/aiService';

export default function CreateNoticeScreen() {
  const navigation = useNavigation<any>();
  const [draft, setDraft] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleAIPolish = async () => {
    if (!draft.trim() || generating) return;
    setGenerating(true);
    try {
      const result = await generateNoticeFromDraft(draft);
      setTitle(result.title);
      setBody(result.body);
    } catch (err: any) {
      Alert.alert('Failed', err.message || 'Could not generate notice');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !body.trim() || publishing) return;
    setPublishing(true);
    await publishNotice(title, body, isEmergency);
    setPublishing(false);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Notice</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Quick draft (optional — let AI polish it)</Text>
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
        <TouchableOpacity style={[styles.aiButton, (!draft.trim() || generating) && styles.aiButtonDisabled]} onPress={handleAIPolish} disabled={!draft.trim() || generating}>
          {generating ? <ActivityIndicator color={colors.primary} /> : (
            <>
              <Ionicons name="sparkles" size={16} color={colors.primary} />
              <Text style={styles.aiButtonText}>Polish with AI</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} placeholder="Notice title" placeholderTextColor={colors.textMuted} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Body</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Notice content"
          placeholderTextColor={colors.textMuted}
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchLabel}>Mark as Emergency</Text>
            <Text style={styles.switchSub}>Emergency notices are sent with priority push</Text>
          </View>
          <Switch value={isEmergency} onValueChange={setIsEmergency} trackColor={{ true: colors.danger, false: colors.border }} />
        </View>

        <TouchableOpacity
          style={[styles.publishButton, (!title.trim() || !body.trim() || publishing) && styles.publishButtonDisabled]}
          onPress={handlePublish}
          disabled={!title.trim() || !body.trim() || publishing}
        >
          {publishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishButtonText}>Publish Notice</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  form: { paddingHorizontal: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: spacing.md },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text },
  textArea: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text, minHeight: 90 },
  aiButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, marginTop: spacing.sm },
  aiButtonDisabled: { opacity: 0.5 },
  aiButtonText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md, borderWidth: 1, borderColor: colors.border },
  switchLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
  switchSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  publishButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl },
  publishButtonDisabled: { opacity: 0.5 },
  publishButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});