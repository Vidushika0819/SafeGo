const express = require("express");
const {
  createReservation,
  getReservationsByStudent,
  updateReservation,
  deleteReservation
} = require("../Controllers/ReservationController");

const router = express.Router();

// CRUD
router.post("/", createReservation);
router.get("/student/:studentID", getReservationsByStudent);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

module.exports = router;
