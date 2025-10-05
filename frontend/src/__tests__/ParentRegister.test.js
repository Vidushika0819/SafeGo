import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ParentRegister from '../components/Auth/ParentRegister';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock useNavigate if needed
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('ParentRegister Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders parent registration form', () => {
    render(<ParentRegister />);

    expect(screen.getByText('Join SafeGo as a Parent')).toBeInTheDocument();
    expect(screen.getByText('Create your account to manage your children\'s school transportation')).toBeInTheDocument();
    expect(screen.getByText('Create Parent Account')).toBeInTheDocument();
  });

  test('renders all required form fields', () => {
    render(<ParentRegister />);

    expect(screen.getByText('Full Name *')).toBeInTheDocument();
    expect(screen.getByText('Email Address *')).toBeInTheDocument();
    expect(screen.getByText('Phone Number (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Password *')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password *')).toBeInTheDocument();
    expect(screen.getByText('I agree to the')).toBeInTheDocument();
  });

  test('validates required fields on submit', async () => {
    render(<ParentRegister />);

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<ParentRegister />);

    const emailInput = screen.getByPlaceholderText('Enter your email address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  test('validates password strength', async () => {
    render(<ParentRegister />);

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  test('shows password strength indicator', () => {
    render(<ParentRegister />);

    const passwordInput = screen.getByPlaceholderText('Create a strong password');

    // Test weak password
    fireEvent.change(passwordInput, { target: { value: '123' } });
    expect(screen.getByText('Weak')).toBeInTheDocument();

    // Test strong password
    fireEvent.change(passwordInput, { target: { value: 'MySecurePass123!' } });
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  test('validates password confirmation match', async () => {
    render(<ParentRegister />);

    const passwordInput = screen.getByPlaceholderText('Create a strong password');
    const confirmInput = screen.getByPlaceholderText('Confirm your password');

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmInput, { target: { value: 'Password456' } });

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('validates terms acceptance', async () => {
    render(<ParentRegister />);

    // Fill required fields but don't check terms
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'John Parent' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), {
      target: { value: 'SecurePass123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'SecurePass123' }
    });

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
    });
  });

  test('validates name minimum length', async () => {
    render(<ParentRegister />);

    const nameInput = screen.getByPlaceholderText('Enter your full name');
    fireEvent.change(nameInput, { target: { value: 'J' } });

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  test('validates phone format if provided', async () => {
    render(<ParentRegister />);

    const phoneInput = screen.getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });

    // Fill other required fields
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'John Parent' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), {
      target: { value: 'SecurePass123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'SecurePass123' }
    });

    // Check terms
    const termsCheckbox = screen.getByRole('checkbox');
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument();
    });
  });

  test('submits form successfully', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Parent registration successful',
        token: 'mock-jwt-token',
        user: { id: '123', email: 'john@example.com', role: 'parent' }
      }
    });

    render(<ParentRegister />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'John Parent' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your phone number'), {
      target: { value: '+1234567890' }
    });
    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), {
      target: { value: 'SecurePass123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'SecurePass123' }
    });

    // Check terms
    const termsCheckbox = screen.getByRole('checkbox');
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/parent/register', {
        name: 'John Parent',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'SecurePass123'
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Parent registration successful! Welcome to SafeGo. You can now login to access your parent dashboard.')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { data: { message: 'Email already exists' } }
    });

    render(<ParentRegister />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'John Parent' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), {
      target: { value: 'SecurePass123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'SecurePass123' }
    });

    // Check terms
    const termsCheckbox = screen.getByRole('checkbox');
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  test('clears errors when user starts typing', async () => {
    render(<ParentRegister />);

    // Trigger validation error
    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
    });

    // Start typing
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    fireEvent.change(nameInput, { target: { value: 'J' } });

    expect(screen.queryByText('Full name is required')).not.toBeInTheDocument();
  });

  test('shows loading state during submission', async () => {
    mockedAxios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<ParentRegister />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'John Parent' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), {
      target: { value: 'SecurePass123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'SecurePass123' }
    });

    // Check terms
    const termsCheckbox = screen.getByRole('checkbox');
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('resets form after successful registration', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        success: true,
        message: 'Parent registration successful',
        token: 'mock-jwt-token',
        user: { id: '123', email: 'john@example.com', role: 'parent' }
      }
    });

    render(<ParentRegister />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'John Parent' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Create a strong password'), {
      target: { value: 'SecurePass123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'SecurePass123' }
    });

    // Check terms
    const termsCheckbox = screen.getByRole('checkbox');
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByText('Create Parent Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your full name')).toHaveValue('');
      expect(screen.getByPlaceholderText('Enter your email address')).toHaveValue('');
      expect(screen.getByPlaceholderText('Create a strong password')).toHaveValue('');
      expect(screen.getByPlaceholderText('Confirm your password')).toHaveValue('');
      expect(termsCheckbox).not.toBeChecked();
    });
  });
});
