# Test Account Credentials

## Test Doctors

| Name | Email | Password | Specialty | License |
|------|-------|----------|-----------|---------|
| Dr. Sarah Johnson | sarah.johnson@test.com | Test123! | Cardiology | MD12345 |
| Dr. Michael Chen | michael.chen@test.com | Test123! | Pediatrics | MD12346 |
| Dr. Emily Davis | emily.davis@test.com | Test123! | Dermatology | MD12347 |
| Dr. James Wilson | james.wilson@test.com | Test123! | Orthopedics | MD12348 |
| Dr. Maria Garcia | maria.garcia@test.com | Test123! | Neurology | MD12349 |
| Dr. Robert Taylor | robert.taylor@test.com | Test123! | Psychiatry | MD12350 |

## Test Patients

| Name | Email | Password | MRN | DOB | Gender |
|------|-------|----------|-----|-----|--------|
| John Smith | john.smith@test.com | Test123! | MRN1000 | 1985-03-15 | Male |
| Emma Brown | emma.brown@test.com | Test123! | MRN1001 | 1990-07-22 | Female |
| Michael Jones | michael.jones@test.com | Test123! | MRN1002 | 1978-11-08 | Male |
| Olivia Williams | olivia.williams@test.com | Test123! | MRN1003 | 1995-05-30 | Female |
| Liam Miller | liam.miller@test.com | Test123! | MRN1004 | 1982-09-14 | Male |
| Sophia Davis | sophia.davis@test.com | Test123! | MRN1005 | 1988-12-25 | Female |

## Test Admin

| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin User | admin@test.com | test1234 | admin |

## Test Hospital

| Name | Email | Password | Role |
|------|-------|----------|------|
| City Hospital | hospital@test.com | test1234 | hospital |

## How to Create Test Data

Run the following command from the backend directory:

```bash
python3 create_test_data.py
```

This will create:
- 6 test doctor accounts with specialties
- 6 test patient accounts with patient records
- All accounts use password: `Test123!`
- All accounts are in organization: "Test Medical Center"

## Notes

- All accounts have email verification enabled
- MFA is disabled by default
- Doctors have valid license numbers
- Patients have realistic DOB and demographics
