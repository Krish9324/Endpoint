import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('banking_token'));

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('banking_token');
      const savedUser = localStorage.getItem('banking_user');
      
      if (savedToken && savedUser) {
        try {
          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
          // Verify token is still valid by fetching profile
          const response = await api.get('/auth/profile');
          
          if (response.data.success) {
            setUser(response.data.data.user);
            setToken(savedToken);
          } else {
            // Token is invalid, clear storage
            clearAuth();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          clearAuth();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        role
      });

      if (response.data.success) {
        const { user: userData, access_token } = response.data.data;
        
        // Store in state
        setUser(userData);
        setToken(access_token);
        
        // Store in localStorage
        localStorage.setItem('banking_token', access_token);
        localStorage.setItem('banking_user', JSON.stringify(userData));
        
        // Set default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      if (response.data.success) {
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('banking_token');
    localStorage.removeItem('banking_user');
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'customer',
    isBanker: user?.role === 'banker'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
