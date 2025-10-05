const Trip = require("../Models/TripModel");

//display all Trips
const getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate('busId')
      .populate('driverId')
      .populate('coordinatorId');

    if (!trips) {
      return res.status(404).json({ message: "No Trips found" });
    }

    return res.status(200).json({ trips });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//data insert
const addTrips = async (req, res, next) => {
  const { Trip_ID, date, start_time, end_time, start_location, route, status, busId, driverId, coordinatorId } =
    req.body;

  try {
    const newTrip = new Trip({
      Trip_ID,
      date,
      start_time,
      end_time,
      start_location,
      route,
      status,
      busId,
      driverId,
      coordinatorId,
    });
    await newTrip.save();
    return res.status(201).json(newTrip);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    } else if (error.name === 'ValidationError') {
      // Validation error
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    } else {
      return res.status(500).json({ message: "Unable to add trip" });
    }
  }
};

//Get by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const trip = await Trip.findById(id)
      .populate('busId')
      .populate('driverId')
      .populate('coordinatorId');
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    return res.status(200).json({ trip });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



//update trip by ID
const updateTripById = async (req, res, next) => {
  const id = req.params.id;
  const { Trip_ID, date, start_time, end_time, start_location, route, status, busId, driverId, coordinatorId } = req.body;

  try {
    const trip = await Trip.findByIdAndUpdate(
      id,
      { Trip_ID, date, start_time, end_time, start_location, route, status, busId, driverId, coordinatorId },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "unable to update trip details" });
    }
    return res.status(200).json(trip);

  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    } else if (error.name === 'ValidationError') {
      // Validation error
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    } else {
      return res.status(500).json({ message: "Unable to update trip" });
    }
  }
};


//delete trip by ID
const deleteTripById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    return res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }  
};

//export All functions
exports.getAllTrips = getAllTrips;
exports.addTrips = addTrips;
exports.getById = getById;
exports.updateTripById = updateTripById;
exports.deleteTripById = deleteTripById;
