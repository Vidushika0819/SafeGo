import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

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
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);

        // Set default authorization header for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5005/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;

        // Store in localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update state
        setToken(newToken);
        setUser(userData);

        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setToken(null);
    setUser(null);

    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];

    // Redirect to login page
    window.location.href = '/login';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user has admin role
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user has coordinator role
  const isCoordinator = () => {
    return hasRole('coordinator');
  };

  // Check if user has driver role
  const isDriver = () => {
    return hasRole('driver');
  };

  // Check if user has parent role
  const isParent = () => {
    return hasRole('parent');
  };

  // Get user display name
  const getUserDisplayName = () => {
    return user ? user.email : '';
  };

  // Get current token
  const getToken = () => {
    return token;
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    isAdmin,
    isCoordinator,
    isDriver,
    isParent,
    getUserDisplayName,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
