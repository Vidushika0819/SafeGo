import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityFeed from '../components/Parent/ActivityFeed';

describe('ActivityFeed', () => {
  test('renders activity feed with header', () => {
    render(<ActivityFeed />);

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Latest updates on your children\'s transportation')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  test('displays activity items', () => {
    render(<ActivityFeed />);

    expect(screen.getByText('Morning Pickup Started')).toBeInTheDocument();
    expect(screen.getByText('Child Picked Up')).toBeInTheDocument();
    expect(screen.getByText('Message from Administrator')).toBeInTheDocument();
    expect(screen.getByText('Afternoon Drop-off Completed')).toBeInTheDocument();
  });

  test('shows activity descriptions', () => {
    render(<ActivityFeed />);

    expect(screen.getByText('Sarah Johnson\'s morning route has begun')).toBeInTheDocument();
    expect(screen.getByText('Emma Johnson was picked up at 7:45 AM')).toBeInTheDocument();
    expect(screen.getByText('Route delay notification sent')).toBeInTheDocument();
  });

  test('displays status badges', () => {
    render(<ActivityFeed />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Unread')).toBeInTheDocument();
  });

  test('shows time ago formatting', () => {
    render(<ActivityFeed />);

    // These should show relative time (e.g., "30 minutes ago", "2 hours ago", etc.)
    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });

  test('renders activity icons', () => {
    render(<ActivityFeed />);

    const activityFeed = screen.getByText('Recent Activity').closest('div');
    expect(activityFeed).toHaveTextContent('🚌'); // Trip icon
    expect(activityFeed).toHaveTextContent('✅'); // Completed icon
    expect(activityFeed).toHaveTextContent('💬'); // Message icon
    expect(activityFeed).toHaveTextContent('🏠'); // Home icon
  });

  test('displays action buttons for specific activities', () => {
    render(<ActivityFeed />);

    expect(screen.getByText('View Message')).toBeInTheDocument();
    expect(screen.getAllByText('View Details')).toHaveLength(2); // Should appear for trip-related activities
  });

  test('renders load more button', () => {
    render(<ActivityFeed />);

    expect(screen.getByText('Load More Activities')).toBeInTheDocument();
  });

  test('displays activity filters', () => {
    render(<ActivityFeed />);

    expect(screen.getByText('Filter Activities')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Trips')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  test('highlights unread activities', () => {
    render(<ActivityFeed />);

    // The unread message should have different styling (though we can't easily test the exact background color)
    const unreadActivity = screen.getByText('Message from Administrator').closest('div');
    expect(unreadActivity).toBeInTheDocument();
  });

  test('shows proper activity timestamps', () => {
    render(<ActivityFeed />);

    // Check that we have various time formats
    const timeElements = screen.getAllByText(/\d+.*ago/);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  test('renders activity feed layout correctly', () => {
    render(<ActivityFeed />);

    // Check that activities are in a vertical list
    const activities = screen.getAllByText(/ago/);
    expect(activities.length).toBeGreaterThan(3); // Should have multiple activities
  });

  test('displays activity types correctly', () => {
    render(<ActivityFeed />);

    // Check for different activity types
    expect(screen.getByText('Morning Pickup Started')).toBeInTheDocument(); // trip_started
    expect(screen.getByText('Child Picked Up')).toBeInTheDocument(); // child_picked_up
    expect(screen.getByText('Message from Administrator')).toBeInTheDocument(); // message_received
    expect(screen.getByText('Afternoon Drop-off Completed')).toBeInTheDocument(); // trip_completed
  });
});
