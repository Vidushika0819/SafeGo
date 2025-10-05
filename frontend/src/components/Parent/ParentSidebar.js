import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ParentSidebar = ({ activeSection = 'dashboard', onNavigate }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/parent/dashboard',
      description: 'Overview and quick actions'
    },
    {
      id: 'children',
      label: 'My Children',
      icon: '👨‍👩‍👧‍👦',
      path: '/parent/children',
      description: 'Manage children information'
    },
    {
      id: 'trips',
      label: 'Trip Assignments',
      icon: '🚌',
      path: '/parent/trips',
      description: 'Assign children to trips'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '💬',
      path: '/parent/messages',
      description: 'Contact and notifications'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      path: '/parent/profile',
      description: 'Account settings'
    }
  ];

  const handleNavigation = (path) => {
    // Extract the view name from the path (e.g., '/parent/children' -> 'children')
    const view = path.split('/').pop();
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div style={{
      width: isCollapsed ? '60px' : '280px',
      minHeight: '100vh',
      backgroundColor: '#2c3e50',
      color: 'white',
      transition: 'width 0.3s ease',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1000,
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: isCollapsed ? '20px 10px' : '20px',
        borderBottom: '1px solid #34495e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between'
      }}>
        {!isCollapsed && (
          <div>
            <h2 style={{
              margin: '0 0 5px 0',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ecf0f1'
            }}>
              SafeGo Parent
            </h2>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#bdc3c7'
            }}>
              Welcome back!
            </p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ecf0f1',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '5px'
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation Items */}
      <nav style={{ padding: isCollapsed ? '20px 0' : '20px 0' }}>
        {navigationItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: isCollapsed ? '15px 10px' : '15px 20px',
              cursor: 'pointer',
              backgroundColor: activeSection === item.id ? '#34495e' : 'transparent',
              borderLeft: activeSection === item.id ? '4px solid #3498db' : '4px solid transparent',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            title={isCollapsed ? item.label : ''}
          >
            <span style={{
              fontSize: '18px',
              marginRight: isCollapsed ? '0' : '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px'
            }}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: activeSection === item.id ? 'bold' : 'normal',
                  fontSize: '14px',
                  marginBottom: '2px'
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#bdc3c7',
                  opacity: 0.8
                }}>
                  {item.description}
                </div>
              </div>
            )}
            {activeSection === item.id && !isCollapsed && (
              <span style={{
                color: '#3498db',
                fontSize: '12px'
              }}>
                ●
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #34495e',
        padding: isCollapsed ? '20px 10px' : '20px'
      }}>
        {!isCollapsed && (
          <div style={{
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#34495e',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#bdc3c7',
              marginBottom: '2px'
            }}>
              Logged in as:
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ecf0f1'
            }}>
              {user?.email || 'Parent User'}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isCollapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '60px',
            width: 'calc(100vw - 60px)',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
          onClick={() => setIsCollapsed(false)}
        />
      )}
    </div>
  );
};

export default ParentSidebar;
