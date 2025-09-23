const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  cost: { type: Number },
  serviceType: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
});

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);