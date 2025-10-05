import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import AdminStats from './AdminStats';
import QuickActions from './QuickActions';
import UserManagement from './UserManagement/UserManagement';
import TripManagement from './TripManagement/TripManagement';
import BusManagement from './BusManagement/BusManagement';

const AdminDashboard = () => {
  const { isAdmin, logout, getUserDisplayName } = useAuth();
  const [searchParams] = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

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
      setCurrentView(section);
    }
  }, [isAdmin, searchParams]);

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    logout();
  };

  if (!isAuthorized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Verifying admin access...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>SafeGo Admin Dashboard</h1>
            <p style={{ margin: '0.25rem 0 0 0', opacity: 0.8 }}>
              Welcome, {getUserDisplayName()}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Navigation Sidebar */}
        <aside style={{
          float: 'left',
          width: '250px',
          marginRight: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '1.5rem'
          }}>
            <h3 style={{ marginTop: 0, color: '#343a40' }}>Management Sections</h3>
            <nav>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => handleNavigation('dashboard')}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: currentView === 'dashboard' ? '#0056b3' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: currentView === 'dashboard' ? 'bold' : 'normal',
                      textAlign: 'left'
                    }}
                  >
                    📊 Dashboard Overview
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => handleNavigation('users')}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: currentView === 'users' ? '#1e7e34' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: currentView === 'users' ? 'bold' : 'normal',
                      textAlign: 'left'
                    }}
                  >
                    👥 User Management
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => handleNavigation('trips')}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: currentView === 'trips' ? '#117a8b' : '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: currentView === 'trips' ? 'bold' : 'normal',
                      textAlign: 'left'
                    }}
                  >
                    🚌 Trip Management
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => handleNavigation('buses')}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: currentView === 'buses' ? '#d39e00' : '#ffc107',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: currentView === 'buses' ? 'bold' : 'normal',
                      textAlign: 'left'
                    }}
                  >
                    🚐 Bus Management
                  </button>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <button
                    onClick={() => handleNavigation('reports')}
                    style={{
                      display: 'block',
                      width: '100% ',
                      padding: '0.75rem',
                      backgroundColor: currentView === 'reports' ? '#545b62' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: currentView === 'reports' ? 'bold' : 'normal',
                      textAlign: 'left'
                    }}
                  >
                    📈 System Reports
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <section style={{
          marginLeft: '250px',
          paddingLeft: '2rem',
          width: '100%'
        }}>
          {currentView === 'dashboard' && (
            <>
              {/* Statistics Section */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h2 style={{ marginTop: 0, color: '#343a40' }}>System Overview</h2>
                <AdminStats />
              </div>

              {/* Quick Actions Section */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h2 style={{ marginTop: 0, color: '#343a40' }}>Quick Actions</h2>
                <QuickActions />
              </div>

              {/* Recent Activity Section */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '1.5rem'
              }}>
                <h2 style={{ marginTop: 0, color: '#343a40' }}>Recent Activity</h2>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1rem',
                  borderRadius: '4px',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  Recent system activity will be displayed here
                </div>
              </div>
            </>
          )}

          {currentView === 'users' && (
            <UserManagement />
          )}

          {currentView === 'trips' && (
            <TripManagement />
          )}

          {currentView === 'buses' && (
            <BusManagement />
          )}

          {currentView === 'reports' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '3rem',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📈</div>
              <h2>System Reports</h2>
              <p>Reporting system will be implemented in a future story.</p>
            </div>
          )}
        </section>

        {/* Clear floats */}
        <div style={{ clear: 'both' }}></div>
      </main>
    </div>
  );
};

export default AdminDashboard;
