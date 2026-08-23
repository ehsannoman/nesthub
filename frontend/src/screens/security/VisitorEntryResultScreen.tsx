import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { checkInVisitor, ParsedVisitorQR } from '../../api/securityService';

export default function VisitorEntryResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { visitor, valid }: { visitor: ParsedVisitorQR | null; valid: boolean } = route.params;
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleApprove = async () => {
    if (!visitor) return;
    setApproving(true);
    await checkInVisitor(visitor.name, visitor.flat);
    setApproving(false);
    setApproved(true);
  };

  if (!valid || !visitor) {
    return (
      <View style={styles.container}>
        <View style={[styles.iconWrap, { backgroundColor: '#FDECEC' }]}>
          <Ionicons name="close-circle" size={44} color={colors.danger} />
        </View>
        <Text style={styles.title}>Invalid QR Code</Text>
        <Text style={styles.subtitle}>This doesn't look like a valid NestHub visitor pass. Please ask the visitor to share a valid invite.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('QRScanner')}>
          <Text style={styles.primaryButtonText}>Scan Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('SecurityDashboard')}>
          <Text style={styles.secondaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (approved) {
    return (
      <View style={styles.container}>
        <View style={[styles.iconWrap, { backgroundColor: '#EAF7EE' }]}>
          <Ionicons name="checkmark-circle" size={44} color={colors.success} />
        </View>
        <Text style={styles.title}>Entry Approved</Text>
        <Text style={styles.subtitle}>{visitor.name} has been checked in. The resident has been notified.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('SecurityDashboard')}>
          <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name="shield-checkmark" size={44} color={colors.primary} />
      </View>
      <Text style={styles.title}>Valid Visitor Pass</Text>

      <View style={styles.card}>
        <View style={styles.row}><Text style={styles.label}>Visitor</Text><Text style={styles.value}>{visitor.name}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Phone</Text><Text style={styles.value}>{visitor.phone}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Flat</Text><Text style={styles.value}>{visitor.flat}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Visit Time</Text><Text style={styles.value}>{visitor.date} · {visitor.time}</Text></View>
        {visitor.vehicle ? (
          <View style={styles.row}><Text style={styles.label}>Vehicle</Text><Text style={styles.value}>{visitor.vehicle}</Text></View>
        ) : null}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleApprove} disabled={approving}>
        {approving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Approve Entry</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('SecurityDashboard')}>
        <Text style={styles.secondaryButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center' },
  iconWrap: {
    width: 80, height: 80, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 19, marginBottom: spacing.lg },

  card: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border, gap: 10, marginBottom: spacing.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 13, color: colors.textMuted },
  value: { fontSize: 13, fontWeight: '600', color: colors.text },

  primaryButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: { paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm },
  secondaryButtonText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
});