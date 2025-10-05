const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getSentMessages,
  getMessage,
  markAsRead,
  archiveMessage,
  getUnreadCount,
  getAvailableRecipients,
  replyToMessage
} = require('../Controllers/messageController');

// Import authentication middleware
const { authenticateToken } = require('./authRoutes');

// All message routes require authentication
router.use(authenticateToken);

// Send a new message
router.post('/', sendMessage);

// Get messages for authenticated user
router.get('/', getMessages);

// Get sent messages
router.get('/sent', getSentMessages);

// Get unread message count
router.get('/unread-count', getUnreadCount);

// Get available recipients for messaging
router.get('/recipients', getAvailableRecipients);

// Get a specific message
router.get('/:id', getMessage);

// Reply to a message
router.post('/:id/reply', replyToMessage);

// Mark message as read
router.patch('/:id/read', markAsRead);

// Archive a message
router.patch('/:id/archive', archiveMessage);

module.exports = router;
