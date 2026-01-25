/**
 * API Integration Test Utilities
 * 
 * Provides test helpers and mock data for API integration testing
 */

import { authAPI, patientAPI, doctorAPI, aiAPI, storeTokens } from '../services/api';

// ==================== MOCK DATA ====================

export const MOCK_USERS = {
    doctor: {
        email: 'dr.sarah@saramedico.com',
        password: 'Password123!',
        role: 'doctor',
        first_name: 'Sarah',
        last_name: 'Smith',
        organization_name: 'SaraMedico Clinic',
    },
    patient: {
        email: 'rohit.patient@gmail.com',
        password: 'SecurePass123!',
        role: 'patient',
        first_name: 'Rohit',
        last_name: 'Kumar',
        organization_name: 'SaraMedico Clinic',
    },
};

export const MOCK_APPOINTMENT = {
    doctor_id: null, // Will be set during test
    requested_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    reason: 'Chest pain consultation',
    grant_access_to_history: true,
};

export const MOCK_DOCTOR_PROFILE = {
    specialty: 'Cardiology',
    license_number: 'MD-2024-CARDIO-001',
};

export const MOCK_AI_REQUEST = {
    data_payload: {
        file_ids: [],
        notes: 'Patient presenting with chest pain. Please analyze ECG and blood work.',
        analysis_type: 'cardiac_risk_assessment',
    },
    request_type: 'diagnosis_assist',
};

// ==================== TEST HELPERS ====================

/**
 * Test user registration
 */
