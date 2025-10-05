const Driver = require('../Models/DriverModel');

//data display
const getAllDrivers = async (req, res, next) => {
    
  
    try {
        const drivers = await Driver.find();

    //not found
    if(!drivers){
        return res.status(404).json({message:"No Drivers found"});
    }
    
    //display all drivers
    return res.status(200).json({drivers});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }} ;  


//data insert
const addDrivers = async (req, res, next) => {
    const { name, licenseNumber, phoneNumber, vehicleType, vehicleNumber, age, experienceYears, email, address, password } = req.body;


    try {
        const driver = new Driver({
            name,
            licenseNumber,
            phoneNumber,
            vehicleType,
            vehicleNumber,
            age,
            experienceYears,
            email,
            address,
            password
        });

        await driver.save();
        return res.status(201).json( driver );
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
            return res.status(500).json({ message: "Unable to add driver" });
        }
    }

} ;


//get driver by id

const getById = async (req, res, next) => {

    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json({ driver });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}  ;

//get driver by email

const getByEmail = async (req, res, next) => {

    try {
        const driver = await Driver.findOne({ email: req.params.email });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json({ driver });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}  ;

//update driver details
const updateDriver = async (req, res, next) => {
    const { name, licenseNumber, phoneNumber, vehicleType, vehicleNumber, age, experienceYears, email, address, password } = req.body;
    const id =req.params.id;


    try {
          const drivers= await Driver.findByIdAndUpdate(id,
           { name,licenseNumber, phoneNumber, vehicleType, vehicleNumber, age, experienceYears, email, address, password },
            { new: true }
        );

         if(!drivers){
        return res.status(404).json({message:"Unable to update by this user id"});
    }

    return res.status(200).json({driver:drivers});

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
            return res.status(500).json({ message: "Unable to update driver" });
        }
}
} ;


//Delete driver Details
const deleteDriver = async (req, res, next) => {
    const id = req.params.id;  

      try {
          const drivers= await Driver.findByIdAndDelete(id);

         if(!drivers){
        return res.status(404).json({message:"Unable to delete driver details"});        
    }

    return res.status(200).json({driver:drivers});
          
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Unable to delete driver" });
}
} ;    





module.exports = { getAllDrivers , addDrivers , getById , getByEmail , updateDriver, deleteDriver } ;
