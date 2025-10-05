const express = require("express");
const router = express.Router();
const RouteController = require("../Controllers/RouteController");
const { authenticateAdmin } = require("../middleware/adminAuth");

// Get all routes (public endpoint for parents)
router.get("/", RouteController.getAllRoutes);

// All other route endpoints require admin authentication
router.use(authenticateAdmin);

// Create a new route
router.post("/", RouteController.createRoute);

// Get route by ID
router.get("/:id", RouteController.getRouteById);

// Update route
router.put("/:id", RouteController.updateRoute);

// Delete route (soft delete)
router.delete("/:id", RouteController.deleteRoute);

module.exports = router;