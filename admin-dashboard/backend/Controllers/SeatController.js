const Seat = require("../Model/SeatModel");
const Bus = require("../Model/BusModel");

// POST /api/seats -> create one seat
const createSeat = async (req, res) => {
  try {
    const { seatNumber, busID, status } = req.body;
    
    // Validate bus exists
    const bus = await Bus.findOne({ busID, isActive: true });
    if (!bus) {
      return res.status(400).json({ error: "Bus not found or inactive" });
    }
    
    const seat = new Seat({
      seatNumber,
      busID,
      status: status || "Available",
    });
    await seat.save();
    res.status(201).json(seat);
  } catch (err) {
    // Duplicate seat for same bus -> E11000
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Seat already exists for this bus." });
    }
    res.status(400).json({ error: err.message });
  }
};

// GET /api/seats/bus/:busID  → list seats of a bus
const getSeatsByBus = async (req, res) => {
  try {
    const seats = await Seat.find({ busID: req.params.busID }).sort("seatNumber");
    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/seats/generate  → bulk create seats (1..totalSeats), no driver seat
const generateSeatsForBus = async (req, res) => {
  try {
    const { busID, totalSeats } = req.body;

    // For testing: allow generating seats even if bus doesn't exist in Bus collection
    // In production, you'd want to validate bus existence
    const seatsToGenerate = totalSeats || 28; // default to 28 seats

    const existing = await Seat.countDocuments({ busID });
    if (existing > 0) {
      return res.status(400).json({ message: `Seats already exist for bus ${busID}.` });
    }

    const seats = Array.from({ length: seatsToGenerate }, (_, i) => ({
      seatNumber: i + 1,
      busID,
      status: "Available",
    }));

    const created = await Seat.insertMany(seats);
    res.status(201).json({
      message: `${created.length} seats created for bus ${busID}`,
      busInfo: {
        busID: busID,
        totalSeats: seatsToGenerate
      },
      createdSeats: created,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Some seats already exist for this bus." });
    }
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createSeat, getSeatsByBus, generateSeatsForBus };
