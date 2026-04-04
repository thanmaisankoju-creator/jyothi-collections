// frontend/src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jc_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Products ──────────────────────────────────────────────
export const fetchProducts  = (params = {}) => api.get('/products', { params });
export const fetchProduct   = (id)          => api.get(`/products/${id}`);
export const fetchCategories= ()            => api.get('/products/categories');
export const createProduct  = (data)        => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct  = (id, data)    => api.put(`/products/${id}`, data);
export const deleteProduct  = (id)          => api.delete(`/products/${id}`);

// ── Reviews ───────────────────────────────────────────────
export const postReview     = (data)        => api.post('/reviews', data);
export const fetchReviews   = (productId)   => api.get(`/reviews/${productId}`);

// ── Orders ────────────────────────────────────────────────
export const placeOrder     = (data)        => api.post('/orders', data);
export const fetchOrders    = (params = {}) => api.get('/orders', { params });
export const updateStatus   = (id, status)  => api.patch(`/orders/${id}/status`, { status });

// ── Admin ─────────────────────────────────────────────────
export const adminLogin     = (data)        => api.post('/admin/login', data);
export const getDashboard   = ()            => api.get('/admin/dashboard');

// ── Payments ──────────────────────────────────────────────
export const createRazorpayOrder = (orderId) => api.post('/payments/create-order', { orderId });
export const verifyPayment       = (data)    => api.post('/payments/verify', data);

export default api;
