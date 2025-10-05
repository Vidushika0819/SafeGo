const mongoose = require("mongoose");

const ParentSchema = new mongoose.Schema({
    parentId: {
        type: String, required: true, unique: true },

    fullName: {
        type: String, required: true },

    phoneNumber: {
        type: String, required: true },

    DOB: {
        type: Date, required: true },

    email: {
        type: String, required: true, unique: true },

    address: {
        type: String, required: true },

    password: {
        type: String, required: true },
});

const Parent = mongoose.model("Parent", ParentSchema);

module.exports = Parent;
