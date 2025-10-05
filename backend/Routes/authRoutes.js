const express = require('express');
const jwt = require('jsonwebtoken');
const { register, login, logout, getProfile, registerParent, loginParent } = require('../Controllers/authController');

const router = express.Router();

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
};

// Middleware to require specific role
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${requiredRole} role required.`
      });
    }

    next();
  };
};

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Parent-specific routes
router.post('/parent/register', registerParent);
router.post('/parent/login', loginParent);

// Protected routes (will need auth middleware)
router.get('/profile', getProfile);

module.exports = {
  router,
  authenticateToken,
  requireRole
};
