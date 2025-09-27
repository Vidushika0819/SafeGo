const express = require("express");
const router = express.Router();


// Import Trip Controller (only once)
const { getAllTrips, addTrips, getById, updateTripById, deleteTripById} = require("../Controllers/TripController.js");
const { findByIdAndDelete } = require("../Model/TripModel.js");

// Get all Trips
router.get("/", getAllTrips);

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

