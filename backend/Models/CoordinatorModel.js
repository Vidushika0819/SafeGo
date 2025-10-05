const mongoose = require("mongoose");

const CoordinatorSchema = new mongoose.Schema({
    coordinatorId: {
        type: String, required: true, unique: true },

    fullName: {
        type: String, required: true },

    phoneNumber: {
        type: String, required: false },

    DOB: {
        type: Date, required: false },

    email: {
        type: String, required: true, unique: true },

    address: {
        type: String, required: false },

    department: {
        type: String, required: false },

    password: {
        type: String, required: true },
});

const Coordinator = mongoose.model("Coordinator", CoordinatorSchema);

module.exports = Coordinator;
