// src/services/auth.js
import axios from 'axios';

const TOKEN_KEY = 'jwt_token';
const USERNAME_KEY = 'username';
const ROLES_KEY    = 'user_roles';

export function login(username, password) {
  return axios.post('/api/auth/login', { username, password })
    .then(res => {
      const { token, roles } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USERNAME_KEY, username);
      localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    });
}

export function register(username, password) {
    return axios.post('/api/auth/register', { username, password });
  }

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(ROLES_KEY);
  delete axios.defaults.headers.common.Authorization;
}

export function isLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

// Returnează true dacă user-ul are rolul "ROLE_ADMIN"  

export function isAdmin() {
  const roles = JSON.parse(localStorage.getItem(ROLES_KEY) || '[]');
  return roles.includes('ROLE_ADMIN');
}

// În momentul încărcării aplicației, dacă avem token, setăm header-ul:
const existingToken = localStorage.getItem(TOKEN_KEY);
if (existingToken) {
  axios.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
}
