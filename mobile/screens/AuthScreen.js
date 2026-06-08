import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { login, register } from '../services/api';

export default function AuthScreen({ navigation, setUserToken }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const payload = { email, password, name };
      console.log('Auth submit', { mode, email, password: password ? '***' : '' });
      const response = mode === 'login' ? await login({ email, password }) : await register(payload);
      console.log('Auth success', response.data);
      setUserToken(response.data.token);
      navigation.replace('Home');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Authentication failed';
      console.log('Auth error', message, error.response?.data);
      setErrorMessage(message);
      Alert.alert('Authentication Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{mode === 'login' ? 'Login' : 'Register'}</Text>
      {mode === 'register' && (
        <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
      )}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{mode === 'login' ? 'Login' : 'Create Account'}</Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity onPress={() => {
        setMode(mode === 'login' ? 'register' : 'login');
        setErrorMessage('');
      }}>
        <Text style={styles.switchText}>{mode === 'login' ? 'Create a new account' : 'Already have an account?'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#edf4ff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#1f4b8f' },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#cfd8e8' },
  button: { backgroundColor: '#1f4b8f', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchText: { color: '#1f4b8f', textAlign: 'center', marginTop: 18 },
  errorText: { color: '#d93025', textAlign: 'center', marginTop: 12, fontSize: 14 }
});
