const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
    busId: {
        type: String, required: true, unique: true },

    busNumber: {
        type: String, required: true },

    busType: {
        type: String, required: true },

    capacity: {
        type: Number, required: true },

    status: {
        type: String, required: true, enum: ['active', 'under maintenance', 'inactive'] },
});

const Bus = mongoose.model("Bus", BusSchema);

module.exports = Bus;
