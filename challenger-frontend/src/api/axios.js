import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Antes de cada petición, agrega el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('challenger_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token venció, manda al login automáticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('challenger_token');
      localStorage.removeItem('challenger_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;