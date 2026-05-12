import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Agregar token automáticamente a cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMenu = () => API.get('/menu');
export const getTables = () => API.get('/tables');
export const getOrders = () => API.get('/orders');
export const createOrder = (data) => API.post('/orders', data);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}`, { status });
export const login = (data) => API.post('/auth/login', data);