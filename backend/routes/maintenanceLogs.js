const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const MaintenanceLog = require('../models/MaintenanceLog');

router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ msg: 'Driver access required' });
  const log = new MaintenanceLog({ ...req.body, driverId: req.user.id });
  await log.save();
  res.json(log);
});

router.get('/:vehicleId', protect, async (req, res) => {
  const logs = await MaintenanceLog.find({ vehicleId: req.params.vehicleId });
  res.json(logs);
});

module.exports = router;