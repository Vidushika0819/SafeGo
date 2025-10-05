import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ParentSidebar from './ParentSidebar';
import DashboardWidgets from './DashboardWidgets';
import QuickActions from './QuickActions';
import ActivityFeed from './ActivityFeed';
import ChildrenManagement from './Children/ChildrenManagement';
import TripAssignmentsManagement from './TripAssignments/TripAssignmentsManagement';
import MessagesManagement from './Messages/MessagesManagement';
import ParentProfile from './ParentProfile';

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <ParentSidebar activeSection={currentView} onNavigate={handleNavigation} />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: window.innerWidth <= 768 ? '0' : '280px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        {/* Top Header Bar */}
        <header style={{
          backgroundColor: 'white',
          padding: '15px 30px',
          borderBottom: '1px solid #ecf0f1',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Breadcrumb Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                fontSize: '18px',
                color: '#2c3e50'
              }}>
                🏠
              </span>
              <span style={{
                color: '#7f8c8d',
                fontSize: '14px'
              }}>
                Dashboard
              </span>
              <span style={{
                color: '#bdc3c7',
                fontSize: '14px',
                margin: '0 5px'
              }}>
                /
              </span>
              <span style={{
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {getViewTitle()}
              </span>
            </div>

            {/* User Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                textAlign: 'right'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  {getUserDisplayName()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#7f8c8d'
                }}>
                  Parent Account
                </div>
              </div>

              {/* User Avatar Placeholder */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {user?.email?.charAt(0).toUpperCase() || 'P'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main style={{
          padding: currentView === 'dashboard' ? '30px' : '0',
          maxWidth: currentView === 'dashboard' ? '1200px' : '100%',
          margin: currentView === 'dashboard' ? '0 auto' : '0',
          width: '100%'
        }}>
          {currentView === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div style={{
                marginBottom: '30px'
              }}>
                <h1 style={{
                  margin: '0 0 10px 0',
                  color: '#2c3e50',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}>
                  Welcome back, {getUserDisplayName()?.split(' ')[0] || 'Parent'}! 👋
                </h1>
                <p style={{
                  margin: 0,
                  color: '#7f8c8d',
                  fontSize: '18px'
                }}>
                  Here's what's happening with your children's transportation today.
                </p>
              </div>

              {/* Dashboard Widgets */}
              <DashboardWidgets />

              {/* Quick Actions */}
              <QuickActions onNavigate={handleNavigation} />

              {/* Activity Feed */}
              <ActivityFeed />
            </>
          )}

          {currentView === 'children' && (
            <ChildrenManagement />
          )}

          {currentView === 'trips' && (
            <TripAssignmentsManagement />
          )}

          {currentView === 'messages' && (
            <MessagesManagement />
          )}

          {currentView === 'profile' && (
            <ParentProfile />
          )}
        </main>
      </div>

      {/* Mobile Overlay for Sidebar */}
      {window.innerWidth <= 768 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            display: 'none' // Controlled by sidebar component
          }}
          id="mobile-overlay"
        />
      )}
    </div>
  );
};

export default ParentDashboard;
