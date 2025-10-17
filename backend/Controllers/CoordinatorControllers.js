const Coordinator = require('../Models/CoordinatorModel');
const Child = require('../Models/Child');

//data display
const getAllCoordinators = async (req, res, next) => {


    try {
        const coordinators = await Coordinator.find();

    //not found
    if(!coordinators){
        return res.status(404).json({message:"No Coordinators found"});
    }

    // Ensure all coordinators have proper display names
    const coordinatorsWithNames = coordinators.map(coordinator => {
        const coordinatorObj = coordinator.toObject();

        // Ensure fullName exists, fallback to email or coordinatorId
        if (!coordinatorObj.fullName || coordinatorObj.fullName.trim() === '') {
            coordinatorObj.fullName = coordinatorObj.email || `Coordinator ${coordinatorObj.coordinatorId}`;
        }

        return coordinatorObj;
    });

    //display all coordinators
    return res.status(200).json({coordinators: coordinatorsWithNames});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }} ;


//data insert
const addCoordinators = async (req, res, next) => {
    const { coordinatorId, fullName, phoneNumber, DOB, email, address, password } = req.body;

    // Ensure fullName is provided and not empty
    let coordinatorFullName = fullName;
    if (!coordinatorFullName || coordinatorFullName.trim() === '') {
        coordinatorFullName = email || `Coordinator ${coordinatorId}`;
    }

    try {
        const coordinator = new Coordinator({
            coordinatorId,
            fullName: coordinatorFullName,
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

// Get all children for coordinators to view (coordinator access only)
const getAllChildren = async (req, res) => {
    try {
        // Verify the user is a coordinator (middleware should handle this, but double check)
        if (req.user.role.toLowerCase() !== 'coordinator') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Coordinator role required.'
            });
        }

        const children = await Child.find({})
            .sort({ createdAt: -1 })
            .populate('parent', 'email name phoneNumber');

        res.status(200).json({
            success: true,
            data: children,
            count: children.length
        });
    } catch (error) {
        console.error('Error fetching all children for coordinator:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching children',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get child statistics for coordinators
const getCoordinatorChildStats = async (req, res) => {
    try {
        console.log('getCoordinatorChildStats called by user:', req.user); // Debug log

        const stats = await Child.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    active: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ['$status', 'active'] }, { $eq: ['$isActive', true] }] },
                                1,
                                0
                            ]
                        }
                    },
                    inactive: {
                        $sum: {
                            $cond: [
                                { $or: [{ $eq: ['$status', 'inactive'] }, { $eq: ['$isActive', false] }] },
                                1,
                                0
                            ]
                        }
                    },
                    byGrade: {
                        $push: '$grade'
                    },
                    byAge: {
                        $push: '$age'
                    }
                }
            }
        ]);

        const result = stats[0] || { total: 0, active: 0, inactive: 0, byGrade: [], byAge: [] };

        // Count grades
        const gradeCount = result.byGrade.reduce((acc, grade) => {
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {});

        // Count ages
        const ageCount = result.byAge.reduce((acc, age) => {
            acc[age] = (acc[age] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                total: result.total,
                active: result.active,
                inactive: result.inactive,
                grades: gradeCount,
                ages: ageCount
            }
        });
    } catch (error) {
        console.error('Error fetching child stats for coordinator:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching child statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get students assigned to a specific trip for check-in/check-out operations
const getStudentsForCheckin = async (req, res) => {
  try {
    const { tripId } = req.query;

    if (!tripId) {
      return res.status(400).json({ success: false, message: 'Trip ID required' });
    }

    const TripAssignment = require('../Models/TripAssignment');

    const assignments = await TripAssignment.find({ 
      trip: tripId, 
      status: 'active' 
    })
    .populate({
      path: 'child',
      select: 'firstName lastName grade emergencyContacts',
      populate: {
        path: 'emergencyContacts.name emergencyContacts.phone emergencyContacts.email',
        select: 'name phone email isPrimary'
      }
    })
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: assignments,
      count: assignments.length
    });
  } catch (error) {
    console.error('Error fetching students for check-in:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students'
    });
  }
};

module.exports = {
    getAllCoordinators,
    addCoordinators,
    getById,
    updateCoordinator,
    deleteCoordinator,
    getCoordinatorProfile,
    updateCoordinatorProfile,
    getAllChildren,
    getCoordinatorChildStats,
    getStudentsForCheckin
};
