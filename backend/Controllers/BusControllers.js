const Bus = require('../Models/BusModel');

//data display
const getAllBuses = async (req, res, next) => {


    try {
        const buses = await Bus.find();

    //not found
    if(!buses){
        return res.status(404).json({message:"No Buses found"});
    }

    //display all buses
    return res.status(200).json({buses});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }} ;


//data insert
const addBuses = async (req, res, next) => {
    const { busId, busNumber, busType, capacity, status } = req.body;


    try {
        const bus = new Bus({
            busId,
            busNumber,
            busType,
            capacity,
            status
        });

        await bus.save();
        return res.status(201).json( bus );
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
            return res.status(500).json({ message: "Unable to add bus" });
        }
    }

} ;


//get bus by id

const getById = async (req, res, next) => {

    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.status(200).json({ bus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }} ;

//update bus details
const updateBus = async (req, res, next) => {
    const { busId, busNumber, busType, capacity, status } = req.body;
    const id =req.params.id;


    try {
          const buses= await Bus.findByIdAndUpdate(id,
           { busId, busNumber, busType, capacity, status },
            { new: true }
        );

         if(!buses){
        return res.status(404).json({message:"Unable to update by this user id"});
    }

    return res.status(200).json({bus:buses});

    }catch(error){
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
            return res.status(500).json({ message: "Unable to update bus" });
        }
}
} ;


//Delete bus Details
const deleteBus = async (req, res, next) => {
    const id = req.params.id;

      try {
          const buses= await Bus.findByIdAndDelete(id);

         if(!buses){
        return res.status(404).json({message:"Unable to delete bus details"});
    }

    return res.status(200).json({bus:buses});

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Unable to delete bus" });
}
} ;





module.exports = { getAllBuses , addBuses , getById , updateBus, deleteBus } ;
