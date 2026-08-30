import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, radius } from '../constants/theme';

interface DateFieldProps {
  value: string; // "DD/MM/YYYY" ফরম্যাটে থাকবে
  onChange: (value: string) => void;
  placeholder?: string;
  minimumDate?: Date;
}

function formatDate(date: Date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function parseDate(value: string): Date {
  const [dd, mm, yyyy] = value.split('/').map(Number);
  if (dd && mm && yyyy) return new Date(yyyy, mm - 1, dd);
  return new Date();
}

export default function DateField({ value, onChange, placeholder = 'DD/MM/YYYY', minimumDate }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // iOS এ picker inline থাকে, Android এ বন্ধ হয়ে যায় select করলে
    if (event.type === 'dismissed') return;
    if (selectedDate) {
      onChange(formatDate(selectedDate));
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.inputContainer} onPress={() => setShowPicker(true)}>
        <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
        <Text style={[styles.text, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value ? parseDate(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 52, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, gap: 10,
  },
  text: { fontSize: 15, color: colors.text },
  placeholderText: { color: colors.textMuted },
});