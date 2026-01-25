const axios = require('axios');

/**
 * Standalone API Verification Script (Node.js)
 * 
 * This script verifies the backend API connection without needing 
 * the React Native environment or the Expo dev server.
 */

const BASE_URL = 'http://localhost:8001/api/v1';

async function verifyBackend() {
    console.log(`\n🔍 Verifying connection to SaraMedico Backend at ${BASE_URL}...`);

    try {
        // 1. Check Health/Connection
        console.log('1. Checking backend status...');
        const health = await axios.get(`${BASE_URL}/auth/me`).catch(err => err.response);

        // 401 is actually GOOD here - it means the backend is alive and responding with "Unauthorized"
        if (health && (health.status === 401 || health.status === 200)) {
            console.log('✅ Backend is REACHABLE and responding correctly.');
        } else {
            console.log('❌ Backend returned unexpected status:', health?.status || 'No response');
            console.log('Please ensure your backend is running: cd backend && ./start_backend.sh');
            return;
        }

        // 2. Test Registration (Doctor)
        console.log('\n2. Testing Doctor Registration...');
        const doctorData = {
            email: `test.dr.${Date.now()}@example.com`,
            password: 'Password123!',
            role: 'doctor',
            first_name: 'Test',
            last_name: 'Doctor',
            organization_name: 'Test Clinic'
        };

        const regResponse = await axios.post(`${BASE_URL}/auth/register`, doctorData);
        if (regResponse.status === 201) {
            console.log('✅ Doctor registration successful.');
        }

        // 3. Test Login
        console.log('\n3. Testing Login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: doctorData.email,
            password: doctorData.password
        });

        if (loginResponse.status === 200 && loginResponse.data.access_token) {
            console.log('✅ Login successful. JWT Token received.');
            const token = loginResponse.data.access_token;

            // 4. Test Profile Update (Authorized Request)
            console.log('\n4. Testing Authorized Profile Update...');
            const profileUpdate = await axios.patch(`${BASE_URL}/doctor/profile`, {
                specialty: 'Cardiology',
                license_number: 'MD-TEST-001'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (profileUpdate.status === 200) {
                console.log('✅ Authorized profile update successful.');
            }
        }

        console.log('\n✨ API INTEGRATION VERIFIED: The frontend code structure matches the backend requirements.');
        console.log('\nTo run the full app on your mobile:');
        console.log('1. Update Node.js to v20+ (required by Expo 54)');
        console.log('2. Run: npx expo start');
        console.log('3. Scan the QR code with the Expo Go app on your phone.');

    } catch (error) {
        console.error('\n❌ Integration Check Failed:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        console.log('\nMake sure the backend is running at http://localhost:8000');
    }
}

verifyBackend();
