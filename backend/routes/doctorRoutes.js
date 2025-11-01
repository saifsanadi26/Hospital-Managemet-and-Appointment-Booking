const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  getDepartments
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/departments/list', getDepartments);

router.route('/')
  .get(getDoctors);

router.route('/:id')
  .get(getDoctor)
  .put(protect, authorize('admin', 'doctor'), updateDoctor)
  .delete(protect, authorize('admin'), deleteDoctor);

module.exports = router;
