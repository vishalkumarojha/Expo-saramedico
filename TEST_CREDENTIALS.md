# Test User Credentials for SaraMedico

## Creating Test Accounts

### Option 1: Using the App (Recommended)

#### Create a Doctor Account
1. Open the app
2. Go to **Sign Up**
3. Select role: **Doctor**
4. Fill in:
   - **Full Name**: Dr. John Smith
   - **Email**: doctor@test.com
   - **Phone**: +1 234-567-8900
   - **License Number**: MD12345678
   - **Specialty**: Cardiology
   - **Password**: test1234
   - **Confirm Password**: test1234
5. Accept terms → **Sign Up**

#### Create a Patient Account
1. **Important**: Log out first if logged in as doctor
2. Go to **Sign Up**
3. Select role: **Patient**
4. Fill in:
   - **Full Name**: Jane Doe
   - **Email**: patient@test.com
   - **Phone**: +1 234-567-8901
   - **Password**: test1234
   - **Confirm Password**: test1234
5. Accept terms → **Sign Up**

---

### Option 2: Using Backend API Directly

If signup in the app fails, create users via backend:

```bash
cd ~/Desktop/Projects/folder/sara_medico/backend

# Create a doctor
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "test1234",
    "confirm_password": "test1234",
    "first_name": "John",
    "last_name": "Smith",
    "role": "doctor",
    "phone_number": "+1234567 8900",
    "specialty": "Cardiology",
    "license_number": "MD12345678"
  }'

# Create a patient
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "test1234",
    "confirm_password": "test1234",
    "first_name": "Jane",
    "last_name": "Doe",
    "role": "patient",
    "phone_number": "+12345678901"
  }'
```

---

## Testing the Complete Flow

### 1. Login as Patient
- **Email**: patient@test.com
- **Password**: test1234

### 2. Book an Appointment
1. After login, go to **Schedule** tab
2. Tap **+** or **Book Appointment**
3. Search for "John" or "Cardiology"
4. Select Dr. John Smith
5. Fill in reason: "Heart checkup"
6. Submit request

### 3. Login as Doctor
**Logout first**, then:
- **Email**: doctor@test.com
- **Password**: test1234

### 4. Approve Appointment
1. Go to **Schedule** screen
2. You should see the pending appointment
3. Tap **Approve**
4. Backend will generate Zoom link

### 5. Test Video Call
**As Doctor**:
- Tap **Start Video Call** button
- Opens Zoom with host controls

**As Patient** (logout and login as patient):
- Refresh schedule
- Tap **Join Call** button
- Opens Zoom meeting

---

## Troubleshooting

### 401 Unauthorized Error
**Cause**: Invalid credentials or email not verified
**Fix**:
- Double-check email and password
- If using backend database directly, set `email_verified=True`

### 422 Validation Error
**Cause**: Missing required fields or wrong format
**Fix**:
- Ensure `confirm_password` matches `password`
- For doctors, include `license_number`
- Phone format: `+1234567890` (no spaces in API calls)

### User Already Exists
**Fix**: Use different email or delete existing user from database

### No Appointments Showing
**Fix**:
- Check if users are in the same organization
- Verify backend logs for errors
- Pull to refresh the schedule screen

---

## Quick Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@test.com | test1234 |
| Doctor | doctor@test.com | test1234 |
| Admin | admin@test.com | test1234 |

**Remember**: These must be created first using one of the methods above!
