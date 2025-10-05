import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const OperationalDashboard = () => {
  const { user, getUserDisplayName } = useAuth();
  const [stats, setStats] = useState({
    activeTrips: 0,
    completedTrips: 0,
    totalBuses: 0,
    availableBuses: 0
  });
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    licenseNumber: '',
    phoneNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    age: '',
    experienceYears: '',
    email: '',
    address: '',
    password: ''
  });

  useEffect(() => {
    // In a real implementation, this would fetch operational data
    // For now, we'll show placeholder data
    setStats({
      activeTrips: 3,
      completedTrips: 12,
      totalBuses: 8,
      availableBuses: 5
    });

    // Load driver profile data if user is a driver
    if (user?.role === 'driver' && user?.id) {
      loadDriverProfile();
    }
  }, [user]);

  const loadDriverProfile = async () => {
    try {
      // Find driver by email since user.id and driver._id might be different
      const response = await axios.get(`http://localhost:5005/drivers/email/${user.email}`);
      setProfileData(response.data.driver);
    } catch (error) {
      console.error('Error loading driver profile:', error);
      // If no driver profile exists, show empty form for creation
      console.log('No driver profile found, showing empty form for profile creation');
    }
  };

  const handleProfileChange = (e) => {
    setProfileData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // First find the driver by email to get the driver ID
      const driverResponse = await axios.get(`http://localhost:5005/drivers/email/${user.email}`);
      const driverId = driverResponse.data.driver._id;

      // Then update using the driver ID
      await axios.put(`http://localhost:5005/drivers/${driverId}`, {
        name: String(profileData.name),
        licenseNumber: String(profileData.licenseNumber),
        phoneNumber: String(profileData.phoneNumber),
        vehicleType: String(profileData.vehicleType),
        vehicleNumber: String(profileData.vehicleNumber),
        age: Number(profileData.age),
        experienceYears: Number(profileData.experienceYears),
        email: String(profileData.email),
        address: String(profileData.address),
        password: String(profileData.password)
      });
      alert('Profile updated successfully!');
      setShowProfileSettings(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + (error.response?.data?.message || error.message));
    }
  };

  const isCoordinator = user?.role === 'coordinator';
  const isDriver = user?.role === 'driver';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1 style={{
          margin: '0 0 10px 0',
          color: '#2c3e50',
          fontSize: '28px'
        }}>
          {isCoordinator ? '🚌 Coordinator' : '🚐 Driver'} Dashboard
        </h1>
        <p style={{
          margin: 0,
          color: '#7f8c8d',
          fontSize: '16px'
        }}>
          Welcome back, {getUserDisplayName()}! Here's your operational overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚌</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
            {stats.activeTrips}
          </div>
          <div style={{ color: '#7f8c8d' }}>Active Trips</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
            {stats.completedTrips}
          </div>
          <div style={{ color: '#7f8c8d' }}>Completed Today</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚐</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
            {stats.availableBuses}
          </div>
          <div style={{ color: '#7f8c8d' }}>Available Buses</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>
            {stats.totalBuses}
          </div>
          <div style={{ color: '#7f8c8d' }}>Total Fleet</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        {/* Main Content */}
        <div>
          {/* Current Assignments */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
              {isCoordinator ? 'Assigned Routes' : 'Your Assignments'}
            </h3>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '6px',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📋</div>
              <p>Assignment details will be displayed here</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                This feature will be implemented in the operational dashboard
              </p>
            </div>
          </div>

          {/* Profile Settings - Only for Drivers */}
          {isDriver && showProfileSettings && (
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginTop: 0, color: '#2c3e50' }}>👤 Profile Settings</h3>
              <form onSubmit={handleProfileSubmit} style={{ maxWidth: '600px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Name:</label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleProfileChange}
                      value={profileData.name}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>License Number:</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      onChange={handleProfileChange}
                      value={profileData.licenseNumber}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Phone Number:</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      onChange={handleProfileChange}
                      value={profileData.phoneNumber}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Email:</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleProfileChange}
                      value={profileData.email}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Vehicle Type:</label>
                    <input
                      type="text"
                      name="vehicleType"
                      onChange={handleProfileChange}
                      value={profileData.vehicleType}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Vehicle Number:</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      onChange={handleProfileChange}
                      value={profileData.vehicleNumber}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Age:</label>
                    <input
                      type="number"
                      name="age"
                      onChange={handleProfileChange}
                      value={profileData.age}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Years of Experience:</label>
                    <input
                      type="number"
                      name="experienceYears"
                      onChange={handleProfileChange}
                      value={profileData.experienceYears}
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Address:</label>
                  <input
                    type="text"
                    name="address"
                    onChange={handleProfileChange}
                    value={profileData.address}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Password:</label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleProfileChange}
                    value={profileData.password}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    💾 Update Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProfileSettings(false)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Recent Activity */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Recent Activity</h3>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '6px',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📈</div>
              <p>Activity log will be displayed here</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Trip updates, status changes, and communications
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h4 style={{ marginTop: 0, color: '#2c3e50' }}>Quick Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{
                padding: '10px 15px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                📍 Update Location
              </button>
              <button style={{
                padding: '10px 15px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                🚨 Report Issue
              </button>
              <button style={{
                padding: '10px 15px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                📞 Contact Support
              </button>
              {isDriver && (
                <button
                  onClick={() => setShowProfileSettings(!showProfileSettings)}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: showProfileSettings ? '#6c757d' : '#9b59b6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {showProfileSettings ? '👤 Hide Profile' : '👤 Profile Settings'}
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h4 style={{ marginTop: 0, color: '#2c3e50' }}>Current Status</h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              backgroundColor: '#d4edda',
              borderRadius: '6px',
              border: '1px solid #c3e6cb'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#28a745'
              }}></div>
              <span style={{ color: '#155724', fontWeight: 'bold' }}>
                On Duty
              </span>
            </div>
          </div>

          {/* Schedule */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ marginTop: 0, color: '#2c3e50' }}>Today's Schedule</h4>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '6px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Next Trip:</strong> 2:00 PM - Route 5
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Bus:</strong> BUS-001
              </div>
              <div>
                <strong>Status:</strong> <span style={{ color: '#27ae60' }}>On Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalDashboard;
