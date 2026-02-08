import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomButton } from '../../components/CustomComponents';
import { authAPI } from '../../services/api';

export default function OTPScreen({ navigation, route }) {
  const email = route?.params?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    // Navigate to reset password with the token (OTP code)
    navigation.navigate('ResetPassword', {
      email,
      token: otpCode
    });
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      Alert.alert('Success', 'A new code has been sent to your email');
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header: Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <View style={styles.centerContent}>

          {/* Lock Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="mail" size={35} color="#333" />
          </View>

          {/* Text */}
          <Text style={styles.heading}>Check your Email</Text>
          <Text style={styles.subText}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.boldText}>{email || 'your email'}</Text>
          </Text>
          <Text style={styles.subText}>
            Enter the code below to reset your password.
          </Text>

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => inputRefs.current[index] = ref}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxFilled : null
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Verify Button */}
          <View style={styles.verifyBtnWrapper}>
            <CustomButton
              title={loading ? "Verifying..." : "Verify"}
              onPress={handleVerify}
              disabled={loading}
            />
          </View>

          {/* Resend Code */}
          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResend}
            disabled={!canResend || loading}
          >
            <Ionicons
              name="refresh"
              size={16}
              color={canResend ? COLORS.primary : '#999'}
              style={{ marginRight: 6 }}
            />
            <Text style={[
              styles.resendText,
              canResend && { color: COLORS.primary }
            ]}>
              {canResend ? 'Resend Code' : `Resend code in ${formatTime(resendTimer)}`}
            </Text>
          </TouchableOpacity>

          {loading && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          )}

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4FF' },
  content: { padding: 25, flex: 1 },

  backButton: { marginTop: 10, alignSelf: 'flex-start' },

  centerContent: { alignItems: 'center', marginTop: 50, width: '100%' },

  iconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#D9E9F9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 25,
  },

  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#1A1A1A' },
  subText: { color: '#555', textAlign: 'center', fontSize: 14, marginBottom: 4, lineHeight: 22 },
  boldText: { fontWeight: 'bold', color: '#1A1A1A' },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    marginBottom: 30
  },
  otpBox: {
    width: 48,
    height: 55,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },

  verifyBtnWrapper: {
    width: '100%',
  },

  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    padding: 10,
  },
  resendText: { color: '#666', fontSize: 14, fontWeight: '500' },
});