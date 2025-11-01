import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let response;

      if (user.role === 'admin') {
        response = await dashboardAPI.getAdminDashboard();
      } else if (user.role === 'doctor') {
        response = await dashboardAPI.getDoctorDashboard();
      } else if (user.role === 'patient') {
        response = await dashboardAPI.getPatientDashboard();
      }

      setDashboardData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {user.role === 'admin' && <AdminDashboard data={dashboardData} />}
      {user.role === 'doctor' && <DoctorDashboard data={dashboardData} />}
      {user.role === 'patient' && <PatientDashboard data={dashboardData} />}
    </div>
  );
};

export default Dashboard;
