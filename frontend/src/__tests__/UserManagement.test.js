import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import UserManagement from '../components/Admin/UserManagement/UserManagement';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock child components
jest.mock('../components/Admin/UserManagement/UserList', () => {
  return function MockUserList({ users, loading, onEditUser }) {
    return (
      <div data-testid="user-list">
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <div>
            {users.map(user => (
              <div key={user._id} data-testid={`user-${user._id}`}>
                {user.name} - {user.email}
                <button onClick={() => onEditUser(user)} data-testid={`edit-${user._id}`}>
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
});

jest.mock('../components/Admin/UserManagement/UserFilters', () => {
  return function MockUserFilters({ filters, onFilterChange }) {
    return (
      <div data-testid="user-filters">
        <input
          data-testid="search-input"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
        <select
          data-testid="role-select"
          value={filters.role}
          onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="coordinator">Coordinator</option>
          <option value="driver">Driver</option>
        </select>
      </div>
    );
  };
});

jest.mock('../components/Admin/UserManagement/UserForm', () => {
  return function MockUserForm({ user, onSave, onCancel }) {
    return (
      <div data-testid="user-form">
        <h2>{user ? 'Edit User' : 'Create New User'}</h2>
        <button onClick={() => onSave({ id: 'new-user' })} data-testid="save-button">
          Save
        </button>
        <button onClick={onCancel} data-testid="cancel-button">
          Cancel
        </button>
      </div>
    );
  };
});

describe('UserManagement Component', () => {
  const mockUsers = [
    {
      _id: '1',
      name: 'John Admin',
      email: 'john@admin.com',
      role: 'admin',
      status: 'active',
      createdAt: '2025-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      name: 'Jane Coordinator',
      email: 'jane@coord.com',
      role: 'coordinator',
      status: 'active',
      createdAt: '2025-01-02T00:00:00.000Z'
    }
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Default auth mock
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => true),
      getToken: jest.fn(() => 'mock-token'),
      logout: jest.fn(),
      getUserDisplayName: jest.fn(() => 'Test Admin')
    });

    // Default axios mock
    mockedAxios.get.mockResolvedValue({
      data: {
        users: mockUsers,
        totalPages: 1
      }
    });
  });

  test('renders UserManagement component with admin access', async () => {
    render(<UserManagement />);

    // Check if main elements are rendered
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Manage system users, roles, and permissions')).toBeInTheDocument();
    expect(screen.getByText('Add New User')).toBeInTheDocument();

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-list')).toBeInTheDocument();
    });
  });

  test('redirects non-admin users', () => {
    // Mock non-admin user
    mockUseAuth.mockReturnValue({
      isAdmin: jest.fn(() => false),
      getToken: jest.fn(() => 'mock-token')
    });

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    render(<UserManagement />);

    expect(window.location.href).toBe('/login');
  });

  test('loads and displays users on mount', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/admin/users?page=1&limit=10&search=&role=&status=',
        {
          headers: { Authorization: 'Bearer mock-token' }
        }
      );
    });

    // Check if users are displayed
    await waitFor(() => {
      expect(screen.getByTestId('user-John Admin - john@admin.com')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch users')).toBeInTheDocument();
    });
  });

  test('opens create user form when Add New User is clicked', async () => {
    render(<UserManagement />);

    const addButton = screen.getByText('Add New User');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
      expect(screen.getByText('Create New User')).toBeInTheDocument();
    });
  });

  test('opens edit user form when edit button is clicked', async () => {
    render(<UserManagement />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-list')).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('edit-1');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
      expect(screen.getByText('Edit User')).toBeInTheDocument();
    });
  });

  test('refreshes user list after form save', async () => {
    render(<UserManagement />);

    // Open create form
    const addButton = screen.getByText('Add New User');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
    });

    // Click save
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);

    // Verify API was called again to refresh
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });

  test('closes form when cancel is clicked', async () => {
    render(<UserManagement />);

    // Open create form
    const addButton = screen.getByText('Add New User');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
    });

    // Click cancel
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('user-form')).not.toBeInTheDocument();
    });
  });

  test('updates filters and refetches users', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByTestId('user-filters')).toBeInTheDocument();
    });

    // Change search filter
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'john' } });

    // Verify API was called with new filters
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:5000/api/admin/users?page=1&limit=10&search=john&role=&status=',
        expect.any(Object)
      );
    });
  });

  test('displays breadcrumb navigation', async () => {
    render(<UserManagement />);

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<UserManagement />);

    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });
});
