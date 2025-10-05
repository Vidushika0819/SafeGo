import React, { useState } from 'react';
import axios from 'axios';

const ParentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);

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

    // Check email uniqueness for parent registration
    if (name === 'email' && value) {
      checkEmailUniqueness(value);
    }
  };

  const checkEmailUniqueness = async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailAvailable(null);
      return;
    }

    setEmailCheckLoading(true);
    try {
      // Note: This would need a backend endpoint to check email uniqueness
      // For now, we'll assume it's available and handle duplicates in registration
      setEmailAvailable(true);
    } catch (error) {
      console.error('Email check failed:', error);
      setEmailAvailable(null);
    } finally {
      setEmailCheckLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided, validate format)
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '#6c757d' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score < 3) return { level: 1, text: 'Weak', color: '#dc3545' };
    if (score < 4) return { level: 2, text: 'Fair', color: '#ffc107' };
    if (score < 5) return { level: 3, text: 'Good', color: '#28a745' };
    return { level: 4, text: 'Strong', color: '#20c997' };
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
      const { confirmPassword, acceptTerms, ...submitData } = formData;

      const response = await axios.post('http://localhost:5005/api/auth/parent/register', submitData);

      if (response.data.success) {
        setSuccessMessage('Parent registration successful! Welcome to SafeGo. You can now login to access your parent dashboard.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false
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

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Join SafeGo as a Parent</h2>
        <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
          Create your account to manage your children's school transportation
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
        {/* Full Name */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.name ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
          {errors.name && (
            <span style={{
              color: '#e74c3c',
              fontSize: '12px',
              marginTop: '4px',
              display: 'block'
            }}>
              {errors.name}
            </span>
          )}
        </div>

        {/* Email */}
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
          <div style={{ position: 'relative' }}>
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
                paddingRight: emailCheckLoading ? '50px' : '12px',
                border: `2px solid ${errors.email ? '#e74c3c' : '#ecf0f1'}`,
                borderRadius: '6px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              disabled={isLoading}
            />
            {emailCheckLoading && (
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '14px',
                color: '#7f8c8d'
              }}>
                Checking...
              </div>
            )}
          </div>
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

        {/* Phone (Optional) */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="phone" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.phone ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
          {errors.phone && (
            <span style={{
              color: '#e74c3c',
              fontSize: '12px',
              marginTop: '4px',
              display: 'block'
            }}>
              {errors.phone}
            </span>
          )}
        </div>

        {/* Password */}
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
            placeholder="Create a strong password"
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
          {formData.password && (
            <div style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                flex: 1,
                height: '6px',
                backgroundColor: '#ecf0f1',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(passwordStrength.level / 4) * 100}%`,
                  height: '100%',
                  backgroundColor: passwordStrength.color,
                  transition: 'width 0.3s ease, background-color 0.3s ease'
                }} />
              </div>
              <span style={{
                fontSize: '12px',
                color: passwordStrength.color,
                fontWeight: 'bold'
              }}>
                {passwordStrength.text}
              </span>
            </div>
          )}
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

        {/* Confirm Password */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.confirmPassword ? '#e74c3c' : '#ecf0f1'}`,
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <span style={{
              color: '#e74c3c',
              fontSize: '12px',
              marginTop: '4px',
              display: 'block'
            }}>
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Terms and Conditions */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#2c3e50'
          }}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              style={{
                marginRight: '10px',
                marginTop: '2px',
                transform: 'scale(1.2)'
              }}
              disabled={isLoading}
            />
            <span>
              I agree to the{' '}
              <a
                href="#"
                style={{
                  color: '#3498db',
                  textDecoration: 'none'
                }}
                onClick={(e) => e.preventDefault()}
              >
                Terms of Service
              </a>
              {' '}and{' '}
              <a
                href="#"
                style={{
                  color: '#3498db',
                  textDecoration: 'none'
                }}
                onClick={(e) => e.preventDefault()}
              >
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.acceptTerms && (
            <span style={{
              color: '#e74c3c',
              fontSize: '12px',
              marginTop: '4px',
              display: 'block',
              marginLeft: '28px'
            }}>
              {errors.acceptTerms}
            </span>
          )}
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
            transition: 'background-color 0.3s ease'
          }}
        >
          {isLoading ? 'Creating Account...' : 'Create Parent Account'}
        </button>
      </form>

      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid #ecf0f1'
      }}>
        <p style={{ margin: '0 0 10px 0', color: '#7f8c8d' }}>
          Already have an account?
        </p>
        <a
          href="/parent/login"
          style={{
            color: '#3498db',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          Sign in to your Parent Account
        </a>
      </div>
    </div>
  );
};

export default ParentRegister;
