import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = ({ user, onSave, onCancel, isAdmin, getToken }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'driver'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const isEditing = !!user;

  // Initialize form data when editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'driver'
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Check email uniqueness for new users
    if (field === 'email' && !isEditing && value) {
      checkEmailUniqueness(value);
    }
  };

  const checkEmailUniqueness = async (email) => {
    if (!email || email === user?.email) {
      setEmailAvailable(null);
      return;
    }

    setEmailCheckLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(
        `http://localhost:5005/api/admin/users/check-email?email=${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmailAvailable(response.data.available);
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
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!isEditing && emailAvailable === false) {
      newErrors.email = 'This email is already in use';
    }

    // Password validation (only for new users)
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Role validation
    const validRoles = ['admin', 'coordinator', 'driver'];
    if (!validRoles.includes(formData.role)) {
      newErrors.role = 'Please select a valid role';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token = getToken();

      if (!token) {
        setErrors({ submit: 'Authentication token not found. Please log in again.' });
        return;
      }

      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role
      };

      // Only include password for new users
      if (!isEditing) {
        submitData.password = formData.password;
      }

      let response;
      if (isEditing) {
        response = await axios.put(
          `http://localhost:5005/api/admin/users/${user._id}`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          'http://localhost:5005/api/admin/users',
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      onSave(response.data);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Form submission failed:', error);

      if (error.response?.status === 401) {
        setErrors({ submit: 'Authentication failed. Please log in again as an admin.' });
      } else if (error.response?.status === 403) {
        setErrors({ submit: 'Access denied. Admin privileges required.' });
      } else if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else if (error.response?.data?.errors) {
        setErrors({ submit: error.response.data.errors.join(', ') });
      } else {
        setErrors({ submit: `Failed to save user: ${error.message}` });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        {/* Name Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#343a40'
          }}>
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.name ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
            placeholder="Enter full name"
          />
          {errors.name && (
            <div style={{
              color: '#dc3545',
              fontSize: '0.875rem',
              marginTop: '0.25rem'
            }}>
              {errors.name}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#343a40'
          }}>
            Email Address *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.email ? '#dc3545' : '#ced4da'}`,
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
              placeholder="Enter email address"
            />
            {emailCheckLoading && (
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.875rem',
                color: '#6c757d'
              }}>
                Checking...
              </div>
            )}
            {!isEditing && emailAvailable !== null && !emailCheckLoading && (
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.875rem',
                color: emailAvailable ? '#28a745' : '#dc3545'
              }}>
                {emailAvailable ? '✓ Available' : '✗ Taken'}
              </div>
            )}
          </div>
          {errors.email && (
            <div style={{
              color: '#dc3545',
              fontSize: '0.875rem',
              marginTop: '0.25rem'
            }}>
              {errors.email}
            </div>
          )}
        </div>

        {/* Password Fields (only for new users) */}
        {!isEditing && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#343a40'
              }}>
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.password ? '#dc3545' : '#ced4da'}`,
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
                placeholder="Enter password"
              />
              {formData.password && (
                <div style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(passwordStrength.level / 4) * 100}%`,
                      height: '100%',
                      backgroundColor: passwordStrength.color,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: passwordStrength.color,
                    fontWeight: 'bold'
                  }}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
              {errors.password && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem'
                }}>
                  {errors.password}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 'bold',
                color: '#343a40'
              }}>
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.confirmPassword ? '#dc3545' : '#ced4da'}`,
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem'
                }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </>
        )}

        {/* Role Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#343a40'
          }}>
            User Role *
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.role ? '#dc3545' : '#ced4da'}`,
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="driver">Driver</option>
            <option value="coordinator">Coordinator</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <div style={{
              color: '#dc3545',
              fontSize: '0.875rem',
              marginTop: '0.25rem'
            }}>
              {errors.role}
            </div>
          )}
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#6c757d'
          }}>
            {formData.role === 'admin' && 'Full system access and user management'}
            {formData.role === 'coordinator' && 'Trip coordination and passenger management'}
            {formData.role === 'driver' && 'Trip execution and basic reporting'}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            {errors.submit}
          </div>
        )}

        {/* Form Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginTop: 0, color: '#343a40' }}>
              Confirm {isEditing ? 'Update' : 'Create'} User
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
              Are you sure you want to {isEditing ? 'update' : 'create'} this user?
              {!isEditing && ' They will receive login credentials via email.'}
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowConfirmDialog(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserForm;
