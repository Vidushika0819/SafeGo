const Reservation = require("../Model/ReservationModel");
const Seat = require("../Model/SeatModel");

//CREATE
const createReservation = async (req, res) => {
  try {
    const { seatID, studentID, reservationType } = req.body;

    const seat = await Seat.findById(seatID);
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    if (seat.status !== "Available")
      return res.status(400).json({ error: "Seat is not available" });

    let status = "Pending";

    if (reservationType === "Regular") {
      status = "Approved";
      seat.status = "Booked";
      await seat.save();
    } else {
      seat.status = "Pending";
      await seat.save();
    }

    const reservation = new Reservation({
      seatID,
      studentID,
      reservationType,
      status,
      requestedAt: new Date(),
    });

    await reservation.save();

    res.status(201).json({
      message:
        reservationType === "Regular"
          ? "Seat successfully booked"
          : "Reservation request pending approval",
      reservation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//READ (by student)
const getReservationsByStudent = async (req, res) => {
  try {
    const { studentID } = req.params;
    const reservations = await Reservation.find({ studentID }).populate("seatID");
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//UPDATE (approve / cancel)
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    reservation.status = status;
    await reservation.save();

    if (status === "Approved") {
      await Seat.findByIdAndUpdate(reservation.seatID, { status: "Booked" });
    }
    if (status === "Cancelled") {
      await Seat.findByIdAndUpdate(reservation.seatID, { status: "Available" });
    }

    res.json({ message: "Reservation updated", reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//DELETE
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    // free seat back
    await Seat.findByIdAndUpdate(reservation.seatID, { status: "Available" });

    await reservation.deleteOne();

    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createReservation,
  getReservationsByStudent,
  updateReservation,
  deleteReservation,
};
