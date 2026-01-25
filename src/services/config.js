import { Platform } from 'react-native';

/**
 * Environment Configuration for SaraMedico App
 * 
 * Manages API base URLs and other environment-specific settings
 */

// Determine the appropriate base URL based on platform
const getBaseUrl = () => {
    // For production, use environment variable or default production URL
    if (__DEV__) {
        // Development mode
        // Your laptop's IP address on the WiFi network: 172.25.251.254
        const LAPTOP_IP = '172.25.251.254';
        const BACKEND_PORT = '8001'; // Change to 8001 if your backend runs on 8001

        if (Platform.OS === 'android') {
            // Android emulator uses 10.0.2.2 to access host machine's localhost
            return `http://10.0.2.2:${BACKEND_PORT}/api/v1`;
        } else {
            // For iOS simulator, web, and REAL DEVICES (Expo Go on phone)
            // Use your laptop's actual IP address
            return `http://${LAPTOP_IP}:${BACKEND_PORT}/api/v1`;
        }
    } else {
        // Production mode - replace with your actual production API URL
        return 'https://api.saramedico.com/api/v1';
    }
};

// API Configuration
export const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    TIMEOUT: 30000, // 30 seconds
    HEADERS: {
        'Content-Type': 'application/json',
    },
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.dicom', '.dcm'],
    CHUNK_SIZE: 1024 * 1024, // 1MB chunks for progress tracking
};

// Token Configuration
export const TOKEN_CONFIG = {
    ACCESS_TOKEN_KEY: 'userToken',
    REFRESH_TOKEN_KEY: 'refreshToken',
    USER_DATA_KEY: 'userData',
};

// Document Categories (matching backend enum)
export const DOCUMENT_CATEGORIES = {
    LAB_REPORT: 'LAB_REPORT',
    PRESCRIPTION: 'PRESCRIPTION',
    IMAGING: 'IMAGING',
    CONSULTATION_NOTES: 'CONSULTATION_NOTES',
    DISCHARGE_SUMMARY: 'DISCHARGE_SUMMARY',
    OTHER: 'OTHER',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// User Roles
export const USER_ROLES = {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    ADMIN: 'admin',
};

// AI Request Types
export const AI_REQUEST_TYPES = {
    DIAGNOSIS_ASSIST: 'diagnosis_assist',
    TREATMENT_RECOMMENDATION: 'treatment_recommendation',
    RISK_ASSESSMENT: 'risk_assessment',
};

export default API_CONFIG;
