const MaintenanceLog = require('../models/MaintenanceLog');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all maintenance logs
const getAllMaintenanceLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, vehicleId, driverId, status, priority, startDate, endDate } = req.query;
    
    const query = {};
    
    if (vehicleId) query.vehicleId = vehicleId;
    if (driverId) query.driverId = driverId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const maintenanceLogs = await MaintenanceLog.find(query)
      .populate('driverId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await MaintenanceLog.countDocuments(query);
    
    res.json({
      maintenanceLogs,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching maintenance logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get maintenance log by ID
const getMaintenanceLogById = async (req, res) => {
  try {
    const maintenanceLog = await MaintenanceLog.findById(req.params.id)
      .populate('driverId', 'firstName lastName email');
    
    if (!maintenanceLog) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }
    
    res.json(maintenanceLog);
  } catch (error) {
    console.error('Error fetching maintenance log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new maintenance log
const createMaintenanceLog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { vehicleId, driverId, serviceType, description, scheduledDate, estimatedCost, priority, coordinatorDetails, completedBy } = req.body;
    
    // Verify vehicle exists
    const vehicle = await Vehicle.findOne({ vehicleId: vehicleId });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    const maintenanceLog = new MaintenanceLog({
      vehicleId,
      driverId,
      serviceType,
      description,
      scheduledDate,
      estimatedCost,
      priority,
      coordinatorDetails,
      completedBy
    });
    
    await maintenanceLog.save();
    
    const populatedLog = await MaintenanceLog.findById(maintenanceLog._id)
      .populate('driverId', 'firstName lastName email');
    
    res.status(201).json(populatedLog);
  } catch (error) {
    console.error('Error creating maintenance log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update maintenance log
const updateMaintenanceLog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const maintenanceLog = await MaintenanceLog.findById(req.params.id);
    if (!maintenanceLog) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }
    
    // If status is being updated to 'Completed', set completedDate
    if (req.body.status === 'Completed' && !maintenanceLog.completedDate) {
      req.body.completedDate = new Date();
    }
    
    const updatedLog = await MaintenanceLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('driverId', 'firstName lastName email');
    
    res.json(updatedLog);
  } catch (error) {
    console.error('Error updating maintenance log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete maintenance log
const deleteMaintenanceLog = async (req, res) => {
  try {
    const maintenanceLog = await MaintenanceLog.findById(req.params.id);
    if (!maintenanceLog) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }
    
    await MaintenanceLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Maintenance log deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get maintenance logs by vehicle
const getMaintenanceLogsByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    const query = { vehicleId: vehicleId };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const maintenanceLogs = await MaintenanceLog.find(query)
      .populate('driverId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await MaintenanceLog.countDocuments(query);
    
    res.json({
      maintenanceLogs,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching maintenance logs by vehicle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get maintenance statistics
const getMaintenanceStats = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.query;
    
    const query = {};
    if (vehicleId) query.vehicleId = vehicleId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const stats = await MaintenanceLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalLogs: { $sum: 1 },
          plannedLogs: {
            $sum: { $cond: [{ $eq: ['$status', 'Planned'] }, 1, 0] }
          },
          inProgressLogs: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          completedLogs: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          totalEstimatedCost: { $sum: '$estimatedCost' },
          totalActualCost: { $sum: '$actualCost' },
          averageCost: { $avg: '$actualCost' }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalLogs: 0,
      plannedLogs: 0,
      inProgressLogs: 0,
      completedLogs: 0,
      totalEstimatedCost: 0,
      totalActualCost: 0,
      averageCost: 0
    };
    
    result.completionRate = result.totalLogs > 0 
      ? Math.round((result.completedLogs / result.totalLogs) * 100) 
      : 0;
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching maintenance stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog,
  getMaintenanceLogsByVehicle,
  getMaintenanceStats
};