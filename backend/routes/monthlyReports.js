const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const MonthlyServiceReport = require('../models/MonthlyServiceReport');

router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ msg: 'Driver access required' });
  const report = new MonthlyServiceReport({ ...req.body, driverId: req.user.id });
  await report.save();
  res.json(report);
});

router.get('/:vehicleId', protect, async (req, res) => {
  const reports = await MonthlyServiceReport.find({ vehicleId: req.params.vehicleId });
  res.json(reports);
});

module.exports = router;