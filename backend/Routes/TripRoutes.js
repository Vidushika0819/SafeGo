const express = require("express");
const router = express.Router();


// Import Trip Controller (only once)
const { getAllTrips, getAvailableTrips, addTrips, getById, updateTripById, deleteTripById} = require("../Controllers/TripController.js");
const { findByIdAndDelete } = require("../Models/TripModel.js");

// Get all Trips
router.get("/", getAllTrips);

// Get available trips (for parents to book seats)
router.get("/available", getAvailableTrips);

// POST add trip
router.post("/", addTrips);

// Get Trip by ID
router.get("/:id", getById);

// Update Trip by ID
router.put("/:id", updateTripById);

// Delete Trip by ID
router.delete("/:id", deleteTripById);

//export
module.exports = router;
