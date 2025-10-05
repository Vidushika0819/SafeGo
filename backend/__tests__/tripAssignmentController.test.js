const TripAssignment = require('../Models/TripAssignment');
const Trip = require('../Models/TripModel');
const Child = require('../Models/Child');
const {
  getTripAssignments,
  getTripAssignment,
  createTripAssignment,
  updateTripAssignment,
  cancelTripAssignment,
  getAvailableTrips,
  getAssignmentStats
} = require('../Controllers/tripAssignmentController');

// Mock the models
jest.mock('../Models/TripAssignment');
jest.mock('../Models/TripModel');
jest.mock('../Models/Child');

describe('Trip Assignment Controller', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      user: { id: 'parent123', role: 'parent' },
      params: {},
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTripAssignments', () => {
    test('should return trip assignments for authenticated parent', async () => {
      const mockChildren = [
        { _id: 'child1' },
        { _id: 'child2' }
      ];
      const mockAssignments = [
        { child: 'child1', trip: 'trip1', assignmentType: 'both' },
        { child: 'child2', trip: 'trip2', assignmentType: 'pickup' }
      ];

      Child.find.mockResolvedValue(mockChildren);
      TripAssignment.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockAssignments)
          })
        })
      });

      await getTripAssignments(mockReq, mockRes);

      expect(Child.find).toHaveBeenCalledWith({ parent: 'parent123' });
      expect(TripAssignment.find).toHaveBeenCalledWith({
        child: { $in: ['child1', 'child2'] }
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockAssignments,
        count: 2
      });
    });

    test('should handle database errors', async () => {
      Child.find.mockRejectedValue(new Error('Database error'));

      await getTripAssignments(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error fetching trip assignments',
        error: 'Database error'
      });
    });
  });

  describe('getTripAssignment', () => {
    test('should return specific assignment for parent', async () => {
      const mockAssignment = {
        _id: 'assignment1',
        child: { _id: 'child1', parent: 'parent123' },
        trip: 'trip1'
      };
      mockReq.params.id = 'assignment1';

      TripAssignment.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockAssignment)
          })
        })
      });

      await getTripAssignment(mockReq, mockRes);

      expect(TripAssignment.findById).toHaveBeenCalledWith('assignment1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockAssignment
      });
    });

    test('should return 404 for non-existent assignment', async () => {
      mockReq.params.id = 'nonexistent';

      TripAssignment.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
          })
        })
      });

      await getTripAssignment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Trip assignment not found'
      });
    });

    test('should return 403 for assignment not owned by parent', async () => {
      const mockAssignment = {
        _id: 'assignment1',
        child: { _id: 'child1', parent: 'otherParent' },
        trip: 'trip1'
      };
      mockReq.params.id = 'assignment1';

      TripAssignment.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockAssignment)
          })
        })
      });

      await getTripAssignment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. You can only view assignments for your own children.'
      });
    });
  });

  describe('createTripAssignment', () => {
    test('should create new assignment successfully', async () => {
      const assignmentData = {
        childId: 'child1',
        tripId: 'trip1',
        assignmentType: 'both',
        notes: 'Test notes'
      };
      mockReq.body = assignmentData;

      const mockChild = { _id: 'child1', parent: 'parent123' };
      const mockTrip = { _id: 'trip1', status: 'scheduled' };
      const mockAssignment = {
        _id: 'newAssignment',
        ...assignmentData,
        populate: jest.fn().mockResolvedValue({})
      };

      Child.findOne.mockResolvedValue(mockChild);
      Trip.findById.mockResolvedValue(mockTrip);
      TripAssignment.countDocuments.mockResolvedValue(5); // Current assignments
      TripAssignment.mockImplementation(() => mockAssignment);
      mockAssignment.save.mockResolvedValue(mockAssignment);

      await createTripAssignment(mockReq, mockRes);

      expect(Child.findOne).toHaveBeenCalledWith({ _id: 'child1', parent: 'parent123' });
      expect(Trip.findById).toHaveBeenCalledWith('trip1');
      expect(mockAssignment.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockAssignment,
        message: 'Trip assignment created successfully'
      });
    });

    test('should return 403 for child not owned by parent', async () => {
      mockReq.body = { childId: 'child1', tripId: 'trip1' };

      Child.findOne.mockResolvedValue(null);

      await createTripAssignment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. You can only assign trips for your own children.'
      });
    });

    test('should return 400 for trip at capacity', async () => {
      const assignmentData = { childId: 'child1', tripId: 'trip1' };
      mockReq.body = assignmentData;

      Child.findOne.mockResolvedValue({ _id: 'child1', parent: 'parent123' });
      Trip.findById.mockResolvedValue({ _id: 'trip1', status: 'scheduled' });
      TripAssignment.countDocuments.mockResolvedValue(50); // At capacity

      await createTripAssignment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Trip has reached maximum capacity'
      });
    });

    test('should handle validation errors', async () => {
      const assignmentData = { childId: 'child1', tripId: 'trip1' };
      mockReq.body = assignmentData;

      Child.findOne.mockResolvedValue({ _id: 'child1', parent: 'parent123' });
      Trip.findById.mockResolvedValue({ _id: 'trip1', status: 'scheduled' });
      TripAssignment.countDocuments.mockResolvedValue(5);

      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.errors = {
        assignmentType: { message: 'Invalid assignment type' }
      };

      TripAssignment.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(validationError)
      }));

      await createTripAssignment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: ['Invalid assignment type']
      });
    });
  });

  describe('cancelTripAssignment', () => {
    test('should cancel assignment successfully', async () => {
      const mockAssignment = {
        _id: 'assignment1',
        child: { _id: 'child1', parent: 'parent123' },
        cancel: jest.fn().mockResolvedValue()
      };
      mockReq.params.id = 'assignment1';

      TripAssignment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAssignment)
      });

      await cancelTripAssignment(mockReq, mockRes);

      expect(mockAssignment.cancel).toHaveBeenCalledWith('Cancelled by parent');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Trip assignment canceled successfully'
      });
    });

    test('should return 403 for assignment not owned by parent', async () => {
      const mockAssignment = {
        _id: 'assignment1',
        child: { _id: 'child1', parent: 'otherParent' }
      };
      mockReq.params.id = 'assignment1';

      TripAssignment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAssignment)
      });

      await cancelTripAssignment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. You can only cancel assignments for your own children.'
      });
    });
  });

  describe('getAvailableTrips', () => {
    test('should return available trips for school', async () => {
      const mockChildren = [{ _id: 'child1', schoolName: 'Test School' }];
      const mockTrips = [
        { _id: 'trip1', Trip_ID: 'T001', date: new Date(), status: 'scheduled' },
        { _id: 'trip2', Trip_ID: 'T002', date: new Date(), status: 'scheduled' }
      ];
      mockReq.params.schoolId = 'Test School';

      Child.find.mockResolvedValue(mockChildren);
      Trip.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockTrips)
          })
        })
      });
      TripAssignment.countDocuments.mockResolvedValue(10);

      await getAvailableTrips(mockReq, mockRes);

      expect(Child.find).toHaveBeenCalledWith({
        parent: 'parent123',
        schoolName: 'Test School'
      });
      expect(Trip.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('should return 403 if parent has no children at school', async () => {
      mockReq.params.schoolId = 'Test School';

      Child.find.mockResolvedValue([]); // No children at this school

      await getAvailableTrips(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. You have no children registered at this school.'
      });
    });
  });

  describe('getAssignmentStats', () => {
    test('should return assignment statistics', async () => {
      const mockChildren = [{ _id: 'child1' }, { _id: 'child2' }];
      const mockStats = [
        { _id: 'active', count: 3 },
        { _id: 'completed', count: 5 },
        { _id: 'canceled', count: 1 }
      ];

      Child.find.mockResolvedValue(mockChildren);
      TripAssignment.aggregate.mockResolvedValue(mockStats);

      await getAssignmentStats(mockReq, mockRes);

      expect(TripAssignment.aggregate).toHaveBeenCalledWith([
        { $match: { child: { $in: ['child1', 'child2'] } } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          total: 9,
          active: 3,
          completed: 5,
          canceled: 1,
          inactive: 0
        }
      });
    });
  });
});
