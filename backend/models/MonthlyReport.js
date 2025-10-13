const mongoose = require('mongoose');

const monthlyServiceReportSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  month: { type: Number, default: () => new Date().getMonth() + 1 },
  year: { type: Number, default: () => new Date().getFullYear() },
  odometerReading: { type: Number }, // Current mileage
  issues: { type: String }, // Description of problems
  actionsTaken: { type: String },
  nextServiceDate: { type: Date },
  attachmentUrl: { type: String }, // For uploading reports
  completedBy: { type: String, required: true }, // Driver name
  serviceProvider: { type: String }, // Service center or mechanic
  totalCost: { type: Number },
  submittedToAdmin: { type: Boolean, default: false },
  images: [{
    id: { type: String },
    name: { type: String },
    size: { type: Number },
    type: { type: String },
    url: { type: String }
  }],
  adminStatus: { 
    type: String, 
    enum: ['pending', 'reviewed', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminComments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MonthlyReport', monthlyServiceReportSchema);