require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/daily-checks', require('./routes/dailyChecks'));
app.use('/api/maintenance-logs', require('./routes/maintenanceLogs'));
app.use('/api/monthly-reports', require('./routes/monthlyReports'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));