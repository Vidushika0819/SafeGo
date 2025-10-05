const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  // Parent relationship
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Parent is required'],
    index: true
  },

  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },

  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },

  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        // Child must be between 3 and 18 years old
        const age = new Date().getFullYear() - value.getFullYear();
        return age >= 3 && age <= 18;
      },
      message: 'Child must be between 3 and 18 years old'
    }
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },

  // School Information
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: [
      'preschool', 'kindergarten', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5',
      'grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11', 'grade12'
    ]
  },

  schoolName: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [100, 'School name cannot exceed 100 characters']
  },

  studentId: {
    type: String,
    trim: true,
    maxlength: [20, 'Student ID cannot exceed 20 characters'],
    sparse: true // Allow null values but ensure uniqueness when present
  },

  // Emergency Contacts (at least 2 required)
  emergencyContacts: [{
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true,
      maxlength: [50, 'Contact name cannot exceed 50 characters']
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      enum: ['parent', 'guardian', 'grandparent', 'aunt', 'uncle', 'sibling', 'other'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function(v) {
          // Basic phone number validation (allow various formats)
          return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
        },
        message: 'Please enter a valid phone number'
      }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Email is optional
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email address'
      }
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],

  // Medical Information (optional but important)
  medicalInfo: {
    allergies: [{
      type: String,
      trim: true,
      maxlength: [100, 'Allergy description cannot exceed 100 characters']
    }],
    medications: [{
      name: {
        type: String,
        required: [true, 'Medication name is required'],
        trim: true,
        maxlength: [50, 'Medication name cannot exceed 50 characters']
      },
      dosage: {
        type: String,
        trim: true,
        maxlength: [50, 'Dosage cannot exceed 50 characters']
      },
      frequency: {
        type: String,
        trim: true,
        maxlength: [50, 'Frequency cannot exceed 50 characters']
      }
    }],
    conditions: [{
      type: String,
      trim: true,
      maxlength: [100, 'Medical condition cannot exceed 100 characters']
    }],
    doctorName: {
      type: String,
      trim: true,
      maxlength: [50, 'Doctor name cannot exceed 50 characters']
    },
    doctorPhone: {
      type: String,
      validate: {
        validator: function(v) {
          if (!v) return true; // Phone is optional
          return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
        },
        message: 'Please enter a valid doctor phone number'
      }
    },
    insuranceProvider: {
      type: String,
      trim: true,
      maxlength: [50, 'Insurance provider cannot exceed 50 characters']
    },
    insuranceNumber: {
      type: String,
      trim: true,
      maxlength: [30, 'Insurance number cannot exceed 30 characters']
    }
  },

  // Special Needs and Accommodations
  specialNeeds: {
    hasSpecialNeeds: {
      type: Boolean,
      default: false
    },
    needs: [{
      type: String,
      trim: true,
      maxlength: [200, 'Special need description cannot exceed 200 characters']
    }],
    accommodations: [{
      type: String,
      trim: true,
      maxlength: [200, 'Accommodation description cannot exceed 200 characters']
    }],
    assistiveDevices: [{
      type: String,
      trim: true,
      maxlength: [100, 'Assistive device cannot exceed 100 characters']
    }]
  },

  // Transportation Preferences
  transportationNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Transportation notes cannot exceed 500 characters']
  },

  pickupLocation: {
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    latitude: Number,
    longitude: Number,
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [200, 'Special instructions cannot exceed 200 characters']
    }
  },

  dropoffLocation: {
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    latitude: Number,
    longitude: Number,
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [200, 'Special instructions cannot exceed 200 characters']
    }
  },

  // Status and Metadata
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },

  isActive: {
    type: Boolean,
    default: true
  },

  // Photo (future feature - store URL or file reference)
  photoUrl: {
    type: String,
    trim: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
childSchema.index({ parent: 1, status: 1 });
childSchema.index({ parent: 1, firstName: 1, lastName: 1 });
childSchema.index({ 'emergencyContacts.phone': 1 });

// Virtual for full name
childSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
childSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
});

// Pre-save middleware to validate emergency contacts
childSchema.pre('save', function(next) {
  // Ensure at least 2 emergency contacts
  if (this.emergencyContacts.length < 2) {
    return next(new Error('At least 2 emergency contacts are required'));
  }

  // Ensure exactly one primary contact
  const primaryContacts = this.emergencyContacts.filter(contact => contact.isPrimary);
  if (primaryContacts.length !== 1) {
    return next(new Error('Exactly one emergency contact must be marked as primary'));
  }

  next();
});

// Static method to find active children by parent
childSchema.statics.findActiveByParent = function(parentId) {
  return this.find({ parent: parentId, status: 'active', isActive: true });
};

// Instance method to deactivate child
childSchema.methods.deactivate = function() {
  this.status = 'inactive';
  this.isActive = false;
  return this.save();
};

module.exports = mongoose.model('Child', childSchema);
