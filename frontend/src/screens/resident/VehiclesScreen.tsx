import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getVehicles, addVehicle, removeVehicle } from '../../api/residentService';
import { Vehicle } from '../../types';

export default function VehiclesScreen() {
  const navigation = useNavigation<any>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<Vehicle['type']>('Car');
  const [saving, setSaving] = useState(false);

  const load = () => getVehicles().then(setVehicles);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!plate.trim() || saving) return;
    setSaving(true);
    await addVehicle(plate, type, model);
    setSaving(false);
    setModalVisible(false);
    setPlate(''); setModel(''); setType('Car');
    load();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
        {vehicles.map((v) => (
          <View key={v.id} style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name="car-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.plate}>{v.plateNumber}</Text>
              <Text style={styles.model}>{v.type}{v.model ? ` · ${v.model}` : ''}</Text>
            </View>
            <TouchableOpacity onPress={async () => { await removeVehicle(v.id); load(); }}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Vehicle</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Plate Number</Text>
            <TextInput style={styles.input} placeholder="e.g. DHA-1234" placeholderTextColor={colors.textMuted} value={plate} onChangeText={setPlate} autoCapitalize="characters" />

            <Text style={styles.label}>Model (Optional)</Text>
            <TextInput style={styles.input} placeholder="e.g. Toyota Axio" placeholderTextColor={colors.textMuted} value={model} onChangeText={setModel} />

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeRow}>
              {(['Car', 'Motorcycle', 'Other'] as Vehicle['type'][]).map((t) => (
                <TouchableOpacity key={t} style={[styles.typeChip, type === t && styles.typeChipActive]} onPress={() => setType(t)}>
                  <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={[styles.saveButton, (!plate.trim() || saving) && styles.saveButtonDisabled]} onPress={handleAdd} disabled={!plate.trim() || saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Add Vehicle</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  addButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  plate: { fontSize: 15, fontWeight: '700', color: colors.text },
  model: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.background, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: spacing.sm },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeChip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: colors.card },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChipText: { fontSize: 12.5, fontWeight: '600', color: colors.text },
  typeChipTextActive: { color: '#fff' },
  saveButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.lg },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});