import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardWidgets from '../components/Parent/DashboardWidgets';

describe('DashboardWidgets', () => {
  test('renders all dashboard widgets', () => {
    render(<DashboardWidgets />);

    // Check main widget titles
    expect(screen.getByText('My Children')).toBeInTheDocument();
    expect(screen.getByText('Active Trips')).toBeInTheDocument();
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    expect(screen.getByText('System Status')).toBeInTheDocument();
  });

  test('displays children overview data', () => {
    render(<DashboardWidgets />);

    expect(screen.getByText('Children registered in the system')).toBeInTheDocument();
    expect(screen.getByText('Total Children')).toBeInTheDocument();
    expect(screen.getByText('2 Active')).toBeInTheDocument();
    expect(screen.getByText('Manage Children')).toBeInTheDocument();
  });

  test('displays trip information', () => {
    render(<DashboardWidgets />);

    expect(screen.getByText('Current trip assignments')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('View All Trips')).toBeInTheDocument();
  });

  test('displays quick stats', () => {
    render(<DashboardWidgets />);

    expect(screen.getByText('Overview of your activity')).toBeInTheDocument();
    expect(screen.getByText('Unread Messages')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Pending Actions')).toBeInTheDocument();
  });

  test('displays system status information', () => {
    render(<DashboardWidgets />);

    expect(screen.getByText('SafeGo system overview')).toBeInTheDocument();
    expect(screen.getByText('Routes')).toBeInTheDocument();
    expect(screen.getByText('Buses')).toBeInTheDocument();
    expect(screen.getByText('Drivers')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('✅ System Operational')).toBeInTheDocument();
  });

  test('renders action buttons', () => {
    render(<DashboardWidgets />);

    const manageChildrenButton = screen.getByText('Manage Children');
    const viewTripsButton = screen.getByText('View All Trips');

    expect(manageChildrenButton).toBeInTheDocument();
    expect(viewTripsButton).toBeInTheDocument();

    // Check button styling (they should be clickable)
    expect(manageChildrenButton).toHaveStyle({ cursor: 'pointer' });
    expect(viewTripsButton).toHaveStyle({ cursor: 'pointer' });
  });

  test('displays formatted numbers correctly', () => {
    render(<DashboardWidgets />);

    // Check that numbers are formatted (though the exact formatting depends on locale)
    // We can check that the numbers appear in the expected locations
    expect(screen.getByText('2')).toBeInTheDocument(); // Total children
    expect(screen.getByText('12')).toBeInTheDocument(); // Routes
    expect(screen.getByText('8')).toBeInTheDocument(); // Buses
    expect(screen.getByText('6')).toBeInTheDocument(); // Drivers
  });

  test('renders widget icons', () => {
    render(<DashboardWidgets />);

    // Check that emoji icons are present
    const widgetsContainer = screen.getByText('My Children').closest('div');
    expect(widgetsContainer).toHaveTextContent('👨‍👩‍👧‍👦'); // Children icon
    expect(widgetsContainer).toHaveTextContent('🚌'); // Bus icon
    expect(widgetsContainer).toHaveTextContent('📊'); // Stats icon
    expect(widgetsContainer).toHaveTextContent('🏫'); // School icon
  });

  test('displays status indicators', () => {
    render(<DashboardWidgets />);

    // Check for status badges/indicators
    expect(screen.getByText('2 Active')).toBeInTheDocument();
    expect(screen.getByText('1 In Progress')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument(); // System online indicator
  });

  test('renders responsive grid layout', () => {
    render(<DashboardWidgets />);

    // The component should use CSS Grid with responsive columns
    const gridContainer = screen.getByText('My Children').closest('div').parentElement;
    expect(gridContainer).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
    });
  });
});
