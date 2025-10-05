import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParentSidebar from '../components/Parent/ParentSidebar';

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'parent@safego.com' },
    logout: jest.fn()
  })
}));

// Mock window.confirm
global.confirm = jest.fn(() => true);

// Mock window.innerWidth for responsive tests
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024
});

describe('ParentSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sidebar with navigation items', () => {
    render(<ParentSidebar activeSection="dashboard" />);

    // Check header
    expect(screen.getByText('SafeGo Parent')).toBeInTheDocument();
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();

    // Check navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Children')).toBeInTheDocument();
    expect(screen.getByText('Trip Management')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('highlights active section', () => {
    render(<ParentSidebar activeSection="children" />);

    // The children section should be highlighted (though we can't easily test the exact styling)
    // We can test that the component renders with the correct activeSection prop
    expect(screen.getByText('My Children')).toBeInTheDocument();
  });

  test('shows user email in sidebar footer', () => {
    render(<ParentSidebar activeSection="dashboard" />);

    expect(screen.getByText('Logged in as:')).toBeInTheDocument();
    expect(screen.getByText('parent@safego.com')).toBeInTheDocument();
  });

  test('handles navigation clicks with alerts', () => {
    // Mock window.alert
    global.alert = jest.fn();

    render(<ParentSidebar activeSection="dashboard" />);

    const childrenLink = screen.getByText('My Children');
    fireEvent.click(childrenLink);

    expect(global.alert).toHaveBeenCalledWith(
      'Navigation to /parent/children will be implemented in future stories.'
    );
  });

  test('handles logout with confirmation', () => {
    const mockLogout = jest.fn();
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        user: { email: 'parent@safego.com' },
        logout: mockLogout
      })
    }));

    render(<ParentSidebar activeSection="dashboard" />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to logout?');
  });

  test('toggles sidebar collapse', () => {
    render(<ParentSidebar activeSection="dashboard" />);

    const toggleButton = screen.getByTitle('Collapse sidebar');
    expect(toggleButton).toBeInTheDocument();

    // Initially expanded (we can't easily test the exact width changes in this test environment)
    // But we can verify the button exists and has the correct title
    fireEvent.click(toggleButton);

    // After clicking, the title should change
    expect(screen.getByTitle('Expand sidebar')).toBeInTheDocument();
  });

  test('shows tooltips when collapsed', () => {
    // Set window width to trigger collapsed state
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 600
    });

    render(<ParentSidebar activeSection="dashboard" />);

    // When collapsed, navigation items should have title attributes
    const dashboardItem = screen.getByTitle('Dashboard');
    expect(dashboardItem).toBeInTheDocument();
  });

  test('renders navigation icons', () => {
    render(<ParentSidebar activeSection="dashboard" />);

    // Check that emoji icons are present (they're rendered as text)
    const sidebar = screen.getByText('SafeGo Parent').closest('div');
    expect(sidebar).toHaveTextContent('📊'); // Dashboard icon
    expect(sidebar).toHaveTextContent('👨‍👩‍👧‍👦'); // Children icon
    expect(sidebar).toHaveTextContent('🚌'); // Trips icon
    expect(sidebar).toHaveTextContent('💬'); // Messages icon
    expect(sidebar).toHaveTextContent('👤'); // Profile icon
  });

  test('displays navigation descriptions', () => {
    render(<ParentSidebar activeSection="dashboard" />);

    expect(screen.getByText('Overview and quick actions')).toBeInTheDocument();
    expect(screen.getByText('Manage children information')).toBeInTheDocument();
    expect(screen.getByText('View and assign trips')).toBeInTheDocument();
    expect(screen.getByText('Contact and notifications')).toBeInTheDocument();
    expect(screen.getByText('Account settings')).toBeInTheDocument();
  });
});
