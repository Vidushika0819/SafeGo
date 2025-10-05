import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserFilters from '../components/Admin/UserManagement/UserFilters';

describe('UserFilters Component', () => {
  const defaultFilters = {
    search: '',
    role: '',
    status: ''
  };

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all filter controls', () => {
    render(<UserFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText('🔍 Search Users')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by name or email...')).toBeInTheDocument();
    expect(screen.getByText('👤 Filter by Role')).toBeInTheDocument();
    expect(screen.getByText('📊 Filter by Status')).toBeInTheDocument();
  });

  test('displays search input with correct value', () => {
    const filtersWithSearch = { ...defaultFilters, search: 'john' };
    render(<UserFilters filters={filtersWithSearch} onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    expect(searchInput.value).toBe('john');
  });

  test('displays role select with correct value', () => {
    const filtersWithRole = { ...defaultFilters, role: 'admin' };
    render(<UserFilters filters={filtersWithRole} onFilterChange={mockOnFilterChange} />);

    const roleSelect = screen.getByDisplayValue('Admin');
    expect(roleSelect.value).toBe('admin');
  });

  test('displays status select with correct value', () => {
    const filtersWithStatus = { ...defaultFilters, status: 'active' };
    render(<UserFilters filters={filtersWithStatus} onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByDisplayValue('Active');
    expect(statusSelect.value).toBe('active');
  });

  test('calls onFilterChange when search input changes', () => {
    render(<UserFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      search: 'test search'
    });
  });

  test('calls onFilterChange when role select changes', () => {
    render(<UserFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const roleSelect = screen.getByDisplayValue('All Roles');
    fireEvent.change(roleSelect, { target: { value: 'coordinator' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      role: 'coordinator'
    });
  });

  test('calls onFilterChange when status select changes', () => {
    render(<UserFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByDisplayValue('All Statuses');
    fireEvent.change(statusSelect, { target: { value: 'inactive' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      status: 'inactive'
    });
  });

  test('does not show Clear Filters button when no filters are active', () => {
    render(<UserFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.queryByText('🗑️ Clear Filters')).not.toBeInTheDocument();
  });

  test('shows Clear Filters button when filters are active', () => {
    const activeFilters = {
      search: 'john',
      role: 'admin',
      status: 'active'
    };

    render(<UserFilters filters={activeFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText('🗑️ Clear Filters')).toBeInTheDocument();
  });

  test('shows active filters summary when filters are applied', () => {
    const activeFilters = {
      search: 'john',
      role: 'admin',
      status: ''
    };

    render(<UserFilters filters={activeFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText('Active Filters:')).toBeInTheDocument();
    expect(screen.getByText('Search: "john"')).toBeInTheDocument();
    expect(screen.getByText('Role: admin')).toBeInTheDocument();
  });

  test('clears all filters when Clear Filters is clicked', () => {
    const activeFilters = {
      search: 'john',
      role: 'admin',
      status: 'active'
    };

    render(<UserFilters filters={activeFilters} onFilterChange={mockOnFilterChange} />);

    const clearButton = screen.getByText('🗑️ Clear Filters');
    fireEvent.click(clearButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      role: '',
      status: ''
    });
  });

  test('renders with responsive flex layout', () => {
    render(<UserFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const container = screen.getByText('🔍 Search Users').closest('div');
    expect(container).toHaveStyle({ display: 'flex', flexWrap: 'wrap' });
  });

  test('has proper form labels and accessibility', () => {
    render(<UserFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    // Check that labels exist
    expect(screen.getByText('🔍 Search Users')).toBeInTheDocument();
    expect(screen.getByText('👤 Filter by Role')).toBeInTheDocument();
    expect(screen.getByText('📊 Filter by Status')).toBeInTheDocument();

    // Check that inputs have proper types
    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    expect(searchInput.type).toBe('text');

    const roleSelect = screen.getByDisplayValue('All Roles');
    expect(roleSelect.tagName).toBe('SELECT');

    const statusSelect = screen.getByDisplayValue('All Statuses');
    expect(statusSelect.tagName).toBe('SELECT');
  });

  test('role select has all expected options', () => {
    render(<UserFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const roleSelect = screen.getByDisplayValue('All Roles');
    expect(roleSelect).toHaveDisplayValue('All Roles');

    // Check options exist (using getByText for option content)
    expect(screen.getByText('All Roles')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Coordinator')).toBeInTheDocument();
    expect(screen.getByText('Driver')).toBeInTheDocument();
  });

  test('status select has all expected options', () => {
    render(<UserFilters filters={defaultFilters} onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByDisplayValue('All Statuses');
    expect(statusSelect).toHaveDisplayValue('All Statuses');

    // Check options exist
    expect(screen.getByText('All Statuses')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Suspended')).toBeInTheDocument();
  });
});
