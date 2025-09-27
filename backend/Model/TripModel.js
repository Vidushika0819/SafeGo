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
  
  /*
  BID: { 
    type: String, required: true }, // Bus ID

  driver_Name: { 
    type: String, ref: "Driver", required: true }, // FK to Driver

  coordinator_Name: { 
    type: String, ref: "coordinator", required: true }, // FK to Coordinator */

});


const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;