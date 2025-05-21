import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_ALYA_API_URL ?? 'http://localhost:3000',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('alya_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});
