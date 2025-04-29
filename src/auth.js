// src/services/auth.js
import axios from 'axios';

const TOKEN_KEY = 'jwt_token';
const USERNAME_KEY = 'username';

export function login(username, password) {
  return axios.post('/api/auth/login', { username, password })
    .then(res => {
      const token = res.data.token;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USERNAME_KEY, username);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    });
}

export function register(username, password) {
    return axios.post('/api/auth/register', { username, password });
  }

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  delete axios.defaults.headers.common.Authorization;
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

// În momentul încărcării aplicației, dacă avem token, setăm header-ul:
const existingToken = localStorage.getItem(TOKEN_KEY);
if (existingToken) {
  axios.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
}
