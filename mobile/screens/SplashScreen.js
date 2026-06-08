import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Auth'), 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rural Health AI</Text>
      <Text style={styles.subtitle}>Smart Disease Prediction for Rural Communities</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1f4b8f' },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: '#d1e8ff', fontSize: 16, textAlign: 'center', paddingHorizontal: 24 }
});
