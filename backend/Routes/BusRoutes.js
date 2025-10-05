const express = require("express");
const router = express.Router();

// Import Bus Controller (only once)
const { getAllBuses, addBuses, getById, updateBus, deleteBus } = require("../Controllers/BusControllers.js");

// GET all buses
router.get("/", getAllBuses);

// POST add bus
router.post("/", addBuses);

//get by ID
router.get("/:id", getById);

//update bus details
router.put( "/:id", updateBus);

//delete bus details
router.delete( "/:id", deleteBus);


//export
module.exports = router;
