import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, FileText, Activity } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Hospital Management System</h1>
            <p className="hero-subtitle">
              Streamline your healthcare experience with our comprehensive appointment and record management platform
            </p>
            <div className="hero-actions">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg">
                    Login
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Easy Appointment Booking</h3>
              <p>Book appointments with your preferred doctors at your convenience</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Find Qualified Doctors</h3>
              <p>Browse through our network of experienced medical professionals</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FileText size={32} />
              </div>
              <h3>Digital Medical Records</h3>
              <p>Access your complete medical history anytime, anywhere</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Activity size={32} />
              </div>
              <h3>Real-time Updates</h3>
              <p>Get instant notifications about your appointments and health records</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Join thousands of patients managing their healthcare digitally</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
