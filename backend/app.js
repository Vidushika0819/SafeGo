require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const driverRouters = require("./Routes/DriverRoutes");
const TripRoutes = require("./Routes/TripRoutes");
const coordinatorRouters = require("./Routes/CoordinatorRoutes");
const busRouters = require("./Routes/BusRoutes");
const parentRouters = require("./Routes/ParentRoutes");
const { router: authRoutes } = require("./Routes/authRoutes");
const childRoutes = require("./Routes/childRoutes");
const tripAssignmentRoutes = require("./Routes/tripAssignmentRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const seedUsers = require("./seedUsers");

const app = express();
const cors = require("cors");
const PORT = 5005;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/children", childRoutes);
app.use("/api/trip-assignments", tripAssignmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/trips", TripRoutes);
app.use("/drivers", driverRouters);
app.use("/coordinators", coordinatorRouters);
app.use("/buses", busRouters);
app.use("/parents", parentRouters);

// pass - BfgwUDnfQIe71WHG
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.then(() => {
    // Optionally seed sample users for demonstration (commented out to preserve user data)
    // seedUsers();
    console.log("Backend server is running on port " + PORT);
    app.listen(PORT);
})
.catch((err) => console.log(err));
