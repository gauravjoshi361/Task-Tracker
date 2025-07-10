import axios from 'axios';

const baseURL = import.meta.env.MODE === 'production'
  ? 'https://task-tracker-bfjm.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;