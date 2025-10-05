const TripAssignment = require('../Models/TripAssignment');
const Trip = require('../Models/TripModel');
const Child = require('../Models/Child');
const User = require('../Models/User');

// Get all trip assignments for the authenticated parent
const getTripAssignments = async (req, res) => {
  try {
    const parentId = req.user.id;

    // Find all children of this parent
    const children = await Child.find({ parent: parentId }).select('_id');
    const childIds = children.map(child => child._id);

    // Get all assignments for these children
    const assignments = await TripAssignment.find({
      child: { $in: childIds }
    })
    .populate({
      path: 'child',
      select: 'firstName lastName grade schoolName'
    })
    .populate({
      path: 'trip',
      select: 'Trip_ID date start_time end_time start_location route status'
    })
    .populate({
      path: 'assignedBy',
      select: 'name email'
    })
    .sort({ assignedDate: -1 });

    res.status(200).json({
      success: true,
      data: assignments,
      count: assignments.length
    });

  } catch (error) {
    console.error('Error fetching trip assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip assignments',
      error: error.message
    });
  }
};

// Get a specific trip assignment
const getTripAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const parentId = req.user.id;

    // Find the assignment and verify ownership
    const assignment = await TripAssignment.findById(id)
      .populate({
        path: 'child',
        select: 'firstName lastName grade schoolName parent'
      })
      .populate({
        path: 'trip',
        select: 'Trip_ID date start_time end_time start_location route status'
      })
      .populate({
        path: 'assignedBy',
        select: 'name email'
      });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Trip assignment not found'
      });
    }

    // Verify the child belongs to the authenticated parent
    if (assignment.child.parent.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view assignments for your own children.'
      });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });

  } catch (error) {
    console.error('Error fetching trip assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip assignment',
      error: error.message
    });
  }
};

// Create a new trip assignment
const createTripAssignment = async (req, res) => {
  try {
    const { childId, tripId, assignmentType, notes, emergencyContactOverride } = req.body;
    const parentId = req.user.id;

    // Verify the child belongs to the authenticated parent
    const child = await Child.findOne({ _id: childId, parent: parentId });
    if (!child) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only assign trips for your own children.'
      });
    }

    // Verify the trip exists and is available
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if trip is in a valid status for assignment
    if (!['scheduled', 'ongoing'].includes(trip.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign children to trips that are not scheduled or ongoing'
      });
    }

    // Check trip capacity (assuming bus capacity from related bus)
    const currentAssignments = await TripAssignment.countDocuments({
      trip: tripId,
      status: 'active'
    });

    // For now, we'll use a default capacity of 50 - this could be made configurable
    const maxCapacity = 50;
    if (currentAssignments >= maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Trip has reached maximum capacity'
      });
    }

    // Create the assignment
    const assignment = new TripAssignment({
      child: childId,
      trip: tripId,
      assignmentType: assignmentType || 'both',
      status: 'active',
      assignedDate: new Date(),
      notes: notes || '',
      assignedBy: parentId,
      emergencyContactOverride: emergencyContactOverride || null
    });

    await assignment.save();

    // Populate the response
    await assignment.populate([
      { path: 'child', select: 'firstName lastName grade schoolName' },
      { path: 'trip', select: 'Trip_ID date start_time end_time start_location route status' },
      { path: 'assignedBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      data: assignment,
      message: 'Trip assignment created successfully'
    });

  } catch (error) {
    console.error('Error creating trip assignment:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    if (error.message.includes('already has an active') || error.message.includes('conflicting trip assignment')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating trip assignment',
      error: error.message
    });
  }
};

