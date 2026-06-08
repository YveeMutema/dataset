import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, setUserToken }) {
  const handleLogout = () => {
    setUserToken(null);
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rural Health AI</Text>
      <Text style={styles.subtitle}>Enter symptoms to receive a medical prediction and advice.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SymptomChecker')}>
        <Text style={styles.buttonText}>Start Symptom Checker</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('History')}>
        <Text style={styles.buttonSecondaryText}>View History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('ClinicLocator')}>
        <Text style={styles.buttonSecondaryText}>Clinic Locator</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={handleLogout}>
        <Text style={styles.buttonSecondaryText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f2f7ff' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#1f4b8f', marginBottom: 12 },
  subtitle: { color: '#4b5f78', textAlign: 'center', marginBottom: 32, fontSize: 16 },
  button: { width: '100%', backgroundColor: '#1f4b8f', borderRadius: 12, padding: 18, marginBottom: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  buttonSecondary: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#d6e2ff' },
  buttonSecondaryText: { color: '#1f4b8f', fontWeight: '600' }
});
