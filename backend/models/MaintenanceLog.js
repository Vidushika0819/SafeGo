const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  serviceType: { type: String, required: true },
  description: { type: String }, // Details of the task
  scheduledDate: { type: Date },
  estimatedCost: { type: Number },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed'], default: 'Planned' },
  actualCost: { type: Number },
  completedDate: { type: Date },
  coordinatorDetails: { type: String },
  remarks: { type: String },
  attachmentUrl: { type: String }, // For invoices
  completedBy: { type: String }, // Coordinator or driver name
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
