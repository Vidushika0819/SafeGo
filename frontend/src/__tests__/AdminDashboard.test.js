import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';
import { AuthProvider } from '../context/AuthContext';

// Mock the child components
jest.mock('../components/Admin/AdminStats', () => {
  return function MockAdminStats() {
    return <div data-testid="admin-stats">Admin Stats Component</div>;
  };
});

jest.mock('../components/Admin/QuickActions', () => {
  return function MockQuickActions() {
    return <div data-testid="quick-actions">Quick Actions Component</div>;
  };
});

// Mock useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => mockUseAuth()
}));

const renderAdminDashboard = () => {
  return render(
    <AuthProvider>
      <AdminDashboard />
    </AuthProvider>
  );
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('verifies admin role on component mount', async () => {
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => true),
      logout: jest.fn(),
      getUserDisplayName: jest.fn(() => 'Admin User')
    });

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByText('SafeGo Admin Dashboard')).toBeInTheDocument();
    });
  });

  test('redirects non-admin users', async () => {
    // Mock window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => false),
      logout: jest.fn(),
      getUserDisplayName: jest.fn(() => 'Regular User')
    });

    renderAdminDashboard();

    await waitFor(() => {
      expect(window.location.href).toBe('/login');
    });

    // Restore window.location
    window.location = originalLocation;
  });

  test('displays admin dashboard layout correctly', async () => {
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => true),
      logout: jest.fn(),
      getUserDisplayName: jest.fn(() => 'Admin User')
    });

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByText('SafeGo Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome, Admin User')).toBeInTheDocument();
      expect(screen.getByText('Management Sections')).toBeInTheDocument();
      expect(screen.getByText('System Overview')).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });

  test('renders navigation sidebar with management sections', async () => {
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => true),
      logout: jest.fn(),
      getUserDisplayName: jest.fn(() => 'Admin User')
    });

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByText('📊 Dashboard Overview')).toBeInTheDocument();
      expect(screen.getByText('👥 User Management')).toBeInTheDocument();
      expect(screen.getByText('🚌 Trip Management')).toBeInTheDocument();
      expect(screen.getByText('🚐 Bus Management')).toBeInTheDocument();
      expect(screen.getByText('📈 System Reports')).toBeInTheDocument();
    });
  });

  test('renders child components', async () => {
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => true),
      logout: jest.fn(),
      getUserDisplayName: jest.fn(() => 'Admin User')
    });

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByTestId('admin-stats')).toBeInTheDocument();
      expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    });
  });

  test('handles logout functionality', async () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => true),
      logout: mockLogout,
      getUserDisplayName: jest.fn(() => 'Admin User')
    });

    renderAdminDashboard();

    await waitFor(() => {
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  test('displays loading state during admin verification', () => {
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => false), // Will show loading first
      logout: jest.fn(),
      getUserDisplayName: jest.fn(() => 'User')
    });

    renderAdminDashboard();

    expect(screen.getByText('Verifying admin access...')).toBeInTheDocument();
  });

  test('applies responsive layout classes', async () => {
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => true),
      logout: jest.fn(),
      getUserDisplayName: jest.fn(() => 'Admin User')
    });

    renderAdminDashboard();

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(main).toHaveStyle({ maxWidth: '1200px' });
    });
  });

  test('includes proper accessibility attributes', async () => {
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => true),
      logout: jest.fn(),
      getUserDisplayName: jest.fn(() => 'Admin User')
    });

    renderAdminDashboard();

    await waitFor(() => {
      const logoutButton = screen.getByText('Logout');
      expect(logoutButton).toHaveAttribute('type', 'button');
    });
  });
});
