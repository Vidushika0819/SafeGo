const express = require("express");
const mongoose = require("mongoose");
const seatRoutes = require("./Routes/SeatRoutes");
const reservationRoutes = require("./Routes/ReservationRoutes");

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://nimeshalwis13_db_user:fXG5lTvOJDUgrUkm@safego.u8riemt.mongodb.net/schoolbus", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/seats", seatRoutes);
app.use("/api/reservations", reservationRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("School Bus Seat Reservation API is running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
