import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorAPI, appointmentAPI } from '../services/api';
import { User, Stethoscope, Award, DollarSign, Calendar } from 'lucide-react';
import './Doctors.css';

const Doctors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    appointment_date: '',
    appointment_time: '',
    reason: ''
  });
  const [filters, setFilters] = useState({
    department: '',
    specialization: ''
  });

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAll(filters);
      setDoctors(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await doctorAPI.getDepartments();
      setDepartments(response.data.data);
    } catch (err) {
      console.error('Failed to load departments');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    try {
      await appointmentAPI.create({
        doctor_id: selectedDoctor,
        ...appointmentForm
      });
      alert('Appointment booked successfully! You will receive a confirmation email.');
      setSelectedDoctor(null);
      setAppointmentForm({ appointment_date: '', appointment_time: '', reason: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="page-header">
        <h1>Find Doctors</h1>
        <p>Browse our qualified medical professionals</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters-section card">
        <div className="form-row">
          <div className="form-group">
            <label>Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              value={filters.specialization}
              onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
              placeholder="Search by specialization"
            />
          </div>
        </div>
      </div>

      {doctors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <User size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280' }}>No doctors found</p>
        </div>
      ) : (
        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-avatar">
                <User size={48} />
              </div>
              
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                
                <div className="doctor-detail">
                  <Stethoscope size={16} />
                  <span>{doctor.department}</span>
                </div>
                
                <div className="doctor-detail">
                  <Award size={16} />
                  <span>{doctor.specialization}</span>
                </div>

                {doctor.qualification && (
                  <div className="doctor-detail">
                    <span className="detail-label">Qualification:</span>
                    <span>{doctor.qualification}</span>
                  </div>
                )}

                {doctor.experience && (
                  <div className="doctor-detail">
                    <span className="detail-label">Experience:</span>
                    <span>{doctor.experience} years</span>
                  </div>
                )}

                {doctor.consultation_fee && (
                  <div className="doctor-detail">
                    <DollarSign size={16} />
                    <span>₹{doctor.consultation_fee}</span>
                  </div>
                )}

                {doctor.availability && (
                  <div className="doctor-availability">
                    <span className="detail-label">Available:</span>
                    <span>{doctor.availability}</span>
                  </div>
                )}
              </div>

              {user?.role === 'patient' && (
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <Calendar size={18} />
                  Book Appointment
                </button>
              )}

              {selectedDoctor === doctor.id && (
                <div className="appointment-modal">
                  <div className="modal-content">
                    <h3>Book Appointment with Dr. {doctor.name}</h3>
                    <form onSubmit={handleBookAppointment}>
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          type="date"
                          value={appointmentForm.appointment_date}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Time</label>
                        <input
                          type="time"
                          value={appointmentForm.appointment_time}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_time: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Reason for Visit</label>
                        <textarea
                          value={appointmentForm.reason}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                          rows="3"
                          placeholder="Describe your symptoms or reason for consultation"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-success">
                          Confirm Booking
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setSelectedDoctor(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
