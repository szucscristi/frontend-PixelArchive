// src/api.js
import axios from 'axios';

// Instanța principală pentru API-ul vostru (JWT, etc.)
const api = axios.create({
  baseURL: 'http://localhost:8081/api'
});

// Interceptor JWT: adaugă token doar dacă nu e cerere către AI
api.interceptors.request.use(config => {
  if (!config.url?.includes('/ai/ask')) {
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// auth
export async function register(username, password, displayName) {
  return api.post('/auth/register', { username, password, displayName });
}

export async function login(username, password) {
  return api.post('/auth/login', { username, password });
}

// Instanță separată fără interceptor, pentru AI
const aiClient = axios.create()

// Wrapper pentru endpoint-ul AI
api.askAI = (message) => {
  return aiClient.post('http://localhost:8081/api/ai/ask', { message })
}

// Reviews
api.getReviews     = gameId => api.get(`/games/${gameId}/reviews`)
api.postReview     = (gameId, content) => api.post(`/games/${gameId}/reviews`, { content })
api.updateReview   = (reviewId, content) => api.put(`/reviews/${reviewId}`,     { content })
api.deleteReview   = reviewId      => api.delete(`/reviews/${reviewId}`)
api.getMyReviews   = username      => api.get(`/users/${username}/reviews`)

// Game details (reuse)
api.getGameDetails = gameId        => api.get(`/games/${gameId}`)

export default api
