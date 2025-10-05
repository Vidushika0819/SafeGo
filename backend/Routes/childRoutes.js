const express = require('express');
const router = express.Router();
const {
  getChildren,
  getChild,
  createChild,
  updateChild,
  deactivateChild,
  reactivateChild,
  getChildStats
} = require('../Controllers/childController');

// Import authentication middleware
const { authenticateToken } = require('./authRoutes');

// All child routes require authentication
router.use(authenticateToken);

// GET /api/children - Get all children for authenticated parent
router.get('/', getChildren);

// GET /api/children/stats - Get child statistics for authenticated parent
router.get('/stats', getChildStats);

// POST /api/children - Create a new child
router.post('/', createChild);

// GET /api/children/:id - Get a specific child
router.get('/:id', getChild);

// PUT /api/children/:id - Update a child
router.put('/:id', updateChild);

// DELETE /api/children/:id - Deactivate a child (soft delete)
router.delete('/:id', deactivateChild);

// PATCH /api/children/:id/reactivate - Reactivate a child
router.patch('/:id/reactivate', reactivateChild);

module.exports = router;
