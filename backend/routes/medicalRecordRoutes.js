const express = require('express');
const router = express.Router();
const {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
} = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMedicalRecords)
  .post(protect, authorize('doctor'), createMedicalRecord);

router.route('/:id')
  .get(protect, getMedicalRecord)
  .put(protect, authorize('doctor'), updateMedicalRecord)
  .delete(protect, authorize('doctor', 'admin'), deleteMedicalRecord);

module.exports = router;
