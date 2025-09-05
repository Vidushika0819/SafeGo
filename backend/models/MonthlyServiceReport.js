
import mongoose from "mongoose";

const monthlyServiceReportSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  date: { type: Date, default: Date.now },  
  month: { type: Number, default: () => new Date().getMonth() + 1 }, 
  year: { type: Number, default: () => new Date().getFullYear() }, 
  odometerReading: { type: Number },  // Current mileage
  issues: { type: String },  // Description of problems
  actionsTaken: { type: String }, 
  nextServiceDate: { type: Date },  
  attachmentUrl: { type: String },  // For uploading reports
}, { timestamps: true });

export default mongoose.model("MonthlyServiceReport", monthlyServiceReportSchema);