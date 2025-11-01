const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getDoctorDashboard,
  getPatientDashboard
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/doctor', protect, authorize('doctor'), getDoctorDashboard);
router.get('/patient', protect, authorize('patient'), getPatientDashboard);

module.exports = router;
