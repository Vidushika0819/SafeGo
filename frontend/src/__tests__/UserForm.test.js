import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import UserForm from '../components/Admin/UserManagement/UserForm';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

describe('UserForm Component', () => {
  const mockProps = {
    user: null,
    onSave: jest.fn(),
    onCancel: jest.fn(),
    isAdmin: jest.fn(() => true),
    getToken: jest.fn(() => 'mock-token')
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => true),
      getToken: jest.fn(() => 'mock-token')
    });
  });

  describe('Create Mode', () => {
    test('renders create form with all required fields', () => {
      render(<UserForm {...mockProps} />);

      expect(screen.getByText('Create New User')).toBeInTheDocument();
      expect(screen.getByText('Full Name *')).toBeInTheDocument();
      expect(screen.getByText('Email Address *')).toBeInTheDocument();
      expect(screen.getByText('Password *')).toBeInTheDocument();
      expect(screen.getByText('Confirm Password *')).toBeInTheDocument();
      expect(screen.getByText('User Role *')).toBeInTheDocument();
    });

    test('validates required fields', async () => {
      render(<UserForm {...mockProps} />);

      const submitButton = screen.getByText('Create User');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    test('validates email format', async () => {
      render(<UserForm {...mockProps} />);

      const emailInput = screen.getByPlaceholderText('Enter email address');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByText('Create User');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    test('validates password strength', async () => {
      render(<UserForm {...mockProps} />);

      const passwordInput = screen.getByPlaceholderText('Enter password');
      fireEvent.change(passwordInput, { target: { value: 'weak' } });

      expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    test('validates password confirmation match', async () => {
      render(<UserForm {...mockProps} />);

      const passwordInput = screen.getByPlaceholderText('Enter password');
      const confirmInput = screen.getByPlaceholderText('Confirm password');

      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.change(confirmInput, { target: { value: 'Password456' } });

      const submitButton = screen.getByText('Create User');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    test('checks email uniqueness', async () => {
      mockedAxios.get.mockResolvedValue({ data: { available: false } });

      render(<UserForm {...mockProps} />);

      const emailInput = screen.getByPlaceholderText('Enter email address');
      fireEvent.change(emailInput, { target: { value: 'existing@email.com' } });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:5000/api/admin/users/check-email?email=existing%40email.com',
          expect.any(Object)
        );
      });

      await waitFor(() => {
        expect(screen.getByText('✗ Taken')).toBeInTheDocument();
      });
    });

    test('shows confirmation dialog on valid form submission', async () => {
      mockedAxios.get.mockResolvedValue({ data: { available: true } });
      mockedAxios.post.mockResolvedValue({ data: { _id: 'new-user' } });

      render(<UserForm {...mockProps} />);

      // Fill form
      fireEvent.change(screen.getByPlaceholderText('Enter full name'), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
        target: { value: 'Password123' }
      });

      const submitButton = screen.getByText('Create User');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Confirm Create User')).toBeInTheDocument();
      });
    });

    test('submits form successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: { available: true } });
      mockedAxios.post.mockResolvedValue({ data: { _id: 'new-user' } });

      render(<UserForm {...mockProps} />);

      // Fill form
      fireEvent.change(screen.getByPlaceholderText('Enter full name'), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
        target: { value: 'Password123' }
      });

      // Submit form
      const submitButton = screen.getByText('Create User');
      fireEvent.click(submitButton);

      // Confirm in dialog
      await waitFor(() => {
        expect(screen.getByText('Confirm Create User')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/admin/users',
          {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password123',
            role: 'driver'
          },
          expect.any(Object)
        );
        expect(mockProps.onSave).toHaveBeenCalledWith({ _id: 'new-user' });
      });
    });
  });

  describe('Edit Mode', () => {
    const existingUser = {
      _id: 'existing-user',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'coordinator'
    };

    test('renders edit form with pre-populated data', () => {
      render(<UserForm {...mockProps} user={existingUser} />);

      expect(screen.getByText('Edit User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
      expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Coordinator')).toBeInTheDocument();
    });

    test('does not show password fields in edit mode', () => {
      render(<UserForm {...mockProps} user={existingUser} />);

      expect(screen.queryByText('Password *')).not.toBeInTheDocument();
      expect(screen.queryByText('Confirm Password *')).not.toBeInTheDocument();
    });

    test('updates user successfully', async () => {
      mockedAxios.put.mockResolvedValue({ data: { ...existingUser, role: 'admin' } });

      render(<UserForm {...mockProps} user={existingUser} />);

      // Change role
      const roleSelect = screen.getByDisplayValue('Coordinator');
      fireEvent.change(roleSelect, { target: { value: 'admin' } });

      // Submit
      const submitButton = screen.getByText('Update User');
      fireEvent.click(submitButton);

      // Confirm
      await waitFor(() => {
        expect(screen.getByText('Confirm Update User')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalledWith(
          'http://localhost:5000/api/admin/users/existing-user',
          {
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'admin'
          },
          expect.any(Object)
        );
      });
    });
  });

  describe('Form Interactions', () => {
    test('clears validation errors when user starts typing', async () => {
      render(<UserForm {...mockProps} />);

      // Trigger validation error
      const submitButton = screen.getByText('Create User');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });

      // Start typing
      const nameInput = screen.getByPlaceholderText('Enter full name');
      fireEvent.change(nameInput, { target: { value: 'J' } });

      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });

    test('calls onCancel when cancel button is clicked', () => {
      render(<UserForm {...mockProps} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockProps.onCancel).toHaveBeenCalled();
    });

    test('closes confirmation dialog when cancel is clicked', async () => {
      render(<UserForm {...mockProps} />);

      // Fill form minimally to enable submit
      fireEvent.change(screen.getByPlaceholderText('Enter full name'), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
        target: { value: 'john@test.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
        target: { value: 'Password123' }
      });

      const submitButton = screen.getByText('Create User');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Confirm Create User')).toBeInTheDocument();
      });

      const cancelDialogButton = screen.getAllByText('Cancel')[1]; // Second cancel button
      fireEvent.click(cancelDialogButton);

      expect(screen.queryByText('Confirm Create User')).not.toBeInTheDocument();
    });

    test('handles API errors gracefully', async () => {
      mockedAxios.get.mockResolvedValue({ data: { available: true } });
      mockedAxios.post.mockRejectedValue({
        response: { data: { message: 'Email already exists' } }
      });

      render(<UserForm {...mockProps} />);

      // Fill and submit form
      fireEvent.change(screen.getByPlaceholderText('Enter full name'), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
        target: { value: 'john@test.com' }
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), {
        target: { value: 'Password123' }
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
        target: { value: 'Password123' }
      });

      const submitButton = screen.getByText('Create User');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Confirm Create User')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });
    });
  });

  describe('Password Strength Indicator', () => {
    test('shows weak password strength', () => {
      render(<UserForm {...mockProps} />);

      const passwordInput = screen.getByPlaceholderText('Enter password');
      fireEvent.change(passwordInput, { target: { value: '123' } });

      expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    test('shows strong password strength', () => {
      render(<UserForm {...mockProps} />);

      const passwordInput = screen.getByPlaceholderText('Enter password');
      fireEvent.change(passwordInput, { target: { value: 'MySecurePass123!' } });

      expect(screen.getByText('Strong')).toBeInTheDocument();
    });
  });

  describe('Role Descriptions', () => {
    test('shows admin role description', () => {
      render(<UserForm {...mockProps} />);

      const roleSelect = screen.getByDisplayValue('Driver');
      fireEvent.change(roleSelect, { target: { value: 'admin' } });

      expect(screen.getByText('Full system access and user management')).toBeInTheDocument();
    });

    test('shows coordinator role description', () => {
      render(<UserForm {...mockProps} />);

      const roleSelect = screen.getByDisplayValue('Driver');
      fireEvent.change(roleSelect, { target: { value: 'coordinator' } });

      expect(screen.getByText('Trip coordination and passenger management')).toBeInTheDocument();
    });
  });
});
