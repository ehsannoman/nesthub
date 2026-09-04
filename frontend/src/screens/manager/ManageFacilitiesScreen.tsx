import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Switch, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getMasterFacilityList, getFacilities, addFacility, updateFacility, deleteFacility } from '../../api/facilityService';

export default function ManageFacilitiesScreen() {
  const navigation = useNavigation<any>();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [masterList, setMasterList] = useState<{ name: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedFacility, setSelectedFacility] = useState<{ name: string; icon: string } | null>(null);
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.all([getFacilities(), getMasterFacilityList()]).then(([f, m]) => {
      setFacilities(f);
      setMasterList(m);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const alreadyAddedNames = facilities.map((f) => f.name);
  const availableToAdd = masterList.filter((m) => !alreadyAddedNames.includes(m.name));

  const handleAdd = async () => {
    if (!selectedFacility || !capacity || !price || saving) return;
    setSaving(true);
    try {
      await addFacility({
        name: selectedFacility.name,
        icon: selectedFacility.icon,
        maxCapacity: parseInt(capacity, 10),
        pricePerHour: parseInt(price, 10),
      });
      setModalVisible(false);
      setSelectedFacility(null);
      setCapacity('');
      setPrice('');
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateFacility(id, { isActive: !isActive });
    load();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Facilities</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
          {facilities.length === 0 && <Text style={styles.emptyText}>No facilities added yet. Tap + to add one.</Text>}
          {facilities.map((f) => (
            <View key={f._id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.iconWrap}>
                  <Ionicons name={f.icon} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.facilityName}>{f.name}</Text>
                  <Text style={styles.facilityMeta}>Capacity: {f.maxCapacity} · ৳{f.pricePerHour}/hour</Text>
                </View>
                <Switch value={f.isActive} onValueChange={() => handleToggleActive(f._id, f.isActive)} trackColor={{ true: colors.primary, false: colors.border }} />
                <TouchableOpacity onPress={async () => { await deleteFacility(f._id); load(); }} style={{ marginLeft: 8 }}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Facility</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Select Facility</Text>
              <View style={styles.facilityGrid}>
                {availableToAdd.map((m) => (
                  <TouchableOpacity
                    key={m.name}
                    style={[styles.facilityOption, selectedFacility?.name === m.name && styles.facilityOptionActive]}
                    onPress={() => setSelectedFacility(m)}
                  >
                    <Ionicons name={m.icon as any} size={18} color={selectedFacility?.name === m.name ? '#fff' : colors.primary} />
                    <Text style={[styles.facilityOptionText, selectedFacility?.name === m.name && styles.facilityOptionTextActive]}>
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                {availableToAdd.length === 0 && <Text style={styles.emptyText}>All facilities already added</Text>}
              </View>

              <Text style={styles.label}>Max Capacity (bookings per hour)</Text>
              <TextInput style={styles.input} placeholder="e.g. 1 for Hall, 10 for Gym" placeholderTextColor={colors.textMuted} value={capacity} onChangeText={setCapacity} keyboardType="numeric" />

              <Text style={styles.label}>Price per Hour (৳)</Text>
              <TextInput style={styles.input} placeholder="e.g. 500" placeholderTextColor={colors.textMuted} value={price} onChangeText={setPrice} keyboardType="numeric" />

              <TouchableOpacity
                style={[styles.saveButton, (!selectedFacility || !capacity || !price || saving) && styles.saveButtonDisabled]}
                onPress={handleAdd}
                disabled={!selectedFacility || !capacity || !price || saving}
              >
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Add Facility</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.sm },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  addButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },

  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  facilityName: { fontSize: 15, fontWeight: '700', color: colors.text },
  facilityMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.background, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: spacing.sm },
  facilityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  facilityOption: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.full,
    paddingHorizontal: 13, paddingVertical: 9, backgroundColor: colors.card,
  },
  facilityOptionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  facilityOptionText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  facilityOptionTextActive: { color: '#fff' },

  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text },

  saveButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.lg },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});