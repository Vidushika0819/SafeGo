const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getVehicles, addVehicle } = require('../controllers/vehicleController');

router.get('/', protect, getVehicles);
router.post('/', protect, addVehicle);

module.exports = router;