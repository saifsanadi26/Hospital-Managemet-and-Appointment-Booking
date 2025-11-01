const { pool } = require('../config/db');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { department, specialization } = req.query;

    let query = `
      SELECT 
        d.*,
        u.name, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;

    let params = [];

    if (department) {
      query += ' AND d.department = ?';
      params.push(department);
    }

    if (specialization) {
      query += ' AND d.specialization = ?';
      params.push(specialization);
    }

    query += ' ORDER BY u.name';

    const [doctors] = await pool.query(query, params);

    res.json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const [doctors] = await pool.query(
      `SELECT 
        d.*,
        u.name, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?`,
      [doctorId]
    );

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      data: doctors[0]
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (Admin/Doctor)
const updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { department, specialization, qualification, experience, consultation_fee, availability } = req.body;

    const [result] = await pool.query(
      `UPDATE doctors 
       SET department = ?, specialization = ?, qualification = ?, experience = ?, consultation_fee = ?, availability = ?
       WHERE id = ?`,
      [department, specialization, qualification, experience, consultation_fee, availability, doctorId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      message: 'Doctor profile updated successfully'
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Get user_id first
    const [doctors] = await pool.query('SELECT user_id FROM doctors WHERE id = ?', [doctorId]);

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete user (will cascade delete doctor record)
    await pool.query('DELETE FROM users WHERE id = ?', [doctors[0].user_id]);

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get departments
// @route   GET /api/doctors/departments/list
// @access  Public
const getDepartments = async (req, res) => {
  try {
    const [departments] = await pool.query(
      'SELECT DISTINCT department FROM doctors ORDER BY department'
    );

    res.json({
      success: true,
      data: departments.map(d => d.department)
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  getDepartments
};
