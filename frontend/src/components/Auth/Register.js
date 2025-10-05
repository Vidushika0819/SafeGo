import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role is required';
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
      const { confirmPassword, ...submitData } = formData;

      const response = await axios.post('http://localhost:5005/api/auth/register', submitData);

      if (response.data.success) {
        setSuccessMessage('Registration successful! You can now login.');
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          role: 'admin'
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>User Registration</h2>

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

        <div style={{ marginBottom: '15px' }}>
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

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.confirmPassword ? 'red' : '#ccc'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={isLoading}
          />
          {errors.confirmPassword && <span style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '5px' }}>Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.role ? 'red' : '#ccc'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={isLoading}
          >
            <option value="admin">Admin</option>
            <option value="coordinator">Coordinator</option>
            <option value="driver">Driver</option>
          </select>
          {errors.role && <span style={{ color: 'red', fontSize: '12px' }}>{errors.role}</span>}
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
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Register;
