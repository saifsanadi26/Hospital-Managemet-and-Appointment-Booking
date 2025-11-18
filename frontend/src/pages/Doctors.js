import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorAPI, appointmentAPI } from '../services/api';
import { User, Stethoscope, Award, Calendar, Search, Filter, Clock } from 'lucide-react';
import './Doctors.css';

const Doctors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
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
    specialization: '',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, [filters.department, filters.specialization]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAll({ 
        department: filters.department, 
        specialization: filters.specialization 
      });
      setDoctors(response.data.data);
      setFilteredDoctors(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filtering logic
  useEffect(() => {
    let filtered = doctors;

    // Filter by search term (name, department, specialization)
    if (filters.searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doctor.department.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [doctors, filters.searchTerm]);

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
      <div className="page-header animate-fadeInUp">
        <h1>Find Doctors</h1>
        <p>Browse our qualified medical professionals</p>
      </div>

      {/* Modern Search & Filter Section */}
      <div className="card animate-fadeIn" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        marginBottom: '32px',
        padding: '32px'
      }}>
        {/* Enhanced Search Bar */}
        <div style={{ 
          position: 'relative', 
          maxWidth: '600px', 
          margin: '0 auto 24px'
        }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#667eea'
              }} 
            />
            <input
              type="text"
              placeholder="Search doctors by name, department, or specialization..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '16px',
                fontSize: '16px',
                background: 'white',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            />
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: showFilters ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
              color: showFilters ? 'white' : '#667eea',
              border: '2px solid #667eea',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
            }}
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Results Counter */}
        <div style={{ 
          textAlign: 'center', 
          color: '#64748b', 
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>
      </div>

      {error && <div className="alert alert-error animate-fadeIn">{error}</div>}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="filters-section card animate-slideInRight" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          marginBottom: '32px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#1e293b', fontWeight: '600' }}>
            Advanced Filters
          </h3>
          <div className="form-row" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            <div className="form-group">
              <label style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Specialization
              </label>
              <input
                type="text"
                value={filters.specialization}
                onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                placeholder="Enter specialization"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  background: 'white'
                }}
              />
            </div>
          </div>
          
          {/* Clear Filters Button */}
          {(filters.department || filters.specialization || filters.searchTerm) && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={() => setFilters({ department: '', specialization: '', searchTerm: '' })}
                style={{
                  padding: '8px 16px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {filteredDoctors.length === 0 ? (
        <div className="card animate-fadeIn" style={{ textAlign: 'center', padding: '40px' }}>
          <User size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280' }}>
            {doctors.length === 0 ? 'No doctors found' : 'No doctors match your search criteria'}
          </p>
          {doctors.length > 0 && (
            <button 
              onClick={() => setFilters({ department: '', specialization: '', searchTerm: '' })}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="doctors-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px',
          marginTop: '32px'
        }}>
          {filteredDoctors.map((doctor, index) => (
            <div 
              key={doctor.id} 
              className="doctor-card animate-fadeInUp card-3d"
              style={{
                animationDelay: `${index * 0.1}s`,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="doctor-avatar" style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
              }}>
                <User size={40} color="white" />
              </div>
              
              <div className="doctor-info" style={{ textAlign: 'center' }}>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: '#1e293b', 
                  marginBottom: '12px',
                  fontFamily: 'Poppins'
                }}>
                  Dr. {doctor.name}
                </h3>
                
                <div className="doctor-detail" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  padding: '8px 16px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '12px',
                  color: '#667eea',
                  fontWeight: '600'
                }}>
                  <Stethoscope size={16} />
                  <span>{doctor.department}</span>
                </div>
                
                <div className="doctor-detail" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  <Award size={16} />
                  <span>{doctor.specialization}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {doctor.qualification && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontWeight: '600' }}>Qualification:</span>
                      <span>{doctor.qualification}</span>
                    </div>
                  )}

                  {doctor.experience && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Clock size={14} />
                      <span style={{ fontWeight: '600' }}>{doctor.experience} years experience</span>
                    </div>
                  )}

                  {doctor.consultation_fee && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      <span>Consultation Fee: {doctor.consultation_fee}</span>
                    </div>
                  )}

                  {doctor.availability && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#059669',
                      textAlign: 'center',
                      fontWeight: '500',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '8px'
                    }}>
                      Available: {doctor.availability}
                    </div>
                  )}
                </div>
              </div>

              {user?.role === 'patient' && (
                <button
                  className="btn"
                  onClick={() => setSelectedDoctor(doctor.id)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.target.style.transform = 'translateY(0)';
                  }}
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
