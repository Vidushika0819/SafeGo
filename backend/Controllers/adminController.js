const User = require('../Models/User');
const Driver = require('../Models/DriverModel');
const Coordinator = require('../Models/CoordinatorModel');
const Parent = require('../Models/ParentModel');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('profile')
      .select('-password')
      .sort({ createdAt: -1 });

    // Transform users to include name from profile and add status
    const transformedUsers = users.map(user => {
      const userObj = user.toObject();

      // Add name from profile
      if (user.profile) {
        if (user.role === 'driver' && user.profile.name) {
          userObj.name = user.profile.name;
        } else if (user.role === 'coordinator' && user.profile.fullName) {
          userObj.name = user.profile.fullName;
        } else if (user.role === 'parent' && user.profile.fullName) {
          userObj.name = user.profile.fullName;
        }
      }

      // Add status (default to active if not set)
      userObj.status = userObj.status || 'active';

      return userObj;
    });

    res.status(200).json({
      success: true,
      users: transformedUsers,
      totalPages: Math.ceil(users.length / 10), // Assuming 10 users per page
      currentPage: 1,
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get a specific user by ID (admin only)
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate('profile')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Create a new user (admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    // Validate role
    const validRoles = ['admin', 'coordinator', 'driver'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, coordinator, or driver'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      role
    });

    await user.save();

    // Create profile based on role
    if (role === 'driver') {
      const driverProfile = new Driver({
        name,
        email: email.toLowerCase(),
        password,
        licenseNumber: '',
        phoneNumber: '',
        vehicleType: '',
        vehicleNumber: '',
        age: null,
        experienceYears: null,
        address: ''
      });
      await driverProfile.save();
      user.profile = driverProfile._id;
    } else if (role === 'coordinator') {
      const coordinatorProfile = new Coordinator({
        coordinatorId: `C${Date.now()}`,
        fullName: name,
        email: email.toLowerCase(),
        password,
        phoneNumber: '',
        department: '',
        DOB: null,
        address: ''
      });
      await coordinatorProfile.save();
      user.profile = coordinatorProfile._id;
    }

    await user.save();

    // Return user data without password, with name from profile
    const userResponse = await User.findById(user._id)
      .populate('profile')
      .select('-password');

    // Transform the response to include name
    const transformedResponse = userResponse.toObject();
    if (userResponse.profile) {
      if (userResponse.role === 'driver' && userResponse.profile.name) {
        transformedResponse.name = userResponse.profile.name;
      } else if (userResponse.role === 'coordinator' && userResponse.profile.fullName) {
        transformedResponse.name = userResponse.profile.fullName;
      }
    }
    transformedResponse.status = transformedResponse.status || 'active';

    res.status(201).json({
      success: true,
      data: transformedResponse,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Update a user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    if (email) user.email = email.toLowerCase();
    if (role) user.role = role;

    await user.save();

    // Update profile if it exists
    if (user.profile) {
      if (user.role === 'driver') {
        await Driver.findByIdAndUpdate(user.profile, { name, email: user.email });
      } else if (user.role === 'coordinator') {
        await Coordinator.findByIdAndUpdate(user.profile, { fullName: name, email: user.email });
      }
    }

    // Return updated user data with name from profile
    const updatedUser = await User.findById(id)
      .populate('profile')
      .select('-password');

    // Transform the response to include name
    const transformedResponse = updatedUser.toObject();
    if (updatedUser.profile) {
      if (updatedUser.role === 'driver' && updatedUser.profile.name) {
        transformedResponse.name = updatedUser.profile.name;
      } else if (updatedUser.role === 'coordinator' && updatedUser.profile.fullName) {
        transformedResponse.name = updatedUser.profile.fullName;
      }
    }
    transformedResponse.status = transformedResponse.status || 'active';

    res.status(200).json({
      success: true,
      data: transformedResponse,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete a user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete associated profile
    if (user.profile) {
      if (user.role === 'driver') {
        await Driver.findByIdAndDelete(user.profile);
      } else if (user.role === 'coordinator') {
        await Coordinator.findByIdAndDelete(user.profile);
      }
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Check if email is available
const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    const available = !existingUser;

    res.status(200).json({
      success: true,
      available,
      message: available ? 'Email is available' : 'Email is already in use'
    });

  } catch (error) {
    console.error('Error checking email availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking email availability',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkEmailAvailability
};
