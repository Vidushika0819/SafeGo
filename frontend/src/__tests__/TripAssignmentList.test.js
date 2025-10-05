import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TripAssignmentList from '../components/Parent/TripAssignments/TripAssignmentList';

// Mock the useAuth hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'parent123', email: 'parent@safego.com' }
  })
}));

// Mock fetch
global.fetch = jest.fn();

describe('TripAssignmentList', () => {
  const mockOnEdit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  test('renders loading state initially', () => {
    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Loading trip assignments...')).toBeInTheDocument();
  });

  test('renders assignments list when data is loaded', async () => {
    const mockAssignments = [
      {
        _id: 'assignment1',
        child: {
          firstName: 'John',
          lastName: 'Doe',
          grade: 'grade1',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T001',
          date: '2025-10-01',
          start_time: '08:00',
          end_time: '09:00',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'both',
        status: 'active',
        assignedDate: '2025-09-30',
        notes: 'Morning pickup'
      }
    ];

    const mockStats = {
      active: 1,
      completed: 0,
      canceled: 0
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAssignments, count: 1 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockStats })
      });

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('Trip Assignments')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('T001')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  test('renders empty state when no assignments', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { active: 0, completed: 0, canceled: 0 } })
      });

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('No Trip Assignments')).toBeInTheDocument();
      expect(screen.getByText('You haven\'t assigned any children to trips yet.')).toBeInTheDocument();
      expect(screen.getByText('Click "Assign to Trip" to get started.')).toBeInTheDocument();
    });
  });

  test('displays statistics correctly', async () => {
    const mockAssignments = [];
    const mockStats = {
      active: 3,
      completed: 2,
      canceled: 1
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAssignments, count: 0 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockStats })
      });

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Active count
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Canceled')).toBeInTheDocument();
    });
  });

  test('shows edit and cancel buttons for active assignments', async () => {
    const mockAssignments = [
      {
        _id: 'assignment1',
        child: {
          firstName: 'John',
          lastName: 'Doe',
          grade: 'grade1',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T001',
          date: '2025-10-01',
          start_time: '08:00',
          end_time: '09:00',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'both',
        status: 'active',
        assignedDate: '2025-09-30'
      }
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAssignments, count: 1 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { active: 1, completed: 0, canceled: 0 } })
      });

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  test('does not show action buttons for non-active assignments', async () => {
    const mockAssignments = [
      {
        _id: 'assignment1',
        child: {
          firstName: 'John',
          lastName: 'Doe',
          grade: 'grade1',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T001',
          date: '2025-10-01',
          start_time: '08:00',
          end_time: '09:00',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'both',
        status: 'completed',
        assignedDate: '2025-09-30'
      }
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAssignments, count: 1 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { active: 0, completed: 1, canceled: 0 } })
      });

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  test('handles cancel assignment with confirmation', async () => {
    const mockAssignments = [
      {
        _id: 'assignment1',
        child: {
          firstName: 'John',
          lastName: 'Doe',
          grade: 'grade1',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T001',
          date: '2025-10-01',
          start_time: '08:00',
          end_time: '09:00',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'both',
        status: 'active',
        assignedDate: '2025-09-30'
      }
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAssignments, count: 1 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { active: 1, completed: 0, canceled: 0 } })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Assignment canceled successfully' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 }) // Refetch returns empty
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { active: 0, completed: 0, canceled: 1 } })
      });

    // Mock window.confirm
    window.confirm = jest.fn().mockReturnValue(true);

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to cancel this trip assignment?');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5005/api/trip-assignments/assignment1',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Authorization': 'Bearer undefined',
          'Content-Type': 'application/json'
        })
      })
    );
  });

  test('handles cancel assignment when user declines confirmation', async () => {
    const mockAssignments = [
      {
        _id: 'assignment1',
        child: {
          firstName: 'John',
          lastName: 'Doe',
          grade: 'grade1',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T001',
          date: '2025-10-01',
          start_time: '08:00',
          end_time: '09:00',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'both',
        status: 'active',
        assignedDate: '2025-09-30'
      }
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAssignments, count: 1 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { active: 1, completed: 0, canceled: 0 } })
      });

    // Mock window.confirm to return false
    window.confirm = jest.fn().mockReturnValue(false);

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to cancel this trip assignment?');
    // Should not make the DELETE request
    expect(global.fetch).toHaveBeenCalledTimes(2); // Only the initial fetches
  });

  test('handles API errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Assignments')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  test('handles retry after error', async () => {
    global.fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], count: 0 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { active: 0, completed: 0, canceled: 0 } })
      });

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      const retryButton = screen.getByText('Try Again');
      fireEvent.click(retryButton);
    });

    await waitFor(() => {
      expect(screen.getByText('No Trip Assignments')).toBeInTheDocument();
    });
  });

  test('displays assignment type badges correctly', async () => {
    const mockAssignments = [
      {
        _id: 'assignment1',
        child: {
          firstName: 'John',
          lastName: 'Doe',
          grade: 'grade1',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T001',
          date: '2025-10-01',
          start_time: '08:00',
          end_time: '09:00',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'pickup',
        status: 'active',
        assignedDate: '2025-09-30'
      },
      {
        _id: 'assignment2',
        child: {
          firstName: 'Jane',
          lastName: 'Doe',
          grade: 'grade2',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T002',
          date: '2025-10-01',
          start_time: '15:00',
          end_time: '16:00',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'dropoff',
        status: 'active',
        assignedDate: '2025-09-30'
      },
      {
        _id: 'assignment3',
        child: {
          firstName: 'Bob',
          lastName: 'Smith',
          grade: 'grade1',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T003',
          date: '2025-10-01',
          start_time: '07:30',
          end_time: '16:30',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'both',
        status: 'active',
        assignedDate: '2025-09-30'
      }
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAssignments, count: 3 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { active: 3, completed: 0, canceled: 0 } })
      });

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('Pickup Only')).toBeInTheDocument();
      expect(screen.getByText('Drop-off Only')).toBeInTheDocument();
      expect(screen.getByText('Round Trip')).toBeInTheDocument();
    });
  });

  test('displays status badges with correct styling', async () => {
    const mockAssignments = [
      {
        _id: 'assignment1',
        child: {
          firstName: 'John',
          lastName: 'Doe',
          grade: 'grade1',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T001',
          date: '2025-10-01',
          start_time: '08:00',
          end_time: '09:00',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'both',
        status: 'active',
        assignedDate: '2025-09-30'
      },
      {
        _id: 'assignment2',
        child: {
          firstName: 'Jane',
          lastName: 'Doe',
          grade: 'grade2',
          schoolName: 'Test School'
        },
        trip: {
          Trip_ID: 'T002',
          date: '2025-10-01',
          start_time: '15:00',
          end_time: '16:00',
          route: 'Main Street Route',
          status: 'scheduled'
        },
        assignmentType: 'both',
        status: 'completed',
        assignedDate: '2025-09-30'
      }
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAssignments, count: 2 })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { active: 1, completed: 1, canceled: 0 } })
      });

    render(<TripAssignmentList onEdit={mockOnEdit} onCancel={mockOnCancel} />);

    await waitFor(() => {
      // Check that both status badges are rendered
      const activeBadges = screen.getAllByText('Active');
      const completedBadges = screen.getAllByText('Completed');
      expect(activeBadges.length).toBeGreaterThan(0);
      expect(completedBadges.length).toBeGreaterThan(0);
    });
  });
});
