import React from 'react';
import { Users, UserCheck, Calendar, Clock } from 'lucide-react';
import './Dashboard.css';

const AdminDashboard = ({ data }) => {
  const { stats, recentAppointments, appointmentsByStatus } = data;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Admin Dashboard</h1>
      <p className="dashboard-subtitle">Overview of hospital operations</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <UserCheck size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>{stats.totalDoctors}</h3>
            <p>Total Doctors</p>
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

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fee2e2' }}>
            <Clock size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <h3>{stats.pendingAppointments}</h3>
            <p>Pending Appointments</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Appointments by Status</h2>
        <div className="card">
          <div className="status-grid">
            {appointmentsByStatus.map((item) => (
              <div key={item.status} className="status-item">
                <span className={`badge badge-${item.status}`}>
                  {item.status}
                </span>
                <span className="status-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Appointments</h2>
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.patient_name}</td>
                    <td>{appointment.doctor_name}</td>
                    <td>{appointment.department}</td>
                    <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                    <td>{appointment.appointment_time}</td>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
