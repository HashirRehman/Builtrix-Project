import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  // Login user
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      return { user, token };
    }
    
    throw new Error(response.data.message || 'Login failed');
  },

  // Register user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.success) {
      const { user, token } = response.data.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      return { user, token };
    }
    
    throw new Error(response.data.message || 'Registration failed');
  },

  // Get user profile
  async getProfile() {
    const response = await api.get('/auth/profile');
    
    if (response.data.success) {
      const user = response.data.data;
      localStorage.setItem('user_data', JSON.stringify(user));
      return user;
    }
    
    throw new Error(response.data.message || 'Failed to get profile');
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    // Always clean local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Get stored user data
  getUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Remove token and user data
  removeToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;
