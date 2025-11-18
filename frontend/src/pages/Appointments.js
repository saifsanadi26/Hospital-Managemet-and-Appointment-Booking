import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';
import { Calendar, Clock, User } from 'lucide-react';
import './Appointments.css';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll();
      setAppointments(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId) => {
    try {
      await appointmentAPI.update(appointmentId, statusUpdate);
      setSelectedAppointment(null);
      setStatusUpdate({ status: '', notes: '' });
      fetchAppointments();
      alert('Appointment updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentAPI.update(appointmentId, { status: 'cancelled', notes: 'Cancelled by user' });
        fetchAppointments();
        alert('Appointment cancelled successfully');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel appointment');
      }
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
        <h1>Appointments</h1>
        <p>Manage your appointments</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {appointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <Calendar size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280' }}>No appointments found</p>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <span className={`badge badge-${appointment.status}`}>
                  {appointment.status}
                </span>
                <span className="appointment-date">
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </span>
              </div>

              <div className="appointment-body">
                <div className="appointment-info">
                  <Clock size={18} />
                  <span>{appointment.appointment_time}</span>
                </div>

                {user.role === 'patient' && (
                  <>
                    <div className="appointment-info">
                      <User size={18} />
                      <span>Dr. {appointment.doctor_name}</span>
                    </div>
                    <div className="appointment-info">
                      <span className="info-label">Department:</span>
                      <span>{appointment.department}</span>
                    </div>
                    <div className="appointment-info">
                      <span className="info-label">Specialization:</span>
                      <span>{appointment.specialization}</span>
                    </div>
                  </>
                )}

                {(user.role === 'doctor' || user.role === 'admin') && (
                  <>
                    <div className="appointment-info">
                      <User size={18} />
                      <span>{appointment.patient_name}</span>
                    </div>
                    <div className="appointment-info">
                      <span className="info-label">Email:</span>
                      <span>{appointment.patient_email}</span>
                    </div>
                  </>
                )}

                {appointment.reason && (
                  <div className="appointment-reason">
                    <span className="info-label">Reason:</span>
                    <p>{appointment.reason}</p>
                  </div>
                )}

                {appointment.notes && (
                  <div className="appointment-notes">
                    <span className="info-label">Notes:</span>
                    <p>{appointment.notes}</p>
                  </div>
                )}
              </div>

              <div className="appointment-actions">
                {user.role === 'patient' && (appointment.status === 'pending' || appointment.status === 'confirmed') && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancel
                  </button>
                )}

                {(user.role === 'doctor' || user.role === 'admin') && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedAppointment(appointment.id);
                      setStatusUpdate({ status: appointment.status, notes: appointment.notes || '' });
                    }}
                  >
                    Update Status
                  </button>
                )}
              </div>

              {selectedAppointment === appointment.id && (
                <div className="status-update-form">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      value={statusUpdate.notes}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                      rows="2"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateStatus(appointment.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedAppointment(null)}
                    >
                      Cancel
                    </button>
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

export default Appointments;
