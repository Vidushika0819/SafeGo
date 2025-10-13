const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  capacity: { type: Number, required: true },
  licensePlate: { type: String, unique: true }, // For identification
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  manufacturer: { type: String },
  color: { type: String },
  lastServiceDate: { type: Date },
  nextServiceDate: { type: Date },
  currentOdometer: { type: Number, default: 0 },
  assignedDriver: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
