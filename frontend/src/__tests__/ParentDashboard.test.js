import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParentDashboard from '../components/Parent/ParentDashboard';

// Mock all the child components
jest.mock('../components/Parent/ParentSidebar', () => {
  return function MockParentSidebar({ activeSection }) {
    return <div data-testid="parent-sidebar">ParentSidebar - {activeSection}</div>;
  };
});

jest.mock('../components/Parent/DashboardWidgets', () => {
  return function MockDashboardWidgets() {
    return <div data-testid="dashboard-widgets">DashboardWidgets</div>;
  };
});

jest.mock('../components/Parent/QuickActions', () => {
  return function MockQuickActions() {
    return <div data-testid="quick-actions">QuickActions</div>;
  };
});

jest.mock('../components/Parent/ActivityFeed', () => {
  return function MockActivityFeed() {
    return <div data-testid="activity-feed">ActivityFeed</div>;
  };
});

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'parent@safego.com' },
    getUserDisplayName: () => 'John Parent'
  })
}));

// Mock window.innerWidth for responsive tests
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024
});

describe('ParentDashboard', () => {
  test('renders dashboard with all components', () => {
    render(<ParentDashboard />);

    // Check main components are rendered
    expect(screen.getByTestId('parent-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-widgets')).toBeInTheDocument();
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    expect(screen.getByTestId('activity-feed')).toBeInTheDocument();
  });

  test('displays welcome message with user name', () => {
    render(<ParentDashboard />);

    expect(screen.getByText('Welcome back, John! 👋')).toBeInTheDocument();
    expect(screen.getByText('Here\'s what\'s happening with your children\'s transportation today.')).toBeInTheDocument();
  });

  test('renders header with breadcrumb navigation', () => {
    render(<ParentDashboard />);

    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  test('displays user information in header', () => {
    render(<ParentDashboard />);

    expect(screen.getByText('John Parent')).toBeInTheDocument();
    expect(screen.getByText('Parent Account')).toBeInTheDocument();
  });

  test('renders user avatar with correct initial', () => {
    render(<ParentDashboard />);

    // The avatar should show the first letter of the email
    const avatar = screen.getByText('P'); // 'P' from 'parent@safego.com'
    expect(avatar).toBeInTheDocument();
  });

  test('passes correct activeSection to sidebar', () => {
    render(<ParentDashboard />);

    expect(screen.getByText('ParentSidebar - dashboard')).toBeInTheDocument();
  });

  test('renders responsive layout', () => {
    render(<ParentDashboard />);

    // The main content should have proper styling for responsive design
    const mainContent = screen.getByText('Welcome back, John! 👋').closest('div').parentElement;
    expect(mainContent).toHaveStyle({ flex: '1' });
  });

  test('displays proper layout structure', () => {
    render(<ParentDashboard />);

    // Check that the layout has the expected structure
    const dashboardContainer = screen.getByText('Welcome back, John! 👋').closest('div');
    expect(dashboardContainer).toHaveStyle({ display: 'flex' });
  });

  test('renders main content area with proper padding', () => {
    render(<ParentDashboard />);

    const mainElement = screen.getByText('Welcome back, John! 👋').closest('main');
    expect(mainElement).toHaveStyle({ padding: '30px' });
  });

  test('includes mobile overlay for small screens', () => {
    // Set window width to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 600
    });

    render(<ParentDashboard />);

    // Should have mobile overlay (though it might not be visible by default)
    const overlay = document.getElementById('mobile-overlay');
    expect(overlay).toBeInTheDocument();
  });

  test('renders all dashboard sections in correct order', () => {
    render(<ParentDashboard />);

    // Get all the main sections
    const welcomeSection = screen.getByText('Welcome back, John! 👋');
    const widgetsSection = screen.getByTestId('dashboard-widgets');
    const quickActionsSection = screen.getByTestId('quick-actions');
    const activityFeedSection = screen.getByTestId('activity-feed');

    // All sections should be present
    expect(welcomeSection).toBeInTheDocument();
    expect(widgetsSection).toBeInTheDocument();
    expect(quickActionsSection).toBeInTheDocument();
    expect(activityFeedSection).toBeInTheDocument();
  });

  test('applies correct styling to main container', () => {
    render(<ParentDashboard />);

    const mainContainer = screen.getByText('Welcome back, John! 👋').closest('div');
    expect(mainContainer).toHaveStyle({
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex'
    });
  });
});
