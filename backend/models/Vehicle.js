
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true, unique: true },  
  model: { type: String, required: true },
  year: { type: Number },        // Manufacturing year
  capacity: { type: Number, required: true },
  licensePlate: { type: String, unique: true },  // For identification
  status: { type: String, enum: ["active", "inactive", "maintenance"], default: "active" }, 
}, { timestamps: true });  

export default mongoose.model("Vehicle", vehicleSchema);