const express = require("express");
const router = express.Router();
const Waitlist = require("../Model/WaitlistModel");
const Seat = require("../Model/SeatModel");
const Bus = require("../Model/BusModel");

// Add student to waitlist
router.post("/add", async (req, res) => {
  try {
    const { studentID, busID, routeID, studentType, expectedDuration, seasonType, requestedDate } = req.body;

    // Check if student is already on waitlist for this bus
    const existingWaitlist = await Waitlist.findOne({
      studentID,
      busID,
      status: "Active"
    });

    if (existingWaitlist) {
      return res.status(400).json({
        success: false,
        message: "You are already on the waitlist for this bus"
      });
    }

    // Check if bus exists
    const bus = await Bus.findOne({ busID });
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    // Create waitlist entry
    const waitlistEntry = new Waitlist({
      studentID,
      busID,
      routeID,
      studentType,
      expectedDuration,
      seasonType,
      requestedDate: requestedDate || new Date()
    });

    await waitlistEntry.save();

    res.status(201).json({
      success: true,
      message: "Successfully added to waitlist",
      data: waitlistEntry
    });

  } catch (error) {
    console.error("Error adding to waitlist:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to waitlist",
      error: error.message
    });
  }
});

// Get waitlist for a specific bus
router.get("/bus/:busID", async (req, res) => {
  try {
    const { busID } = req.params;
    
    const waitlist = await Waitlist.find({ 
      busID, 
      status: "Active" 
    }).sort({ priority: -1, createdAt: 1 });

    res.json({
      success: true,
      data: waitlist
    });

  } catch (error) {
    console.error("Error fetching waitlist:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching waitlist",
      error: error.message
    });
  }
});

// Get all waitlists for admin dashboard
router.get("/admin/all", async (req, res) => {
  try {
    const waitlists = await Waitlist.find({ status: "Active" })
      .sort({ priority: -1, createdAt: 1 });

    // Group by busID and student type
    const groupedWaitlists = waitlists.reduce((acc, item) => {
      if (!acc[item.busID]) {
        acc[item.busID] = {
          regular: [],
          temporary: []
        };
      }
      
      if (item.studentType === "Regular") {
        acc[item.busID].regular.push(item);
      } else {
        acc[item.busID].temporary.push(item);
      }
      
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedWaitlists,
      totalWaitlistEntries: waitlists.length
    });

  } catch (error) {
    console.error("Error fetching waitlists for admin:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching waitlists",
      error: error.message
    });
  }
});

// Get waitlist for specific student
router.get("/student/:studentID", async (req, res) => {
  try {
    const { studentID } = req.params;
    
    const waitlists = await Waitlist.find({ 
      studentID,
      status: "Active"
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: waitlists
    });

  } catch (error) {
    console.error("Error fetching student waitlist:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching waitlist",
      error: error.message
    });
  }
});

// Cancel waitlist entry
router.delete("/:waitlistID", async (req, res) => {
  try {
    const { waitlistID } = req.params;
    
    const waitlistEntry = await Waitlist.findOneAndUpdate(
      { waitlistID },
      { status: "Cancelled", updatedAt: new Date() },
      { new: true }
    );

    if (!waitlistEntry) {
      return res.status(404).json({
        success: false,
        message: "Waitlist entry not found"
      });
    }

    res.json({
      success: true,
      message: "Waitlist entry cancelled",
      data: waitlistEntry
    });

  } catch (error) {
    console.error("Error cancelling waitlist entry:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling waitlist entry",
      error: error.message
    });
  }
});

// Process waitlist when seat becomes available (for admin use)
router.post("/process/:busID", async (req, res) => {
  try {
    const { busID } = req.params;
    
    // Get available seats for this bus
    const availableSeats = await Seat.find({ 
      busID, 
      status: "Available" 
    }).countDocuments();

    if (availableSeats === 0) {
      return res.status(400).json({
        success: false,
        message: "No available seats for this bus"
      });
    }

    // Get waitlist entries for this bus (prioritized)
    const waitlistEntries = await Waitlist.find({
      busID,
      status: "Active"
    }).sort({ priority: -1, createdAt: 1 }).limit(availableSeats);

    const processedEntries = [];

    for (const entry of waitlistEntries) {
      // Mark as fulfilled (admin will manually assign seats)
      entry.status = "Fulfilled";
      entry.notificationSent = true;
      entry.updatedAt = new Date();
      await entry.save();
      
      processedEntries.push(entry);
    }

    res.json({
      success: true,
      message: `Processed ${processedEntries.length} waitlist entries`,
      data: processedEntries
    });

  } catch (error) {
    console.error("Error processing waitlist:", error);
    res.status(500).json({
      success: false,
      message: "Error processing waitlist",
      error: error.message
    });
  }
});

module.exports = router;