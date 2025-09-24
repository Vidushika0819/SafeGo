const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  seatID: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
  studentID: { type: String, required: true }, 
  reservationType: { 
    type: String, 
    enum: ["Regular", "Temporary"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Cancelled"], 
    default: "Pending" 
  },
  approvedBy: { type: String }, // can just store Admin name/ID string
  requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reservation", reservationSchema);
