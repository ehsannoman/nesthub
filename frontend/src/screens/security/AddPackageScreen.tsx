import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator,Alert,Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius } from '../../constants/theme';
import { registerPackage } from '../../api/packageService';
import { getBuildingFlats } from '../../api/userService';

export default function AddPackageScreen() {
  const navigation = useNavigation<any>();
  const [flat, setFlat] = useState('');
  const [courier, setCourier] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = flat.trim() && courier.trim();

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await registerPackage({ flat, courier });
      navigation.navigate('SecurityDashboard');
    } catch (err: any) {
      Alert.alert('Failed', err.message || 'Could not register package');
    } finally {
      setSubmitting(false);
    }
  };
  const [flats, setFlats] = useState<{ flat: string; residentName: string }[]>([]);
  const [showFlatPicker, setShowFlatPicker] = useState(false);

  useEffect(() => {
    getBuildingFlats().then(setFlats).catch(() => {});
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Package</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Flat Number</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowFlatPicker(true)}>
            <Text style={{ color: flat ? colors.text : colors.textMuted, fontSize: 15 }}>
              {flat ? `${flat}${flats.find((f) => f.flat === flat)?.residentName ? ` — ${flats.find((f) => f.flat === flat)?.residentName}` : ''}` : 'Select flat'}
            </Text>
          </TouchableOpacity>

          <Modal visible={showFlatPicker} animationType="slide" transparent onRequestClose={() => setShowFlatPicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Flat</Text>
                  <TouchableOpacity onPress={() => setShowFlatPicker(false)}>
                    <Ionicons name="close" size={22} color={colors.text} />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {flats.map((f) => (
                    <TouchableOpacity
                      key={f.flat}
                      style={styles.flatOption}
                      onPress={() => { setFlat(f.flat); setShowFlatPicker(false); }}
                    >
                      <Text style={styles.flatOptionText}>{f.flat}</Text>
                      <Text style={styles.flatOptionSub}>{f.residentName}</Text>
                    </TouchableOpacity>
                  ))}
                  {flats.length === 0 && <Text style={{ padding: 20, color: colors.textMuted }}>No flats found</Text>}
                </ScrollView>
              </View>
            </View>
          </Modal>

        <Text style={styles.label}>Courier Company</Text>
        <TextInput style={styles.input} placeholder="e.g. Pathao, Daraz, Sundarban" placeholderTextColor={colors.textMuted} value={courier} onChangeText={setCourier} />

        <Text style={styles.label}>Package Photo</Text>
        {photoUri ? (
          <View style={styles.photoPreviewWrap}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.removePhotoButton} onPress={() => setPhotoUri(null)}>
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
            <Ionicons name="camera-outline" size={22} color={colors.textMuted} />
            <Text style={styles.photoPickerText}>Take Package Photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.submitButton, (!canSubmit || submitting) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Register Package</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md,
  },
  backButton: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },

  form: { paddingHorizontal: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: spacing.md },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, fontSize: 15, backgroundColor: colors.card, color: colors.text },

  photoPicker: {
    borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radius.md,
    paddingVertical: spacing.lg, alignItems: 'center', gap: 6, backgroundColor: colors.card,
  },
  photoPickerText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  photoPreviewWrap: { position: 'relative', alignSelf: 'flex-start' },
  photoPreview: { width: 100, height: 100, borderRadius: radius.md },
  removePhotoButton: {
    position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: radius.full,
    backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center',
  },

  submitButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.background, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  flatOption: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  flatOptionText: { fontSize: 15, fontWeight: '600', color: colors.text },
  flatOptionSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  });