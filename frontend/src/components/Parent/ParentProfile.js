import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ParentProfile = () => {
  const { user, getUserDisplayName } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    parentId: '',
    fullName: '',
    phoneNumber: '',
    DOB: '',
    email: '',
    address: '',
    password: ''
  });

  useEffect(() => {
    if (user?.role === 'parent' && user?.email) {
      loadParentProfile();
    }
  }, [user]);

  const loadParentProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5005/parents/email/${user.email}`);
      const parent = response.data.parent;
      setFormData({
        parentId: parent.parentId || '',
        fullName: parent.fullName || '',
        phoneNumber: parent.phoneNumber || '',
        DOB: parent.DOB ? new Date(parent.DOB).toISOString().split('T')[0] : '',
        email: parent.email || '',
        address: parent.address || '',
        password: '' // Don't pre-fill password
      });
    } catch (error) {
      console.error('Error loading parent profile:', error);
      // If no profile exists in backend, use data from auth context
      console.log('No parent profile found in backend, using auth context data');
      setFormData({
        parentId: '',
        fullName: user.name || '', // From login response
        phoneNumber: user.phone || '', // From login response
        DOB: '',
        email: user.email || '', // From auth context
        address: '',
        password: '' // Don't pre-fill password
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      parentId: '',
      fullName: '',
      phoneNumber: '',
      DOB: '',
      email: '',
      address: '',
      password: ''
    });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if parent profile exists
      let parentExists = false;
      let parentId = null;

      try {
        const response = await axios.get(`http://localhost:5005/parents/email/${user.email}`);
        parentExists = true;
        parentId = response.data.parent._id;
      } catch (error) {
        if (error.response?.status === 404) {
          parentExists = false;
        } else {
          throw error; // Re-throw other errors
        }
      }

      // Prepare update data (exclude empty password and parentId)
      const updateData = { ...formData };
      delete updateData.parentId; // Don't send parentId in update
      if (!updateData.password) {
        delete updateData.password;
      }

      if (parentExists) {
        // Parent profile exists, update it
        await axios.put(`http://localhost:5005/parents/${parentId}`, updateData);
        alert('Profile updated successfully!');
      } else {
        // Parent profile doesn't exist, create it
        const createData = {
          ...updateData,
          parentId: `P${Date.now()}`, // Generate new parent ID
        };
        await axios.post('http://localhost:5005/parents', createData);
        alert('Profile created successfully!');
      }

      setShowForm(false);
      loadParentProfile(); // Reload the profile
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>👤 Parent Profile</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: showForm ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {showForm ? '❌ Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      {/* Profile Display */}
      {!showForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#3498db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0 auto 15px'
            }}>
              {formData.fullName?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
              {formData.fullName || 'No Name Set'}
            </h3>
            <p style={{ margin: 0, color: '#7f8c8d' }}>
              Parent Account
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #e9ecef',
              gridColumn: 'span 2'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#6c757d',
                marginBottom: '5px',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                Full Name
              </label>
              <div style={{
                fontSize: '16px',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                {formData.fullName || 'Not set'}
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #e9ecef'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#6c757d',
                marginBottom: '5px',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                Phone Number
              </label>
              <div style={{
                fontSize: '16px',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                {formData.phoneNumber || 'Not set'}
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #e9ecef'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#6c757d',
                marginBottom: '5px',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                Date of Birth
              </label>
              <div style={{
                fontSize: '16px',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                {formData.DOB ? new Date(formData.DOB).toLocaleDateString() : 'Not set'}
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #e9ecef',
              gridColumn: 'span 2'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#6c757d',
                marginBottom: '5px',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                Email Address
              </label>
              <div style={{
                fontSize: '16px',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                {formData.email || 'Not set'}
              </div>
            </div>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px',
              border: '1px solid #e9ecef',
              gridColumn: 'span 2'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#6c757d',
                marginBottom: '5px',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                Address
              </label>
              <div style={{
                fontSize: '16px',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                {formData.address || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Form */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50', textAlign: 'center' }}>
            ✏️ Edit Profile
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Full Name:
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Phone Number:
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Date of Birth:
                </label>
                <input
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email Address:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Address:
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  New Password (leave empty to keep current):
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="submit"
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                💾 Update Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  loadParentProfile();
                }}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ParentProfile;
