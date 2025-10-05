const User = require('../Models/User');
const Parent = require('../Models/ParentModel');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'default-secret-key',
    { expiresIn: '24h' }
  );
};

// Validate password strength
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  // Check for at least one uppercase, one lowercase, one number
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }

  return null; // Valid
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, role, additionalFields } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError
      });
    }

    // Validate role
    const validRoles = ['admin', 'coordinator', 'driver', 'parent'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, coordinator, driver, or parent'
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

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // For stateless JWT, logout is handled client-side
    // In a production app, you might want to implement token blacklisting
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Parent-specific registration
const registerParent = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError
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

    // Create new parent user
    const user = new User({
      email: email.toLowerCase(),
      password,
      role: 'parent'
    });

    await user.save();

    // Create parent profile
    const parentProfile = new Parent({
      parentId: `P${Date.now()}`, // Generate unique parent ID
      fullName: name,
      phoneNumber: phone || '',
      DOB: null, // Will be set later in profile management
      email: email.toLowerCase(),
      address: '', // Will be set later in profile management
      password: password // Store password for profile management
    });

    await parentProfile.save();

    // Update user to reference the parent profile
    user.profile = parentProfile._id;
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Parent registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: name,
        phone: phone || null
      }
    });

  } catch (error) {
    console.error('Parent registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during parent registration'
    });
  }
};

// Parent-specific login
const loginParent = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email and ensure they are a parent
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: 'parent'
    }).populate('profile');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token (extend expiration if rememberMe is true)
    const tokenExpiration = rememberMe ? '7d' : '24h';
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: tokenExpiration }
    );

    // Get parent profile data if it exists
    let parentData = {};
    if (user.profile) {
      parentData = {
        name: user.profile.fullName,
        phone: user.profile.phoneNumber
      };
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        ...parentData
      }
    });

  } catch (error) {
    console.error('Parent login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during parent login'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  registerParent,
  loginParent
};
