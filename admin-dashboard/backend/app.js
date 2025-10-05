const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const seatRoutes = require("./Routes/SeatRoutes");
const reservationRoutes = require("./Routes/ReservationRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const routeRoutes = require("./Routes/RouteRoutes");
const busRoutes = require("./Routes/BusRoutes");
const expiredReservationRoutes = require("./Routes/ExpiredReservationRoutes");
const waitlistRoutes = require("./Routes/WaitlistRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://nimeshalwis13_db_user:fXG5lTvOJDUgrUkm@safego.u8riemt.mongodb.net/schoolbus")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/seats", seatRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/expired-reservations", expiredReservationRoutes);
app.use("/api/waitlist", waitlistRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("School Bus Seat Reservation API is running");
});

// Automatic expired reservation cleanup
const Reservation = require("./Model/ReservationModel");
const Seat = require("./Model/SeatModel");

// Schedule automatic cleanup every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Running automatic expired reservation cleanup...');
        
        const currentDate = new Date();
        const expiredReservations = await Reservation.find({
            status: "Booked",
            endDate: { $lt: currentDate }
        });

        let releasedSeats = 0;
        let pendingSeats = 0;
        
        for (const reservation of expiredReservations) {
            // Update reservation status
            reservation.status = "Completed";
            await reservation.save();

            // Handle seat status based on reservation type
            const seat = await Seat.findOne({
                busID: reservation.busID,
                seatNumber: reservation.seatNumber
            });

            if (seat && seat.status === "Booked") {
                if (reservation.reservationType === "Temporary") {
                    // Temporary students: Release seat immediately
                    seat.status = "Available";
                    seat.reservedBy = undefined;
                    await seat.save();
                    releasedSeats++;
                    console.log(`Released seat ${seat.seatNumber} on bus ${seat.busID} - Temporary reservation ${reservation.reservationID} expired`);
                } else if (reservation.reservationType === "Regular") {
                    // Regular students: Set to Pending for potential renewal
                    seat.status = "Pending";
                    // Keep reservedBy for renewal tracking
                    await seat.save();
                    pendingSeats++;
                    console.log(`Set seat ${seat.seatNumber} on bus ${seat.busID} to Pending - Regular reservation ${reservation.reservationID} expired`);
                }
            }
        }

        console.log(`Cleanup completed: ${expiredReservations.length} reservations processed`);
        console.log(`- ${releasedSeats} temporary seats released to Available`);
        console.log(`- ${pendingSeats} regular seats set to Pending for renewal`);
    } catch (error) {
        console.error('Error during automatic cleanup:', error.message);
    }
});

// Schedule reminder check every day at 9 AM for reservations expiring today
cron.schedule('0 9 * * *', async () => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const expiringToday = await Reservation.find({
            status: "Booked",
            endDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (expiringToday.length > 0) {
            console.log(`Reminder: ${expiringToday.length} reservations expire today`);
            expiringToday.forEach(r => {
                console.log(`- ${r.reservationID} (${r.studentID}) - Bus ${r.busID}, Seat ${r.seatNumber}`);
            });
        }
    } catch (error) {
        console.error('Error during expiration reminder check:', error.message);
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Automatic seat release system activated:');
    console.log('- Daily cleanup at midnight (00:00)');
    console.log('- Daily expiration reminders at 9:00 AM');
});
