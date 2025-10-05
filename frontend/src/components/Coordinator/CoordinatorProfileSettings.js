import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CoordinatorProfileSettings = () => {
  const { user, getToken } = useAuth();
  const [profile, setProfile] = useState({
    coordinatorId: '',
    fullName: '',
    phoneNumber: '',
    DOB: '',
    email: '',
    address: '',
    department: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(
        `http://localhost:5005/coordinators/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.coordinator) {
        const coordinator = response.data.coordinator;
        setProfile({
          coordinatorId: coordinator.coordinatorId || '',
          fullName: coordinator.fullName || '',
          phoneNumber: coordinator.phoneNumber || '',
          DOB: coordinator.DOB ? coordinator.DOB.split('T')[0] : '',
          email: coordinator.email || '',
          address: coordinator.address || '',
          department: coordinator.department || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profile.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (profile.phoneNumber && !/^\+?[\d\s-()]+$/.test(profile.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setMessage('');

    try {
      const token = getToken();
      const updateData = {
        fullName: profile.fullName.trim(),
        phoneNumber: profile.phoneNumber.trim(),
        DOB: profile.DOB,
        email: profile.email.trim(),
        address: profile.address.trim(),
        department: profile.department.trim()
      };

      await axios.put(
        `http://localhost:5005/coordinators/profile`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        fontSize: '16px',
        color: '#6c757d'
      }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          margin: '0 0 0.5rem 0',
          color: '#343a40',
          fontSize: '2rem'
        }}>
          Profile Settings
        </h1>
        <p style={{
          margin: 0,
          color: '#6c757d',
          fontSize: '1.1rem'
        }}>
          Manage your coordinator profile information
        </p>
      </div>

      {/* Profile Form */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
            color: message.includes('successfully') ? '#155724' : '#721c24',
            border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Coordinator ID (Read-only) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#343a40'
            }}>
              Coordinator ID
            </label>
            <input
              type="text"
              value={profile.coordinatorId}
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: '#e9ecef',
                color: '#6c757d'
              }}
            />
            <small style={{ color: '#6c757d', fontSize: '0.875rem' }}>
              This field cannot be modified
            </small>
          </div>

          {/* Full Name */}
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
              value={profile.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.fullName ? '#dc3545' : '#ced4da'}`,
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <div style={{
                color: '#dc3545',
                fontSize: '0.875rem',
                marginTop: '0.25rem'
              }}>
                {errors.fullName}
              </div>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#343a40'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.email ? '#dc3545' : '#ced4da'}`,
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
              placeholder="Enter your email address"
            />
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

          {/* Phone Number */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#343a40'
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.phoneNumber ? '#dc3545' : '#ced4da'}`,
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && (
              <div style={{
                color: '#dc3545',
                fontSize: '0.875rem',
                marginTop: '0.25rem'
              }}>
                {errors.phoneNumber}
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#343a40'
            }}>
              Date of Birth
            </label>
            <input
              type="date"
              value={profile.DOB}
              onChange={(e) => handleInputChange('DOB', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
            />
          </div>

          {/* Department */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#343a40'
            }}>
              Department
            </label>
            <select
              value={profile.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Select Department</option>
              <option value="Operations">Operations</option>
              <option value="Planning">Planning</option>
              <option value="Safety">Safety</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          {/* Address */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#343a40'
            }}>
              Address
            </label>
            <textarea
              value={profile.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem',
                backgroundColor: 'white',
                resize: 'vertical'
              }}
              placeholder="Enter your address"
            />
          </div>

          {/* Submit Button */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: saving ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '4px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoordinatorProfileSettings;
