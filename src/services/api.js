import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, TOKEN_CONFIG } from './config';
import ErrorHandler from './errorHandler';
import FileUploadService from './fileUpload';

// Create axios instance with configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor: Add token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorInfo = ErrorHandler.handleError(error);

    // Auto-logout on authentication errors
    if (errorInfo.shouldLogout) {
      await ErrorHandler.handleLogout();
    }

    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION API ====================

export const authAPI = {
  // POST /auth/register - Enhanced to support doctor registration
  register: (email, password, fullName, role, phoneNumber = null, specialty = null, licenseNumber = null) => {
    const [firstName, ...lastNameParts] = fullName.trim().split(' ');
    const lastName = lastNameParts.join(' ') || 'User';

    const payload = {
      email,
      password,
      confirm_password: password, // Backend expects this
      first_name: firstName,
      last_name: lastName,
      role, // 'patient', 'doctor', 'admin', 'hospital'
      phone_number: phoneNumber,
    };

    // Add doctor-specific fields only if role is doctor
    if (role === 'doctor') {
      if (specialty) payload.specialty = specialty;
      if (licenseNumber) payload.license_number = licenseNumber;
    }

    return api.post('/auth/register', payload);
  },

  // POST /auth/login
  login: (email, password) => api.post('/auth/login', { email, password }),

  // GET /auth/me
  getCurrentUser: () => api.get('/auth/me'),

  // POST /auth/verify-email
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),

  // POST /auth/forgot-password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  // POST /auth/reset-password
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', {
    token,
    new_password: newPassword
  }),

  // POST /auth/refresh
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),

  // POST /auth/logout
  logout: async (refreshToken) => {
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      await AsyncStorage.multiRemove([
        TOKEN_CONFIG.ACCESS_TOKEN_KEY,
        TOKEN_CONFIG.REFRESH_TOKEN_KEY,
        TOKEN_CONFIG.USER_DATA_KEY,
      ]);
    }
  },

  // MFA endpoints
  setupMFA: () => api.post('/auth/mfa/setup'),
  verifyMFASetup: (code) => api.post('/auth/mfa/verify-setup', { code }),
  verifyMFA: (sessionId, code) => api.post('/auth/mfa/verify', { session_id: sessionId, code }),
  disableMFA: () => api.post('/auth/mfa/disable'),
};

// ==================== PATIENT API ====================

export const patientAPI = {
  // GET /doctors/search?specialty=...&query=...
  searchDoctors: (params) => api.get('/doctors/search', { params }),

  // POST /patient/medical-history (File Upload)
  uploadMedicalHistory: (file, category, title, description, onProgress) => {
    const formData = FileUploadService.prepareFormData(file, {
      category,
      title,
      description,
    });

    const config = FileUploadService.createUploadConfig(onProgress);

    return api.post('/patient/medical-history', formData, config);
  },

  // GET /appointments (Patient View)
  getMyAppointments: () => api.get('/appointments/patient-appointments'),

  // POST /appointments (Create appointment request)
  requestAppointment: (data) => api.post('/appointments', data),

  // GET /patient/appointments - List all appointments
  getAppointments: () => api.get('/patient/appointments'),

  // GET /patient/appointments/{id} - Get single appointment
  getAppointment: (appointmentId) => api.get(`/patient/appointments/${appointmentId}`),

  // GET /patient/documents
  getMyDocuments: () => api.get('/patient/documents'),

  // DELETE /patient/documents/{id}
  deleteDocument: (documentId) => api.delete(`/patient/documents/${documentId}`),
};

// ==================== DOCTOR API ====================

export const doctorAPI = {
  // PATCH /doctor/profile
  updateProfile: (data) => api.patch('/doctor/profile', data),

  // GET /doctor/patients
  getPatients: () => api.get('/doctor/patients'),

  // GET /doctor/appointments?status=...
  getAppointments: (status) => api.get('/doctor/appointments', {
    params: status ? { status } : {}
  }),

  // GET /doctor/schedule/next
  getNextAppointment: () => api.get('/doctor/schedule/next'),

  // GET /doctor/activity
  getActivityFeed: () => api.get('/doctor/activity'),

  // POST /appointments/{id}/approve (Generates Zoom Link)
  approveAppointment: (id, data) => api.post(`/appointments/${id}/approve`, data),

  // PATCH /appointments/{id}/status (Reject)
  updateAppointmentStatus: (id, status, notes) => api.patch(`/appointments/${id}/status`, {
    status,
    doctor_notes: notes,
  }),

  // GET /doctor/patients/{id}/documents (Requires Permission)
  getPatientDocuments: (patientId) => api.get(`/doctor/patients/${patientId}/documents`),

  // Task Management
  createTask: (data) => api.post('/doctor/tasks', data),
  getTasks: () => api.get('/doctor/tasks'),
  updateTask: (id, data) => api.patch(`/doctor/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/doctor/tasks/${id}`),

  // Doctor Records
  createRecord: (patientId, data) => api.post('/doctor/records', {
    patient_id: patientId,
    ...data
  }),
  getRecords: (patientId) => api.get('/doctor/records', {
    params: { patient_id: patientId }
  }),
  updateRecord: (recordId, data) => api.patch(`/doctor/records/${recordId}`, data),
};

