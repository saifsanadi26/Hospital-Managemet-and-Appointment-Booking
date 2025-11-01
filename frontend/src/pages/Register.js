import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    // Patient fields
    age: '',
    gender: '',
    contact: '',
    address: '',
    blood_group: '',
    // Doctor fields
    department: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultation_fee: '',
    availability: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...submitData } = formData;
    const result = await register(submitData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for Hospital Management</h2>
        <p className="auth-subtitle">Create your account to get started</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-group">
            <label>Register as</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {formData.role === 'patient' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>

              <div className="form-group">
                <label>Blood Group</label>
                <input
                  type="text"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  placeholder="e.g., A+, B-, O+"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                  rows="2"
                />
              </div>
            </>
          )}

          {formData.role === 'doctor' && (
            <>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Cardiology"
                />
              </div>

              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Heart Surgeon"
                />
              </div>

              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g., MBBS, MD"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Years"
                  />
                </div>
                <div className="form-group">
                  <label>Consultation Fee</label>
                  <input
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    placeholder="Amount"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Availability</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
