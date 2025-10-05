const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema({
  waitlistID: {
    type: String,
    unique: true
  },
  studentID: {
    type: String,
    required: true
  },
  busID: {
    type: String,
    required: true
  },
  routeID: {
    type: String,
    required: true
  },
  reservationType: {
    type: String,
    enum: ["Regular", "Temporary"],
    required: true
  },
  requestedDate: {
    type: Date,
    required: true
  },
  daysRequested: {
    type: Number,
    required: true
  },
  seasonType: {
    type: String,
    enum: ["FirstSemester", "SecondSemester", "ThirdSemester"],
    required: true
  },
  status: {
    type: String,
    enum: ["Waiting", "Notified", "Cancelled", "Expired"],
    default: "Waiting"
  },
  priority: {
    type: Number,
    default: 1 // Lower number = higher priority
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notifiedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Expires after 7 days if not acted upon
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }
});

// Generate waitlistID before saving
waitlistSchema.pre("save", function (next) {
  if (!this.waitlistID) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.waitlistID = `WL${timestamp}${random}`.toUpperCase();
  }
  next();
});

// Also generate on validation
waitlistSchema.pre("validate", function (next) {
  if (!this.waitlistID) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.waitlistID = `WL${timestamp}${random}`.toUpperCase();
  }
  next();
});

// Index for efficient querying
waitlistSchema.index({ busID: 1, status: 1, priority: 1, createdAt: 1 });
waitlistSchema.index({ studentID: 1 });
waitlistSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model("Waitlist", waitlistSchema);