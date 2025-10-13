const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['driver', 'admin', 'coordinator'], default: 'driver' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  licenseNumber: { type: String },
  isActive: { type: Boolean, default: true },
  assignedVehicles: [{ type: String }], // Array of vehicle IDs
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
