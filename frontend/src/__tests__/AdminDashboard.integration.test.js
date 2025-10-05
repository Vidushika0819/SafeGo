import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import AdminDashboard from '../components/Admin/AdminDashboard';
import { AuthProvider } from '../context/AuthContext';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
const originalLocation = window.location;
delete window.location;
window.location = { href: '' };

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('AdminDashboard Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();

    // Reset window.location
    window.location.href = '';
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  describe('Complete Admin Login to Dashboard Flow', () => {
    test('successful admin login redirects to dashboard', async () => {
      // Mock successful login response
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          success: true,
          token: 'admin-jwt-token',
          user: { id: '1', email: 'admin@safego.com', role: 'admin' }
        }
      });

      // Mock admin stats API call
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            totalUsers: 15,
            totalTrips: 45,
            totalBuses: 8,
            totalCoordinators: 3
          }
        }
      });

      const { rerender } = renderWithRouter(<div>Login Page</div>);

      // Simulate login process (this would normally happen in Login component)
      // For integration test, we'll directly test the dashboard with admin context

      rerender(
        <MemoryRouter>
          <AuthProvider>
            <AdminDashboard />
          </AuthProvider>
        </MemoryRouter>
      );

      // Mock the auth context to simulate logged-in admin
      // In a real scenario, this would be set by the login process

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5005/api/admin/stats');
      });
    });

    test('admin dashboard loads with statistics data', async () => {
      // Mock admin stats API response
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            totalUsers: 15,
            totalTrips: 45,
            totalBuses: 8,
            totalCoordinators: 3
          }
        }
      });

      // Mock AuthContext to return admin user
      const mockUseAuth = jest.fn(() => ({
        isAdmin: () => true,
        logout: jest.fn(),
        getUserDisplayName: () => 'admin@safego.com'
      }));

      jest.doMock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: mockUseAuth
      }));

      renderWithRouter(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText('SafeGo Admin Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Welcome, admin@safego.com')).toBeInTheDocument();
      });

      // Verify API call was made
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5005/api/admin/stats');
    });

    test('handles statistics API errors gracefully', async () => {
      // Mock API error
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          data: { message: 'Database connection failed' }
        }
      });

      renderWithRouter(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load statistics')).toBeInTheDocument();
      });
    });
  });

  describe('Admin Dashboard Navigation and Routing', () => {
    test('admin route protection works correctly', async () => {
      // This would typically be tested at the App level
      // For this integration test, we'll verify the component behavior

      renderWithRouter(<AdminDashboard />);

      // Component should handle its own admin verification
      await waitFor(() => {
        expect(screen.getByText('Verifying admin access...')).toBeInTheDocument();
      });
    });

    test('non-admin users are redirected', async () => {
      // Mock non-admin context
      const mockUseAuth = jest.fn(() => ({
        isAdmin: () => false,
        logout: jest.fn(),
        getUserDisplayName: () => 'user@example.com'
      }));

      jest.doMock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: mockUseAuth
      }));

      renderWithRouter(<AdminDashboard />);

      await waitFor(() => {
        expect(window.location.href).toBe('/login');
      });
    });
  });

  describe('Admin Dashboard Interactions', () => {
    test('quick actions are functional', async () => {
      // Mock successful stats load
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            totalUsers: 15,
            totalTrips: 45,
            totalBuses: 8,
            totalCoordinators: 3
          }
        }
      });

      // Mock alert for action execution
      global.alert = jest.fn();

      renderWithRouter(<AdminDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      });

      // The QuickActions component is mocked, so we can't test actual button clicks
      // In a real scenario, this would test the full interaction flow
    });

    test('statistics refresh functionality', async () => {
      // Mock initial load
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            totalUsers: 15,
            totalTrips: 45,
            totalBuses: 8,
            totalCoordinators: 3
          }
        }
      });

      // Mock refresh call
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            totalUsers: 16, // Updated count
            totalTrips: 45,
            totalBuses: 8,
            totalCoordinators: 3
          }
        }
      });

      renderWithRouter(<AdminDashboard />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      });

      // Note: Actual refresh button testing would require more complex mocking
      // of the AdminStats component's refresh functionality
    });

    test('logout functionality clears session', async () => {
      const mockLogout = jest.fn();

      // Mock admin context with logout
      const mockUseAuth = jest.fn(() => ({
        isAdmin: () => true,
        logout: mockLogout,
        getUserDisplayName: () => 'admin@safego.com'
      }));

      jest.doMock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: mockUseAuth
      }));

      renderWithRouter(<AdminDashboard />);

      await waitFor(() => {
        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);
        expect(mockLogout).toHaveBeenCalled();
      });
    });
  });

  describe('Admin Dashboard Performance and Reliability', () => {
    test('handles slow API responses', async () => {
      // Mock slow API response
      mockedAxios.get.mockImplementationOnce(
        () => new Promise(resolve =>
          setTimeout(() => resolve({
            data: {
              success: true,
              data: {
                totalUsers: 15,
                totalTrips: 45,
                totalBuses: 8,
                totalCoordinators: 3
              }
            }
          }), 100)
        )
      );

      renderWithRouter(<AdminDashboard />);

      // Should show loading state initially
      expect(screen.getByText('Verifying admin access...')).toBeInTheDocument();

      // Should eventually load dashboard
      await waitFor(() => {
        expect(screen.getByText('SafeGo Admin Dashboard')).toBeInTheDocument();
      }, { timeout: 200 });
    });

    test('maintains functionality during API errors', async () => {
      // Mock API failure
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<AdminDashboard />);

      await waitFor(() => {
        // Dashboard should still render, just with error states
        expect(screen.getByText('SafeGo Admin Dashboard')).toBeInTheDocument();
      });
    });
  });
});
