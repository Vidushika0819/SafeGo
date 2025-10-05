const express = require("express");
const router = express.Router();
const BusController = require("../Controllers/BusController");
const { authenticateAdmin } = require("../middleware/adminAuth");

// Public endpoints (no authentication required) for frontend
// Get buses by route (for seat reservation page)
router.get("/route/:routeId", BusController.getBusesByRoute);

// Admin-only endpoints (authentication required)
// Create a new bus
router.post("/", authenticateAdmin, BusController.createBus);

// Get all buses
router.get("/", authenticateAdmin, BusController.getAllBuses);

// Get bus by ID
router.get("/:busID", authenticateAdmin, BusController.getBusById);

// Update bus
router.put("/:busID", authenticateAdmin, BusController.updateBus);

// Delete bus (soft delete)
router.delete("/:busID", authenticateAdmin, BusController.deleteBus);

module.exports = router;