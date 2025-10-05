const Message = require('../Models/Message');
const User = require('../Models/User');

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { recipientId, subject, content, type = 'general', priority = 'normal', relatedChild, relatedTrip, relatedAssignment } = req.body;
    const senderId = req.user.id;

    // Get sender and recipient details
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId)
    ]);

    if (!sender || !recipient) {
      return res.status(404).json({
        success: false,
        message: 'Sender or recipient not found'
      });
    }

    // Create the message
    const message = new Message({
      sender: senderId,
      senderRole: sender.role,
      recipient: recipientId,
      recipientRole: recipient.role,
      subject,
      content,
      type,
      priority,
      relatedChild,
      relatedTrip,
      relatedAssignment
    });

    await message.save();

    // Populate sender and recipient details for response
    await message.populate([
      { path: 'sender', select: 'firstName lastName email role' },
      { path: 'recipient', select: 'firstName lastName email role' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get messages for the authenticated user
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status, type } = req.query;

    const query = { recipient: userId, isArchived: false };

    if (status) query.status = status;
    if (type) query.type = type;

    const messages = await Message.find(query)
      .populate('sender', 'firstName lastName email role')
      .populate('recipient', 'firstName lastName email role')
      .populate('relatedChild', 'firstName lastName grade')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Get sent messages
const getSentMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.find({ sender: userId, isArchived: false })
      .populate('sender', 'firstName lastName email role')
      .populate('recipient', 'firstName lastName email role')
      .populate('relatedChild', 'firstName lastName grade')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ sender: userId, isArchived: false });

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sent messages',
      error: error.message
    });
  }
};

// Get a specific message
const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      _id: id,
      $or: [{ sender: userId }, { recipient: userId }],
      isArchived: false
    })
    .populate('sender', 'firstName lastName email role')
    .populate('recipient', 'firstName lastName email role')
    .populate('relatedChild', 'firstName lastName grade schoolName')
    .populate('relatedTrip', 'routeName departureTime')
    .populate('relatedAssignment', 'status');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read if recipient is viewing
    if (message.recipient.toString() === userId && message.status !== 'read') {
      await message.markAsRead();
    }

    res.json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message',
      error: error.message
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      _id: id,
      recipient: userId
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.markAsRead();

    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message
    });
  }
};

// Archive a message
const archiveMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      _id: id,
      $or: [{ sender: userId }, { recipient: userId }]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isArchived = true;
    await message.save();

    res.json({
      success: true,
      message: 'Message archived successfully'
    });

  } catch (error) {
    console.error('Error archiving message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive message',
      error: error.message
    });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Message.getUnreadCount(userId);

    res.json({
      success: true,
      data: { unreadCount: count }
    });

  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};

// Get available recipients (for message composition)
const getAvailableRecipients = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let recipients = [];

    if (user.role === 'parent') {
      // Parents can message admins and coordinators
      recipients = await User.find({
        role: { $in: ['admin', 'coordinator'] },
        isActive: true
      }).select('firstName lastName email role');
    } else if (user.role === 'admin' || user.role === 'coordinator') {
      // Admins/coordinators can message all parents
      recipients = await User.find({
        role: 'parent',
        isActive: true
      }).select('firstName lastName email role');
    }

    res.json({
      success: true,
      data: recipients
    });

  } catch (error) {
    console.error('Error getting available recipients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available recipients',
      error: error.message
    });
  }
};

// Reply to a message
const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, subject } = req.body;
    const userId = req.user.id;

    // Find the original message
    const originalMessage = await Message.findById(id);
    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: 'Original message not found'
      });
    }

    // Determine recipient (swap sender and recipient)
    const recipientId = originalMessage.sender.toString() === userId
      ? originalMessage.recipient
      : originalMessage.sender;

    const recipient = await User.findById(recipientId);
    const sender = await User.findById(userId);

    // Create reply message
    const replyMessage = new Message({
      sender: userId,
      senderRole: sender.role,
      recipient: recipientId,
      recipientRole: recipient.role,
      subject: subject || `Re: ${originalMessage.subject}`,
      content,
      type: 'general',
      priority: 'normal',
      parentMessage: id,
      relatedChild: originalMessage.relatedChild,
      relatedTrip: originalMessage.relatedTrip,
      relatedAssignment: originalMessage.relatedAssignment
    });

    await replyMessage.save();

    // Update original message status
    originalMessage.status = 'replied';
    await originalMessage.save();

    // Populate for response
    await replyMessage.populate([
      { path: 'sender', select: 'firstName lastName email role' },
      { path: 'recipient', select: 'firstName lastName email role' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: replyMessage
    });

  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getSentMessages,
  getMessage,
  markAsRead,
  archiveMessage,
  getUnreadCount,
  getAvailableRecipients,
  replyToMessage
};
