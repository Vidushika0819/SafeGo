const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Sender information
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  senderRole: {
    type: String,
    enum: ['parent', 'admin', 'coordinator', 'driver'],
    required: [true, 'Sender role is required']
  },

  // Recipient information
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  recipientRole: {
    type: String,
    enum: ['parent', 'admin', 'coordinator', 'driver'],
    required: [true, 'Recipient role is required']
  },

  // Message content
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },

  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [2000, 'Message content cannot exceed 2000 characters']
  },

  // Message type and priority
  type: {
    type: String,
    enum: ['general', 'trip_update', 'emergency', 'school_announcement', 'system_notification'],
    default: 'general'
  },

  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'replied'],
    default: 'sent'
  },

  // Read timestamp
  readAt: {
    type: Date
  },

  // Reply relationship (for threaded conversations)
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },

  // Related entities (optional)
  relatedChild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  },

  relatedTrip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },

  relatedAssignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TripAssignment'
  },

  // Metadata
  isArchived: {
    type: Boolean,
    default: false
  },

  // Auto-delete after certain period (optional)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ type: 1, createdAt: -1 });
messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for message age
messageSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for formatted age
messageSchema.virtual('ageFormatted').get(function() {
  const age = this.age;
  const minutes = Math.floor(age / (1000 * 60));
  const hours = Math.floor(age / (1000 * 60 * 60));
  const days = Math.floor(age / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
});

// Static method to get conversation between two users
messageSchema.statics.getConversation = function(user1Id, user2Id, limit = 50) {
  return this.find({
    $or: [
      { sender: user1Id, recipient: user2Id },
      { sender: user2Id, recipient: user1Id }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('sender', 'firstName lastName email role')
  .populate('recipient', 'firstName lastName email role');
};

// Static method to get unread messages for a user
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    status: { $in: ['sent', 'delivered'] }
  });
};

// Instance method to mark as read
messageSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Pre-save middleware to set delivered status for non-system messages
messageSchema.pre('save', function(next) {
  if (this.isNew && this.type !== 'system_notification') {
    // In a real app, you'd check if the recipient is online
    // For now, we'll mark as delivered immediately
    this.status = 'delivered';
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);
