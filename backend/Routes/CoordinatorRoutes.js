const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('./authRoutes');

// Import Coordinator Controller
const {
    getAllCoordinators,
    addCoordinators,
    getById,
    updateCoordinator,
    deleteCoordinator,
    getCoordinatorProfile,
    updateCoordinatorProfile
} = require("../Controllers/CoordinatorControllers.js");

// GET all coordinators
router.get("/", getAllCoordinators);

// POST add coordinator
router.post("/", addCoordinators);

//get by ID
router.get("/:id", getById);

//update coordinator details
router.put( "/:id", updateCoordinator);

//delete coordinator details
router.delete( "/:id", deleteCoordinator);

// Profile routes (require authentication)
router.get("/profile", authenticateToken, requireRole('coordinator'), getCoordinatorProfile);
router.put("/profile", authenticateToken, requireRole('coordinator'), updateCoordinatorProfile);

//export
module.exports = router;
