import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function SymptomCheckbox({ label, value, onToggle }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onToggle}>
      <View style={[styles.box, value && styles.boxSelected]}>{value && <Text style={styles.checkmark}>✓</Text>}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  box: { width: 26, height: 26, borderRadius: 6, borderWidth: 1, borderColor: '#1f4b8f', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  boxSelected: { backgroundColor: '#1f4b8f' },
  checkmark: { color: '#fff', fontWeight: 'bold' },
  label: { fontSize: 16, color: '#1f4b8f' }
});
