import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Clock } from 'lucide-react';
import './Dashboard.css';

const PatientDashboard = ({ data }) => {
  const navigate = useNavigate();
  const { stats, upcomingAppointments, pastAppointments, recentRecords } = data;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Patient Dashboard</h1>
      <p className="dashboard-subtitle">Manage your health appointments and records</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <Clock size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>{stats.upcomingAppointmentsCount}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <Calendar size={24} color="#10b981" />
          </div>
          <div className="stat-content">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <FileText size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>{stats.medicalRecordsCount}</h3>
            <p>Medical Records</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="btn btn-primary" onClick={() => navigate('/doctors')}>
          Book New Appointment
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/medical-records')}>
          View Medical Records
        </button>
      </div>

      <div className="dashboard-section">
        <h2>Upcoming Appointments</h2>
        <div className="card">
          {upcomingAppointments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No upcoming appointments</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.doctor_name}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <span className={`badge badge-${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Medical Records</h2>
        <div className="card">
          {recentRecords.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No medical records yet</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Diagnosis</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.record_date).toLocaleDateString()}</td>
                      <td>{record.doctor_name}</td>
                      <td>{record.department}</td>
                      <td>{record.diagnosis.substring(0, 50)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
