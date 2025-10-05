import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from '../context/AuthContext';
import ParentRegister from '../components/Auth/ParentRegister';
import ParentLogin from '../components/Auth/ParentLogin';
import ParentDashboard from '../components/Parent/ParentDashboard';

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
delete window.location;
window.location = { href: '' };

// Test component that uses auth context
const TestComponent = () => {
  const { user, isAuthenticated, isParent, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        Authenticated: {isAuthenticated() ? 'Yes' : 'No'}
      </div>
      <div data-testid="user-role">
        Role: {user?.role || 'None'}
      </div>
      <div data-testid="is-parent">
        Is Parent: {isParent() ? 'Yes' : 'No'}
      </div>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

describe('Parent Authentication Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    window.location.href = '';

    // Mock localStorage to return null initially (no stored auth)
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Complete Parent Registration Flow', () => {
    test('parent can register, login, and access dashboard', async () => {
      // Mock successful registration
      mockedAxios.post
        .mockResolvedValueOnce({
          data: {
            success: true,
            message: 'Parent registration successful',
            token: 'registration-token',
            user: { id: '123', email: 'parent@example.com', role: 'parent' }
          }
        })
        // Mock successful login
        .mockResolvedValueOnce({
          data: {
            success: true,
            token: 'login-token',
            user: { id: '123', email: 'parent@example.com', role: 'parent' }
          }
        });

      // Render auth provider with test component
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initially not authenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated: No');
      expect(screen.getByTestId('user-role')).toHaveTextContent('Role: None');
      expect(screen.getByTestId('is-parent')).toHaveTextContent('Is Parent: No');

      // Simulate registration
      const { rerender } = render(
        <AuthProvider>
          <ParentRegister />
        </AuthProvider>
      );

      // Fill registration form
      fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
        target: { value: 'John Parent' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
        target: { value: 'parent@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Create a strong password'), {
        target: { value: 'SecurePass123' }
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
        target: { value: 'SecurePass123' }
      });

      const termsCheckbox = screen.getByRole('checkbox');
      fireEvent.click(termsCheckbox);

      const registerButton = screen.getByText('Create Parent Account');
      fireEvent.click(registerButton);

      // Wait for registration success
      await waitFor(() => {
        expect(screen.getByText('Parent registration successful! Welcome to SafeGo. You can now login to access your parent dashboard.')).toBeInTheDocument();
      });

      // Verify registration API call
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/parent/register', {
        name: 'John Parent',
        email: 'parent@example.com',
        password: 'SecurePass123',
        phone: ''
      });

      // Now simulate login
      rerender(
        <AuthProvider>
          <ParentLogin />
        </AuthProvider>
      );

      // Fill login form
      fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
        target: { value: 'parent@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'SecurePass123' }
      });

      const loginButton = screen.getByText('Sign In to SafeGo');
      fireEvent.click(loginButton);

      // Wait for login success and redirect
      await waitFor(() => {
        expect(window.location.href).toBe('/parent/dashboard');
      }, { timeout: 2000 });

      // Verify login API call
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/parent/login', {
        email: 'parent@example.com',
        password: 'SecurePass123',
        rememberMe: false
      });

      // Verify localStorage storage
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'login-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({
        id: '123',
        email: 'parent@example.com',
        role: 'parent'
      }));

      // Test dashboard access
      rerender(
        <AuthProvider>
          <ParentDashboard />
        </AuthProvider>
      );

      // Should show dashboard content
      expect(screen.getByText('Welcome to SafeGo Parent Portal')).toBeInTheDocument();
      expect(screen.getByText('Manage your children\'s school transportation')).toBeInTheDocument();
    });
  });

  describe('Session Management', () => {
    test('maintains session across browser refreshes', async () => {
      // Mock stored authentication data
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'stored-token';
        if (key === 'user') return JSON.stringify({
          id: '123',
          email: 'parent@example.com',
          role: 'parent'
        });
        return null;
      });

      // Mock axios for token validation (if needed)
      mockedAxios.defaults.headers.common = {};

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Should be authenticated on load
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated: Yes');
        expect(screen.getByTestId('user-role')).toHaveTextContent('Role: parent');
        expect(screen.getByTestId('is-parent')).toHaveTextContent('Is Parent: Yes');
      });

      // Verify axios headers were set
      expect(mockedAxios.defaults.headers.common['Authorization']).toBe('Bearer stored-token');
    });

    test('handles logout correctly', async () => {
      // Setup authenticated state
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'stored-token';
        if (key === 'user') return JSON.stringify({
          id: '123',
          email: 'parent@example.com',
          role: 'parent'
        });
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for authentication
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated: Yes');
      });

      // Click logout
      const logoutButton = screen.getByTestId('logout-btn');
      fireEvent.click(logoutButton);

      // Should redirect to login (mocked)
      expect(window.location.href).toBe('/login');

      // Verify localStorage cleanup
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');

      // Verify axios headers cleared
      expect(mockedAxios.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('Role-Based Access Control', () => {
    test('parent role is correctly identified', async () => {
      // Setup parent authentication
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'parent-token';
        if (key === 'user') return JSON.stringify({
          id: '123',
          email: 'parent@example.com',
          role: 'parent'
        });
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-parent')).toHaveTextContent('Is Parent: Yes');
        expect(screen.getByTestId('user-role')).toHaveTextContent('Role: parent');
      });
    });

    test('non-parent users are rejected', async () => {
      // Setup admin authentication
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'admin-token';
        if (key === 'user') return JSON.stringify({
          id: '456',
          email: 'admin@example.com',
          role: 'admin'
        });
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-parent')).toHaveTextContent('Is Parent: No');
        expect(screen.getByTestId('user-role')).toHaveTextContent('Role: admin');
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('handles registration failure gracefully', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Email already exists' } }
      });

      render(
        <AuthProvider>
          <ParentRegister />
        </AuthProvider>
      );

      // Fill and submit registration form
      fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
        target: { value: 'John Parent' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
        target: { value: 'existing@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Create a strong password'), {
        target: { value: 'SecurePass123' }
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
        target: { value: 'SecurePass123' }
      });

      const termsCheckbox = screen.getByRole('checkbox');
      fireEvent.click(termsCheckbox);

      const registerButton = screen.getByText('Create Parent Account');
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });
    });

    test('handles login failure gracefully', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Invalid credentials' } }
      });

      render(
        <AuthProvider>
          <ParentLogin />
        </AuthProvider>
      );

      // Fill and submit login form
      fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
        target: { value: 'parent@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'wrongpassword' }
      });

      const loginButton = screen.getByText('Sign In to SafeGo');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    test('handles network errors during authentication', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

      render(
        <AuthProvider>
          <ParentLogin />
        </AuthProvider>
      );

      // Fill and submit login form
      fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
        target: { value: 'parent@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'SecurePass123' }
      });

      const loginButton = screen.getByText('Sign In to SafeGo');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Login failed. Please check your credentials and try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Remember Me Functionality', () => {
    test('sends rememberMe flag to API', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          token: 'extended-token',
          user: { id: '123', email: 'parent@example.com', role: 'parent' }
        }
      });

      render(
        <AuthProvider>
          <ParentLogin />
        </AuthProvider>
      );

      // Fill form and enable remember me
      fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
        target: { value: 'parent@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'SecurePass123' }
      });

      const rememberCheckbox = screen.getByLabelText('Remember me for 7 days');
      fireEvent.click(rememberCheckbox);

      const loginButton = screen.getByText('Sign In to SafeGo');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/parent/login', {
          email: 'parent@example.com',
          password: 'SecurePass123',
          rememberMe: true
        });
      });
    });
  });
});
