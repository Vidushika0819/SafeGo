import React, { useState } from 'react';
import axios from 'axios';

const ParentLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      newErrors.email = 'Please enter a valid email address';
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
      const response = await axios.post('http://localhost:5005/api/auth/parent/login', formData);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setSuccessMessage('Login successful! Welcome back to SafeGo.');

        // Redirect to parent dashboard after short delay
        setTimeout(() => {
          window.location.href = '/parent/dashboard';
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Login failed. Please check your credentials and try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
    // TODO: Implement forgot password functionality
    alert('Forgot password functionality will be implemented soon. Please contact support for assistance.');
  };

  if (showForgotPassword) {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Reset Password</h2>
        <p style={{ margin: '0 0 30px 0', color: '#7f8c8d' }}>
          Password reset functionality is coming soon. Please contact SafeGo support for assistance.
        </p>
        <button
          onClick={() => setShowForgotPassword(false)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '450px',
      margin: '50px auto',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Welcome Back to SafeGo</h2>
        <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
          Sign in to manage your children's transportation
        </p>
      </div>

      {successMessage && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.email ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
          {errors.email && (
            <span style={{
              color: '#e74c3c',
              fontSize: '12px',
              marginTop: '4px',
              display: 'block'
            }}>
              {errors.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.password ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
          {errors.password && (
            <span style={{
              color: '#e74c3c',
              fontSize: '12px',
              marginTop: '4px',
              display: 'block'
            }}>
              {errors.password}
            </span>
          )}
        </div>

        {/* Remember Me and Forgot Password */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#2c3e50'
          }}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              style={{
                marginRight: '8px',
                transform: 'scale(1.2)'
              }}
              disabled={isLoading}
            />
            Remember me for 7 days
          </label>

          <button
            type="button"
            onClick={handleForgotPassword}
            style={{
              background: 'none',
              border: 'none',
              color: '#3498db',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: isLoading ? '#95a5a6' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
            marginBottom: '20px'
          }}
        >
          {isLoading ? 'Signing In...' : 'Sign In to SafeGo'}
        </button>
      </form>

      <div style={{
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #ecf0f1'
      }}>
        <p style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>
          New to SafeGo?
        </p>
        <a
          href="/parent/register"
          style={{
            color: '#3498db',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          Create your Parent Account
        </a>
      </div>
    </div>
  );
};

export default ParentLogin;
