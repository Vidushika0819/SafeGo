const Seat = require("../Model/SeatModel");

// POST /api/seats -> create one seat
const createSeat = async (req, res) => {
  try {
    const { seatNumber, busID, status } = req.body;
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
    const { busID, totalSeats = 28 } = req.body;

    const existing = await Seat.countDocuments({ busID });
    if (existing > 0) {
      return res.status(400).json({ message: `Seats already exist for bus ${busID}.` });
    }

    const seats = Array.from({ length: totalSeats }, (_, i) => ({
      seatNumber: i + 1,
      busID,
      status: "Available",
    }));

    const created = await Seat.insertMany(seats);
    res.status(201).json({
      message: `${created.length} seats created for bus ${busID}`,
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
