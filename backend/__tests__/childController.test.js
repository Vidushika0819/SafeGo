const Child = require('../Models/Child');
const User = require('../Models/User');
const {
  getChildren,
  getChild,
  createChild,
  updateChild,
  deactivateChild,
  getChildStats
} = require('../Controllers/childController');

// Mock the models
jest.mock('../Models/Child');
jest.mock('../Models/User');

describe('Child Controller', () => {
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

  describe('getChildren', () => {
    test('should return children for authenticated parent', async () => {
      const mockChildren = [
        { _id: 'child1', firstName: 'John', lastName: 'Doe' },
        { _id: 'child2', firstName: 'Jane', lastName: 'Doe' }
      ];

      Child.find.mockResolvedValue(mockChildren);

      await getChildren(mockReq, mockRes);

      expect(Child.find).toHaveBeenCalledWith({ parent: 'parent123' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockChildren,
        count: 2
      });
    });

    test('should return 403 for non-parent user', async () => {
      mockReq.user.role = 'admin';

      await getChildren(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Parent role required.'
      });
    });

    test('should handle database errors', async () => {
      Child.find.mockRejectedValue(new Error('Database error'));

      await getChildren(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error fetching children',
        error: 'Database error'
      });
    });
  });

  describe('getChild', () => {
    test('should return specific child for parent', async () => {
      const mockChild = { _id: 'child1', firstName: 'John', parent: 'parent123' };
      mockReq.params.id = 'child1';

      Child.findOne.mockResolvedValue(mockChild);

      await getChild(mockReq, mockRes);

      expect(Child.findOne).toHaveBeenCalledWith({ _id: 'child1', parent: 'parent123' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockChild
      });
    });

    test('should return 404 for non-existent child', async () => {
      mockReq.params.id = 'nonexistent';

      Child.findOne.mockResolvedValue(null);

      await getChild(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Child not found or access denied'
      });
    });
  });

  describe('createChild', () => {
    test('should create new child for parent', async () => {
      const childData = {
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

      const mockSavedChild = { ...childData, _id: 'newChildId', parent: 'parent123' };
      mockReq.body = childData;

      const mockChildInstance = {
        save: jest.fn().mockResolvedValue(mockSavedChild),
        populate: jest.fn().mockResolvedValue(mockSavedChild)
      };

      Child.mockImplementation(() => mockChildInstance);

      await createChild(mockReq, mockRes);

      expect(Child).toHaveBeenCalledWith({ ...childData, parent: 'parent123' });
      expect(mockChildInstance.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockSavedChild,
        message: 'Child created successfully'
      });
    });

    test('should handle validation errors', async () => {
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.errors = {
        firstName: { message: 'First name is required' },
        lastName: { message: 'Last name is required' }
      };

      const mockChildInstance = {
        save: jest.fn().mockRejectedValue(validationError),
        populate: jest.fn()
      };

      Child.mockImplementation(() => mockChildInstance);

      await createChild(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: ['First name is required', 'Last name is required']
      });
    });
  });

  describe('updateChild', () => {
    test('should update child for parent', async () => {
      const updateData = { firstName: 'Updated Name' };
      const mockChild = {
        _id: 'child1',
        firstName: 'Original Name',
        save: jest.fn().mockResolvedValue(),
        populate: jest.fn().mockResolvedValue()
      };

      mockReq.params.id = 'child1';
      mockReq.body = updateData;

      Child.findOne.mockResolvedValue(mockChild);

      await updateChild(mockReq, mockRes);

      expect(mockChild.firstName).toBe('Updated Name');
      expect(mockChild.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockChild,
        message: 'Child updated successfully'
      });
    });

    test('should return 404 for child not found', async () => {
      mockReq.params.id = 'nonexistent';

      Child.findOne.mockResolvedValue(null);

      await updateChild(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Child not found or access denied'
      });
    });
  });

  describe('deactivateChild', () => {
    test('should deactivate child for parent', async () => {
      const mockChild = {
        _id: 'child1',
        deactivate: jest.fn().mockResolvedValue()
      };

      mockReq.params.id = 'child1';

      Child.findOne.mockResolvedValue(mockChild);

      await deactivateChild(mockReq, mockRes);

      expect(mockChild.deactivate).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Child deactivated successfully'
      });
    });
  });

  describe('getChildStats', () => {
    test('should return child statistics for parent', async () => {
      const mockStats = [{
        total: 2,
        active: 2,
        inactive: 0,
        byGrade: ['grade1', 'grade2']
      }];

      Child.aggregate.mockResolvedValue(mockStats);

      await getChildStats(mockReq, mockRes);

      expect(Child.aggregate).toHaveBeenCalledWith([
        { $match: { parent: 'parent123' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ['$status', 'active'] }, { $eq: ['$isActive', true] }] },
                  1,
                  0
                ]
              }
            },
            inactive: {
              $sum: {
                $cond: [
                  { $or: [{ $eq: ['$status', 'inactive'] }, { $eq: ['$isActive', false] }] },
                  1,
                  0
                ]
              }
            },
            byGrade: { $push: '$grade' }
          }
        }
      ]);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          total: 2,
          active: 2,
          inactive: 0,
          grades: { grade1: 1, grade2: 1 }
        }
      });
    });
  });
});
