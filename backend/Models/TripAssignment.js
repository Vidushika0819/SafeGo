const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tripAssignmentSchema = new Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
    index: true
  },

  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true
  },

  assignmentType: {
    type: String,
    enum: ['pickup', 'dropoff', 'both'],
    required: true,
    default: 'both'
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'canceled', 'completed'],
    required: true,
    default: 'active'
  },

  assignedDate: {
    type: Date,
    default: Date.now,
    required: true
  },

  notes: {
    type: String,
    maxlength: 500,
    trim: true
  },

  // Track assignment metadata
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  lastModified: {
    type: Date,
    default: Date.now
  },

  // Emergency contact override (optional)
  emergencyContactOverride: {
    name: {
      type: String,
      maxlength: 100
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: 'Phone number must be valid'
      }
    },
    relationship: {
      type: String,
      maxlength: 50
    }
  },

  // Check-in/checkout tracking for student safety
  checkinStatus: {
    type: String,
    enum: ['pending', 'checked_in', 'dropped_off'],
    default: 'pending'
  },

  checkinTimestamp: {
    type: Date,
    default: null
  },

  checkoutTimestamp: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound indexes for performance and uniqueness
tripAssignmentSchema.index({ child: 1, trip: 1, assignmentType: 1 }, { unique: true });
tripAssignmentSchema.index({ trip: 1, status: 1 });
tripAssignmentSchema.index({ child: 1, status: 1 });

// Check-in/checkout tracking indexes
tripAssignmentSchema.index({ trip: 1, checkinStatus: 1 });
tripAssignmentSchema.index({ child: 1, trip: 1 });

// Pre-save middleware to update lastModified
tripAssignmentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Static method to find active assignments by child
tripAssignmentSchema.statics.findActiveByChild = function(childId) {
  return this.find({
    child: childId,
    status: 'active'
  }).populate('trip');
};

// Static method to find assignments by trip
tripAssignmentSchema.statics.findByTrip = function(tripId) {
  return this.find({
    trip: tripId,
    status: { $in: ['active', 'completed'] }
  }).populate('child');
};

// Static method to check trip capacity
tripAssignmentSchema.statics.getTripCapacity = async function(tripId) {
  const assignments = await this.find({
    trip: tripId,
    status: 'active'
  });

  return assignments.length;
};

// Instance method to cancel assignment
tripAssignmentSchema.methods.cancel = function(reason) {
  this.status = 'canceled';
  this.notes = reason || 'Assignment canceled by parent';
  this.lastModified = new Date();
  return this.save();
};

// Instance method to complete assignment
tripAssignmentSchema.methods.complete = function() {
  this.status = 'completed';
  this.lastModified = new Date();
  return this.save();
};

// Validation: Prevent conflicting assignments
tripAssignmentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('trip') || this.isModified('assignmentType')) {
    // Check for conflicting assignments on the same trip
    const existingAssignment = await this.constructor.findOne({
      child: this.child,
      trip: this.trip,
      assignmentType: this.assignmentType,
      status: 'active',
      _id: { $ne: this._id }
    });

    if (existingAssignment) {
      return next(new Error(`Child already has an active ${this.assignmentType} assignment for this trip`));
    }

    // Check for overlapping trips on the same day (basic conflict detection)
    const trip = await mongoose.model('Trip').findById(this.trip);
    if (trip) {
      const conflictingAssignment = await this.constructor.findOne({
        child: this.child,
        status: 'active',
        _id: { $ne: this._id }
      }).populate('trip');

      if (conflictingAssignment && conflictingAssignment.trip) {
        const existingTripDate = new Date(conflictingAssignment.trip.date).toDateString();
        const newTripDate = new Date(trip.date).toDateString();

        if (existingTripDate === newTripDate) {
          // Check for time overlap based on assignment type
          const existingStart = conflictingAssignment.trip.start_time;
          const existingEnd = conflictingAssignment.trip.end_time;
          const newStart = trip.start_time;
          const newEnd = trip.end_time;

          // Simple overlap check - if trips overlap in time, flag as potential conflict
          if ((newStart < existingEnd && newEnd > existingStart)) {
            // Allow if assignment types are different (pickup vs dropoff)
            if (conflictingAssignment.assignmentType === this.assignmentType) {
              return next(new Error('Child has conflicting trip assignment on the same day and time'));
            }
          }
        }
      }
    }
  }

  next();
});

// Validation: Ensure child belongs to authenticated parent
tripAssignmentSchema.pre('save', async function(next) {
  const child = await mongoose.model('Child').findById(this.child);
  if (!child) {
    return next(new Error('Child not found'));
  }

  // This validation will be enforced at the controller level with user context
  next();
});

const TripAssignment = mongoose.model('TripAssignment', tripAssignmentSchema);

module.exports = TripAssignment;
