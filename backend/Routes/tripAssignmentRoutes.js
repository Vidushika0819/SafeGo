const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('./authRoutes');

// Import controllers
const {
  getTripAssignments,
  getTripAssignment,
  createTripAssignment,
  updateTripAssignment,
  cancelTripAssignment,
  getAvailableTrips,
  getAssignmentStats,
  checkinStudent,
  checkoutStudent
} = require('../Controllers/tripAssignmentController');

const { getStudentsForCheckin } = require('../Controllers/CoordinatorControllers');

// Coordinator specific routes
router.get('/students-for-checkin', authenticateToken, requireRole('coordinator'), getStudentsForCheckin);
router.put('/:id/checkin', authenticateToken, requireRole('coordinator'), checkinStudent);
router.put('/:id/checkout', authenticateToken, requireRole('coordinator'), checkoutStudent);

// All routes require authentication and parent role (for remaining parent operations)
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
