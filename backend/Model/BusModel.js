const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Available", "Booked", "Reserved"],
    default: "Available"
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  }
});

const busSchema = new mongoose.Schema({
  busID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  busNumber: {
    type: String,
    required: true,
    trim: true
  },
  driverName: {
    type: String,
    required: true,
    trim: true
  },
  driverContact: {
    type: String,
    required: true,
    trim: true
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
    max: 50,
    default: 28
  },
  routeId: {
    type: String,
    required: true,
    ref: 'Route'
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Maintenance"],
    default: "Active"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  seats: [seatSchema]
});

// Update the updatedAt field before saving
busSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Initialize seats when bus is created
busSchema.pre('save', function(next) {
  if (this.isNew && (!this.seats || this.seats.length === 0)) {
    this.seats = [];
    for (let i = 1; i <= this.totalSeats; i++) {
      this.seats.push({
        seatNumber: i,
        status: "Available"
      });
    }
  }
  this.updatedAt = Date.now();
  next();
});

// Ensure bus number is unique
busSchema.index({ busNumber: 1 }, { unique: true });

module.exports = mongoose.model("Bus", busSchema);
