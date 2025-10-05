const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  busID: { type: String, required: true }, 
  status: {
    type: String,
    enum: ["Available", "Pending", "Booked"],
    default: "Available",
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: false
  },
});

// Ensure unique seat per bus
seatSchema.index({ busID: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model("Seat", seatSchema);
