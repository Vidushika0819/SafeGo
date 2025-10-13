const express = require('express');
const { body } = require('express-validator');
const {
  getAllMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog,
  getMaintenanceLogsByVehicle,
  getMaintenanceStats
} = require('../controllers/maintenanceController');

const router = express.Router();

// Validation middleware
const maintenanceValidation = [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('serviceType').notEmpty().withMessage('Service type is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('status').isIn(['Planned', 'In Progress', 'Completed']).withMessage('Invalid status'),
  body('estimatedCost').optional().isNumeric().withMessage('Estimated cost must be a number'),
  body('actualCost').optional().isNumeric().withMessage('Actual cost must be a number'),
  body('completedBy').optional().notEmpty().withMessage('Completed by cannot be empty')
];

// Routes
router.get('/', getAllMaintenanceLogs);
router.get('/stats', getMaintenanceStats);
router.get('/vehicle/:vehicleId', getMaintenanceLogsByVehicle);
router.get('/:id', getMaintenanceLogById);
router.post('/', maintenanceValidation, createMaintenanceLog);
router.put('/:id', maintenanceValidation, updateMaintenanceLog);
router.delete('/:id', deleteMaintenanceLog);

module.exports = router;