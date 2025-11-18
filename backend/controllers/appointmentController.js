const { pool } = require('../config/db');
const { sendEmail } = require('../utils/emailService');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const createAppointment = async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;
    const userId = req.user.id;

    // Get patient_id from user_id
    const [patients] = await pool.query('SELECT id FROM patients WHERE user_id = ?', [userId]);
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const patient_id = patients[0].id;

    // Check if doctor exists
    const [doctors] = await pool.query('SELECT * FROM doctors WHERE id = ?', [doctor_id]);
    
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const [conflicts] = await pool.query(
      'SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != ?',
      [doctor_id, appointment_date, appointment_time, 'cancelled']
    );

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const [result] = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time, reason, 'pending']
    );

    // Send confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: 'Appointment Booking Confirmation',
        text: `Your appointment has been booked for ${appointment_date} at ${appointment_time}. Status: Pending confirmation.`
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: {
        id: result.insertId,
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all appointments (with filters)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = `
      SELECT 
        a.*,
        u1.name as patient_name, u1.email as patient_email,
        u2.name as doctor_name, u2.email as doctor_email,
        d.department, d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u1 ON p.user_id = u1.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users u2 ON doc.user_id = u2.id
      JOIN doctors d ON a.doctor_id = d.id
    `;

    let params = [];

    if (userRole === 'patient') {
      query += ' WHERE p.user_id = ?';
      params.push(userId);
    } else if (userRole === 'doctor') {
      query += ' WHERE doc.user_id = ?';
      params.push(userId);
    }
    // Admin sees all appointments

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const [appointments] = await pool.query(query, params);

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const [appointments] = await pool.query(
      `SELECT 
        a.*,
        u1.name as patient_name, u1.email as patient_email,
        u2.name as doctor_name, u2.email as doctor_email,
        d.department, d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u1 ON p.user_id = u1.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users u2 ON doc.user_id = u2.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?`,
      [appointmentId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: appointments[0]
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Patient can cancel, Doctor/Admin can update status)
const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status, notes } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get appointment details first
    const [appointments] = await pool.query(
      `SELECT a.*, p.user_id as patient_user_id, doc.user_id as doctor_user_id 
       FROM appointments a 
       JOIN patients p ON a.patient_id = p.id 
       JOIN doctors doc ON a.doctor_id = doc.id 
       WHERE a.id = ?`,
      [appointmentId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const appointment = appointments[0];

    // Check permissions
    if (userRole === 'patient') {
      // Patients can only cancel their own appointments
      if (appointment.patient_user_id !== userId) {
        return res.status(403).json({ message: 'You can only update your own appointments' });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Patients can only cancel appointments' });
      }
    } else if (userRole === 'doctor') {
      // Doctors can update appointments for their patients
      if (appointment.doctor_user_id !== userId) {
        return res.status(403).json({ message: 'You can only update appointments with your patients' });
      }
    }
    // Admins can update any appointment

    const [result] = await pool.query(
      'UPDATE appointments SET status = ?, notes = ? WHERE id = ?',
      [status, notes || null, appointmentId]
    );

    res.json({
      success: true,
      message: 'Appointment updated successfully'
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const [result] = await pool.query('DELETE FROM appointments WHERE id = ?', [appointmentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment
};
