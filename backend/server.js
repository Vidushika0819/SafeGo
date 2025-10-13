// Simple entrypoint used in some scripts. This file creates an Express app,
// attaches a small set of routes and connects to MongoDB.
// Note: the main backend server used during development is `backend/src/index.js`.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route modules (minimal subset — full router set lives under backend/src)
const authRoutes = require('./src/routes/auth');
const vehicleRoutes = require('./src/routes/vehicles');
const dailyCheckRoutes = require('./src/routes/dailyChecks');
const maintenanceRoutes = require('./src/routes/maintenance');
const monthlyReportRoutes = require('./src/routes/monthlyReports');

const app = express();

// ----- Middleware -----
// Enable CORS for development convenience and accept JSON bodies
app.use(cors());
app.use(express.json());

// ----- Routes -----
// Mount route modules under /api/* paths. Each router groups related endpoints.
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/daily-checks', dailyCheckRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/monthly-reports', monthlyReportRoutes);

// ----- Database Connection -----
// Uses MONGO_URI environment variable when present, otherwise falls back to the
// provided connection string. This file is primarily for quick scripts and
// simple runs; more robust startup logic is available in backend/src.
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:nZOOi0ZqFXR8LQxc@cluster0.nbtqlwt.mongodb.net/vehiclehealth";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    // Start HTTP server after DB connection is established
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // Log connection errors — do not attempt recovery here (simple script)
    console.error('Database connection error:', err);
  });