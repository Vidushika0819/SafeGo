import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CoordinatorDashboard.css';

const CoordinatorDashboard = () => {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    totalChildren: 0,
    totalParents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = getToken();
      // You can add API calls here to fetch coordinator-specific stats
      // For now, we'll use placeholder data
      setStats({
        totalTrips: 12,
        activeTrips: 5,
        totalChildren: 89,
        totalParents: 67
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
    navigate('/coordinator/profile');
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="coordinator-dashboard">
      {/* Modern Navbar */}
      <nav className="dashboard-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>🚍 SafeGo Coordinator</h2>
          </div>

          <div className="nav-menu">
            <button
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('dashboard')}
            >
              <span className="tab-icon">📊</span>
              <span className="tab-text">Dashboard</span>
            </button>

            <button
              className={`nav-tab ${activeTab === 'trips' ? 'active' : ''}`}
              onClick={() => handleTabChange('trips')}
            >
              <span className="tab-icon">🚌</span>
              <span className="tab-text">Trips</span>
            </button>

            <button
              className={`nav-tab ${activeTab === 'passengers' ? 'active' : ''}`}
              onClick={() => handleTabChange('passengers')}
            >
              <span className="tab-icon">👨‍👩‍👧‍👦</span>
              <span className="tab-text">Passengers</span>
            </button>

            <button
              className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => handleTabChange('reports')}
            >
              <span className="tab-icon">📈</span>
              <span className="tab-text">Reports</span>
            </button>

            {/* Dropdown Menu */}
            <div className="dropdown-container">
              <button
                className="dropdown-toggle"
                onClick={toggleDropdown}
              >
                <span className="tab-icon">⚙️</span>
                <span className="tab-text">More</span>
                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={navigateToProfileSettings}
                  >
                    👤 Profile Settings
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleTabChange('settings')}
                  >
                    🔧 Preferences
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleTabChange('help')}
                  >
                    ❓ Help & Support
                  </button>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Content Container */}
      <div className="tab-content-container">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content dashboard-tab">
            <div className="welcome-section">
              <h1>Welcome back, {user?.email?.split('@')[0] || 'Coordinator'}! 👋</h1>
              <p>Here's your trip coordination overview for today</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">🚌</div>
                <div className="stat-content">
                  <h3>{stats.totalTrips}</h3>
                  <p>Total Trips</p>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>{stats.activeTrips}</h3>
                  <p>Active Trips</p>
                </div>
              </div>

              <div className="stat-card warning">
                <div className="stat-icon">👶</div>
                <div className="stat-content">
                  <h3>{stats.totalChildren}</h3>
                  <p>Total Children</p>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-icon">👨‍👩‍👧‍👦</div>
                <div className="stat-content">
                  <h3>{stats.totalParents}</h3>
                  <p>Total Parents</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-card" onClick={() => handleTabChange('trips')}>
                  <div className="action-icon">➕</div>
                  <h3>Create Trip</h3>
                  <p>Schedule a new bus trip</p>
                </button>

                <button className="action-card" onClick={() => handleTabChange('passengers')}>
                  <div className="action-icon">👤</div>
                  <h3>Manage Passengers</h3>
                  <p>View and update passenger info</p>
                </button>

                <button className="action-card" onClick={() => handleTabChange('reports')}>
                  <div className="action-icon">📊</div>
                  <h3>View Reports</h3>
                  <p>Check trip performance</p>
                </button>

                <button className="action-card" onClick={navigateToProfileSettings}>
                  <div className="action-icon">⚙️</div>
                  <h3>Settings</h3>
                  <p>Update your profile</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🚌</div>
                  <div className="activity-content">
                    <p><strong>Trip #1234</strong> started on time</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p>New passenger registered: <strong>John Doe</strong></p>
                    <span className="activity-time">4 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <p><strong>Trip #1229</strong> completed successfully</p>
                    <span className="activity-time">6 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trips Tab */}
        {activeTab === 'trips' && (
          <div className="tab-content trips-tab">
            <div className="tab-header">
              <h1>Trip Management</h1>
              <button className="btn-primary">+ Create New Trip</button>
            </div>

            <div className="trips-overview">
              <div className="overview-cards">
                <div className="overview-card">
                  <h3>Today's Trips</h3>
                  <p className="overview-number">8</p>
                </div>
                <div className="overview-card">
                  <h3>Completed</h3>
                  <p className="overview-number">5</p>
                </div>
                <div className="overview-card">
                  <h3>Pending</h3>
                  <p className="overview-number">3</p>
                </div>
              </div>
            </div>

            <div className="trips-list">
              <h2>Active Trips</h2>
              <div className="trip-cards">
                <div className="trip-card">
                  <div className="trip-header">
                    <h3>Trip #1234</h3>
                    <span className="trip-status active">Active</span>
                  </div>
                  <div className="trip-details">
                    <p><strong>Route:</strong> Colombo → Kandy</p>
                    <p><strong>Time:</strong> 08:00 AM - 12:00 PM</p>
                    <p><strong>Passengers:</strong> 45/50</p>
                  </div>
                  <div className="trip-actions">
                    <button className="btn-secondary">View Details</button>
                    <button className="btn-primary">Update Status</button>
                  </div>
                </div>

                <div className="trip-card">
                  <div className="trip-header">
                    <h3>Trip #1235</h3>
                    <span className="trip-status scheduled">Scheduled</span>
                  </div>
                  <div className="trip-details">
                    <p><strong>Route:</strong> Colombo → Galle</p>
                    <p><strong>Time:</strong> 02:00 PM - 06:00 PM</p>
                    <p><strong>Passengers:</strong> 32/50</p>
                  </div>
                  <div className="trip-actions">
                    <button className="btn-secondary">View Details</button>
                    <button className="btn-primary">Start Trip</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Passengers Tab */}
        {activeTab === 'passengers' && (
          <div className="tab-content passengers-tab">
            <div className="tab-header">
              <h1>Passenger Management</h1>
              <button className="btn-primary">+ Add Passenger</button>
            </div>

            <div className="passengers-overview">
              <div className="overview-cards">
                <div className="overview-card">
                  <h3>Total Children</h3>
                  <p className="overview-number">{stats.totalChildren}</p>
                </div>
                <div className="overview-card">
                  <h3>Total Parents</h3>
                  <p className="overview-number">{stats.totalParents}</p>
                </div>
                <div className="overview-card">
                  <h3>Active Today</h3>
                  <p className="overview-number">23</p>
                </div>
              </div>
            </div>

            <div className="passengers-list">
              <h2>Recent Passengers</h2>
              <div className="passenger-cards">
                <div className="passenger-card">
                  <div className="passenger-avatar">👦</div>
                  <div className="passenger-info">
                    <h3>John Doe</h3>
                    <p>Age: 8 | Grade: 3</p>
                    <p>Parent: Jane Doe</p>
                  </div>
                  <div className="passenger-status">
                    <span className="status-badge active">Active</span>
                  </div>
                </div>

                <div className="passenger-card">
                  <div className="passenger-avatar">👧</div>
                  <div className="passenger-info">
                    <h3>Sarah Smith</h3>
                    <p>Age: 10 | Grade: 5</p>
                    <p>Parent: Mike Smith</p>
                  </div>
                  <div className="passenger-status">
                    <span className="status-badge active">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="tab-content reports-tab">
            <div className="tab-header">
              <h1>Reports & Analytics</h1>
              <button className="btn-secondary">📥 Export Report</button>
            </div>

            <div className="reports-overview">
              <div className="overview-cards">
                <div className="overview-card">
                  <h3>This Week</h3>
                  <p className="overview-number">67</p>
                  <span className="overview-label">Trips Completed</span>
                </div>
                <div className="overview-card">
                  <h3>On Time</h3>
                  <p className="overview-number">94%</p>
                  <span className="overview-label">Performance Rate</span>
                </div>
                <div className="overview-card">
                  <h3>Avg. Passengers</h3>
                  <p className="overview-number">42</p>
                  <span className="overview-label">Per Trip</span>
                </div>
              </div>
            </div>

            <div className="reports-charts">
              <h2>Performance Overview</h2>
              <div className="chart-placeholder">
                <div className="chart-icon">📊</div>
                <p>Interactive charts and analytics will be displayed here</p>
                <p>Showing trip performance, passenger trends, and system metrics</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content settings-tab">
            <div className="tab-header">
              <h1>Dashboard Preferences</h1>
            </div>

            <div className="settings-section">
              <h2>Notification Settings</h2>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  Email notifications for trip updates
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  SMS alerts for urgent issues
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h2>Display Preferences</h2>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  Show passenger photos
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" />
                  Dark mode (coming soon)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Help Tab */}
        {activeTab === 'help' && (
          <div className="tab-content help-tab">
            <div className="tab-header">
              <h1>Help & Support</h1>
            </div>

            <div className="help-section">
              <h2>Quick Start Guide</h2>
              <div className="help-item">
                <h3>🚀 Getting Started</h3>
                <p>Use the navigation tabs to switch between different sections of your dashboard.</p>
              </div>
              <div className="help-item">
                <h3>🚌 Managing Trips</h3>
                <p>Go to the Trips tab to view, create, and update trip information.</p>
              </div>
              <div className="help-item">
                <h3>👥 Passenger Management</h3>
                <p>Use the Passengers tab to view and manage passenger information.</p>
              </div>
            </div>

            <div className="help-section">
              <h2>Contact Support</h2>
              <p>If you need assistance, please contact:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> support@safego.com</p>
                <p><strong>Phone:</strong> +94 11 123 4567</p>
                <p><strong>Hours:</strong> Mon-Fri 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
