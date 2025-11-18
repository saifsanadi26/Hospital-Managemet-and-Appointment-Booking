import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { medicalRecordAPI } from '../services/api';
import { appointmentAPI } from '../services/api';
import { FileText, User, Calendar, Plus } from 'lucide-react';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_id: '',
    diagnosis: '',
    prescription: '',
    treatment: '',
    notes: '',
    record_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRecords();
    if (user.role === 'doctor') {
      fetchAppointments();
    }
  }, [user.role]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await medicalRecordAPI.getAll();
      setRecords(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getAll();
      // Show all appointments (not just completed) so doctors can create records
      setAppointments(response.data.data);
    } catch (err) {
      console.error('Failed to load appointments');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill patient_id when appointment is selected
    if (name === 'appointment_id' && value) {
      const selectedApt = appointments.find(apt => apt.id === parseInt(value));
      if (selectedApt) {
        setFormData(prev => ({ ...prev, patient_id: selectedApt.patient_id }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await medicalRecordAPI.create(formData);
      setSuccess('Medical record created successfully!');
      setShowCreateForm(false);
      setFormData({
        patient_id: '',
        appointment_id: '',
        diagnosis: '',
        prescription: '',
        treatment: '',
        notes: '',
        record_date: new Date().toISOString().split('T')[0]
      });
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create medical record');
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
        <h1>Medical Records</h1>
        <p>View your medical history and treatment records</p>
        {user.role === 'doctor' && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{ marginTop: '10px' }}
          >
            <Plus size={20} style={{ marginRight: '8px' }} />
            {showCreateForm ? 'Cancel' : 'Create New Record'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showCreateForm && user.role === 'doctor' && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>Create Medical Record</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Appointment</label>
              <select
                name="appointment_id"
                value={formData.appointment_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose an appointment...</option>
                {appointments.map(apt => (
                  <option key={apt.id} value={apt.id}>
                    {apt.patient_name} - {new Date(apt.appointment_date).toLocaleDateString()} at {apt.appointment_time} ({apt.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Record Date</label>
              <input
                type="date"
                name="record_date"
                value={formData.record_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Diagnosis *</label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="Enter diagnosis..."
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Prescription</label>
              <textarea
                name="prescription"
                value={formData.prescription}
                onChange={handleInputChange}
                placeholder="Enter prescription details..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Treatment</label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                placeholder="Enter treatment plan..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes..."
                rows="2"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                Create Record
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <FileText size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280' }}>No medical records found</p>
        </div>
      ) : (
        <div className="records-grid">
          {records.map((record) => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <div className="record-date">
                  <Calendar size={18} />
                  <span>{new Date(record.record_date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="record-body">
                <div className="record-info">
                  <User size={18} />
                  <div>
                    <span className="info-label">
                      {user.role === 'patient' ? 'Doctor' : 'Patient'}:
                    </span>
                    <span className="info-value">
                      {user.role === 'patient' ? record.doctor_name : record.patient_name}
                    </span>
                  </div>
                </div>

                <div className="record-info">
                  <span className="info-label">Department:</span>
                  <span className="info-value">{record.department}</span>
                </div>

                <div className="record-section">
                  <h4>Diagnosis</h4>
                  <p>{record.diagnosis}</p>
                </div>

                {record.prescription && (
                  <div className="record-section">
                    <h4>Prescription</h4>
                    <p>{record.prescription}</p>
                  </div>
                )}

                {record.treatment && (
                  <div className="record-section">
                    <h4>Treatment</h4>
                    <p>{record.treatment}</p>
                  </div>
                )}

                {record.notes && (
                  <div className="record-section">
                    <h4>Additional Notes</h4>
                    <p>{record.notes}</p>
                  </div>
                )}
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
              >
                {selectedRecord === record.id ? 'Show Less' : 'View Details'}
              </button>

              {selectedRecord === record.id && (
                <div className="record-details">
                  <div className="detail-row">
                    <span className="detail-label">Record ID:</span>
                    <span>{record.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Created:</span>
                    <span>{new Date(record.created_at).toLocaleString()}</span>
                  </div>
                  {record.appointment_id && (
                    <div className="detail-row">
                      <span className="detail-label">Appointment ID:</span>
                      <span>{record.appointment_id}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
