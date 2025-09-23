const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });
    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({ msg: 'User registered' });
  } catch (err) {
    res.status(400).json({ msg: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ msg: 'Login failed' });
  }
};

module.exports = { register, login };