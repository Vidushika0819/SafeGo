
import mongoose from "mongoose";

const dailyCheckSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true }, 
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  date: { type: Date, default: Date.now },  
  time: { type: String, default: () => new Date().toLocaleTimeString() },  
  checklist: {
    brakes: { type: Boolean, default: false },
    tires: { type: Boolean, default: false },
    lights: { type: Boolean, default: false },
    fuel: { type: Boolean, default: false },  
    firstAidKit: { type: Boolean, default: false },  

  },
  finalDecision: { type: String, enum: ["Ready", "Not Ready", "Needs Service", "Unsafe"], required: true }, 
  remarks: { type: String },
}, { timestamps: true });  

export default mongoose.model("DailyCheck", dailyCheckSchema);