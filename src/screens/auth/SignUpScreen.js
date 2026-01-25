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
  const [role, setRole] = useState('patient');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);

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

      Alert.alert(
        'Success',
        'Your account has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate based on role
              if (user.role === 'doctor') {
                navigation.replace('DoctorFlow');
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

        {/* Header: Back Button & Progress Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        <Text style={styles.screenTitle}>Saramedico</Text>

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
              {['patient', 'doctor', 'admin', 'hospital'].map((r) => (
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
                <Text style={styles.dropdownText}>{specialty || 'Select specialty'}</Text>
                <Ionicons name={showSpecialtyPicker ? "chevron-up" : "chevron-down"} size={20} color="#666" />
              </TouchableOpacity>
              {showSpecialtyPicker && (
                <View style={styles.dropdownList}>
                  {SPECIALTIES.map((spec) => (
                    <TouchableOpacity
                      key={spec}
                      style={styles.dropdownItem}
                      onPress={() => { setSpecialty(spec); setShowSpecialtyPicker(false); }}
                    >
                      <Text style={styles.dropdownItemText}>{spec}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
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
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20, paddingBottom: 40 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  progressBarBg: { height: 6, width: 100, backgroundColor: '#E0E0E0', borderRadius: 3 },
  progressBarFill: { height: '100%', width: '50%', backgroundColor: COLORS.primary, borderRadius: 3 },

  screenTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },

  tabContainer: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 25, padding: 4, marginBottom: 20 },
  activeTab: { flex: 1, backgroundColor: COLORS.white, borderRadius: 20, paddingVertical: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  inactiveTab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeTabText: { fontWeight: 'bold', color: '#333' },
  inactiveTabText: { color: '#666' },

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
    shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, maxHeight: 200,
  },
  dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 16, color: '#333' },

  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkboxText: { fontSize: 12, color: '#666', flex: 1 },
  linkText: { color: COLORS.primary, fontWeight: '600' },
});