// Update a trip assignment
const updateTripAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignmentType, notes, emergencyContactOverride } = req.body;
    const parentId = req.user.id;

    // Find the assignment and verify ownership
    const assignment = await TripAssignment.findById(id).populate('child');
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Trip assignment not found'
      });
    }

    // Verify the child belongs to the authenticated parent
    if (assignment.child.parent.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update assignments for your own children.'
      });
    }

    // Update allowed fields
    if (assignmentType) assignment.assignmentType = assignmentType;
    if (notes !== undefined) assignment.notes = notes;
    if (emergencyContactOverride !== undefined) {
      assignment.emergencyContactOverride = emergencyContactOverride;
    }

    assignment.lastModified = new Date();
    await assignment.save();

    // Populate the response
    await assignment.populate([
      { path: 'child', select: 'firstName lastName grade schoolName' },
      { path: 'trip', select: 'Trip_ID date start_time end_time start_location route status' },
      { path: 'assignedBy', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      data: assignment,
      message: 'Trip assignment updated successfully'
    });

  } catch (error) {
    console.error('Error updating trip assignment:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating trip assignment',
      error: error.message
    });
  }
};

// Cancel a trip assignment
const cancelTripAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const parentId = req.user.id;

    // Find the assignment and verify ownership
    const assignment = await TripAssignment.findById(id).populate('child');
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Trip assignment not found'
      });
    }

    // Verify the child belongs to the authenticated parent
    if (assignment.child.parent.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only cancel assignments for your own children.'
      });
    }

    // Cancel the assignment
    await assignment.cancel(reason);

    res.status(200).json({
      success: true,
      message: 'Trip assignment canceled successfully'
    });

  } catch (error) {
    console.error('Error canceling trip assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Error canceling trip assignment',
      error: error.message
    });
  }
};

// Get available trips for a specific school
const getAvailableTrips = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const parentId = req.user.id;

    // First verify the parent has children at this school
    const childrenAtSchool = await Child.find({
      parent: parentId,
      schoolName: schoolId // Assuming schoolId is the school name for now
    });

    if (childrenAtSchool.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You have no children registered at this school.'
      });
    }

    // Find all available trips (not filtering by route for now to ensure trips are visible)
    // Parents can see all available trips and we'll validate school compatibility during assignment
    const trips = await Trip.find({
      status: { $in: ['scheduled', 'ongoing'] }
    })
    .populate('busId', 'busNumber capacity')
    .populate('driverId', 'name')
    .sort({ date: 1, start_time: 1 });

    // Add capacity information for each trip
    const tripsWithCapacity = await Promise.all(
      trips.map(async (trip) => {
        const currentAssignments = await TripAssignment.countDocuments({
          trip: trip._id,
          status: 'active'
        });

        const busCapacity = trip.busId?.capacity || 50; // Default capacity
        const availableSeats = Math.max(0, busCapacity - currentAssignments);

        return {
          ...trip.toObject(),
          currentAssignments,
          availableSeats,
          capacity: busCapacity
        };
      })
    );

    res.status(200).json({
      success: true,
      data: tripsWithCapacity,
      count: tripsWithCapacity.length
    });

  } catch (error) {
    console.error('Error fetching available trips:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available trips',
      error: error.message
    });
  }
};

// Get assignment statistics for parent
const getAssignmentStats = async (req, res) => {
  try {
    const parentId = req.user.id;

    // Find all children of this parent
    const children = await Child.find({ parent: parentId }).select('_id');
    const childIds = children.map(child => child._id);

    // Get assignment statistics
    const stats = await TripAssignment.aggregate([
      { $match: { child: { $in: childIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the response
    const formattedStats = {
      total: stats.reduce((sum, stat) => sum + stat.count, 0),
      active: stats.find(s => s._id === 'active')?.count || 0,
      completed: stats.find(s => s._id === 'completed')?.count || 0,
      canceled: stats.find(s => s._id === 'canceled')?.count || 0,
      inactive: stats.find(s => s._id === 'inactive')?.count || 0
    };

    res.status(200).json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error('Error fetching assignment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignment statistics',
      error: error.message
    });
  }
};

module.exports = {
  getTripAssignments,
  getTripAssignment,
  createTripAssignment,
  updateTripAssignment,
  cancelTripAssignment,
  getAvailableTrips,
  getAssignmentStats
};
