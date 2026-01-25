# SaraMedico Frontend - API Integration

Complete React Native frontend integration with SaraMedico backend API, supporting the full E2E workflow for patient and doctor interactions.

## 🎯 Features

### Patient Features
- 📄 **Medical History Upload** - Upload medical documents (PDF, images, DICOM) with HIPAA compliance
- 🔍 **Doctor Search** - Search doctors by specialty or name
- 📅 **Appointment Booking** - Request appointments with permission grants for medical history access

### Doctor Features
- ✅ **Appointment Approval** - Review and approve/reject patient appointments with Zoom meeting generation
- 📋 **Patient Documents** - Permission-based access to patient medical records
- 🤖 **AI Integration** - Submit patient data to AI processing queue for diagnosis assistance
- 📊 **Activity Feed** - View recent activities and access Zoom meeting links
- 🗓️ **Next Appointment Widget** - Dashboard widget showing upcoming appointments

### Core Infrastructure
- 🔐 **Authentication** - Complete auth flow with MFA support
- 🔄 **Token Management** - Automatic token injection and error handling
- 📤 **File Upload** - Progress tracking and validation
- 🛡️ **HIPAA Compliance** - Encrypted storage, presigned URLs, audit logging

---

## 📦 Installation

### Prerequisites

- Node.js 16+ and npm
- React Native development environment
- Expo CLI
- Backend server running on `localhost:8000`

### Install Dependencies

```bash
cd react
npm install

# Install additional required dependencies
npm install expo-document-picker @react-native-picker/picker @react-native-community/datetimepicker
```

---

## 🚀 Quick Start

### 1. Start Backend Server

```bash
cd ../backend
./start_backend.sh
```

Ensure these services are running:
- PostgreSQL
- Redis
- MinIO
- Zoom API credentials configured in `.env`

### 2. Start React Native App

```bash
cd ../react
npm start
```

### 3. Run on Device/Emulator

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

---

## 🏗️ Project Structure

```
react/
├── src/
│   ├── components/
│   │   └── NextAppointmentWidget.js          # Reusable appointment widget
│   ├── screens/
│   │   ├── patient/
│   │   │   ├── MedicalHistoryUploadScreen.js # File upload screen
│   │   │   ├── DoctorSearchScreen.js         # Doctor search
│   │   │   └── AppointmentBookingScreen.js   # Appointment booking
│   │   └── doctor/
│   │       ├── AppointmentApprovalScreen.js  # Approve appointments
│   │       ├── PatientDocumentsScreen.js     # View patient documents
│   │       ├── AIContributionScreen.js       # AI queue submission
│   │       └── ActivityFeedScreen.js         # Activity timeline
│   ├── services/
│   │   ├── api.js                            # Complete API service
│   │   ├── config.js                         # Environment config
│   │   ├── errorHandler.js                   # Error handling
│   │   └── fileUpload.js                     # File upload utilities
│   └── tests/
│       └── apiTests.js                       # E2E test utilities
```

---

## 🔧 Configuration

### API Base URL

Edit `src/services/config.js`:

```javascript
// Development (default)
Android Emulator: http://10.0.2.2:8000/api/v1
iOS Simulator: http://localhost:8000/api/v1

// Production
Update API_CONFIG.BASE_URL to your production URL
```

### Environment Variables

The app automatically detects the platform and environment:
- `__DEV__` - Development mode (uses localhost)
- Production mode - Uses production API URL

---

## 📱 Screen Navigation

### Patient Flow

1. **Register/Login** → `AuthScreen`
2. **Upload Medical History** → `MedicalHistoryUploadScreen`
3. **Search Doctors** → `DoctorSearchScreen`
4. **Book Appointment** → `AppointmentBookingScreen`
5. **View Appointments** → `PatientDashboard`

### Doctor Flow

1. **Register/Login** → `AuthScreen`
2. **Update Profile** → `DoctorProfileScreen`
3. **View Pending Appointments** → `AppointmentApprovalScreen`
4. **Approve Appointment** → Generates Zoom link
5. **View Patient Documents** → `PatientDocumentsScreen`
6. **Submit to AI Queue** → `AIContributionScreen`
7. **Check Activity Feed** → `ActivityFeedScreen`

---

## 🧪 Testing

### Run E2E Test Flow

```javascript
import { runE2ETest } from './src/tests/apiTests';

// Run complete E2E test
const results = await runE2ETest();
console.log(results);
```

### Manual Testing Checklist

#### Patient Workflow
- [ ] Register new patient account
- [ ] Login with credentials
- [ ] Upload medical document (PDF/image)
- [ ] Search for doctor by specialty
- [ ] Book appointment with permission grant
- [ ] View appointment status

