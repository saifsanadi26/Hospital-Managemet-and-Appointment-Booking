import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import './Dashboard.css';

const DoctorDashboard = ({ data }) => {
  const { stats, todayAppointments, upcomingAppointments } = data;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Doctor Dashboard</h1>
      <p className="dashboard-subtitle">Manage your appointments and patients</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <Clock size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>{stats.todayAppointmentsCount}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <Users size={24} color="#10b981" />
          </div>
          <div className="stat-content">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <Calendar size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Today's Appointments</h2>
        <div className="card">
          {todayAppointments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No appointments for today</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Contact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.age || 'N/A'}</td>
                      <td>{appointment.gender || 'N/A'}</td>
                      <td>{appointment.contact || 'N/A'}</td>
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
                    <th>Patient</th>
                    <th>Contact</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                      <td>{appointment.appointment_time}</td>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.contact || 'N/A'}</td>
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
    </div>
  );
};

export default DoctorDashboard;
