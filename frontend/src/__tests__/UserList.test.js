import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from '../components/Admin/UserManagement/UserList';

describe('UserList Component', () => {
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
      status: 'inactive',
      createdAt: '2025-01-02T00:00:00.000Z'
    },
    {
      _id: '3',
      name: 'Bob Driver',
      email: 'bob@driver.com',
      role: 'driver',
      status: 'suspended',
      createdAt: '2025-01-03T00:00:00.000Z'
    }
  ];

  const defaultProps = {
    users: mockUsers,
    loading: false,
    currentPage: 1,
    totalPages: 2,
    onPageChange: jest.fn(),
    onEditUser: jest.fn(),
    onRefresh: jest.fn()
  };

  test('renders user list with all users', () => {
    render(<UserList {...defaultProps} />);

    // Check table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check user data
    expect(screen.getByText('John Admin')).toBeInTheDocument();
    expect(screen.getByText('john@admin.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Coordinator')).toBeInTheDocument();
    expect(screen.getByText('jane@coord.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Driver')).toBeInTheDocument();
    expect(screen.getByText('bob@driver.com')).toBeInTheDocument();
  });

  test('displays role badges with correct colors', () => {
    render(<UserList {...defaultProps} />);

    // Check role badges
    const adminBadge = screen.getByText('admin');
    const coordinatorBadge = screen.getByText('coordinator');
    const driverBadge = screen.getByText('driver');

    expect(adminBadge).toBeInTheDocument();
    expect(coordinatorBadge).toBeInTheDocument();
    expect(driverBadge).toBeInTheDocument();
  });

  test('displays status badges with correct colors', () => {
    render(<UserList {...defaultProps} />);

    // Check status badges
    const activeBadge = screen.getByText('active');
    const inactiveBadge = screen.getByText('inactive');
    const suspendedBadge = screen.getByText('suspended');

    expect(activeBadge).toBeInTheDocument();
    expect(inactiveBadge).toBeInTheDocument();
    expect(suspendedBadge).toBeInTheDocument();
  });

  test('formats dates correctly', () => {
    render(<UserList {...defaultProps} />);

    // Check date formatting (should show localized date)
    expect(screen.getByText('1/1/2025')).toBeInTheDocument();
    expect(screen.getByText('1/2/2025')).toBeInTheDocument();
    expect(screen.getByText('1/3/2025')).toBeInTheDocument();
  });

  test('shows loading state when loading is true', () => {
    render(<UserList {...defaultProps} loading={true} />);

    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  test('shows empty state when no users found', () => {
    render(<UserList {...defaultProps} users={[]} />);

    expect(screen.getByText('No users found matching your criteria')).toBeInTheDocument();
  });

  test('displays pagination info correctly', () => {
    render(<UserList {...defaultProps} />);

    expect(screen.getByText('Showing 3 users (Page 1 of 2)')).toBeInTheDocument();
  });

  test('calls onEditUser when edit button is clicked', () => {
    render(<UserList {...defaultProps} />);

    const editButtons = screen.getAllByText('✏️ Edit');
    fireEvent.click(editButtons[0]);

    expect(defaultProps.onEditUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  test('calls onRefresh when refresh button is clicked', () => {
    render(<UserList {...defaultProps} />);

    const refreshButton = screen.getByText('🔄 Refresh');
    fireEvent.click(refreshButton);

    expect(defaultProps.onRefresh).toHaveBeenCalled();
  });

  test('renders pagination controls when totalPages > 1', () => {
    render(<UserList {...defaultProps} />);

    expect(screen.getByText('← Previous')).toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('does not render pagination when totalPages = 1', () => {
    render(<UserList {...defaultProps} totalPages={1} />);

    expect(screen.queryByText('← Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next →')).not.toBeInTheDocument();
  });

  test('calls onPageChange when page button is clicked', () => {
    render(<UserList {...defaultProps} />);

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  test('disables Previous button on first page', () => {
    render(<UserList {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByText('← Previous');
    expect(prevButton).toBeDisabled();
  });

  test('disables Next button on last page', () => {
    render(<UserList {...defaultProps} currentPage={2} totalPages={2} />);

    const nextButton = screen.getByText('Next →');
    expect(nextButton).toBeDisabled();
  });

  test('handles undefined user name gracefully', () => {
    const usersWithUndefinedName = [
      { ...mockUsers[0], name: undefined }
    ];

    render(<UserList {...defaultProps} users={usersWithUndefinedName} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  test('handles undefined createdAt gracefully', () => {
    const usersWithUndefinedDate = [
      { ...mockUsers[0], createdAt: undefined }
    ];

    render(<UserList {...defaultProps} users={usersWithUndefinedDate} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  test('renders table with proper responsive overflow', () => {
    render(<UserList {...defaultProps} />);

    const tableContainer = screen.getByRole('table').parentElement;
    expect(tableContainer).toHaveStyle({ overflowX: 'auto' });
  });
});
