import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('banking_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('banking_token');
      localStorage.removeItem('banking_user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: (email, password, role) => api.post('/auth/login', { email, password, role }),
  register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const transactionAPI = {
  getHistory: (limit = 50) => api.get(`/transactions/history?limit=${limit}`),
  getBalance: () => api.get('/transactions/balance'),
  getStats: () => api.get('/transactions/stats'),
  deposit: (amount) => api.post('/transactions/deposit', { amount }),
  withdraw: (amount) => api.post('/transactions/withdraw', { amount }),
};

export const bankerAPI = {
  getDashboard: () => api.get('/banker/dashboard'),
  getAllCustomers: () => api.get('/banker/customers'),
  searchCustomers: (query) => api.get(`/banker/customers/search?query=${encodeURIComponent(query)}`),
  getCustomerDetails: (customerId) => api.get(`/banker/customers/${customerId}`),
  getCustomerTransactions: (customerId, limit = 50) => api.get(`/banker/customers/${customerId}/transactions?limit=${limit}`),
};

export default api;
