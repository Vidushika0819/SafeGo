const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAllVehicles, createVehicle, getVehicleById, updateVehicle, deleteVehicle, getVehicleStats } = require('../controllers/vehicleController');

router.get('/', protect, getAllVehicles);
router.get('/stats', protect, getVehicleStats);
router.get('/:id', protect, getVehicleById);
router.post('/', protect, createVehicle);
router.put('/:id', protect, updateVehicle);
router.delete('/:id', protect, deleteVehicle);

module.exports = router;