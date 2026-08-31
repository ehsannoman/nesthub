import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getPackages, markPackageCollected } from '../../api/packageService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function PackagesScreen() {
  const navigation = useNavigation<any>();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    getPackages().then((data: any[]) => {
      setPackages(data);
      setLoading(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const handleMarkCollected = async (id: string) => {
    setUpdating(id);
    try {
      await markPackageCollected(id);
      load();
    } finally {
      setUpdating(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Packages</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
          {packages.length === 0 && (
            <Text style={styles.emptyText}>No packages yet</Text>
          )}
          {packages.map((p) => (
            <View key={p._id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.iconWrap}>
                  <Ionicons name="cube-outline" size={20} color={colors.purple} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.courier}>{p.courier}</Text>
                  <Text style={styles.time}>{new Date(p.createdAt).toLocaleString()}</Text>
                </View>
                <View style={[styles.statusBadge, p.status === 'collected' && styles.statusCollected]}>
                  <Text style={[styles.statusText, p.status === 'collected' && styles.statusCollectedText]}>
                    {p.status === 'collected' ? 'Collected' : 'Ready to Receive'}
                  </Text>
                </View>
              </View>

              {p.status === 'received' && (
                <TouchableOpacity
                  style={styles.collectButton}
                  onPress={() => handleMarkCollected(p._id)}
                  disabled={updating === p._id}
                >
                  {updating === p._id ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                      <Text style={styles.collectButtonText}>I've Received This</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },

  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: '#F1E9FC', alignItems: 'center', justifyContent: 'center' },
  courier: { fontSize: 15, fontWeight: '700', color: colors.text },
  time: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  statusBadge: { backgroundColor: '#FEF3E2', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusCollected: { backgroundColor: '#EAF7EE' },
  statusText: { fontSize: 11, fontWeight: '700', color: colors.warning },
  statusCollectedText: { color: colors.success },

  collectButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.primary, borderRadius: radius.sm, paddingVertical: 10, marginTop: spacing.sm,
  },
  collectButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});