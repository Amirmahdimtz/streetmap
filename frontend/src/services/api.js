import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';  // ← این باید 8000 باشد، نه 8004
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// اضافه کردن توکن به هر درخواست
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const profile = {
  save: (data) => api.post('/profile/', data),
  get: () => api.get('/profile/'),
};

export const locations = {
  save: (data) => api.post('/locations/', data),
  getAll: () => api.get('/locations/'),
};

export default api;