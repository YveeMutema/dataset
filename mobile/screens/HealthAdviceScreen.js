import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HealthAdviceScreen({ route, navigation }) {
  const { advice, risk } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Advice</Text>
      <Text style={styles.risk}>Risk Level: {risk || 'Unknown'}</Text>
      <View style={styles.card}>
        <Text style={styles.advice}>{advice || 'No advice available.'}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f7fbff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f4b8f', marginBottom: 12 },
  risk: { fontSize: 16, color: '#3c4f6b', marginBottom: 18 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 22, elevation: 3, marginBottom: 24 },
  advice: { fontSize: 18, color: '#12233f' },
  button: { backgroundColor: '#1f4b8f', borderRadius: 14, padding: 16, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' }
});