export const testRegistration = async (userData) => {
    try {
        console.log('Testing registration for:', userData.email);
        const response = await authAPI.register(userData);
        console.log('✓ Registration successful:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('✗ Registration failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Test user login
 */
export const testLogin = async (email, password) => {
    try {
        console.log('Testing login for:', email);
        const response = await authAPI.login(email, password);

        // Store tokens
        await storeTokens(
            response.data.access_token,
            response.data.refresh_token,
            response.data.user
        );

        console.log('✓ Login successful:', response.data.user);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('✗ Login failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Test doctor profile update
 */
export const testDoctorProfileUpdate = async (profileData) => {
    try {
        console.log('Testing doctor profile update');
        const response = await doctorAPI.updateProfile(profileData);
        console.log('✓ Profile update successful:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('✗ Profile update failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Test doctor search
 */
export const testDoctorSearch = async (specialty) => {
    try {
        console.log('Testing doctor search for specialty:', specialty);
        const response = await patientAPI.searchDoctors({ specialty });
        console.log('✓ Doctor search successful. Found:', response.data.results.length, 'doctors');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('✗ Doctor search failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Test appointment request
 */
export const testAppointmentRequest = async (appointmentData) => {
    try {
        console.log('Testing appointment request');
        const response = await patientAPI.requestAppointment(appointmentData);
        console.log('✓ Appointment request successful:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('✗ Appointment request failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Test appointment approval
 */
export const testAppointmentApproval = async (appointmentId, approvalData) => {
    try {
        console.log('Testing appointment approval');
        const response = await doctorAPI.approveAppointment(appointmentId, approvalData);
        console.log('✓ Appointment approval successful. Zoom link:', response.data.join_url);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('✗ Appointment approval failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Test patient documents retrieval
 */
export const testGetPatientDocuments = async (patientId) => {
    try {
        console.log('Testing patient documents retrieval');
        const response = await doctorAPI.getPatientDocuments(patientId);
        console.log('✓ Documents retrieved successfully. Count:', response.data.length);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('✗ Documents retrieval failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Test AI contribution
 */
export const testAIContribution = async (patientId, dataPayload, requestType) => {
    try {
        console.log('Testing AI contribution');
        const response = await aiAPI.contributeToAI(patientId, dataPayload, requestType);
        console.log('✓ AI contribution successful. Queue ID:', response.data.queue_id);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('✗ AI contribution failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

/**
 * Test activity feed
 */
export const testActivityFeed = async () => {
    try {
        console.log('Testing activity feed');
        const response = await doctorAPI.getActivityFeed();
        console.log('✓ Activity feed retrieved successfully. Count:', response.data.length);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('✗ Activity feed retrieval failed:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

// ==================== E2E TEST FLOW ====================

/**
 * Run complete E2E test flow
 * 
 * This follows the API workflow from the documentation:
 * 1. Doctor registration & setup
 * 2. Patient registration
 * 3. Patient uploads medical history (requires file picker in UI)
 * 4. Patient searches for doctor
 * 5. Patient books appointment
 * 6. Doctor approves appointment (generates Zoom link)
 * 7. Doctor views patient documents
 * 8. Doctor submits to AI queue
 * 9. Doctor checks activity feed
 */
export const runE2ETest = async () => {
    console.log('\n========== Starting E2E API Test Flow ==========\n');

    const results = {
        doctorRegistration: null,
        doctorLogin: null,
        doctorProfileUpdate: null,
        patientRegistration: null,
        patientLogin: null,
        doctorSearch: null,
        appointmentRequest: null,
        appointmentApproval: null,
        patientDocuments: null,
        aiContribution: null,
        activityFeed: null,
    };

    // Phase 1: Doctor Setup
    console.log('\n--- Phase 1: Doctor Setup ---\n');
    results.doctorRegistration = await testRegistration(MOCK_USERS.doctor);
    if (!results.doctorRegistration.success) return results;

    results.doctorLogin = await testLogin(MOCK_USERS.doctor.email, MOCK_USERS.doctor.password);
    if (!results.doctorLogin.success) return results;

    const doctorId = results.doctorLogin.data.user.id;

    results.doctorProfileUpdate = await testDoctorProfileUpdate(MOCK_DOCTOR_PROFILE);

    // Phase 2: Patient Setup
    console.log('\n--- Phase 2: Patient Setup ---\n');
    results.patientRegistration = await testRegistration(MOCK_USERS.patient);
    if (!results.patientRegistration.success) return results;

    results.patientLogin = await testLogin(MOCK_USERS.patient.email, MOCK_USERS.patient.password);
    if (!results.patientLogin.success) return results;

    const patientId = results.patientLogin.data.user.id;

    // Phase 3: Discovery & Booking
    console.log('\n--- Phase 3: Discovery & Booking ---\n');
    results.doctorSearch = await testDoctorSearch('Cardiology');

    const appointmentData = {
        ...MOCK_APPOINTMENT,
        doctor_id: doctorId,
    };
    results.appointmentRequest = await testAppointmentRequest(appointmentData);
    const appointmentId = results.appointmentRequest.data?.id;

    // Phase 4: Doctor Workflow (need to login as doctor again)
    console.log('\n--- Phase 4: Doctor Workflow ---\n');
    await testLogin(MOCK_USERS.doctor.email, MOCK_USERS.doctor.password);

    if (appointmentId) {
        results.appointmentApproval = await testAppointmentApproval(appointmentId, {
            appointment_time: MOCK_APPOINTMENT.requested_date,
            doctor_notes: 'Please bring previous cardiac reports if available',
        });

        results.patientDocuments = await testGetPatientDocuments(patientId);

        results.aiContribution = await testAIContribution(
            patientId,
            MOCK_AI_REQUEST.data_payload,
            MOCK_AI_REQUEST.request_type
        );

        results.activityFeed = await testActivityFeed();
    }

    console.log('\n========== E2E Test Flow Complete ==========\n');
    console.log('Results Summary:');
    Object.entries(results).forEach(([key, value]) => {
        console.log(`${key}: ${value?.success ? '✓ PASS' : '✗ FAIL'}`);
    });

    return results;
};

export default {
    testRegistration,
    testLogin,
    testDoctorProfileUpdate,
    testDoctorSearch,
    testAppointmentRequest,
    testAppointmentApproval,
    testGetPatientDocuments,
    testAIContribution,
    testActivityFeed,
    runE2ETest,
};
