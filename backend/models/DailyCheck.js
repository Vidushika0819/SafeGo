const mongoose = require('mongoose');

const dailyCheckSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  time: { type: String, default: () => new Date().toLocaleTimeString() },
  checklist: {
    brakes: { type: Boolean, default: false },
    tires: { type: Boolean, default: false },
    lights: { type: Boolean, default: false },
    fuel: { type: Boolean, default: false },
    firstAidKit: { type: Boolean, default: false },
    engine: { type: Boolean, default: false },
    mirrors: { type: Boolean, default: false },
    seatbelts: { type: Boolean, default: false },
    horn: { type: Boolean, default: false },
    wipers: { type: Boolean, default: false }
  },
  finalDecision: { type: String, enum: ['Ready', 'Not Ready', 'Needs Service', 'Unsafe'], required: true },
  remarks: { type: String },
  completedBy: { type: String, required: true }, // Driver name
  submittedToAdmin: { type: Boolean, default: false },
  adminNotification: {
    submittedAt: { type: Date, default: Date.now },
    driverName: { type: String },
    vehicleId: { type: String },
    status: { type: String },
    requiresAttention: { type: Boolean, default: false }
  },
  adminStatus: { 
    type: String, 
    enum: ['pending', 'reviewed', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminComments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('DailyCheck', dailyCheckSchema);