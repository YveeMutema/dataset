import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getHistory } from '../services/api';

export default function HistoryScreen({ userToken }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getHistory(userToken);
        setHistory(response.data.history);
      } catch (error) {
        Alert.alert('History error', error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [userToken]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1f4b8f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prediction History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Disease</Text>
            <Text style={styles.value}>{item.disease}</Text>
            <Text style={styles.label}>Confidence</Text>
            <Text style={styles.value}>{item.confidence}%</Text>
            <Text style={styles.label}>Advice</Text>
            <Text style={styles.value}>{item.advice}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No history found. Run a symptom check to begin.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#eef5ff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 18, color: '#1f4b8f' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#d2e0f1' },
  label: { fontSize: 14, color: '#6a7e97', marginTop: 8 },
  value: { fontSize: 16, fontWeight: '600', color: '#10284b' },
  date: { marginTop: 10, fontSize: 12, color: '#77869e' },
  empty: { textAlign: 'center', marginTop: 36, fontSize: 16, color: '#5a6d86' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
