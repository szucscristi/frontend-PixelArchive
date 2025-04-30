// src/services/api.js
import axios from 'axios';

const api = axios.create({
  // pune aici URL-ul complet cu /api
  baseURL: 'http://localhost:8081/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
