const { pool } = require('../config/db');

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
const getAdminDashboard = async (req, res) => {
  try {
    // Total counts
    const [totalDoctors] = await pool.query('SELECT COUNT(*) as count FROM doctors');
    const [totalPatients] = await pool.query('SELECT COUNT(*) as count FROM patients');
    const [totalAppointments] = await pool.query('SELECT COUNT(*) as count FROM appointments');
    const [pendingAppointments] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE status = ?',
      ['pending']
    );

    // Recent appointments
    const [recentAppointments] = await pool.query(
      `SELECT 
        a.*,
        u1.name as patient_name,
        u2.name as doctor_name,
        d.department
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u1 ON p.user_id = u1.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users u2 ON doc.user_id = u2.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.created_at DESC
      LIMIT 10`
    );

    // Appointments by status
    const [appointmentsByStatus] = await pool.query(
      'SELECT status, COUNT(*) as count FROM appointments GROUP BY status'
    );

    // Appointments by department
    const [appointmentsByDept] = await pool.query(
      `SELECT d.department, COUNT(*) as count
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       GROUP BY d.department
       ORDER BY count DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalDoctors: totalDoctors[0].count,
          totalPatients: totalPatients[0].count,
          totalAppointments: totalAppointments[0].count,
          pendingAppointments: pendingAppointments[0].count
        },
        recentAppointments,
        appointmentsByStatus,
        appointmentsByDept
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get doctor dashboard stats
// @route   GET /api/dashboard/doctor
// @access  Private (Doctor)
const getDoctorDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get doctor_id
    const [doctors] = await pool.query('SELECT id FROM doctors WHERE user_id = ?', [userId]);
    
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const doctorId = doctors[0].id;

    // Today's appointments
    const [todayAppointments] = await pool.query(
      `SELECT 
        a.*,
        u.name as patient_name,
        p.contact, p.age, p.gender
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.doctor_id = ? AND a.appointment_date = CURDATE()
      ORDER BY a.appointment_time`,
      [doctorId]
    );

    // Upcoming appointments
    const [upcomingAppointments] = await pool.query(
      `SELECT 
        a.*,
        u.name as patient_name,
        p.contact
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.doctor_id = ? AND a.appointment_date > CURDATE()
      ORDER BY a.appointment_date, a.appointment_time
      LIMIT 5`,
      [doctorId]
    );

    // Total patients treated
    const [totalPatients] = await pool.query(
      'SELECT COUNT(DISTINCT patient_id) as count FROM appointments WHERE doctor_id = ?',
      [doctorId]
    );

    // Total appointments
    const [totalAppointments] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ?',
      [doctorId]
    );

    res.json({
      success: true,
      data: {
        stats: {
          todayAppointmentsCount: todayAppointments.length,
          totalPatients: totalPatients[0].count,
          totalAppointments: totalAppointments[0].count
        },
        todayAppointments,
        upcomingAppointments
      }
    });
  } catch (error) {
    console.error('Doctor dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get patient dashboard stats
// @route   GET /api/dashboard/patient
// @access  Private (Patient)
const getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get patient_id
    const [patients] = await pool.query('SELECT id FROM patients WHERE user_id = ?', [userId]);
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const patientId = patients[0].id;

    // Upcoming appointments
    const [upcomingAppointments] = await pool.query(
      `SELECT 
        a.*,
        u.name as doctor_name,
        d.department, d.specialization, d.consultation_fee
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE a.patient_id = ? AND a.appointment_date >= CURDATE()
      ORDER BY a.appointment_date, a.appointment_time`,
      [patientId]
    );

    // Past appointments
    const [pastAppointments] = await pool.query(
      `SELECT 
        a.*,
        u.name as doctor_name,
        d.department, d.specialization
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE a.patient_id = ? AND a.appointment_date < CURDATE()
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
      LIMIT 5`,
      [patientId]
    );

    // Recent medical records
    const [recentRecords] = await pool.query(
      `SELECT 
        mr.*,
        u.name as doctor_name,
        d.department
      FROM medical_records mr
      JOIN doctors d ON mr.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE mr.patient_id = ?
      ORDER BY mr.record_date DESC
      LIMIT 5`,
      [patientId]
    );

    // Total appointments
    const [totalAppointments] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?',
      [patientId]
    );

    res.json({
      success: true,
      data: {
        stats: {
          upcomingAppointmentsCount: upcomingAppointments.length,
          totalAppointments: totalAppointments[0].count,
          medicalRecordsCount: recentRecords.length
        },
        upcomingAppointments,
        pastAppointments,
        recentRecords
      }
    });
  } catch (error) {
    console.error('Patient dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminDashboard,
  getDoctorDashboard,
  getPatientDashboard
};
