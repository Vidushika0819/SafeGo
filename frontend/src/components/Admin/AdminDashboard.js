import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Bus,
  BarChart3,
  DollarSign,
  Ticket,
  Settings,
  Database,
  TrendingUp,
  Shield,
  TrendingDown,
  Activity,
  ChevronDown,
  Star,
  Medal,
  Target
} from 'lucide-react';
import AdminStats from './AdminStats';
import AdminNavbar from './AdminNavbar';
import QuickActions from './QuickActions';
import UserManagement from './UserManagement/UserManagement';
import TripManagement from './TripManagement/TripManagement';
import BusManagement from './BusManagement/BusManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { isAdmin, logout, getUserDisplayName } = useAuth();
  const [searchParams] = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showHero, setShowHero] = useState(true);

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
    if (section && ['dashboard', 'users', 'trips', 'buses', 'reports', 'finance', 'seats', 'settings', 'logs', 'backup', 'system'].includes(section)) {
      setActiveTab(section);
      setShowHero(false); // Hide hero if we start with a specific section
    }
  }, [isAdmin, searchParams]);

  const handleTabChange = (tabName) => {
    // If changing to dashboard, show hero
    if (tabName === 'dashboard') {
      setShowHero(true);
    } else if (showHero) {
      setShowHero(false);
    }

    // Smooth scroll to top when changing tabs (except finance/seats which redirect externally)
    if (tabName !== 'finance' && tabName !== 'seats') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300); // Wait for transition animation
    }
    setActiveTab(tabName);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Modern Admin Navbar */}
      <AdminNavbar
        user={{ name: getUserDisplayName(), email: 'admin@safego.com' }}
        onNavigate={handleTabChange}
        activeTab={activeTab}
        unreadNotifications={3}
      />

      {/* Add top spacing for fixed navbar */}
      <div className="pt-16"></div>

      {/* Hero Section */}
      <AnimatePresence>
        {showHero && (
          <motion.section
            key="hero"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative pt-16 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
              />
              <motion.div
                animate={{
                  scale: [1.1, 1, 1.1],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-xl"
              />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
                {/* Hero Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="w-8 h-8 text-white" />
                      <span className="text-xl font-semibold text-white/90">Admin Portal</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                      Welcome back,
                      <span className="block text-3xl lg:text-5xl mt-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        {getUserDisplayName()}! 👋
                      </span>
                    </h1>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl lg:text-2xl text-white/90 max-w-lg leading-relaxed"
                  >
                    Your comprehensive system administration dashboard. Monitor, manage, and optimize your transportation network.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTabChange('dashboard')}
                      className="group flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300"
                    >
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      Dashboard
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTabChange('users')}
                      className="group flex items-center justify-center px-8 py-4 bg-blue-800/30 text-white rounded-xl font-semibold text-lg hover:bg-blue-800/50 transition-all duration-300 border border-white/20"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Manage Users
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Hero Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <div className="relative">
                    {/* Animated dashboard preview */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <Shield className="w-12 h-12 text-white" />
                        <div>
                          <h3 className="text-2xl font-bold text-white">SafeGo Admin</h3>
                          <p className="text-white/80">Management Portal</p>
                        </div>
                      </div>

                      {/* Mock stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/20 rounded-xl p-4">
                          <div className="text-2xl font-bold text-white mb-1">247</div>
                          <div className="text-sm text-white/80">Active Users</div>
                        </div>
                        <div className="bg-white/20 rounded-xl p-4">
                          <div className="text-2xl font-bold text-white mb-1">89</div>
                          <div className="text-sm text-white/80">Live Trips</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      </div>
                    </motion.div>

                    {/* Floating elements */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="absolute top-10 -left-10 bg-white rounded-xl p-4 shadow-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                          <div className="font-semibold text-gray-900">Performance</div>
                          <div className="text-sm text-gray-600">94% On-Time</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                      className="absolute bottom-10 -right-6 bg-white rounded-xl p-4 shadow-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-semibold text-gray-900">Efficiency</div>
                          <div className="text-sm text-gray-600">32% Improved</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                onClick={() => handleTabChange('dashboard')}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center text-white/70"
                >
                  <span className="text-sm mb-2">Explore Dashboard</span>
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Modern Dashboard Content */}
      <div className="tab-content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="tab-content dashboard-tab"
              >
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
                  <QuickActions onNavigate={handleTabChange} />
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
              </motion.div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="tab-content users-tab"
              >
                <div className="tab-header">
                  <h1>User Management</h1>
                  <button className="btn-primary">+ Add New User</button>
                </div>

                <UserManagement />
              </motion.div>
            )}

            {/* Trips Tab */}
            {activeTab === 'trips' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="tab-content trips-tab"
              >
                <div className="tab-header">
                  <h1>Trip Management</h1>
                  <button className="btn-primary">+ Create New Trip</button>
                </div>

                <TripManagement />
              </motion.div>
            )}

            {/* Buses Tab */}
            {activeTab === 'buses' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="tab-content buses-tab"
              >
                <div className="tab-header">
                  <h1>Bus Fleet Management</h1>
                  <button className="btn-primary">+ Add New Bus</button>
                </div>

                <BusManagement />
              </motion.div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="tab-content reports-tab"
              >
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
              </motion.div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="tab-content system-tab"
              >
                <div className="tab-header">
                  <h1>System Administration</h1>
                </div>

                <div className="system-overview">
                  <h2>System Status</h2>
                  <div className="status-grid">
                    <div className="status-card">
                      <div className="status-icon">🖥️</div>
                      <div className="status-info">
                        <h3>Server Status</h3>
                        <p className="status-health">Online</p>
                      </div>
                    </div>
                    <div className="status-card">
                      <div className="status-icon">💾</div>
                      <div className="status-info">
                        <h3>Database</h3>
                        <p className="status-health">Healthy</p>
                      </div>
                    </div>
                    <div className="status-card">
                      <div className="status-icon">🌐</div>
                      <div className="status-info">
                        <h3>Network</h3>
                        <p className="status-health">Stable</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="system-tools">
                  <h2>System Tools</h2>
                  <div className="tool-grid">
                    <button className="tool-button" onClick={() => handleTabChange('settings')}>
                      <div className="tool-icon">⚙️</div>
                      <h3>System Settings</h3>
                      <p>Configure system parameters</p>
                    </button>
                    <button className="tool-button" onClick={() => handleTabChange('logs')}>
                      <div className="tool-icon">📋</div>
                      <h3>Activity Logs</h3>
                      <p>View system activity logs</p>
                    </button>
                    <button className="tool-button" onClick={() => handleTabChange('backup')}>
                      <div className="tool-icon">💾</div>
                      <h3>Backup & Restore</h3>
                      <p>Manage system backups</p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="tab-content settings-tab"
              >
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
              </motion.div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="tab-content logs-tab"
              >
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
              </motion.div>
            )}

            {/* Backup Tab */}
            {activeTab === 'backup' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="tab-content backup-tab"
              >
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
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
