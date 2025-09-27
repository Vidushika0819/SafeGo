const express = require("express");
const router = express.Router();

// Import Driver Controller (only once)
const { getAllDrivers, addDrivers, getById, updateDriver, deleteDriver } = require("../Controllers/DriverControllers.js");

// GET all drivers
router.get("/", getAllDrivers);

// POST add driver
router.post("/", addDrivers);

//get by ID
router.get("/:id", getById);

//update driver details
router.put( "/:id", updateDriver);

//delete driver details
router.delete( "/:id", deleteDriver);


//export 
module.exports = router;


