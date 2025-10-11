import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import AdminStats from './AdminStats';
import UserManagement from './UserManagement/UserManagement';
import TripManagement from './TripManagement/TripManagement';
import BusManagement from './BusManagement/BusManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { isAdmin, logout, getUserDisplayName } = useAuth();
  const [searchParams] = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Verify admin role on component mount
    if (!isAdmin()) {
      // Redirect non-admin users
      window.location.href = '/login';
      return;
    }
    setIsAuthorized(true);

    // Check URL parameters for initial section
    const section = searchParams.get('section');
    if (section && ['dashboard', 'users', 'trips', 'buses', 'reports'].includes(section)) {
      setActiveTab(section);
    }
  }, [isAdmin, searchParams]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
  };

  if (!isAuthorized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verifying admin access...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Modern Navbar */}
      <nav className="dashboard-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>🛠️ SafeGo Admin</h2>
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
              className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => handleTabChange('users')}
            >
              <span className="tab-icon">👥</span>
              <span className="tab-text">Users</span>
            </button>

            <button
              className={`nav-tab ${activeTab === 'trips' ? 'active' : ''}`}
              onClick={() => handleTabChange('trips')}
            >
              <span className="tab-icon">🚌</span>
              <span className="tab-text">Trips</span>
            </button>

            <button
              className={`nav-tab ${activeTab === 'buses' ? 'active' : ''}`}
              onClick={() => handleTabChange('buses')}
            >
              <span className="tab-icon">🚐</span>
              <span className="tab-text">Buses</span>
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
                    onClick={() => handleTabChange('settings')}
                  >
                    🔧 System Settings
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleTabChange('logs')}
                  >
                    📋 Activity Logs
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleTabChange('backup')}
                  >
                    💾 Backup & Restore
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
              <h1>Welcome back, {getUserDisplayName()}! 👋</h1>
              <p>Here's your complete system administration overview</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>247</h3>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-icon">🚌</div>
                <div className="stat-content">
                  <h3>89</h3>
                  <p>Active Trips</p>
                </div>
              </div>

              <div className="stat-card warning">
                <div className="stat-icon">🚐</div>
                <div className="stat-content">
                  <h3>34</h3>
                  <p>Total Buses</p>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h3>94%</h3>
                  <p>On-Time Rate</p>
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="system-overview-section">
              <h2>System Overview</h2>
              <AdminStats />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-card" onClick={() => handleTabChange('users')}>
                  <div className="action-icon">➕</div>
                  <h3>Add User</h3>
                  <p>Create new system users</p>
                </button>

                <button className="action-card" onClick={() => handleTabChange('trips')}>
                  <div className="action-icon">🚌</div>
                  <h3>Manage Trips</h3>
                  <p>View and modify trip schedules</p>
                </button>

                <button className="action-card" onClick={() => handleTabChange('buses')}>
                  <div className="action-icon">🚐</div>
                  <h3>Bus Fleet</h3>
                  <p>Monitor and maintain buses</p>
                </button>

                <button className="action-card" onClick={() => handleTabChange('reports')}>
                  <div className="action-icon">📊</div>
                  <h3>Generate Reports</h3>
                  <p>View system analytics</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-section">
              <h2>Recent System Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <p><strong>New coordinator</strong> registered: Sarah Johnson</p>
                    <span className="activity-time">5 minutes ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🚌</div>
                  <div className="activity-content">
                    <p><strong>Trip #1456</strong> completed successfully</p>
                    <span className="activity-time">12 minutes ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🚐</div>
                  <div className="activity-content">
                    <p><strong>Bus maintenance</strong> scheduled for Bus #23</p>
                    <span className="activity-time">1 hour ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📊</div>
                  <div className="activity-content">
                    <p><strong>Weekly report</strong> generated automatically</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-content users-tab">
            <div className="tab-header">
              <h1>User Management</h1>
              <button className="btn-primary">+ Add New User</button>
            </div>

            <UserManagement />
          </div>
        )}

        {/* Trips Tab */}
        {activeTab === 'trips' && (
          <div className="tab-content trips-tab">
            <div className="tab-header">
              <h1>Trip Management</h1>
              <button className="btn-primary">+ Create New Trip</button>
            </div>

            <TripManagement />
          </div>
        )}

        {/* Buses Tab */}
        {activeTab === 'buses' && (
          <div className="tab-content buses-tab">
            <div className="tab-header">
              <h1>Bus Fleet Management</h1>
              <button className="btn-primary">+ Add New Bus</button>
            </div>

            <BusManagement />
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="tab-content reports-tab">
            <div className="tab-header">
              <h1>System Reports & Analytics</h1>
              <button className="btn-secondary">📥 Export All Reports</button>
            </div>

            <div className="reports-overview">
              <div className="overview-cards">
                <div className="overview-card">
                  <h3>This Month</h3>
                  <p className="overview-number">1,247</p>
                  <span className="overview-label">Trips Completed</span>
                </div>
                <div className="overview-card">
                  <h3>Average Rating</h3>
                  <p className="overview-number">4.8</p>
                  <span className="overview-label">Out of 5 stars</span>
                </div>
                <div className="overview-card">
                  <h3>System Uptime</h3>
                  <p className="overview-number">99.9%</p>
                  <span className="overview-label">Last 30 days</span>
                </div>
              </div>
            </div>

            <div className="reports-charts">
              <h2>Performance Analytics</h2>
              <div className="chart-placeholder">
                <div className="chart-icon">📊</div>
                <p>Detailed analytics and interactive charts will be displayed here</p>
                <p>Showing trip performance, user activity, and system metrics</p>
              </div>
            </div>

            <div className="reports-sections">
              <div className="report-section">
                <h3>📈 Trip Performance Reports</h3>
                <p>View detailed trip completion rates, delays, and passenger satisfaction</p>
                <button className="btn-secondary">Generate Report</button>
              </div>

              <div className="report-section">
                <h3>👥 User Activity Reports</h3>
                <p>Monitor user registrations, login patterns, and system usage</p>
                <button className="btn-secondary">Generate Report</button>
              </div>

              <div className="report-section">
                <h3>🚐 Fleet Utilization Reports</h3>
                <p>Track bus usage, maintenance schedules, and operational efficiency</p>
                <button className="btn-secondary">Generate Report</button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content settings-tab">
            <div className="tab-header">
              <h1>System Settings</h1>
            </div>

            <div className="settings-section">
              <h2>General Settings</h2>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  Enable automatic backups
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  Send system notifications
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" />
                  Maintenance mode (blocks user access)
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h2>Security Settings</h2>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  Require strong passwords
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  <input type="checkbox" defaultChecked />
                  Enable two-factor authentication
                </label>
              </div>
              <div className="setting-item">
                <label className="setting-label">
                  Session timeout: <input type="number" defaultValue="30" style={{width: '60px', marginLeft: '10px'}} /> minutes
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="tab-content logs-tab">
            <div className="tab-header">
              <h1>System Activity Logs</h1>
              <button className="btn-secondary">📥 Export Logs</button>
            </div>

            <div className="logs-container">
              <div className="log-filters">
                <select className="filter-select">
                  <option>All Activities</option>
                  <option>User Actions</option>
                  <option>System Events</option>
                  <option>Security Events</option>
                  <option>Errors</option>
                </select>
                <input type="date" className="date-filter" />
                <button className="btn-secondary">Filter</button>
              </div>

              <div className="logs-list">
                <div className="log-entry">
                  <div className="log-time">2025-10-11 10:45:23</div>
                  <div className="log-type info">INFO</div>
                  <div className="log-message">User 'admin@safego.com' logged in</div>
                </div>
                <div className="log-entry">
                  <div className="log-time">2025-10-11 10:42:15</div>
                  <div className="log-type success">SUCCESS</div>
                  <div className="log-message">Trip #1456 completed successfully</div>
                </div>
                <div className="log-entry">
                  <div className="log-time">2025-10-11 10:38:42</div>
                  <div className="log-type warning">WARNING</div>
                  <div className="log-message">Bus #23 maintenance reminder sent</div>
                </div>
                <div className="log-entry">
                  <div className="log-time">2025-10-11 10:35:18</div>
                  <div className="log-type error">ERROR</div>
                  <div className="log-message">Failed login attempt for user 'unknown@example.com'</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <div className="tab-content backup-tab">
            <div className="tab-header">
              <h1>Backup & Restore</h1>
            </div>

            <div className="backup-section">
              <h2>Database Backup</h2>
              <div className="backup-options">
                <button className="btn-primary">📦 Create Full Backup</button>
                <button className="btn-secondary">📊 Backup User Data Only</button>
                <button className="btn-secondary">🚌 Backup Trip Data Only</button>
              </div>

              <div className="backup-history">
                <h3>Recent Backups</h3>
                <div className="backup-list">
                  <div className="backup-item">
                    <div className="backup-info">
                      <strong>Full System Backup</strong>
                      <span>October 11, 2025 - 10:30 AM</span>
                    </div>
                    <div className="backup-actions">
                      <button className="btn-small">⬇️ Download</button>
                      <button className="btn-small">🔄 Restore</button>
                    </div>
                  </div>
                  <div className="backup-item">
                    <div className="backup-info">
                      <strong>User Data Backup</strong>
                      <span>October 10, 2025 - 6:00 PM</span>
                    </div>
                    <div className="backup-actions">
                      <button className="btn-small">⬇️ Download</button>
                      <button className="btn-small">🔄 Restore</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
