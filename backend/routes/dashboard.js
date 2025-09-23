const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const DailyCheck = require('../models/DailyCheck');
const Vehicle = require('../models/Vehicle');

router.get('/driver', protect, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ msg: 'Access denied' });
  const checkStats = await DailyCheck.aggregate([
    { $match: { driverId: req.user._id } },  // Note: req.user.id -> req.user._id (Mongoose ObjectId)
    { $group: { _id: '$finalDecision', count: { $sum: 1 } } }
  ]);
  const recentChecks = await DailyCheck.find({ driverId: req.user._id }).sort({ date: -1 }).limit(5);
  const assignedVehicles = await Vehicle.find({});  // Customize if vehicles are assigned per driver
  res.json({ checkStats, recentChecks, assignedVehicles });
});

// Add admin dashboard if needed
router.get('/admin', protect, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  // Add admin stats here (e.g., all vehicles, all checks)
  res.json({ msg: 'Admin dashboard data' });
});

module.exports = router;