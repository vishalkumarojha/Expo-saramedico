import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomInput, CustomButton } from '../../components/CustomComponents';

import { authAPI, storeTokens } from '../../services/api';
import { Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'connected', 'error'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Check backend connection on mount
  React.useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setBackendStatus('checking');
      // Pinging the 'me' endpoint (will return 401 but confirms connectivity)
      await authAPI.getCurrentUser().catch(err => {
        if (err.response) return err.response;
        throw err;
      });
      setBackendStatus('connected');
    } catch (error) {
      if (error.response) {
        // Any response (even 401) means the server is UP
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { access_token, refresh_token, user } = response.data;

      // Store tokens and user data
      await storeTokens(access_token, refresh_token, user);

      console.log('Login successful for role:', user.role);

      // Navigate based on the ACTUAL user role from backend
      if (user.role === 'admin') {
        navigation.replace('AdminFlow');
      } else if (user.role === 'doctor') {
        navigation.replace('DoctorFlow');
      } else if (user.role === 'hospital') {
        navigation.replace('HospitalFlow');
      } else {
        // Default: Patient
        navigation.replace('PatientFlow');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      // TODO: Implement Google OAuth flow
      // For now, show info message
      Alert.alert(
        'Google Login',
        'Google OAuth integration requires:\n\n1. Google OAuth credentials in backend\n2. expo-auth-session or @react-native-google-signin/google-signin\n3. Backend endpoint: POST /api/v1/auth/google\n\nPlease configure these to enable Google login.',
        [
          {
            text: 'OK',
            onPress: () => console.log('Google login info acknowledged'),
          },
        ]
      );
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Error', 'Google login is not configured yet');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      Alert.alert(
        'Apple Login',
        'Apple Sign-In integration requires:\n\n1. Apple Developer account\n2. expo-apple-authentication\n3. Backend endpoint: POST /api/v1/auth/apple\n\nPlease configure these to enable Apple login.',
        [
          {
            text: 'OK',
            onPress: () => console.log('Apple login info acknowledged'),
          },
        ]
      );
    } catch (error) {
      console.error('Apple login error:', error);
      Alert.alert('Error', 'Apple login is not configured yet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Logo Section */}
        <View style={styles.headerCenter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="medkit" size={40} color={COLORS.primary} />
            <Text style={styles.headerTitle}>Saramedico</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inactiveTab}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.inactiveTabText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <Text style={styles.label}>Work Email</Text>
        <CustomInput
          placeholder="dr.name@hospital.org"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <CustomInput
          placeholder="••••••••••••"
          isPassword icon="key-outline"
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={{ alignSelf: 'flex-end', marginBottom: 20, marginTop: 5, padding: 5 }}
        >
          <Text style={styles.forgotPassText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <CustomButton
          title={loading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={loading}
        />

        {/* Social Buttons */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
            <Ionicons name="logo-apple" size={22} color="black" />
            <Text style={styles.socialBtnText}>Continue with Apple ID</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={22} color="black" />
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  content: { padding: 25, flex: 1, justifyContent: 'center' },

  headerCenter: { alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#00A3FF', marginLeft: 10 },

  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: '#F0F2F5', borderRadius: 30, padding: 4, marginBottom: 20 },
  activeTab: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 25, paddingVertical: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  inactiveTab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTabText: { fontWeight: 'bold', color: 'white', fontSize: 16 },
  inactiveTabText: { color: '#666', fontSize: 16 },

  label: { fontSize: 14, color: '#333', marginBottom: 8, marginTop: 10, fontWeight: '500' },

  // Status Indicator
  statusIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, borderWidth: 1, borderColor: '#eee' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 12, color: '#666', fontWeight: '500' },



  // Footer Links & Socials
  forgotPassText: { color: '#444', fontSize: 14 },
  socialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 55, borderRadius: 30, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: 'white', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  socialBtnText: { marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#333' }
});