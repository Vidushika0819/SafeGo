const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db'); // Import MongoDB connection

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/dailyChecks', require('./routes/dailyChecks'));
app.use('/api/maintenanceLogs', require('./routes/maintenanceLogs'));
app.use('/api/monthlyReports', require('./routes/monthlyReports'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => {
  res.send('API is working... 🚀');
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong!' });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));