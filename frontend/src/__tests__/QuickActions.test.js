import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickActions from '../components/Parent/QuickActions';

describe('QuickActions', () => {
  beforeEach(() => {
    global.alert = jest.fn();
  });

  test('renders quick actions panel', () => {
    render(<QuickActions />);

    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Common tasks and shortcuts for managing your children\'s transportation')).toBeInTheDocument();
  });

  test('renders all quick action buttons', () => {
    render(<QuickActions />);

    expect(screen.getByText('Add New Child')).toBeInTheDocument();
    expect(screen.getByText('View Available Trips')).toBeInTheDocument();
    expect(screen.getByText('Contact Administrator')).toBeInTheDocument();
    expect(screen.getByText('Update Profile')).toBeInTheDocument();
  });

  test('displays action descriptions', () => {
    render(<QuickActions />);

    expect(screen.getByText('Register a new child for transportation services')).toBeInTheDocument();
    expect(screen.getByText('Browse and assign children to transportation routes')).toBeInTheDocument();
    expect(screen.getByText('Send messages to school administrators')).toBeInTheDocument();
    expect(screen.getByText('Manage your account settings and preferences')).toBeInTheDocument();
  });

  test('handles quick action clicks with appropriate alerts', () => {
    render(<QuickActions />);

    // Test Add Child action
    const addChildButton = screen.getByText('Add New Child');
    fireEvent.click(addChildButton);
    expect(global.alert).toHaveBeenCalledWith(
      'Add Child functionality will be implemented in Story 3.3: Child Information Management'
    );

    // Test View Trips action
    const viewTripsButton = screen.getByText('View Available Trips');
    fireEvent.click(viewTripsButton);
    expect(global.alert).toHaveBeenCalledWith(
      'Trip Management will be implemented in Story 3.4: Trip Assignment for Children'
    );

    // Test Contact Admin action
    const contactAdminButton = screen.getByText('Contact Administrator');
    fireEvent.click(contactAdminButton);
    expect(global.alert).toHaveBeenCalledWith(
      'Contact Administrator will be implemented in Story 3.5: Parent Communication System'
    );

    // Test Update Profile action
    const updateProfileButton = screen.getByText('Update Profile');
    fireEvent.click(updateProfileButton);
    expect(global.alert).toHaveBeenCalledWith(
      'Profile Management will be implemented in future updates'
    );
  });

  test('renders additional action buttons', () => {
    render(<QuickActions />);

    expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    expect(screen.getByText('Trip History')).toBeInTheDocument();
    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
  });

  test('renders help section', () => {
    render(<QuickActions />);

    expect(screen.getByText('Need Help?')).toBeInTheDocument();
    expect(screen.getByText('Support Hotline')).toBeInTheDocument();
    expect(screen.getByText('Email Support')).toBeInTheDocument();
    expect(screen.getByText('User Guide')).toBeInTheDocument();
  });

  test('displays contact information', () => {
    render(<QuickActions />);

    expect(screen.getByText('Call 1-800-SAFEGO for immediate assistance')).toBeInTheDocument();
    expect(screen.getByText('support@safego.com - Response within 24 hours')).toBeInTheDocument();
    expect(screen.getByText('Access our comprehensive parent guide')).toBeInTheDocument();
  });

  test('renders action icons', () => {
    render(<QuickActions />);

    const quickActionsContainer = screen.getByText('Quick Actions').closest('div');
    expect(quickActionsContainer).toHaveTextContent('⚡'); // Quick actions icon
    expect(quickActionsContainer).toHaveTextContent('👶'); // Add child icon
    expect(quickActionsContainer).toHaveTextContent('🚌'); // View trips icon
    expect(quickActionsContainer).toHaveTextContent('💬'); // Contact admin icon
    expect(quickActionsContainer).toHaveTextContent('⚙️'); // Update profile icon
  });

  test('renders help section icons', () => {
    render(<QuickActions />);

    const helpSection = screen.getByText('Need Help?').closest('div');
    expect(helpSection).toHaveTextContent('❓'); // Help icon
    expect(helpSection).toHaveTextContent('📞'); // Phone icon
    expect(helpSection).toHaveTextContent('📧'); // Email icon
    expect(helpSection).toHaveTextContent('📖'); // User guide icon
  });

  test('renders additional action icons', () => {
    render(<QuickActions />);

    const additionalActions = screen.getByText('Emergency Contact').closest('div').parentElement;
    expect(additionalActions).toHaveTextContent('🚨'); // Emergency contact icon
    expect(additionalActions).toHaveTextContent('📚'); // Trip history icon
    expect(additionalActions).toHaveTextContent('🔔'); // Notification settings icon
  });

  test('has proper button styling and hover effects', () => {
    render(<QuickActions />);

    const addChildButton = screen.getByText('Add New Child');
    const buttonContainer = addChildButton.closest('div');

    // Check that the button container has cursor pointer (indicating it's clickable)
    expect(buttonContainer).toHaveStyle({ cursor: 'pointer' });
  });
});
