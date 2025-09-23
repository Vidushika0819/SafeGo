const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const DailyCheck = require('../models/DailyCheck');


router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ msg: 'Driver access required' });
  const check = new DailyCheck({ ...req.body, driverId: req.user.id });
  await check.save();
  res.json(check);
});

router.get('/:vehicleId', protect, async (req, res) => {
  const checks = await DailyCheck.find({ vehicleId: req.params.vehicleId });
  res.json(checks);
});

module.exports = router;