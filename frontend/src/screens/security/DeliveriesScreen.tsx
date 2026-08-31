import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getPackages, markPackageCollected } from '../../api/packageService';
import { DeliveryItem } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function DeliveriesScreen() {
  const navigation = useNavigation<any>();
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);

  const loadPackages = () => {
    getPackages().then((data: any[]) => {
      setDeliveries(data.map((p) => ({
        id: p._id, flat: p.flat, courier: p.courier,
        time: new Date(p.createdAt).toLocaleString(), status: p.status,
      })));
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadPackages();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Deliveries</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Home', { screen: 'AddPackage' })}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: spacing.lg }}>
        <View style={styles.list}>
          {deliveries.map((d) => (
            <View key={d.id} style={styles.row}>
              <View style={styles.iconWrap}>
                <Ionicons name="cube-outline" size={18} color={colors.purple} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{d.courier}</Text>
                <Text style={styles.sub}>Flat {d.flat} · {d.time}</Text>
              </View>
              {d.status === 'collected' ? (
                <View style={[styles.statusBadge, styles.statusCollected]}>
                  <Text style={[styles.statusText, styles.statusCollectedText]}>Collected</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.statusBadge}
                  onPress={async () => {
                    await markPackageCollected(d.id);
                    loadPackages();
                  }}
                >
                  <Text style={styles.statusText}>Mark Collected</Text>
                </TouchableOpacity>
              )}
            </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
          );
        }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  addButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },

  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: '#F1E9FC', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '600', color: colors.text },
  sub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  statusBadge: { backgroundColor: '#FEF3E2', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusCollected: { backgroundColor: '#EAF7EE' },
  statusText: { fontSize: 11, fontWeight: '700', color: colors.warning },
  statusCollectedText: { color: colors.success },
});