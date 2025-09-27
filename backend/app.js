require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const driverRouters = require("./Routes/DriverRoutes");
const TripRoutes = require("./Routes/TripRoutes");

const app = express();
const cors = require("cors");
const PORT = 5005;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/trips", TripRoutes);
app.use("/drivers", driverRouters);

// pass - BfgwUDnfQIe71WHG
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.then(() => console.log("Backend server is running on port " + PORT))
.then(() => {
    app.listen(PORT);
})
.catch((err) => console.log(err));
