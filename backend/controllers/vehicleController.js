const Vehicle = require('../models/Vehicle');
const DailyCheck = require('../models/DailyCheck');
const MaintenanceLog = require('../models/MaintenanceLog');
const MonthlyReport = require('../models/MonthlyReport');
const { validationResult } = require('express-validator');

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { vehicleId: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { licensePlate: { $regex: search, $options: 'i' } }
      ];
    }
    
    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Vehicle.countDocuments(query);
    
    res.json({
      vehicles,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ vehicleId: req.params.id });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new vehicle
const createVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { vehicleId, model, year, capacity, licensePlate, status, manufacturer, color, assignedDriver } = req.body;
    
    // Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ 
      $or: [
        { vehicleId: vehicleId },
        { licensePlate: licensePlate }
      ]
    });
    
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle with this ID or license plate already exists' });
    }
    
    const vehicle = new Vehicle({
      vehicleId,
      model,
      year,
      capacity,
      licensePlate,
      status,
      manufacturer,
      color,
      assignedDriver
    });
    
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const vehicle = await Vehicle.findOne({ vehicleId: req.params.id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { vehicleId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ vehicleId: req.params.id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    await Vehicle.findOneAndDelete({ vehicleId: req.params.id });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vehicle statistics
const getVehicleStats = async (req, res) => {
  try {
    const stats = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          totalVehicles: { $sum: 1 },
          activeVehicles: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          inactiveVehicles: {
            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
          },
          maintenanceVehicles: {
            $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
          },
          totalCapacity: { $sum: '$capacity' }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalVehicles: 0,
      activeVehicles: 0,
      inactiveVehicles: 0,
      maintenanceVehicles: 0,
      totalCapacity: 0
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching vehicle stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleStats
};
