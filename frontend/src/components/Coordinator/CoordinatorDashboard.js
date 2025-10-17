import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  MapPin,
  Activity,
  TrendingUp,
  Clock,
  Shield,
  Bell,
  Home,
  UserPlus,
  Edit,
  Eye,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  Star
} from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import CoordinatorNavbar from './CoordinatorNavbar';
import CoordinatorStats from './CoordinatorStats';
import CoordinatorActions from './CoordinatorActions';
import ActivityFeed from './ActivityFeed';
import CoordinatorProfileSettings from './CoordinatorProfileSettings';
import TripManagement from './TripManagement/TripManagement';
import PassengerManagement from './PassengerManagement/PassengerManagement';
import StudentTracking from './StudentTracking/StudentTracking';
import ReportsAnalytics from './Reports/ReportsAnalytics';

const CoordinatorDashboard = () => {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');

  // Redirect if not a coordinator
  if (!user || user.role !== 'coordinator') {
    window.location.href = '/login';
    return null;
  }

  const handleNavigation = (view) => {
    setCurrentView(view);
    // Smooth scroll to top when changing views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'trips':
        return 'Trip Management';
      case 'passengers':
        return 'Passenger Management';
      case 'reports':
        return 'Reports & Analytics';
      case 'student-tracking':
        return 'Student Tracking';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Modern Coordinator Navbar */}
      <CoordinatorNavbar
        user={user}
        onNavigate={handleNavigation}
        activeView={currentView}
      />

      {/* Main Content Area with Animation */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pt-16 min-h-screen"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentView === 'dashboard' && (
              <>
                {/* Hero Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12 text-center"
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                    Welcome back,{' '}
                    <span className="text-primary-600">
                      {user?.name?.split(' ')[0] || 'Coordinator'}
                    </span>
                    <motion.span
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                      className="inline-block ml-2"
                    >
                      👋
                    </motion.span>
                  </h1>
                  <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                    Here's your comprehensive coordination overview for today's transportation operations.
                  </p>
                </motion.div>

                {/* Modern Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <CoordinatorStats />
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <CoordinatorActions onNavigate={handleNavigation} />
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <ActivityFeed />
                </motion.div>
              </>
            )}

            {currentView === 'trips' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TripManagement />
              </motion.div>
            )}

            {currentView === 'passengers' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PassengerManagement />
              </motion.div>
            )}

            {currentView === 'reports' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ReportsAnalytics />
              </motion.div>
            )}

            {currentView === 'student-tracking' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StudentTracking />
              </motion.div>
            )}

            {/* Profile view */}
            {currentView === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-medium p-8"
              >
                <CoordinatorProfileSettings />
              </motion.div>
            )}

            {/* Settings view */}
            {currentView === 'settings' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-medium p-8 space-y-8"
              >
                <div className="text-center">
                  <Settings className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    Dashboard Preferences
                  </h2>
                  <p className="text-neutral-600 max-w-2xl mx-auto">
                    Coming soon! We'll soon provide comprehensive settings to customize your coordination dashboard experience.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-neutral-900">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-neutral-700">Email notifications for trip updates</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-neutral-700">SMS alerts for urgent issues</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-neutral-900">Display Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-neutral-700">Show passenger photos</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-neutral-700">Dark mode (coming soon)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Help view */}
            {currentView === 'help' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-medium p-8"
              >
                <div className="text-center">
                  <Activity className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    Help & Support Center
                  </h2>
                  <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
                    Get help with coordination tasks, troubleshooting, and best practices.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <Bus className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-neutral-900 mb-2">Trip Management</h3>
                    <p className="text-sm text-neutral-600">Learn how to create, monitor, and manage transportation trips effectively.</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <Users className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-semibold text-neutral-900 mb-2">Passenger Coordination</h3>
                    <p className="text-sm text-neutral-600">Manage passenger information, assignments, and communication.</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-neutral-900 mb-2">Reports & Analytics</h3>
                    <p className="text-sm text-neutral-600">Generate insights and track performance metrics.</p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-neutral-50 rounded-xl">
                  <h3 className="font-semibold text-neutral-900 mb-3">Need More Help?</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-600 mb-2"><strong>Email Support:</strong></p>
                      <p className="font-mono">coordinator.support@safego.com</p>
                    </div>
                    <div>
                      <p className="text-neutral-600 mb-2"><strong>Phone Support:</strong></p>
                      <p className="font-mono">+94 11 123 4567 (Mon-Fri 8AM-6PM)</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default CoordinatorDashboard;
