const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, ...additionalData } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const userId = result.insertId;

    // Create role-specific record
    if (role === 'patient') {
      const { age, gender, contact, address, blood_group } = additionalData;
      await pool.query(
        'INSERT INTO patients (user_id, age, gender, contact, address, blood_group) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, age || null, gender || null, contact || null, address || null, blood_group || null]
      );
    } else if (role === 'doctor') {
      const { department, specialization, qualification, experience, consultation_fee, availability } = additionalData;
      await pool.query(
        'INSERT INTO doctors (user_id, department, specialization, qualification, experience, consultation_fee, availability) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, department, specialization, qualification || null, experience || null, consultation_fee || null, availability || null]
      );
    }

    // Generate token
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: userId,
        name,
        email,
        role,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check user exists
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let userData = { ...req.user };

    // Get additional data based on role
    if (userRole === 'patient') {
      const [patients] = await pool.query('SELECT * FROM patients WHERE user_id = ?', [userId]);
      if (patients.length > 0) {
        userData.patientInfo = patients[0];
      }
    } else if (userRole === 'doctor') {
      const [doctors] = await pool.query('SELECT * FROM doctors WHERE user_id = ?', [userId]);
      if (doctors.length > 0) {
        userData.doctorInfo = doctors[0];
      }
    }

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getMe };
