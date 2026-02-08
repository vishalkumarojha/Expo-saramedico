import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomInput, CustomButton } from '../../components/CustomComponents';
import { authAPI } from '../../services/api';

export default function ResetPasswordScreen({ navigation, route }) {
  const token = route?.params?.token || '';
  const email = route?.params?.email || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation states
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const getStrengthLevel = () => {
    let strength = 0;
    if (hasMinLength) strength++;
    if (hasUppercase) strength++;
    if (hasLowercase) strength++;
    if (hasNumber) strength++;
    if (hasSpecial) strength++;
    return strength;
  };

  const handleResetPassword = async () => {
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      Alert.alert('Weak Password', 'Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, newPassword);
      Alert.alert(
        'Password Reset Successful!',
        'Your password has been reset. Please login with your new password.',
        [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to reset password. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = getStrengthLevel();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.headerCenter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="medkit" size={35} color={COLORS.primary} />
            <Text style={styles.headerTitle}>Saramedico</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Create New Password</Text>
        <Text style={styles.pageSubtitle}>
          Your new password must be different from previously used passwords.
        </Text>

        <View style={{ marginTop: 20 }}>
          {/* New Password Input */}
          <Text style={styles.label}>New Password</Text>
          <CustomInput
            placeholder="Enter new password"
            isPassword
            icon="key-outline"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          {/* Strength Bars */}
          <View style={styles.strengthContainer}>
            {[1, 2, 3, 4].map((level) => (
              <View
                key={level}
                style={[
                  styles.strengthBar,
                  { backgroundColor: strengthLevel >= level ? COLORS.success : '#E0E0E0' }
                ]}
              />
            ))}
          </View>

          <Text style={styles.helperTitle}>
            Use 8+ characters with a mix of letters, numbers & symbols.
          </Text>

          {/* Requirements List */}
          <View style={styles.reqList}>
            <ReqItem text="At least 8 characters" valid={hasMinLength} />
            <ReqItem text="One uppercase letter" valid={hasUppercase} />
            <ReqItem text="One lowercase letter" valid={hasLowercase} />
            <ReqItem text="One number" valid={hasNumber} />
            <ReqItem text="One special character (!@#$%)" valid={hasSpecial} />
          </View>

          {/* Confirm Password Input */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.confirmInputWrapper}>
            <CustomInput
              placeholder="Re-enter new password"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {passwordsMatch && (
              <View style={styles.confirmIcon}>
                <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
              </View>
            )}
          </View>

          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}

          {/* Confirm Button */}
          <View style={{ marginTop: 30 }}>
            <CustomButton
              title={loading ? "Resetting..." : "Reset Password"}
              onPress={handleResetPassword}
              disabled={loading}
            />
          </View>

          {loading && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

// Helper Component for the Checklist
const ReqItem = ({ text, valid }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
    <Ionicons
      name={valid ? "checkmark-circle" : "ellipse-outline"}
      size={16}
      color={valid ? COLORS.success : '#CCC'}
    />
    <Text style={[styles.reqText, valid && { color: COLORS.success }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9FF' },
  content: { padding: 25, flexGrow: 1 },

  headerCenter: { alignItems: 'center', marginBottom: 20, marginTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#00A3FF', marginLeft: 10 },

  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center' },
  pageSubtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 8, lineHeight: 20 },

  label: { fontSize: 14, color: '#333', marginBottom: 8, marginTop: 15, fontWeight: '500' },

  // Strength Bars
  strengthContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 12 },
  strengthBar: { height: 4, flex: 1, borderRadius: 2, marginHorizontal: 2 },

  helperTitle: { fontSize: 12, color: '#666', marginBottom: 15 },

  // Checklist
  reqList: { marginBottom: 15 },
  reqText: { fontSize: 13, color: '#999', marginLeft: 8 },

  // Confirm Input Overlay
  confirmInputWrapper: { position: 'relative' },
  confirmIcon: { position: 'absolute', right: 15, top: 15 },

  errorText: { color: '#F44336', fontSize: 12, marginTop: 5 },
});