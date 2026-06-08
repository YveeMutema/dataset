import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { predict } from '../services/api';

export default function SymptomCheckerScreen({ navigation, userToken }) {
  const [customSymptom, setCustomSymptom] = useState('');
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);

  const addCustomSymptom = () => {
    const trimmed = customSymptom.trim();
    if (!trimmed) {
      Alert.alert('Validation', 'Please enter a symptom.');
      return;
    }
    if (customSymptoms.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setCustomSymptom('');
      return;
    }
    setCustomSymptoms((prev) => [...prev, trimmed]);
    setCustomSymptom('');
  };

  const removeCustomSymptom = (symptom) => {
    setCustomSymptoms((prev) => prev.filter((item) => item !== symptom));
  };

  const handleSubmit = async () => {
    if (customSymptoms.length === 0) {
      Alert.alert('Validation', 'Please add at least one symptom before requesting a prediction.');
      return;
    }

    setLoading(true);
    try {
      const result = await predict({ symptoms: {}, customSymptoms }, userToken);
      navigation.navigate('Result', { result: result.data });
    } catch (error) {
      Alert.alert('Prediction Error', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter your symptoms</Text>
      <Text style={styles.instructions}>Describe each symptom you have and add it to the list.</Text>
      <View style={styles.customInputRow}>
        <TextInput
          style={styles.customInput}
          placeholder="e.g. severe headache"
          value={customSymptom}
          onChangeText={setCustomSymptom}
          onSubmitEditing={addCustomSymptom}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addCustomSymptom}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {customSymptoms.length > 0 && (
        <ScrollView style={styles.customList}>
          {customSymptoms.map((item) => (
            <View key={item} style={styles.customItem}>
              <Text style={styles.customItemText}>{item}</Text>
              <TouchableOpacity onPress={() => removeCustomSymptom(item)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Get Prediction'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fbff', padding: 24 },
  heading: { fontSize: 22, fontWeight: '700', color: '#1f4b8f', marginBottom: 8 },
  instructions: { fontSize: 14, color: '#556a8a', marginBottom: 18 },
  customInputRow: { flexDirection: 'row', marginBottom: 16 },
  customInput: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#d7e0f2', marginRight: 10 },
  addButton: { backgroundColor: '#1f4b8f', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 18, justifyContent: 'center' },
  addButtonText: { color: '#fff', fontWeight: '700' },
  customList: { flex: 1, marginBottom: 24 },
  customItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#e9eefc', borderRadius: 12, marginBottom: 10 },
  customItemText: { color: '#1f4b8f' },
  removeText: { color: '#d93025', fontWeight: '600' },
  button: { backgroundColor: '#1f4b8f', padding: 16, borderRadius: 14, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#7091c3' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});
