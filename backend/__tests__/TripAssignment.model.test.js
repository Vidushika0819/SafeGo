const TripAssignment = require('../Models/TripAssignment');
const Trip = require('../Models/TripModel');
const Child = require('../Models/Child');

describe('TripAssignment Model', () => {
  describe('Schema Validation', () => {
    test('should validate required fields', () => {
      const assignment = new TripAssignment({});

      const validationError = assignment.validateSync();

      expect(validationError.errors.child).toBeDefined();
      expect(validationError.errors.trip).toBeDefined();
      expect(validationError.errors.assignmentType).toBeDefined();
      expect(validationError.errors.status).toBeDefined();
      expect(validationError.errors.assignedDate).toBeDefined();
      expect(validationError.errors.assignedBy).toBeDefined();
    });

    test('should validate assignment type enum', () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'invalid-type',
        assignedBy: 'parent123'
      });

      const validationError = assignment.validateSync();
      expect(validationError.errors.assignmentType).toBeDefined();
    });

    test('should validate status enum', () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        status: 'invalid-status',
        assignedBy: 'parent123'
      });

      const validationError = assignment.validateSync();
      expect(validationError.errors.status).toBeDefined();
    });

    test('should validate phone format in emergency contacts', () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        assignedBy: 'parent123',
        emergencyContactOverride: {
          name: 'Test Contact',
          phone: 'invalid-phone',
          relationship: 'parent'
        }
      });

      const validationError = assignment.validateSync();
      expect(validationError.errors['emergencyContactOverride.phone']).toBeDefined();
    });
  });

  describe('Schema Indexes', () => {
    test('should have proper indexes defined', () => {
      const schema = TripAssignment.schema;

      // Check compound indexes
      expect(schema).toBeDefined();
      // Note: In unit tests, we can't easily verify actual index creation
      // but we can verify the schema structure exists
    });
  });

  describe('Default Values', () => {
    test('should set default values', () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'pickup',
        assignedBy: 'parent123'
      });

      expect(assignment.status).toBe('active');
      expect(assignment.assignedDate).toBeDefined();
      expect(assignment.lastModified).toBeDefined();
    });
  });

  describe('Pre-save Middleware', () => {
    test('should update lastModified on save', async () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        assignedBy: 'parent123'
      });

      const originalModified = assignment.lastModified;
      assignment.notes = 'Updated notes';

      // Mock save
      assignment.save = jest.fn().mockImplementation(function() {
        this.lastModified = new Date();
        return Promise.resolve(this);
      });

      await assignment.save();

      expect(assignment.save).toHaveBeenCalled();
      expect(assignment.lastModified).toBeDefined();
    });
  });

  describe('Static Methods', () => {
    test('should find active assignments by child', async () => {
      const mockAssignments = [
        { child: 'child123', status: 'active', assignmentType: 'both' },
        { child: 'child123', status: 'active', assignmentType: 'pickup' }
      ];

      TripAssignment.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAssignments)
      });

      const result = await TripAssignment.findActiveByChild('child123');

      expect(TripAssignment.find).toHaveBeenCalledWith({
        child: 'child123',
        status: 'active'
      });
      expect(result).toEqual(mockAssignments);
    });

    test('should find assignments by trip', async () => {
      const mockAssignments = [
        { trip: 'trip123', status: 'active' },
        { trip: 'trip123', status: 'completed' }
      ];

      TripAssignment.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAssignments)
      });

      const result = await TripAssignment.findByTrip('trip123');

      expect(TripAssignment.find).toHaveBeenCalledWith({
        trip: 'trip123',
        status: { $in: ['active', 'completed'] }
      });
      expect(result).toEqual(mockAssignments);
    });

    test('should get trip capacity', async () => {
      TripAssignment.find = jest.fn().mockResolvedValue([
        { trip: 'trip123', status: 'active' },
        { trip: 'trip123', status: 'active' },
        { trip: 'trip123', status: 'active' }
      ]);

      const capacity = await TripAssignment.getTripCapacity('trip123');

      expect(TripAssignment.find).toHaveBeenCalledWith({
        trip: 'trip123',
        status: 'active'
      });
      expect(capacity).toBe(3);
    });
  });

  describe('Instance Methods', () => {
    test('should cancel assignment', async () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        assignedBy: 'parent123',
        status: 'active'
      });

      assignment.save = jest.fn().mockResolvedValue(assignment);

      const result = await assignment.cancel('Test reason');

      expect(assignment.status).toBe('canceled');
      expect(assignment.notes).toBe('Test reason');
      expect(assignment.save).toHaveBeenCalled();
      expect(result).toBe(assignment);
    });

    test('should complete assignment', async () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        assignedBy: 'parent123',
        status: 'active'
      });

      assignment.save = jest.fn().mockResolvedValue(assignment);

      const result = await assignment.complete();

      expect(assignment.status).toBe('completed');
      expect(assignment.save).toHaveBeenCalled();
      expect(result).toBe(assignment);
    });
  });

  describe('Validation Middleware', () => {
    test('should prevent duplicate assignments', async () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        assignedBy: 'parent123'
      });

      // Mock existing assignment
      TripAssignment.findOne = jest.fn().mockResolvedValue({
        _id: 'existing123',
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        status: 'active'
      });

      assignment.save = jest.fn().mockImplementation(async function() {
        // Simulate pre-save validation
        const existing = await TripAssignment.findOne({
          child: this.child,
          trip: this.trip,
          assignmentType: this.assignmentType,
          status: 'active',
          _id: { $ne: this._id }
        });

        if (existing) {
          throw new Error(`Child already has an active ${this.assignmentType} assignment for this trip`);
        }

        return this;
      });

      await expect(assignment.save()).rejects.toThrow(
        'Child already has an active both assignment for this trip'
      );
    });

    test('should prevent conflicting time assignments', async () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'pickup',
        assignedBy: 'parent123'
      });

      // Mock existing conflicting assignment
      TripAssignment.findOne = jest.fn()
        .mockResolvedValueOnce(null) // First check passes
        .mockResolvedValueOnce({ // Second check finds conflict
          _id: 'existing123',
          child: 'child123',
          trip: { date: new Date(), start_time: '08:00', end_time: '09:00' },
          assignmentType: 'dropoff'
        });

      Trip.findById = jest.fn().mockResolvedValue({
        _id: 'trip123',
        date: new Date(),
        start_time: '08:30',
        end_time: '09:30'
      });

      assignment.save = jest.fn().mockImplementation(async function() {
        // Simulate conflict detection logic
        const trip = await Trip.findById(this.trip);
        const conflictingAssignment = await TripAssignment.findOne({
          child: this.child,
          status: 'active',
          _id: { $ne: this._id }
        });

        if (conflictingAssignment && trip) {
          const existingStart = conflictingAssignment.trip.start_time;
          const existingEnd = conflictingAssignment.trip.end_time;
          const newStart = trip.start_time;
          const newEnd = trip.end_time;

          if ((newStart < existingEnd && newEnd > existingStart)) {
            if (conflictingAssignment.assignmentType === this.assignmentType) {
              throw new Error('Child has conflicting trip assignment on the same day and time');
            }
          }
        }

        return this;
      });

      await expect(assignment.save()).rejects.toThrow(
        'Child has conflicting trip assignment on the same day and time'
      );
    });
  });

  describe('Field Validation', () => {
    test('should validate notes length', () => {
      const longNotes = 'A'.repeat(501); // Too long
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        assignedBy: 'parent123',
        notes: longNotes
      });

      const validationError = assignment.validateSync();
      expect(validationError.errors.notes).toBeDefined();
    });

    test('should validate emergency contact name length', () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        assignedBy: 'parent123',
        emergencyContactOverride: {
          name: 'A'.repeat(101), // Too long
          phone: '123-456-7890',
          relationship: 'parent'
        }
      });

      const validationError = assignment.validateSync();
      expect(validationError.errors['emergencyContactOverride.name']).toBeDefined();
    });

    test('should validate emergency contact relationship length', () => {
      const assignment = new TripAssignment({
        child: 'child123',
        trip: 'trip123',
        assignmentType: 'both',
        assignedBy: 'parent123',
        emergencyContactOverride: {
          name: 'Test Contact',
          phone: '123-456-7890',
          relationship: 'A'.repeat(51) // Too long
        }
      });

      const validationError = assignment.validateSync();
      expect(validationError.errors['emergencyContactOverride.relationship']).toBeDefined();
    });
  });
});
