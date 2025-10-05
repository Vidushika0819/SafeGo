const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
    name: { 
        type: String, required: true },

    licenseNumber: {
        type: String, required: false, unique: true },

    phoneNumber: {
        type: String, required: false },

    vehicleType: {
        type: String, required: false },

    vehicleNumber: {
        type: String, required: false, unique: true },

    age: {
        type: Number, required: false },

    experienceYears: {
        type: Number, required: false },

    email: {
        type: String, required: true, unique: true },

    address: {
        type: String, required: false },

    password: { 
        type: String, required: true },
});

const Driver = mongoose.model("Driver", DriverSchema);

module.exports = Driver;
