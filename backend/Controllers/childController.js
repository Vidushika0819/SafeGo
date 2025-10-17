const Child = require('../Models/Child');
const User = require('../Models/User');

// Get all children for the authenticated parent
const getChildren = async (req, res) => {
  try {
    const parentId = req.user.id;

    // Verify the user is a parent
    if (req.user.role?.toLowerCase() !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Parent role required.'
      });
    }

    const children = await Child.find({ parent: parentId })
      .sort({ createdAt: -1 })
      .populate('parent', 'email name');

    res.status(200).json({
      success: true,
      data: children,
      count: children.length
    });
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching children',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a specific child by ID (only if belongs to authenticated parent)
const getChild = async (req, res) => {
  try {
    const { id } = req.params;
    const parentId = req.user.id;

    // Verify the user is a parent
    if (req.user.role?.toLowerCase() !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Parent role required.'
      });
    }

    const child = await Child.findOne({ _id: id, parent: parentId })
      .populate('parent', 'email name');

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: child
    });
  } catch (error) {
    console.error('Error fetching child:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching child',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create a new child
const createChild = async (req, res) => {
  try {
    const parentId = req.user.id;

    // Verify the user is a parent
    if (req.user.role?.toLowerCase() !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Parent role required.'
      });
    }

    // Add parent ID to the request body
    const childData = {
      ...req.body,
      parent: parentId
    };

    const child = new Child(childData);
    await child.save();

    // Populate parent information for response
    await child.populate('parent', 'email name');

    res.status(201).json({
      success: true,
      data: child,
      message: 'Child created successfully'
    });
  } catch (error) {
    console.error('Error creating child:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating child',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a child (only if belongs to authenticated parent)
const updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const parentId = req.user.id;

    // Verify the user is a parent
    if (req.user.role?.toLowerCase() !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Parent role required.'
      });
    }

    const child = await Child.findOne({ _id: id, parent: parentId });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or access denied'
      });
    }

    // Update child data
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        child[key] = req.body[key];
      }
    });

    await child.save();

    // Populate parent information for response
    await child.populate('parent', 'email name');

    res.status(200).json({
      success: true,
      data: child,
      message: 'Child updated successfully'
    });
  } catch (error) {
    console.error('Error updating child:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating child',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Deactivate a child (soft delete - only if belongs to authenticated parent)
const deactivateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const parentId = req.user.id;

    // Verify the user is a parent
    if (req.user.role?.toLowerCase() !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Parent role required.'
      });
    }

    const child = await Child.findOne({ _id: id, parent: parentId });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or access denied'
      });
    }

    // Use the deactivate method from the model
    await child.deactivate();

    res.status(200).json({
      success: true,
      message: 'Child deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating child:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating child',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Reactivate a child
const reactivateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const parentId = req.user.id;

    // Verify the user is a parent
    if (req.user.role?.toLowerCase() !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Parent role required.'
      });
    }

    const child = await Child.findOne({ _id: id, parent: parentId });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or access denied'
      });
    }

    child.status = 'active';
    child.isActive = true;
    await child.save();

    res.status(200).json({
      success: true,
      data: child,
      message: 'Child reactivated successfully'
    });
  } catch (error) {
    console.error('Error reactivating child:', error);
    res.status(500).json({
      success: false,
      message: 'Error reactivating child',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get child statistics for the parent
const getChildStats = async (req, res) => {
  try {
    const parentId = req.user.id;

    // Verify the user is a parent
    if (req.user.role?.toLowerCase() !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Parent role required.'
      });
    }

    const stats = await Child.aggregate([
      { $match: { parent: parentId } },
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
          byGrade: {
            $push: '$grade'
          }
        }
      }
    ]);

    const result = stats[0] || { total: 0, active: 0, inactive: 0, byGrade: [] };

    // Count grades
    const gradeCount = result.byGrade.reduce((acc, grade) => {
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        total: result.total,
        active: result.active,
        inactive: result.inactive,
        grades: gradeCount
      }
    });
  } catch (error) {
    console.error('Error fetching child stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching child statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getChildrenForCoordinator = async (req, res) => {
  try {
    const children = await Child.find()
      .populate('parent', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: children,
      count: children.length
    });
  } catch (error) {
    console.error('Error fetching children for coordinator:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching children'
    });
  }
};

module.exports = {
  getChildren,
  getChild,
  createChild,
  updateChild,
  deactivateChild,
  reactivateChild,
  getChildStats,
  getChildrenForCoordinator
};
