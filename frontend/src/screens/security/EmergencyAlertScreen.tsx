import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { sendEmergencyAlert } from '../../api/securityService';

const presets = ['Fire Alarm', 'Building Evacuation', 'Security Threat', 'Medical Emergency'];

export default function EmergencyAlertScreen() {
  const navigation = useNavigation<any>();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    await sendEmergencyAlert(message);
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={44} color={colors.success} />
        <Text style={styles.successTitle}>Alert Sent</Text>
        <Text style={styles.successSubtitle}>All residents and the manager have been notified.</Text>
        <TouchableOpacity style={styles.doneButton} onPress={() => navigation.navigate('SecurityDashboard')}>
          <Text style={styles.doneButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Alert</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.warningBanner}>
        <Ionicons name="warning" size={18} color={colors.danger} />
        <Text style={styles.warningText}>This will immediately notify all residents and the manager.</Text>
      </View>

      <View style={{ paddingHorizontal: spacing.lg }}>
        <Text style={styles.label}>Quick Select</Text>
        <View style={styles.presetGrid}>
          {presets.map((p) => (
            <TouchableOpacity key={p} style={styles.presetChip} onPress={() => setMessage(p)}>
              <Text style={styles.presetChipText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Alert Message</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the emergency..."
          placeholderTextColor={colors.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.sendButton, (!message.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || sending}
        >
          {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send Emergency Alert</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  warningBanner: { flexDirection: 'row', gap: 8, backgroundColor: '#FDECEC', marginHorizontal: spacing.lg, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.md, alignItems: 'flex-start' },
  warningText: { flex: 1, fontSize: 12, color: colors.danger, fontWeight: '600' },

  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: spacing.md },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetChip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: colors.card },
  presetChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },

  textArea: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text, minHeight: 100 },

  sendButton: { backgroundColor: colors.danger, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  successContainer: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center', alignItems: 'center' },
  successTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  successSubtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: spacing.lg },
  doneButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: spacing.xl },
  doneButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});