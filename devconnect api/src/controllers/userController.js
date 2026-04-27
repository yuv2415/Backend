const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


// REGISTER (Signup)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔥 validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // check user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 🔥 password hide
    user.password = undefined;

    res.redirect('/login');

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    // 🔥 safety check
    if (!JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret not configured"
      });
    }

    // generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token);
    res.redirect('/dashboard');

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET USER PROFILE
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  res.json({
    success: true,
    data: user
  });
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).select('-password');

  res.json({
    success: true,
    message: "Profile updated",
    data: user
  });
};