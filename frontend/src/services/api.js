import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Appointments API
export const appointmentAPI = {
  getAll: () => apiClient.get('/appointments'),
  getOne: (id) => apiClient.get(`/appointments/${id}`),
  create: (data) => apiClient.post('/appointments', data),
  update: (id, data) => apiClient.put(`/appointments/${id}`, data),
  delete: (id) => apiClient.delete(`/appointments/${id}`)
};

// Doctors API
export const doctorAPI = {
  getAll: (params) => apiClient.get('/doctors', { params }),
  getOne: (id) => apiClient.get(`/doctors/${id}`),
  update: (id, data) => apiClient.put(`/doctors/${id}`, data),
  delete: (id) => apiClient.delete(`/doctors/${id}`),
  getDepartments: () => apiClient.get('/doctors/departments/list')
};

// Medical Records API
export const medicalRecordAPI = {
  getAll: (params) => apiClient.get('/medical-records', { params }),
  getOne: (id) => apiClient.get(`/medical-records/${id}`),
  create: (data) => apiClient.post('/medical-records', data),
  update: (id, data) => apiClient.put(`/medical-records/${id}`, data),
  delete: (id) => apiClient.delete(`/medical-records/${id}`)
};

// Dashboard API
export const dashboardAPI = {
  getAdminDashboard: () => apiClient.get('/dashboard/admin'),
  getDoctorDashboard: () => apiClient.get('/dashboard/doctor'),
  getPatientDashboard: () => apiClient.get('/dashboard/patient')
};

export default {
  appointmentAPI,
  doctorAPI,
  medicalRecordAPI,
  dashboardAPI
};
