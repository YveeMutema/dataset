import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:5000/api`;
  }

  return 'http://10.0.2.2:5000/api';
};

const BASE_URL = getBaseUrl();
const authHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const register = (data) => axios.post(`${BASE_URL}/auth/register`, data);
export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data);
export const predict = (data, token) => axios.post(`${BASE_URL}/predict`, data, authHeaders(token));
export const getHistory = (token) => axios.get(`${BASE_URL}/history`, authHeaders(token));
export const getStats = (token) => axios.get(`${BASE_URL}/stats`, authHeaders(token));
