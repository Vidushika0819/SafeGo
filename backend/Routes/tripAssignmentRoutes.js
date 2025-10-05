const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('./authRoutes');

// Import trip assignment controller
const {
  getTripAssignments,
  getTripAssignment,
  createTripAssignment,
  updateTripAssignment,
  cancelTripAssignment,
  getAvailableTrips,
  getAssignmentStats
} = require('../Controllers/tripAssignmentController');

// All routes require authentication and parent role
router.use(authenticateToken);
router.use(requireRole('parent'));

// Get all trip assignments for authenticated parent
router.get('/', getTripAssignments);

// Get assignment statistics for authenticated parent
router.get('/stats', getAssignmentStats);

// Get available trips for a specific school
router.get('/available/:schoolId', getAvailableTrips);

// Get a specific trip assignment
router.get('/:id', getTripAssignment);

// Create a new trip assignment
router.post('/', createTripAssignment);

// Update a trip assignment
router.put('/:id', updateTripAssignment);

// Cancel a trip assignment
router.delete('/:id', cancelTripAssignment);

module.exports = router;
