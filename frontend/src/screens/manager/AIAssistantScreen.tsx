import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { askCommunityAI } from '../../api/aiService';
import KeyboardScreen from '../../components/KeyboardScreen';

const suggestedPrompts = [
  'How is my community doing today?',
  "Give me this month's summary",
  'Any complaints I should worry about?',
];

export default function AIAssistantScreen() {
  const navigation = useNavigation<any>();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (customQuestion?: string) => {
    const q = customQuestion || question;
    if (!q.trim() || loading) return;
    setLoading(true);
    setAnswer(null);
    try {
      const data = await askCommunityAI(q);
      setAnswer(data.answer);
    } catch (err: any) {
      setAnswer('Sorry, something went wrong while getting the answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardScreen contentContainerStyle={{ paddingBottom: 250 }}>
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
        <Text style={styles.askTitle}>Ask anything about your community</Text>
        <Text style={styles.askSubtitle}>AI will analyse complaints, visitors, and resident data to answer.</Text>

        <TextInput
          style={styles.questionInput}
          placeholder="Type your question..."
          placeholderTextColor="#CFE8E6"
          value={question}
          onChangeText={setQuestion}
          multiline
        />

        <View style={styles.promptChips}>
          {suggestedPrompts.map((p) => (
            <TouchableOpacity key={p} style={styles.promptChip} onPress={() => { setQuestion(p); handleAsk(p); }}>
              <Text style={styles.promptChipText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.askButton, !question.trim() && styles.askButtonDisabled]} onPress={() => handleAsk()} disabled={!question.trim() || loading}>
          {loading ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.askButtonText}>Ask</Text>}
        </TouchableOpacity>
      </View>

      {/* Answer */}
      {loading && (
        <View style={styles.answerCard}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
      {answer && !loading && (
        <View style={styles.answerCard}>
          <View style={styles.answerHeader}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Text style={styles.answerHeaderText}>AI Response</Text>
          </View>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  askCard: { backgroundColor: colors.primary, marginHorizontal: spacing.lg, borderRadius: radius.lg, padding: spacing.lg },
  aiIconWrap: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  askTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  askSubtitle: { color: '#CFE8E6', fontSize: 12, marginTop: 4, marginBottom: spacing.md },

  questionInput: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.md, padding: spacing.sm,
    color: '#fff', fontSize: 14, minHeight: 60, textAlignVertical: 'top', marginBottom: spacing.md,
  },

  promptChips: { gap: 8, marginBottom: spacing.md },
  promptChip: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.md, padding: spacing.sm },
  promptChipText: { color: '#fff', fontSize: 12.5 },

  askButton: { backgroundColor: '#fff', borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  askButtonDisabled: { opacity: 0.6 },
  askButtonText: { color: colors.primary, fontWeight: '700', fontSize: 14 },

  answerCard: { backgroundColor: colors.card, marginHorizontal: spacing.lg, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginTop: spacing.md },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm },
  answerHeaderText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  answerText: { fontSize: 14, color: colors.text, lineHeight: 21 },
});