import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function ResultScreen({ route, navigation }) {
  const { result } = route.params || {};
  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No prediction available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Prediction Result</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Disease</Text>
        <Text style={styles.value}>{result.disease}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Confidence</Text>
        <Text style={styles.value}>{result.confidence}%</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Risk Level</Text>
        <Text style={styles.value}>{result.risk}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Advice</Text>
        <Text style={styles.value}>{result.advice}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Reasoning</Text>
        <Text style={styles.value}>{result.explanation}</Text>
      </View>
      <Text style={styles.section}>Top 3 predictions</Text>
      {result.topPredictions?.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.rowText}>{item.disease}</Text>
          <Text style={styles.rowText}>{item.confidence}%</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HealthAdvice', { advice: result.advice, risk: result.risk })}>
        <Text style={styles.buttonText}>View Health Advice</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.linkText}>Return Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef5ff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1f4b8f', marginBottom: 18 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 14, elevation: 2 },
  label: { fontSize: 14, color: '#6b7c93', marginBottom: 6 },
  value: { fontSize: 18, fontWeight: '600', color: '#112d4e' },
  section: { fontSize: 18, fontWeight: '700', color: '#1f4b8f', marginTop: 8, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#d9e2ef' },
  rowText: { fontSize: 16, color: '#1a3349' },
  button: { backgroundColor: '#1f4b8f', padding: 16, borderRadius: 14, marginTop: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 14, alignItems: 'center' },
  linkText: { color: '#1f4b8f', fontWeight: '600' },
  message: { flex: 1, textAlign: 'center', marginTop: 32, fontSize: 18, color: '#4b5f78' }
});
