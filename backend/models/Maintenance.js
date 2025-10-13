const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Maintenance details
  maintenanceType: {
    type: String,
    enum: ['repair', 'service', 'inspection', 'replacement', 'emergency'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    default: 'medium'
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'on-hold'],
    required: true,
    default: 'scheduled'
  },
  scheduledDate: {
    type: Date
  },
  startDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  
  // Cost information
  estimatedCost: {
    type: Number,
    min: 0,
    default: 0
  },
  actualCost: {
    type: Number,
    min: 0,
    default: 0
  },
  laborHours: {
    type: Number,
    min: 0,
    default: 0
  },
  laborRate: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // Parts and materials
  partsUsed: [{
    partName: {
      type: String,
      required: true,
      trim: true
    },
    partNumber: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitCost: {
      type: Number,
      required: true,
      min: 0
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  
  // Service provider information
  serviceProvider: {
    type: String,
    required: true,
    trim: true
  },
  serviceProviderContact: {
    type: String,
    trim: true
  },
  serviceLocation: {
    type: String,
    required: true,
    trim: true
  },
  
  // Mechanic information
  mechanicName: {
    type: String,
    trim: true
  },
  mechanicLicense: {
    type: String,
    trim: true
  },
  mechanicContact: {
    type: String,
    trim: true
  },
  
  // Maintenance details
  mileageAtMaintenance: {
    type: Number,
    required: true,
    min: 0
  },
  nextMaintenanceMileage: {
    type: Number,
    min: 0
  },
  nextMaintenanceDate: {
    type: Date
  },
  
  // Quality and follow-up
  qualityRating: {
    type: Number,
    min: 1,
    max: 5
  },
  warrantyPeriod: {
    type: Number,
    min: 0
  },
  warrantyExpiry: {
    type: Date
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  followUpNotes: {
    type: String,
    trim: true
  },
  
  // Documentation
  workOrderNumber: {
    type: String,
    trim: true
  },
  invoiceNumber: {
    type: String,
    trim: true
  },
  receipts: [{
    type: String,
    trim: true
  }],
  photos: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  },
  
  // Approval workflow
  requiresApproval: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  approvalNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate parts total cost
MaintenanceSchema.pre('save', function(next) {
  if (this.partsUsed && this.partsUsed.length > 0) {
    this.partsUsed.forEach(part => {
      part.totalCost = part.quantity * part.unitCost;
    });
  }
  next();
});

// Indexes for efficient queries
MaintenanceSchema.index({ vehicle: 1, createdAt: -1 });
MaintenanceSchema.index({ driver: 1, createdAt: -1 });
MaintenanceSchema.index({ status: 1 });
MaintenanceSchema.index({ maintenanceType: 1 });
MaintenanceSchema.index({ priority: 1 });
MaintenanceSchema.index({ scheduledDate: 1 });
MaintenanceSchema.index({ completedDate: -1 });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);






