import React, { useState, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const { isAdmin, isCoordinator, isDriver, isParent } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5005/api/auth/login', formData);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setSuccessMessage('Login successful! Redirecting...');

        // Redirect to appropriate dashboard based on role
        const userRole = response.data.user.role;
        let dashboardRoute = '/mainhome'; // default

        if (userRole === 'admin') {
          dashboardRoute = '/admin';
        } else if (userRole === 'coordinator') {
          dashboardRoute = '/coordinator/dashboard';
        } else if (userRole === 'driver') {
          dashboardRoute = '/driver/dashboard'; // assuming this exists
        } else if (userRole === 'parent') {
          dashboardRoute = '/parent/dashboard';
        }

        // Redirect to dashboard after short delay
        setTimeout(() => {
          window.location.href = dashboardRoute;
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>User Login</h2>

      {successMessage && (
        <div style={{ color: 'green', marginBottom: '20px', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.email ? 'red' : '#ccc'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={isLoading}
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.password ? 'red' : '#ccc'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={isLoading}
          />
          {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default Login;
