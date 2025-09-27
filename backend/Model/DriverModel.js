const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
    name: { 
        type: String, required: true },

    licenseNumber: { 
        type: String, required: true, unique: true },

    phoneNumber: { 
        type: String, required: true },

    vehicleType: { 
        type: String, required: true },

    vehicleNumber: { 
        type: String, required: true, unique: true },

    age: { 
        type: Number, required: true },

    experienceYears: { 
        type: Number, required: true },

    email: { 
        type: String, required: true, unique: true },

    address: { 
        type: String, required: true },

    password: { 
        type: String, required: true },
});

const Driver = mongoose.model("Driver", DriverSchema);

module.exports = Driver;