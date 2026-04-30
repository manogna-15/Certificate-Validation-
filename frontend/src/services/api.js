import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:8080/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (data) =>
  api.post('/auth/register', data);

// Certificates
export const uploadCertificate = (file, certificateData) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('request', new Blob([JSON.stringify(certificateData)], { type: 'application/json' }));
  return api.post('/certificates/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getCertificates = () =>
  api.get('/certificates');

export const getMyCertificates = () =>
  api.get('/certificates/my');

export const getUploadedCertificates = () =>
  api.get('/certificates/uploaded');

export const getCertificateById = (id) =>
  api.get(`/certificates/${id}`);

export const revokeCertificate = (id) =>
  api.put(`/certificates/${id}/revoke`);

export const getQrCode = (id) =>
  `${API_BASE_URL}/certificates/${id}/qrcode`;

export const getCertificateFileUrl = (id) =>
  `${API_BASE_URL}/certificates/${id}/file`;

export const getQrCodeWithAuth = (id) => {
  const token = localStorage.getItem('token');
  return api.get(`/certificates/${id}/qrcode`, {
    responseType: 'blob',
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Verification
export const verifyCertificate = (data) =>
  api.post('/verify', data);

export const verifyCertificateById = (certificateId) =>
  api.get(`/verify/${certificateId}`);

export const verifyCertificateByFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/verify/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Transactions
export const getTransactions = () =>
  api.get('/transactions');

export const getCertificateTransactions = (certificateId) =>
  api.get(`/transactions/certificate/${certificateId}`);

// Dashboard
export const getDashboardStats = () =>
  api.get('/dashboard/stats');

export default api;
