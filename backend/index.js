const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const healthCheckRoutes = require('./routes/healthChecks');
const tripRoutes = require('./routes/trips');
const dailyCheckRoutes = require('./routes/dailyChecks');
const monthlyReportRoutes = require('./routes/monthlyReports');
const maintenanceRoutes = require('./routes/maintenance');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/health-checks', healthCheckRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/daily-checks', dailyCheckRoutes);
app.use('/api/monthly-reports', monthlyReportRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vehicle Health Check API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚗 Vehicle Health Check API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});