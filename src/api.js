// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api'
});

// interceptor JWT
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jwt_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Reviews
api.getReviews    = gameId => api.get(`/games/${gameId}/reviews`);
api.postReview    = (gameId, content) => api.post(`/games/${gameId}/reviews`, { content });
api.updateReview  = (reviewId, content) => api.put(`/reviews/${reviewId}`,     { content });
api.deleteReview  = reviewId      => api.delete(`/reviews/${reviewId}`);
api.getMyReviews  = username      => api.get(`/users/${username}/reviews`);
api.getGameDetails = (gameId) => api.get(`/games/${gameId}`);


export default api;
