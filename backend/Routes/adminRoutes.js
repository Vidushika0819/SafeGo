const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('./authRoutes');

// Import admin controller
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkEmailAvailability
} = require('../Controllers/adminController');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole('admin'));

// GET /api/admin/users - Get all users
router.get('/users', getAllUsers);

// GET /api/admin/users/check-email - Check email availability
router.get('/users/check-email', checkEmailAvailability);

// POST /api/admin/users - Create a new user
router.post('/users', createUser);

// GET /api/admin/users/:id - Get a specific user
router.get('/users/:id', getUser);

// PUT /api/admin/users/:id - Update a user
router.put('/users/:id', updateUser);

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', deleteUser);

module.exports = router;
