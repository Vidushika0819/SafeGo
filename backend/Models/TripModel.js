const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tripSchema = new Schema({
  Trip_ID: {
       type: String, required: true, unique: true }, // primary key

  date: {
    type: Date, required: true },

  start_time: {
    type: String, required: true },

  end_time: {
    type: String, required: true },

  start_location: {
    type: String, required: true },

  route: {
    type: String, required: true },

  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed", "canceled"],
    required: true,
  },

  busId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true }, // Reference to Bus

  driverId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true }, // Reference to Driver

  coordinatorId: {
    type: mongoose.Schema.Types.ObjectId, ref: "Coordinator", required: true }, // Reference to Coordinator

  // Additional fields for parent seat booking
  availableSeats: {
    type: Number,
    default: 0,
    min: 0
  },

  routeName: {
    type: String,
    trim: true
  },

  departureTime: {
    type: Date
  },

  busNumber: {
    type: String,
    trim: true
  }

});


const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
