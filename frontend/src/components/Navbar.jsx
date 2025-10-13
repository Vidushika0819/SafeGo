import React, { useState } from 'react';
import { 
  User, 
  LogOut, 
  Home, 
  CheckSquare, 
  Wrench, 
  FileText, 
  Truck, 
  Users, 
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AdminNotifications from './AdminNotifications';
import { getCurrentUser, clearAuth } from '../utils/auth';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser() || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Daily Checks', path: '/daily-checks', icon: CheckSquare },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Monthly Reports', path: '/monthly-reports', icon: FileText },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  // Admin only items
  if (user.role === 'admin') {
    menuItems.push({ name: 'Admin Panel', path: '/admin', icon: Settings });
    menuItems.push({ name: 'Users', path: '/users', icon: Users });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>
        {`
          @media (max-width: 1200px) {
            .nav-menu-item span {
              display: none;
            }
          }
          
          @media (max-width: 768px) {
            .nav-desktop-menu {
              display: none !important;
            }
            .nav-mobile-toggle {
              display: flex !important;
            }
            .nav-user-info-text {
              display: none !important;
            }
            .nav-logout-text {
              display: none !important;
            }
          }
          
          @media (min-width: 769px) {
            .nav-mobile-toggle {
              display: none !important;
            }
            .nav-mobile-menu {
              display: none !important;
            }
          }
        `}
      </style>
      <nav style={{
        background: '#0a1536ff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        width: '100%',
        minHeight: '70px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '100%',
          margin: '0 auto',
          height: '100%'
        }}>
          {/* Mobile Menu Toggle */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '10px'
            }}
          >
            {mobileMenuOpen ? <X style={{height: 26, width: 26}} /> : <Menu style={{height: 26, width: 26}} />}
          </button>

          {/* Desktop Navigation Menu Items */}
          <div className="nav-desktop-menu" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            overflow: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="nav-menu-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    color: isItemActive ? '#79bddfff' : '#fff',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: isItemActive ? '600' : '500',
                    background: isItemActive ? 'rgba(0, 8, 255, 0.1)' : 'transparent',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (!isItemActive) {
                      e.currentTarget.style.background = 'rgba(22, 8, 71, 1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isItemActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon style={{height: 20, width: 20, flexShrink: 0}} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side: Notifications, User Info, Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexShrink: 0
          }}>
            <AdminNotifications />
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <div style={{
                width: 38,
                height: 38,
                background: '#FFD700',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User style={{height: 20, width: 20, color: '#160421ff'}} />
              </div>
              <div className="nav-user-info-text" style={{display: 'block'}}>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.3
                }}>{user.firstName} {user.lastName}</p>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#bfdbfe',
                  textTransform: 'capitalize',
                  margin: 0,
                  lineHeight: 1.3
                }}>{user.role}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => e.target.style.background = '#dc2626'}
              onMouseLeave={(e) => e.target.style.background = '#ef4444'}
              title="Logout"
            >
              <LogOut style={{height: 18, width: 18}} />
              <span className="nav-logout-text">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="nav-mobile-menu" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    color: isItemActive ? '#79bddfff' : '#fff',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: isItemActive ? '600' : '500',
                    background: isItemActive ? 'rgba(4, 149, 221, 0.1)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon style={{height: 20, width: 20}} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
