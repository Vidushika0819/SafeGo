const express = require("express");
const router = express.Router();
const { createSeat, getSeatsByBus, generateSeatsForBus } =
  require("../Controllers/SeatController");

router.post("/", createSeat);                 // create one seat
router.post("/generate", generateSeatsForBus); // bulk create seats
router.get("/bus/:busID", getSeatsByBus);      // list seats by bus

module.exports = router;