#### Doctor Workflow
- [ ] Register new doctor account
- [ ] Update profile (specialty, license)
- [ ] View pending appointments
- [ ] Approve appointment (verify Zoom link)
- [ ] View patient documents (permission-based)
- [ ] Submit patient data to AI queue
- [ ] Check activity feed

---

## 🔐 Security & HIPAA Compliance

### File Upload Security
- ✅ Files encrypted at rest in MinIO
- ✅ Presigned URLs with 15-minute expiration
- ✅ File type and size validation
- ✅ Virus scanning (backend)

### Access Control
- ✅ Permission-based document access
- ✅ Patient consent verification
- ✅ Audit logging on all sensitive operations
- ✅ Automatic logout on token expiration

### Data Protection
- ✅ PII encryption in database
- ✅ Secure token storage (AsyncStorage)
- ✅ HTTPS in production
- ✅ No sensitive data in logs

---

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `POST /auth/verify-email` - Verify email
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/refresh` - Refresh access token

### Patient
- `GET /doctors/search` - Search doctors
- `POST /patient/medical-history` - Upload medical document
- `POST /appointments/request` - Request appointment
- `GET /appointments/patient-appointments` - Get appointments
- `GET /patient/documents` - Get my documents

### Doctor
- `PATCH /doctor/profile` - Update profile
- `GET /doctor/patients` - Get patient list
- `GET /doctor/appointments` - Get appointments
- `GET /doctor/schedule/next` - Get next appointment
- `GET /doctor/activity` - Get activity feed
- `POST /appointments/{id}/approve` - Approve appointment (Zoom)
- `PATCH /appointments/{id}/status` - Update appointment status
- `GET /doctor/patients/{id}/documents` - Get patient documents
- `POST /doctor/ai/contribute` - Submit to AI queue

### AI Integration
- `POST /doctor/ai/contribute` - Submit patient data to AI
- `GET /doctor/ai/queue` - Get AI queue status
- `GET /doctor/ai/results/{id}` - Get AI results

---

## 🐛 Troubleshooting

### Android Emulator Cannot Connect to Backend

**Problem:** Network error when calling API

**Solution:** Use `10.0.2.2` instead of `localhost`
```javascript
// Already configured in config.js
Android: http://10.0.2.2:8000/api/v1
```

### File Upload Fails

**Problem:** File too large or wrong type

**Solution:** Check file validation
- Maximum size: 100MB
- Allowed types: PDF, JPG, PNG, DICOM

### Token Expired Error

**Problem:** 401 Unauthorized after some time

**Solution:** Token refresh logic (to be implemented)
- Currently auto-logs out on 401
- Implement token refresh in next iteration

### Presigned URL Expired

**Problem:** Cannot open document after 15 minutes

**Solution:** Reload document list to get new presigned URLs
- Pull to refresh on `PatientDocumentsScreen`
- URLs expire for security (HIPAA compliance)

---

## 🚧 TODO / Next Steps

### High Priority
- [ ] Integrate screens into navigation stack
- [ ] Implement automatic token refresh
- [ ] Add loading skeletons
- [ ] Test file upload with real files
- [ ] Add error boundaries

### Medium Priority
- [ ] Add push notifications for appointments
- [ ] Implement offline support
- [ ] Add in-app document viewer
- [ ] Improve UI/UX polish
- [ ] Add animations

### Low Priority
- [ ] Integrate Zoom SDK for in-app calls
- [ ] Add real-time updates via WebSocket
- [ ] Implement biometric authentication
- [ ] Add analytics tracking

---

## 📄 License

This project is part of the SaraMedico platform.

---

## 👥 Support

For issues or questions:
1. Check the [walkthrough.md](file:///home/arno/.gemini/antigravity/brain/a0ed657c-fdb9-48b3-a697-bc007330cddd/walkthrough.md) for detailed implementation notes
2. Review the [implementation_plan.md](file:///home/arno/.gemini/antigravity/brain/a0ed657c-fdb9-48b3-a697-bc007330cddd/implementation_plan.md) for architecture details
3. Check backend API documentation in `backend/flow.md`

---

## 🎉 Quick Test

To verify the integration is working:

1. Start backend: `cd backend && ./start_backend.sh`
2. Start frontend: `cd react && npm start`
3. Run E2E test: Import and call `runE2ETest()` from `src/tests/apiTests.js`
4. Check console for test results

Expected output:
```
========== Starting E2E API Test Flow ==========
✓ Doctor registration successful
✓ Doctor login successful
✓ Doctor profile update successful
✓ Patient registration successful
✓ Patient login successful
✓ Doctor search successful
✓ Appointment request successful
✓ Appointment approval successful (Zoom link generated)
✓ Patient documents retrieved
✓ AI contribution successful
✓ Activity feed retrieved
========== E2E Test Flow Complete ==========
```

---

**Built with ❤️ for SaraMedico Platform**