// ==================== CONSULTATION API ====================

export const consultationAPI = {
  // POST /consultations
  createConsultation: (data) => api.post('/consultations', data),

  // GET /consultations/{id}
  getConsultation: (id) => api.get(`/consultations/${id}`),

  // PATCH /consultations/{id}
  updateConsultation: (id, data) => api.patch(`/consultations/${id}`, data),

  // GET /consultations (list)
  getConsultations: (params) => api.get('/consultations', { params }),

  // POST /consultations/{id}/notes
  addConsultationNote: (id, note) => api.post(`/consultations/${id}/notes`, { note }),
};

// ==================== AI INTEGRATION API ====================

export const aiAPI = {
  // POST /doctor/ai/contribute
  contributeToAI: (patientId, dataPayload, requestType = 'diagnosis_assist') =>
    api.post('/doctor/ai/contribute', {
      patient_id: patientId,
      data_payload: dataPayload,
      request_type: requestType,
    }),

  // GET /doctor/ai/queue (if implemented)
  getAIQueue: () => api.get('/doctor/ai/queue'),

  // GET /doctor/ai/results/{queueId} (if implemented)
  getAIResult: (queueId) => api.get(`/doctor/ai/results/${queueId}`),
};

// ==================== ORGANIZATION & TEAM API ====================

export const organizationAPI = {
  // GET /organizations/{id}
  getOrganization: (id) => api.get(`/organizations/${id}`),

  // PATCH /organizations/{id}
  updateOrganization: (id, data) => api.patch(`/organizations/${id}`, data),

  // GET /organizations/{id}/members
  getMembers: (id) => api.get(`/organizations/${id}/members`),
};

export const teamAPI = {
  // POST /team/invite
  inviteTeamMember: (data) => api.post('/team/invite', data),

  // GET /team/invitations
  getInvitations: () => api.get('/team/invitations'),

  // POST /team/invitations/{id}/accept
  acceptInvitation: (id) => api.post(`/team/invitations/${id}/accept`),

  // POST /team/invitations/{id}/decline
  declineInvitation: (id) => api.post(`/team/invitations/${id}/decline`),

  // GET /team/members
  getTeamMembers: () => api.get('/team/members'),

  // DELETE /team/members/{id}
  removeTeamMember: (id) => api.delete(`/team/members/${id}`),
};

// ==================== AUDIT & COMPLIANCE API ====================

export const auditAPI = {
  // GET /audit/logs
  getAuditLogs: (params) => api.get('/audit/logs', { params }),

  // GET /audit/logs/{id}
  getAuditLog: (id) => api.get(`/audit/logs/${id}`),

  // GET /compliance/access-logs
  getAccessLogs: (params) => api.get('/compliance/access-logs', { params }),

  // GET /compliance/reports
  getComplianceReports: (params) => api.get('/compliance/reports', { params }),
};

// ==================== DOCUMENTS API ====================

export const documentsAPI = {
  // GET /documents/{id}
  getDocument: (id) => api.get(`/documents/${id}`),

  // GET /documents/{id}/download (presigned URL)
  getDocumentDownloadUrl: (id) => api.get(`/documents/${id}/download`),

  // DELETE /documents/{id}
  deleteDocument: (id) => api.delete(`/documents/${id}`),

  // PATCH /documents/{id}
  updateDocument: (id, data) => api.patch(`/documents/${id}`, data),
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Store authentication tokens
 */
export const storeTokens = async (accessToken, refreshToken, userData) => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken],
      [TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken || ''],
      [TOKEN_CONFIG.USER_DATA_KEY, JSON.stringify(userData)],
    ]);
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

/**
 * Get stored user data
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(TOKEN_CONFIG.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export default api;