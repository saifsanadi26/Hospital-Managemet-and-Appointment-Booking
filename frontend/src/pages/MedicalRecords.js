import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { medicalRecordAPI } from '../services/api';
import { FileText, User, Calendar } from 'lucide-react';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

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
      </div>

      {error && <div className="alert alert-error">{error}</div>}

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
