import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../../constants/theme';
import { getFamilyMembers, addFamilyMember, removeFamilyMember } from '../../api/residentService';
import { FamilyMember } from '../../types';

export default function FamilyMembersScreen() {
  const navigation = useNavigation<any>();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => getFamilyMembers().then(setMembers);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!name.trim() || !relation.trim() || saving) return;
    setSaving(true);
    await addFamilyMember(name, relation, phone);
    setSaving(false);
    setModalVisible(false);
    setName(''); setRelation(''); setPhone('');
    load();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Members</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.sm }}>
        {members.map((m) => (
          <View key={m.id} style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{m.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{m.name}</Text>
              <Text style={styles.relation}>{m.relation}{m.phone !== '—' ? ` · ${m.phone}` : ''}</Text>
            </View>
            <TouchableOpacity onPress={async () => { await removeFamilyMember(m.id); load(); }}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Family Member</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="Enter full name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />

            <Text style={styles.label}>Relation</Text>
            <TextInput style={styles.input} placeholder="e.g. Spouse, Son, Daughter" placeholderTextColor={colors.textMuted} value={relation} onChangeText={setRelation} />

            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput style={styles.input} placeholder="017XXXXXXXX" placeholderTextColor={colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

            <TouchableOpacity style={[styles.saveButton, (!name.trim() || !relation.trim() || saving) && styles.saveButtonDisabled]} onPress={handleAdd} disabled={!name.trim() || !relation.trim() || saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Add Member</Text>}
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
  avatar: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  name: { fontSize: 14, fontWeight: '700', color: colors.text },
  relation: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.background, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: spacing.sm },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text },
  saveButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.lg },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});