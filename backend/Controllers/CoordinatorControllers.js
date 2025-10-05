const Coordinator = require('../Models/CoordinatorModel');

//data display
const getAllCoordinators = async (req, res, next) => {


    try {
        const coordinators = await Coordinator.find();

    //not found
    if(!coordinators){
        return res.status(404).json({message:"No Coordinators found"});
    }

    //display all coordinators
    return res.status(200).json({coordinators});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }} ;


//data insert
const addCoordinators = async (req, res, next) => {
    const { coordinatorId, fullName, phoneNumber, DOB, email, address, password } = req.body;


    try {
        const coordinator = new Coordinator({
            coordinatorId,
            fullName,
            phoneNumber,
            DOB,
            email,
            address,
            password
        });

        await coordinator.save();
        return res.status(201).json( coordinator );
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
            return res.status(500).json({ message: "Unable to add coordinator" });
        }
    }

} ;


//get coordinator by id

const getById = async (req, res, next) => {

    try {
        const coordinator = await Coordinator.findById(req.params.id);
        if (!coordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }
        res.status(200).json({ coordinator });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}  ;

//update coordinator details
const updateCoordinator = async (req, res, next) => {
    const { coordinatorId, fullName, phoneNumber, DOB, email, address, password } = req.body;
    const id =req.params.id;


    try {
          const coordinators= await Coordinator.findByIdAndUpdate(id,
           { coordinatorId, fullName, phoneNumber, DOB, email, address, password },
            { new: true }
        );

         if(!coordinators){
        return res.status(404).json({message:"Unable to update by this user id"});
    }

    return res.status(200).json({coordinator:coordinators});

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
            return res.status(500).json({ message: "Unable to update coordinator" });
        }
}
} ;


//Delete coordinator Details
const deleteCoordinator = async (req, res, next) => {
    const id = req.params.id;

      try {
          const coordinators= await Coordinator.findByIdAndDelete(id);

         if(!coordinators){
        return res.status(404).json({message:"Unable to delete coordinator details"});
    }

    return res.status(200).json({coordinator:coordinators});

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Unable to delete coordinator" });
}
} ;

// Get current coordinator profile
const getCoordinatorProfile = async (req, res) => {
    try {
        // Get coordinator ID from authenticated user
        const coordinatorId = req.user.profile;

        if (!coordinatorId) {
            return res.status(404).json({ message: 'Coordinator profile not found' });
        }

        const coordinator = await Coordinator.findById(coordinatorId);

        if (!coordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        res.status(200).json({ coordinator });
    } catch (error) {
        console.error('Error fetching coordinator profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};

// Update current coordinator profile
const updateCoordinatorProfile = async (req, res) => {
    try {
        // Get coordinator ID from authenticated user
        const coordinatorId = req.user.profile;

        if (!coordinatorId) {
            return res.status(404).json({ message: 'Coordinator profile not found' });
        }

        const { fullName, phoneNumber, DOB, email, address, department } = req.body;

        const updatedCoordinator = await Coordinator.findByIdAndUpdate(
            coordinatorId,
            {
                fullName,
                phoneNumber,
                DOB,
                email,
                address,
                department
            },
            { new: true, runValidators: true }
        );

        if (!updatedCoordinator) {
            return res.status(404).json({ message: 'Coordinator not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            coordinator: updatedCoordinator
        });
    } catch (error) {
        console.error('Error updating coordinator profile:', error);

        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `${field} already exists` });
        } else if (error.name === 'ValidationError') {
            // Validation error
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        } else {
            return res.status(500).json({ message: 'Failed to update profile' });
        }
    }
};

module.exports = {
    getAllCoordinators,
    addCoordinators,
    getById,
    updateCoordinator,
    deleteCoordinator,
    getCoordinatorProfile,
    updateCoordinatorProfile
};
