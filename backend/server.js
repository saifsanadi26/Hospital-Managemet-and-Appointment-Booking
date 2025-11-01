const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
testConnection();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Hospital Management System API',
    version: '1.0.0'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
