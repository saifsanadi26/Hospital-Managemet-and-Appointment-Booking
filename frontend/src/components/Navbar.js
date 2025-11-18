import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Activity } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <Activity size={24} />
          <span>Hospital Management</span>
        </Link>

        <div className={`navbar-menu ${!isAuthenticated ? 'navbar-menu-guest' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              
              {user?.role === 'patient' && (
                <>
                  <Link to="/appointments" className="nav-link">My Appointments</Link>
                  <Link to="/doctors" className="nav-link">Find Doctors</Link>
                  <Link to="/medical-records" className="nav-link">Medical Records</Link>
                </>
              )}

              {user?.role === 'doctor' && (
                <>
                  <Link to="/appointments" className="nav-link">Appointments</Link>
                  <Link to="/medical-records" className="nav-link">Medical Records</Link>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <Link to="/doctors" className="nav-link">Doctors</Link>
                  <Link to="/appointments" className="nav-link">Appointments</Link>
                  <Link to="/patients" className="nav-link">Patients</Link>
                </>
              )}

              <div className="navbar-user">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
                <button onClick={handleLogout} className="btn-logout">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
