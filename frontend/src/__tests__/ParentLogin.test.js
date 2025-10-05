import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ParentLogin from '../components/Auth/ParentLogin';

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

describe('ParentLogin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    window.location.href = '';
  });

  test('renders parent login form', () => {
    render(<ParentLogin />);

    expect(screen.getByText('Welcome Back to SafeGo')).toBeInTheDocument();
    expect(screen.getByText('Sign in to manage your children\'s transportation')).toBeInTheDocument();
    expect(screen.getByText('Sign In to SafeGo')).toBeInTheDocument();
  });

  test('renders all form fields', () => {
    render(<ParentLogin />);

    expect(screen.getByText('Email Address *')).toBeInTheDocument();
    expect(screen.getByText('Password *')).toBeInTheDocument();
    expect(screen.getByText('Remember me for 7 days')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  test('validates required fields on submit', async () => {
    render(<ParentLogin />);

    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<ParentLogin />);

    const emailInput = screen.getByPlaceholderText('Enter your email address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  test('clears errors when user starts typing', async () => {
    render(<ParentLogin />);

    // Trigger validation error
    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Start typing
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    fireEvent.change(emailInput, { target: { value: 'j' } });

    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });

  test('handles remember me checkbox', () => {
    render(<ParentLogin />);

    const rememberCheckbox = screen.getByLabelText('Remember me for 7 days');
    expect(rememberCheckbox).not.toBeChecked();

    fireEvent.click(rememberCheckbox);
    expect(rememberCheckbox).toBeChecked();

    fireEvent.click(rememberCheckbox);
    expect(rememberCheckbox).not.toBeChecked();
  });

  test('shows forgot password modal when clicked', () => {
    render(<ParentLogin />);

    const forgotLink = screen.getByText('Forgot password?');
    fireEvent.click(forgotLink);

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByText('Password reset functionality is coming soon. Please contact SafeGo support for assistance.')).toBeInTheDocument();
  });

  test('closes forgot password modal', () => {
    render(<ParentLogin />);

    // Open modal
    const forgotLink = screen.getByText('Forgot password?');
    fireEvent.click(forgotLink);

    expect(screen.getByText('Reset Password')).toBeInTheDocument();

    // Close modal
    const backButton = screen.getByText('Back to Login');
    fireEvent.click(backButton);

    expect(screen.queryByText('Reset Password')).not.toBeInTheDocument();
    expect(screen.getByText('Welcome Back to SafeGo')).toBeInTheDocument();
  });

  test('submits login form successfully', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        success: true,
        token: 'mock-jwt-token',
        user: { id: '123', email: 'parent@example.com', role: 'parent' }
      }
    });

    render(<ParentLogin />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'parent@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'SecurePass123' }
    });

    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/parent/login', {
        email: 'parent@example.com',
        password: 'SecurePass123',
        rememberMe: false
      });
    });

    // Check localStorage calls
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({
      id: '123',
      email: 'parent@example.com',
      role: 'parent'
    }));

    // Check success message
    await waitFor(() => {
      expect(screen.getByText('Login successful! Welcome back to SafeGo.')).toBeInTheDocument();
    });

    // Check redirect (will happen after timeout)
    await waitFor(() => {
      expect(window.location.href).toBe('/parent/dashboard');
    }, { timeout: 2000 });
  });

  test('submits login with remember me enabled', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        success: true,
        token: 'mock-jwt-token-extended',
        user: { id: '123', email: 'parent@example.com', role: 'parent' }
      }
    });

    render(<ParentLogin />);

    // Fill form and check remember me
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'parent@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'SecurePass123' }
    });

    const rememberCheckbox = screen.getByLabelText('Remember me for 7 days');
    fireEvent.click(rememberCheckbox);

    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/parent/login', {
        email: 'parent@example.com',
        password: 'SecurePass123',
        rememberMe: true
      });
    });
  });

  test('handles login API errors gracefully', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(<ParentLogin />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'parent@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpassword' }
    });

    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('handles network errors gracefully', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network Error'));

    render(<ParentLogin />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'parent@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'SecurePass123' }
    });

    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please check your credentials and try again.')).toBeInTheDocument();
    });
  });

  test('shows loading state during submission', async () => {
    mockedAxios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<ParentLogin />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'parent@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'SecurePass123' }
    });

    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for completion
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('disables form inputs during loading', async () => {
    mockedAxios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<ParentLogin />);

    // Fill form
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'parent@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePass123' } });

    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();

    // Wait for completion
    await waitFor(() => {
      expect(emailInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('navigates to registration page', () => {
    render(<ParentLogin />);

    const registerLink = screen.getByText('Create your Parent Account');
    expect(registerLink.closest('a')).toHaveAttribute('href', '/parent/register');
  });

  test('alerts on forgot password click', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<ParentLogin />);

    const forgotLink = screen.getByText('Forgot password?');
    fireEvent.click(forgotLink);

    // Click the forgot password functionality (simulated)
    const modalButton = screen.getByText('Back to Login');
    // The alert happens when forgot password is clicked, before modal opens
    // This test verifies the forgot password flow works

    expect(alertMock).toHaveBeenCalledWith('Forgot password functionality will be implemented soon. Please contact support for assistance.');

    alertMock.mockRestore();
  });

  test('maintains form state after failed login', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(<ParentLogin />);

    // Fill form
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'parent@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const submitButton = screen.getByText('Sign In to SafeGo');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Form should still have the values
    expect(emailInput).toHaveValue('parent@example.com');
    expect(passwordInput).toHaveValue('wrongpassword');
  });
});
