import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DriverDashboard = () => {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    activeTrips: 0,
    totalHours: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = getToken();
      // You can add API calls here to fetch driver-specific stats
      // For now, we'll use placeholder data
      setStats({
        totalTrips: 0,
        completedTrips: 0,
        activeTrips: 0,
        totalHours: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const navigateToProfileSettings = () => {
    navigate('/driver/profile');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            margin: '0 0 0.5rem 0',
            color: '#343a40',
            fontSize: '2.5rem'
          }}>
            Driver Dashboard
          </h1>
          <p style={{
            margin: 0,
            color: '#6c757d',
            fontSize: '1.1rem'
          }}>
            Welcome back, {user?.email || 'Driver'}! Manage your trips and vehicle assignments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={navigateToProfileSettings}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ⚙️ Profile Settings
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#343a40',
            fontSize: '1.5rem'
          }}>
            Total Trips
          </h3>
          <p style={{
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#007bff'
          }}>
            {stats.totalTrips}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#343a40',
            fontSize: '1.5rem'
          }}>
            Completed Trips
          </h3>
          <p style={{
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#28a745'
          }}>
            {stats.completedTrips}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#343a40',
            fontSize: '1.5rem'
          }}>
            Active Trips
          </h3>
          <p style={{
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ffc107'
          }}>
            {stats.activeTrips}
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#343a40',
            fontSize: '1.5rem'
          }}>
            Total Hours
          </h3>
          <p style={{
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#6f42c1'
          }}>
            {stats.totalHours}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <h2 style={{
          margin: '0 0 1.5rem 0',
          color: '#343a40',
          fontSize: '1.8rem'
        }}>
          Quick Actions
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <button
            onClick={navigateToProfileSettings}
            style={{
              backgroundColor: '#e9ecef',
              color: '#495057',
              border: 'none',
              padding: '1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.color = '#495057';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>👤</span>
            <div>
              <div style={{ fontWeight: 'bold' }}>Profile Settings</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.25rem' }}>
                Update your personal information
              </div>
            </div>
          </button>

          <button
            style={{
              backgroundColor: '#e9ecef',
              color: '#495057',
              border: 'none',
              padding: '1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#28a745';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.color = '#495057';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🚌</span>
            <div>
              <div style={{ fontWeight: 'bold' }}>My Trips</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.25rem' }}>
                View assigned trips and schedules
              </div>
            </div>
          </button>

          <button
            style={{
              backgroundColor: '#e9ecef',
              color: '#495057',
              border: 'none',
              padding: '1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#ffc107';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.color = '#495057';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🚗</span>
            <div>
              <div style={{ fontWeight: 'bold' }}>Vehicle Info</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.25rem' }}>
                View assigned vehicle details
              </div>
            </div>
          </button>

          <button
            style={{
              backgroundColor: '#e9ecef',
              color: '#495057',
              border: 'none',
              padding: '1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#6f42c1';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.color = '#495057';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <div>
              <div style={{ fontWeight: 'bold' }}>Reports</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'normal', marginTop: '0.25rem' }}>
                View trip reports and earnings
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
