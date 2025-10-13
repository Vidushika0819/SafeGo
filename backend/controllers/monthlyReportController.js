const MonthlyReport = require('../models/MonthlyReport');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all monthly reports
const getAllMonthlyReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, vehicleId, driverId, month, year, startDate, endDate, adminStatus } = req.query;
    
    const query = {};
    
    if (vehicleId) query.vehicleId = vehicleId;
    if (driverId) query.driverId = driverId;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (adminStatus) query.adminStatus = adminStatus;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const monthlyReports = await MonthlyReport.find(query)
      .populate('driverId', 'firstName lastName email')
      .sort({ date: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await MonthlyReport.countDocuments(query);
    
    res.json({
      monthlyReports,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching monthly reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get monthly report by ID
const getMonthlyReportById = async (req, res) => {
  try {
    const monthlyReport = await MonthlyReport.findById(req.params.id)
      .populate('driverId', 'firstName lastName email');
    
    if (!monthlyReport) {
      return res.status(404).json({ message: 'Monthly report not found' });
    }
    
    res.json(monthlyReport);
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new monthly report
const createMonthlyReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { vehicleId, driverId, odometerReading, issues, actionsTaken, nextServiceDate, serviceProvider, totalCost, completedBy } = req.body;
    
    // Verify vehicle exists
    const vehicle = await Vehicle.findOne({ vehicleId: vehicleId });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if monthly report already exists for this vehicle and month/year
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    const existingReport = await MonthlyReport.findOne({
      vehicleId: vehicleId,
      month: month,
      year: year
    });
    
    if (existingReport) {
      return res.status(400).json({ message: 'Monthly report already exists for this vehicle this month' });
    }
    
    const monthlyReport = new MonthlyReport({
      vehicleId,
      driverId,
      odometerReading,
      issues,
      actionsTaken,
      nextServiceDate,
      serviceProvider,
      totalCost,
      completedBy,
      month,
      year
    });
    
    await monthlyReport.save();
    
    // Update vehicle's current odometer reading
    if (odometerReading && odometerReading > vehicle.currentOdometer) {
      vehicle.currentOdometer = odometerReading;
      await vehicle.save();
    }
    
    const populatedReport = await MonthlyReport.findById(monthlyReport._id)
      .populate('driverId', 'firstName lastName email');
    
    res.status(201).json(populatedReport);
  } catch (error) {
    console.error('Error creating monthly report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update monthly report
const updateMonthlyReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const monthlyReport = await MonthlyReport.findById(req.params.id);
    if (!monthlyReport) {
      return res.status(404).json({ message: 'Monthly report not found' });
    }
    
    const updatedReport = await MonthlyReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('driverId', 'firstName lastName email');
    
    res.json(updatedReport);
  } catch (error) {
    console.error('Error updating monthly report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete monthly report
const deleteMonthlyReport = async (req, res) => {
  try {
    const monthlyReport = await MonthlyReport.findById(req.params.id);
    if (!monthlyReport) {
      return res.status(404).json({ message: 'Monthly report not found' });
    }
    
    await MonthlyReport.findByIdAndDelete(req.params.id);
    res.json({ message: 'Monthly report deleted successfully' });
  } catch (error) {
    console.error('Error deleting monthly report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get monthly reports by vehicle
const getMonthlyReportsByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    const query = { vehicleId: vehicleId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const monthlyReports = await MonthlyReport.find(query)
      .populate('driverId', 'firstName lastName email')
      .sort({ date: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await MonthlyReport.countDocuments(query);
    
    res.json({
      monthlyReports,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching monthly reports by vehicle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get monthly report statistics
const getMonthlyReportStats = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.query;
    
    const query = {};
    if (vehicleId) query.vehicleId = vehicleId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const stats = await MonthlyReport.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          totalCost: { $sum: '$totalCost' },
          averageCost: { $avg: '$totalCost' },
          averageOdometer: { $avg: '$odometerReading' }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalReports: 0,
      totalCost: 0,
      averageCost: 0,
      averageOdometer: 0
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching monthly report stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllMonthlyReports,
  getMonthlyReportById,
  createMonthlyReport,
  updateMonthlyReport,
  deleteMonthlyReport,
  getMonthlyReportsByVehicle,
  getMonthlyReportStats
};