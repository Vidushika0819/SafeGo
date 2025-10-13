const DailyCheck = require('../models/DailyCheck');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all daily checks
const getAllDailyChecks = async (req, res) => {
  try {
    const { page = 1, limit = 10, vehicleId, driverId, finalDecision, startDate, endDate, adminStatus } = req.query;
    
    const query = {};
    
    if (vehicleId) query.vehicleId = vehicleId;
    if (driverId) query.driverId = driverId;
    if (finalDecision) query.finalDecision = finalDecision;
    if (adminStatus) query.adminStatus = adminStatus;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const dailyChecks = await DailyCheck.find(query)
      .populate('driverId', 'firstName lastName email')
      .sort({ date: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await DailyCheck.countDocuments(query);
    
    res.json({
      dailyChecks,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching daily checks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get daily check by ID
const getDailyCheckById = async (req, res) => {
  try {
    const dailyCheck = await DailyCheck.findById(req.params.id)
      .populate('driverId', 'firstName lastName email');
    
    if (!dailyCheck) {
      return res.status(404).json({ message: 'Daily check not found' });
    }
    
    res.json(dailyCheck);
  } catch (error) {
    console.error('Error fetching daily check:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new daily check
const createDailyCheck = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { vehicleId, driverId, checklist, finalDecision, remarks, completedBy } = req.body;
    
    // Verify vehicle exists
    const vehicle = await Vehicle.findOne({ vehicleId: vehicleId });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if daily check already exists for this vehicle and date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingCheck = await DailyCheck.findOne({
      vehicleId: vehicleId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    if (existingCheck) {
      return res.status(400).json({ message: 'Daily check already exists for this vehicle today' });
    }
    
    const dailyCheck = new DailyCheck({
      vehicleId,
      driverId,
      checklist,
      finalDecision,
      remarks,
      completedBy
    });
    
    await dailyCheck.save();
    
    const populatedCheck = await DailyCheck.findById(dailyCheck._id)
      .populate('driverId', 'firstName lastName email');
    
    res.status(201).json(populatedCheck);
  } catch (error) {
    console.error('Error creating daily check:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update daily check
const updateDailyCheck = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const dailyCheck = await DailyCheck.findById(req.params.id);
    if (!dailyCheck) {
      return res.status(404).json({ message: 'Daily check not found' });
    }
    
    const updatedCheck = await DailyCheck.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('driverId', 'firstName lastName email');
    
    res.json(updatedCheck);
  } catch (error) {
    console.error('Error updating daily check:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete daily check
const deleteDailyCheck = async (req, res) => {
  try {
    const dailyCheck = await DailyCheck.findById(req.params.id);
    if (!dailyCheck) {
      return res.status(404).json({ message: 'Daily check not found' });
    }
    
    await DailyCheck.findByIdAndDelete(req.params.id);
    res.json({ message: 'Daily check deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily check:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get daily checks by vehicle
const getDailyChecksByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    const query = { vehicleId: vehicleId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const dailyChecks = await DailyCheck.find(query)
      .populate('driverId', 'firstName lastName email')
      .sort({ date: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await DailyCheck.countDocuments(query);
    
    res.json({
      dailyChecks,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching daily checks by vehicle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get daily check statistics
const getDailyCheckStats = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.query;
    
    const query = {};
    if (vehicleId) query.vehicleId = vehicleId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const stats = await DailyCheck.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalChecks: { $sum: 1 },
          readyChecks: {
            $sum: { $cond: [{ $eq: ['$finalDecision', 'Ready'] }, 1, 0] }
          },
          notReadyChecks: {
            $sum: { $cond: [{ $eq: ['$finalDecision', 'Not Ready'] }, 1, 0] }
          },
          needsServiceChecks: {
            $sum: { $cond: [{ $eq: ['$finalDecision', 'Needs Service'] }, 1, 0] }
          },
          unsafeChecks: {
            $sum: { $cond: [{ $eq: ['$finalDecision', 'Unsafe'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalChecks: 0,
      readyChecks: 0,
      notReadyChecks: 0,
      needsServiceChecks: 0,
      unsafeChecks: 0
    };
    
    result.readyPercentage = result.totalChecks > 0 
      ? Math.round((result.readyChecks / result.totalChecks) * 100) 
      : 0;
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching daily check stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllDailyChecks,
  getDailyCheckById,
  createDailyCheck,
  updateDailyCheck,
  deleteDailyCheck,
  getDailyChecksByVehicle,
  getDailyCheckStats
};


