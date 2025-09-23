const Vehicle = require('../models/Vehicle');

const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({});
  res.json(vehicles);
};

const addVehicle = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });
  const vehicle = new Vehicle(req.body);
  await vehicle.save();
  res.json(vehicle);
};

module.exports = { getVehicles, addVehicle };