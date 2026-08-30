import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Share,Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { colors, spacing, radius } from '../../constants/theme';
import { inviteVisitor } from '../../api/visitorService';
import { useAuth } from '../../context/AuthContext';
import DateField from '../../components/DateField';

export default function InviteVisitorScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [qrValue, setQrValue] = useState<string | null>(null);

  const canGenerate = name.trim() && phone.trim() && date.trim() && time.trim();

  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
      if (!canGenerate || generating) return;
      setGenerating(true);
      try {
        const data = await inviteVisitor({ name, phone, visitDate: date, visitTime: time, vehicle: vehicle || undefined });
        setQrValue(data.qrToken); // এখন QR code এ শুধু token থাকবে, পুরো JSON না
      } catch (err: any) {
        Alert.alert('Failed', err.message || 'Could not create invite');
      } finally {
        setGenerating(false);
      }
    };

  const handleShare = () => {
    Share.share({
      message: `You're invited to Green Valley Residency!\nVisitor: ${name}\nDate: ${date} at ${time}\nShow this code at the gate.`,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Visitor</Text>
        <View style={{ width: 40 }} />
      </View>

      {!qrValue ? (
        <View style={styles.form}>
          <Text style={styles.label}>Visitor Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Karim Rahman"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 017XXXXXXXX"
            placeholderTextColor={colors.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Visit Date</Text>
              <DateField value={date} onChange={setDate} minimumDate={new Date()} />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Visit Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 5:00 PM"
                placeholderTextColor={colors.textMuted}
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>

          <Text style={styles.label}>Vehicle Number (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. DHA-1234"
            placeholderTextColor={colors.textMuted}
            value={vehicle}
            onChangeText={setVehicle}
          />

          <TouchableOpacity
            style={[styles.generateButton, !canGenerate && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={!canGenerate || generating}
          >
            <Ionicons name="qr-code-outline" size={18} color="#fff" />
            <Text style={styles.generateButtonText}>{generating ? 'Generating...' : 'Generate QR Code'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.qrSection}>
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Visitor Pass</Text>
            <Text style={styles.qrSubtitle}>Flat {user?.flat || 'N/A'}</Text>

            <View style={styles.qrWrap}>
              <QRCode value={qrValue} size={200} color={colors.text} backgroundColor="#fff" />
            </View>

            <View style={styles.qrDetails}>
              <View style={styles.qrDetailRow}>
                <Text style={styles.qrDetailLabel}>Visitor</Text>
                <Text style={styles.qrDetailValue}>{name}</Text>
              </View>
              <View style={styles.qrDetailRow}>
                <Text style={styles.qrDetailLabel}>Date & Time</Text>
                <Text style={styles.qrDetailValue}>{date} · {time}</Text>
              </View>
              {vehicle ? (
                <View style={styles.qrDetailRow}>
                  <Text style={styles.qrDetailLabel}>Vehicle</Text>
                  <Text style={styles.qrDetailValue}>{vehicle}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={18} color={colors.primary} />
            <Text style={styles.shareButtonText}>Share with Visitor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
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

  form: { paddingHorizontal: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: spacing.md },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },

  generateButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, marginTop: spacing.xl,
  },
  generateButtonDisabled: { opacity: 0.5 },
  generateButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  qrSection: { paddingHorizontal: spacing.lg, alignItems: 'center' },
  qrCard: {
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg,
    alignItems: 'center', width: '100%', borderWidth: 1, borderColor: colors.border,
  },
  qrTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  qrSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: spacing.lg },
  qrWrap: { padding: spacing.md, backgroundColor: '#fff', borderRadius: radius.md },
  qrDetails: { width: '100%', marginTop: spacing.lg, gap: 8 },
  qrDetailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  qrDetailLabel: { fontSize: 13, color: colors.textMuted },
  qrDetailValue: { fontSize: 13, fontWeight: '600', color: colors.text },

  shareButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 14, width: '100%', marginTop: spacing.lg,
  },
  shareButtonText: { color: colors.primary, fontSize: 14, fontWeight: '700' },

  doneButton: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 14, width: '100%', alignItems: 'center', marginTop: spacing.sm,
  },
  doneButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});