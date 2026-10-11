import axios from 'axios';
import { storage } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL || '';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

client.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

const normalizeError = (err) => {
  const message =
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    'Request failed';
  const error = new Error(message);
  error.status = err.response?.status;
  error.code = err.response?.data?.code;
  error.details = err.response?.data?.details;
  return error;
};

client.interceptors.response.use(
  (res) => (res.data?.data !== undefined ? res.data.data : res.data),
  (err) => {
    if (err.response?.status === 401) {
      storage.clearToken();
    }
    return Promise.reject(normalizeError(err));
  }
);

export default client;