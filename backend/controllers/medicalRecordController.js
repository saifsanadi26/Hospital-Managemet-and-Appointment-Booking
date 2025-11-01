const { pool } = require('../config/db');

// @desc    Create medical record
// @route   POST /api/medical-records
// @access  Private (Doctor)
const createMedicalRecord = async (req, res) => {
  try {
    const { patient_id, appointment_id, diagnosis, prescription, treatment, notes, record_date } = req.body;
    const userId = req.user.id;

    // Get doctor_id from user_id
    const [doctors] = await pool.query('SELECT id FROM doctors WHERE user_id = ?', [userId]);
    
    if (doctors.length === 0) {
      return res.status(403).json({ message: 'Only doctors can create medical records' });
    }

    const doctor_id = doctors[0].id;

    // Verify patient exists
    const [patients] = await pool.query('SELECT id FROM patients WHERE id = ?', [patient_id]);
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create medical record
    const [result] = await pool.query(
      `INSERT INTO medical_records 
       (patient_id, doctor_id, appointment_id, diagnosis, prescription, treatment, notes, record_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [patient_id, doctor_id, appointment_id || null, diagnosis, prescription, treatment, notes, record_date]
    );

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: {
        id: result.insertId
      }
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get medical records
// @route   GET /api/medical-records
// @access  Private
const getMedicalRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { patient_id } = req.query;

    let query = `
      SELECT 
        mr.*,
        u1.name as patient_name,
        u2.name as doctor_name,
        d.department, d.specialization
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users u1 ON p.user_id = u1.id
      JOIN doctors doc ON mr.doctor_id = doc.id
      JOIN users u2 ON doc.user_id = u2.id
      JOIN doctors d ON mr.doctor_id = d.id
    `;

    let params = [];

    if (userRole === 'patient') {
      query += ' WHERE p.user_id = ?';
      params.push(userId);
    } else if (userRole === 'doctor') {
      query += ' WHERE doc.user_id = ?';
      params.push(userId);
      
      if (patient_id) {
        query += ' AND mr.patient_id = ?';
        params.push(patient_id);
      }
    } else if (userRole === 'admin' && patient_id) {
      query += ' WHERE mr.patient_id = ?';
      params.push(patient_id);
    }

    query += ' ORDER BY mr.record_date DESC';

    const [records] = await pool.query(query, params);

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single medical record
// @route   GET /api/medical-records/:id
// @access  Private
const getMedicalRecord = async (req, res) => {
  try {
    const recordId = req.params.id;

    const [records] = await pool.query(
      `SELECT 
        mr.*,
        u1.name as patient_name, u1.email as patient_email,
        u2.name as doctor_name, u2.email as doctor_email,
        d.department, d.specialization
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users u1 ON p.user_id = u1.id
      JOIN doctors doc ON mr.doctor_id = doc.id
      JOIN users u2 ON doc.user_id = u2.id
      JOIN doctors d ON mr.doctor_id = d.id
      WHERE mr.id = ?`,
      [recordId]
    );

    if (records.length === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json({
      success: true,
      data: records[0]
    });
  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private (Doctor)
const updateMedicalRecord = async (req, res) => {
  try {
    const recordId = req.params.id;
    const { diagnosis, prescription, treatment, notes } = req.body;

    const [result] = await pool.query(
      `UPDATE medical_records 
       SET diagnosis = ?, prescription = ?, treatment = ?, notes = ?
       WHERE id = ?`,
      [diagnosis, prescription, treatment, notes, recordId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json({
      success: true,
      message: 'Medical record updated successfully'
    });
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete medical record
// @route   DELETE /api/medical-records/:id
// @access  Private (Doctor/Admin)
const deleteMedicalRecord = async (req, res) => {
  try {
    const recordId = req.params.id;

    const [result] = await pool.query('DELETE FROM medical_records WHERE id = ?', [recordId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.error('Delete medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
};
