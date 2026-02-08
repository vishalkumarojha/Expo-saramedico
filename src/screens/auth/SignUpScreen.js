import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomInput, CustomButton } from '../../components/CustomComponents';
import { authAPI, storeTokens } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SPECIALTIES = [
  'Cardiology', 'Pediatrics', 'Dermatology', 'Orthopedics',
  'Neurology', 'Psychiatry', 'General Practice', 'Internal Medicine'
];

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('doctor');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  const [showCustomSpecialty, setShowCustomSpecialty] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState('');

  const handleSignUp = async () => {
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    if (role === 'doctor' && !licenseNumber) {
      Alert.alert('Error', 'License number is required for doctors');
      return;
    }

    if (!isChecked) {
      Alert.alert('Error', 'Please agree to the Terms & Service and Privacy Policy');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(
        email,
        password,
        fullName,
        role,
        phone || null,
        role === 'doctor' ? specialty || null : null,
        role === 'doctor' ? licenseNumber : null
      );

      const { access_token, refresh_token, user } = response.data;
      await storeTokens(access_token, refresh_token, user);

      // Store doctor-specific data locally for immediate access
      if (role === 'doctor') {
        const doctorProfile = {
          specialty: specialty || customSpecialty || 'General Practice',
          license_number: licenseNumber,
          phone: phone || null,
          full_name: fullName,
          email: email
        };
        await AsyncStorage.setItem('doctor_profile', JSON.stringify(doctorProfile));

        // Sync specialty and license to backend via PATCH /doctor/profile
        try {
          const { default: api } = await import('../../services/api');
          await api.patch('/doctor/profile', {
            specialty: specialty || customSpecialty || 'General Practice',
            license_number: licenseNumber
          });
        } catch (syncError) {
          console.log('Profile sync will happen on next login:', syncError.message);
        }
      }

      Alert.alert(
        'Success',
        'Your account has been created successfully!',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Mark as first-time login for doctors
              if (user.role === 'doctor') {
                await AsyncStorage.setItem('doctor_first_login', 'true');
                navigation.replace('DoctorFlow');
              } else if (user.role === 'hospital') {
                navigation.replace('HospitalFlow');
              } else if (user.role === 'patient') {
                navigation.replace('PatientFlow');
              } else {
                navigation.replace('AdminFlow');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Logo Section - Matching Login */}
        <View style={styles.headerCenter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="medkit" size={40} color={COLORS.primary} />
            <Text style={styles.headerTitle}>Saramedico</Text>
          </View>
        </View>

        {/* Tabs: Login / Sign Up */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.inactiveTab}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.inactiveTabText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Role Selector */}
        <View style={styles.dropdownWrapper}>
          <Text style={styles.label}>I am a</Text>
          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={() => setShowRolePicker(!showRolePicker)}
          >
            <Text style={styles.dropdownText}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
            <Ionicons name={showRolePicker ? "chevron-up" : "chevron-down"} size={20} color="#666" />
          </TouchableOpacity>
          {showRolePicker && (
            <View style={styles.dropdownList}>
              {['doctor', 'hospital'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={styles.dropdownItem}
                  onPress={() => { setRole(r); setShowRolePicker(false); }}
                >
                  <Text style={styles.dropdownItemText}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Full Name */}
        <Text style={styles.label}>Full Name *</Text>
        <CustomInput
          placeholder="John Doe"
          icon="person-outline"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Work Email */}
        <Text style={styles.label}>Email *</Text>
        <CustomInput
          placeholder="your.email@example.com"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
        />

        {/* Phone Number */}
        <Text style={styles.label}>Phone</Text>
        <CustomInput
          placeholder="+1 202-555-0111"
          icon="call-outline"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Doctor-Specific Fields */}
        {role === 'doctor' && (
          <>
            <Text style={styles.label}>Medical License Number *</Text>
            <CustomInput
              placeholder="e.g., MD12345678"
              icon="card-outline"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
            />

            {/* Specialty Dropdown */}
            <View style={styles.dropdownWrapper}>
              <Text style={styles.label}>Specialty (Optional)</Text>
              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setShowSpecialtyPicker(!showSpecialtyPicker)}
              >
                <Text style={styles.dropdownText}>
                  {showCustomSpecialty ? customSpecialty : (specialty || 'Select specialty')}
                </Text>
                <Ionicons name={showSpecialtyPicker ? "chevron-up" : "chevron-down"} size={20} color="#666" />
              </TouchableOpacity>
              {showSpecialtyPicker && (
                <View style={styles.dropdownList}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                  >
                    {SPECIALTIES.map((spec) => (
                      <TouchableOpacity
                        key={spec}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSpecialty(spec);
                          setShowSpecialtyPicker(false);
                          setShowCustomSpecialty(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{spec}</Text>
                      </TouchableOpacity>
                    ))}
                    {/* Custom Specialty Option */}
                    <TouchableOpacity
                      style={[styles.dropdownItem, styles.customOption]}
                      onPress={() => {
                        setShowSpecialtyPicker(false);
                        setShowCustomSpecialty(true);
                        setSpecialty('');
                      }}
                    >
                      <Text style={[styles.dropdownItemText, styles.customOptionText]}>
                        I don't see my specialty
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Custom Specialty Input */}
            {showCustomSpecialty && (
              <>
                <Text style={styles.label}>Enter Your Specialty</Text>
                <CustomInput
                  placeholder="e.g., Oncology, Endocrinology"
                  icon="medical-outline"
                  value={customSpecialty}
                  onChangeText={(text) => {
                    setCustomSpecialty(text);
                    setSpecialty(text);
                  }}
                />
              </>
            )}
          </>
        )}

        {/* Password */}
        <Text style={styles.label}>Password *</Text>
        <CustomInput
          placeholder="••••••••••••"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.helperText}>Must be at least 8 characters</Text>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password *</Text>
        <CustomInput
          placeholder="••••••••••••"
          isPassword
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Terms Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsChecked(!isChecked)}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.linkText}>Terms & Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <CustomButton
          title={loading ? "Creating Account..." : "Sign Up"}
          onPress={handleSignUp}
          disabled={loading}
        />

        {loading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  content: { padding: 25, paddingBottom: 40 },

  headerCenter: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#00A3FF', marginLeft: 10 },

  tabContainer: { flexDirection: 'row', backgroundColor: '#F0F2F5', borderRadius: 30, padding: 4, marginBottom: 20 },
  activeTab: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 25, paddingVertical: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  inactiveTab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTabText: { fontWeight: 'bold', color: 'white', fontSize: 16 },
  inactiveTabText: { color: '#666', fontSize: 16 },

  label: { fontSize: 14, color: '#333', marginBottom: 8, marginTop: 10, fontWeight: '500' },
  helperText: { fontSize: 11, color: '#666', marginBottom: 10, marginTop: -10 },

  // Dropdown Styles
  dropdownWrapper: { marginBottom: 5, zIndex: 2000, elevation: 2000, position: 'relative' },
  dropdownTrigger: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', borderWidth: 1, borderColor: '#E8E8E8',
    borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 15,
  },
  dropdownText: { fontSize: 16, color: '#333' },
  dropdownList: {
    position: 'absolute', top: 60, left: 0, right: 0,
    backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: '#eee',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, maxHeight: 250,
  },
  dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 16, color: '#333' },
  customOption: { borderBottomWidth: 0, borderTopWidth: 2, borderTopColor: '#E0E0E0' },
  customOptionText: { color: COLORS.primary, fontWeight: '600' },

  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkboxText: { fontSize: 12, color: '#666', flex: 1 },
  linkText: { color: COLORS.primary, fontWeight: '600' },
});