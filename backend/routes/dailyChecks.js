const express = require('express');
const { body } = require('express-validator');
const {
  getAllDailyChecks,
  getDailyCheckById,
  createDailyCheck,
  updateDailyCheck,
  deleteDailyCheck,
  getDailyChecksByVehicle,
  getDailyCheckStats
} = require('../controllers/dailyCheckController');

const router = express.Router();

// Validation middleware
const dailyCheckValidation = [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('driverId').isMongoId().withMessage('Valid driver ID is required'),
  body('finalDecision').isIn(['Ready', 'Not Ready', 'Needs Service', 'Unsafe']).withMessage('Invalid final decision'),
  body('checklist.brakes').isBoolean().withMessage('Brakes checked must be boolean'),
  body('checklist.tires').isBoolean().withMessage('Tires checked must be boolean'),
  body('checklist.lights').isBoolean().withMessage('Lights checked must be boolean'),
  body('checklist.fuel').isBoolean().withMessage('Fuel checked must be boolean'),
  body('checklist.firstAidKit').isBoolean().withMessage('First aid kit checked must be boolean'),
  body('completedBy').notEmpty().withMessage('Completed by is required')
];

// Routes
router.get('/', getAllDailyChecks);
router.get('/stats', getDailyCheckStats);
router.get('/vehicle/:vehicleId', getDailyChecksByVehicle);
router.get('/:id', getDailyCheckById);
router.post('/', dailyCheckValidation, createDailyCheck);
router.put('/:id', dailyCheckValidation, updateDailyCheck);
router.delete('/:id', deleteDailyCheck);

module.exports = router;