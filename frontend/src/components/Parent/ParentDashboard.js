import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ParentNavbar from './ParentNavbar';
import DashboardWidgets from './DashboardWidgets';
import QuickActionsModern from './QuickActionsModern';
import ActivityFeed from './ActivityFeed';
import ChildrenManagement from './Children/ChildrenManagement';
import TripAssignmentsManagement from './TripAssignments/TripAssignmentsManagement';
import MessagesManagement from './Messages/MessagesManagement';
import ParentProfile from './ParentProfile';
import NotificationsCenter from './NotificationsCenter';
import QuickNotificationsWidget from './QuickNotificationsWidget';
import Dashbutton from './Dashbutton';

const ParentDashboard = () => {
  const { user, getUserDisplayName } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  // Redirect if not a parent
  if (!user || user.role !== 'parent') {
    window.location.href = '/login';
    return null;
  }

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Overview';
      case 'children':
        return 'My Children';
      case 'trips':
        return 'Trip Assignments';
      case 'messages':
        return 'Messages';
      case 'profile':
        return 'Profile';
      default:
        return 'Overview';
    }
  };

  const getViewIcon = () => {
    switch (currentView) {
      case 'dashboard':
        return '📊';
      case 'children':
        return '👨‍👩‍👧‍👦';
      case 'trips':
        return '🚌';
      case 'messages':
        return '💬';
      case 'profile':
        return '👤';
      default:
        return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Modern Navbar */}
      <ParentNavbar
        user={user}
        onNavigate={handleNavigation}
        activeView={currentView}
      />

      {/* Floating Notification Button */}
      <Dashbutton onNavigate={handleNavigation} />

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
                      {getUserDisplayName()?.split(' ')[0] || 'Parent'}
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
                    Here's what's happening with your children's transportation today.
                  </p>
                </motion.div>

                {/* Dashboard Widgets */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <DashboardWidgets />
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <QuickActionsModern onNavigate={handleNavigation} />
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <ActivityFeed />
                </motion.div>
              </>
            )}

            {currentView === 'children' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChildrenManagement />
              </motion.div>
            )}

            {currentView === 'trips' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TripAssignmentsManagement />
              </motion.div>
            )}

            {currentView === 'messages' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessagesManagement />
              </motion.div>
            )}

            {currentView === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ParentProfile />
              </motion.div>
            )}

            {currentView === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NotificationsCenter />
              </motion.div>
            )}

            {/* Special views */}
            {['children-add', 'children-safety', 'trips-active', 'trips-history', 'trips-schedule'].includes(currentView) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-medium p-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                    {currentView.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h2>
                  <p className="text-neutral-600">
                    This feature is coming soon! We're working hard to bring you the best experience.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default ParentDashboard;
