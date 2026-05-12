import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const getMenu = () => API.get('/menu');
export const getTables = () => API.get('/tables');
export const getOrders = () => API.get('/orders');
export const createOrder = (data) => API.post('/orders', data);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}`, { status });