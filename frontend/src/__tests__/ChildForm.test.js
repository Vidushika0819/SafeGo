import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChildForm from '../components/Parent/Children/ChildForm';

// Mock the useAuth hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'parent123', email: 'parent@safego.com' }
  })
}));

// Mock fetch
global.fetch = jest.fn();

describe('ChildForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  test('renders form with step indicators', () => {
    render(<ChildForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByText('Add New Child')).toBeInTheDocument();
    expect(screen.getByText('Register a new child for transportation services')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
  });

  test('loads existing child data when editing', () => {
    const existingChild = {
      _id: 'child123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2015-01-01',
      gender: 'male',
      grade: 'grade1',
      schoolName: 'Test School',
      emergencyContacts: [
        { name: 'Mom', relationship: 'parent', phone: '123-456-7890', isPrimary: true },
        { name: 'Dad', relationship: 'parent', phone: '098-765-4321', isPrimary: false }
      ]
    };

    render(<ChildForm child={existingChild} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByText('Edit Child Information')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  });

  test('validates required fields on step 1', async () => {
    render(<ChildForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      expect(screen.getByText('Gender is required')).toBeInTheDocument();
      expect(screen.getByText('Grade is required')).toBeInTheDocument();
      expect(screen.getByText('School name is required')).toBeInTheDocument();
    });
  });

  test('navigates between steps', () => {
    render(<ChildForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Start on step 1
    expect(screen.getByText('Basic Information')).toBeInTheDocument();

    // Fill required fields for step 1
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText('Date of Birth *'), {
      target: { value: '2015-01-01' }
    });
    fireEvent.change(screen.getByLabelText('Gender *'), {
      target: { value: 'male' }
    });
    fireEvent.change(screen.getByLabelText('Grade *'), {
      target: { value: 'grade1' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter school name'), {
      target: { value: 'Test School' }
    });

    // Click next
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Should be on step 2
    expect(screen.getByText('Emergency Contacts')).toBeInTheDocument();

    // Click previous
    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);

    // Should be back on step 1
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
  });

  test('validates emergency contacts on step 2', async () => {
    render(<ChildForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Navigate to step 2
    // Fill step 1 first
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText('Date of Birth *'), {
      target: { value: '2015-01-01' }
    });
    fireEvent.change(screen.getByLabelText('Gender *'), {
      target: { value: 'male' }
    });
    fireEvent.change(screen.getByLabelText('Grade *'), {
      target: { value: 'grade1' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter school name'), {
      target: { value: 'Test School' }
    });

    fireEvent.click(screen.getByText('Next'));

    // Try to go to next step without filling emergency contacts
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('Contact name is required')).toBeInTheDocument();
      expect(screen.getByText('Relationship is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });
  });

  test('handles emergency contact primary selection', () => {
    render(<ChildForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Navigate to step 2
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText('Date of Birth *'), {
      target: { value: '2015-01-01' }
    });
    fireEvent.change(screen.getByLabelText('Gender *'), {
      target: { value: 'male' }
    });
    fireEvent.change(screen.getByLabelText('Grade *'), {
      target: { value: 'grade1' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter school name'), {
      target: { value: 'Test School' }
    });

    fireEvent.click(screen.getByText('Next'));

    // Check that primary contact checkboxes exist
    const primaryCheckboxes = screen.getAllByLabelText('Primary Contact');
    expect(primaryCheckboxes).toHaveLength(2);
  });

  test('submits form successfully', async () => {
    const mockResponse = {
      data: {
        _id: 'newChildId',
        firstName: 'John',
        lastName: 'Doe'
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<ChildForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Fill all required fields
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText('Date of Birth *'), {
      target: { value: '2015-01-01' }
    });
    fireEvent.change(screen.getByLabelText('Gender *'), {
      target: { value: 'male' }
    });
    fireEvent.change(screen.getByLabelText('Grade *'), {
      target: { value: 'grade1' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter school name'), {
      target: { value: 'Test School' }
    });

    // Navigate to step 2
    fireEvent.click(screen.getByText('Next'));

    // Fill emergency contacts
    const contact1Name = screen.getAllByPlaceholderText('Enter full name')[0];
    const contact1Relationship = screen.getAllByDisplayValue('')[0];
    const contact1Phone = screen.getAllByPlaceholderText('Enter phone number')[0];

    fireEvent.change(contact1Name, { target: { value: 'Mom' } });
    fireEvent.change(contact1Relationship, { target: { value: 'parent' } });
    fireEvent.change(contact1Phone, { target: { value: '123-456-7890' } });

    const contact2Name = screen.getAllByPlaceholderText('Enter full name')[1];
    const contact2Relationship = screen.getAllByDisplayValue('')[1];
    const contact2Phone = screen.getAllByPlaceholderText('Enter phone number')[1];

    fireEvent.change(contact2Name, { target: { value: 'Dad' } });
    fireEvent.change(contact2Relationship, { target: { value: 'parent' } });
    fireEvent.change(contact2Phone, { target: { value: '098-765-4321' } });

    // Navigate to step 3
    fireEvent.click(screen.getByText('Next'));

    // Submit form
    fireEvent.click(screen.getByText('Add Child'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5005/api/children',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer undefined',
            'Content-Type': 'application/json'
          })
        })
      );
      expect(mockOnSave).toHaveBeenCalledWith(mockResponse.data);
    });
  });

  test('handles form submission errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Validation failed' })
    });

    render(<ChildForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Fill minimal required fields and try to submit
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText('Date of Birth *'), {
      target: { value: '2015-01-01' }
    });
    fireEvent.change(screen.getByLabelText('Gender *'), {
      target: { value: 'male' }
    });
    fireEvent.change(screen.getByLabelText('Grade *'), {
      target: { value: 'grade1' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter school name'), {
      target: { value: 'Test School' }
    });

    // Navigate to step 2 and fill emergency contacts
    fireEvent.click(screen.getByText('Next'));

    fireEvent.change(screen.getAllByPlaceholderText('Enter full name')[0], {
      target: { value: 'Mom' }
    });
    fireEvent.change(screen.getAllByDisplayValue('')[0], {
      target: { value: 'parent' }
    });
    fireEvent.change(screen.getAllByPlaceholderText('Enter phone number')[0], {
      target: { value: '123-456-7890' }
    });

    fireEvent.change(screen.getAllByPlaceholderText('Enter full name')[1], {
      target: { value: 'Dad' }
    });
    fireEvent.change(screen.getAllByDisplayValue('')[1], {
      target: { value: 'parent' }
    });
    fireEvent.change(screen.getAllByPlaceholderText('Enter phone number')[1], {
      target: { value: '098-765-4321' }
    });

    // Navigate to step 3 and submit
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Add Child'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to create child: Validation failed');
    });
  });

  test('cancels form when cancel button is clicked', () => {
    render(<ChildForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('renders step indicators correctly', () => {
    render(<ChildForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByText('👶')).toBeInTheDocument(); // Basic info icon
    expect(screen.getByText('📞')).toBeInTheDocument(); // Emergency contacts icon
    expect(screen.getByText('📋')).toBeInTheDocument(); // Additional info icon
  });
});
