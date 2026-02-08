import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { authAPI, getUserData } from '../../services/api';

export default function DoctorChangePasswordScreen({ navigation }) {
    const [step, setStep] = useState(1); // 1: request OTP, 2: verify OTP, 3: new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState('');

    useEffect(() => {
        // Pre-fill email from user data
        loadUserEmail();
    }, []);

    const loadUserEmail = async () => {
        try {
            const userData = await getUserData();
            if (userData && userData.email) {
                setEmail(userData.email);
            }
        } catch (error) {
            console.log('Could not load user email:', error);
        }
    };

    const handleRequestOTP = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        setLoading(true);
        try {
            // Call backend forgot-password endpoint which sends OTP email
            await authAPI.forgotPassword(email);
            setStep(2);
            Alert.alert('Success', 'Password reset link sent to your email. Please check your inbox for the reset token.');
        } catch (error) {
            console.error('Request OTP error:', error);
            // Always show success to prevent email enumeration
            setStep(2);
            Alert.alert('Check Email', 'If that email exists, a password reset link has been sent.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length < 6) {
            Alert.alert('Error', 'Please enter the reset token from your email');
            return;
        }
        // Store the token for the final step
        setResetToken(otp);
        setStep(3);
    };

    const handleChangePassword = async () => {
        if (!newPassword || newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            // Call reset-password endpoint with token
            await authAPI.resetPassword(resetToken, newPassword);
            Alert.alert('Success', 'Password changed successfully. Please login with your new password.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Change password error:', error);
            Alert.alert('Error', error.response?.data?.detail || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Change Password</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.stepIndicator}>
                    <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
                    <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
                    <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
                    <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
                    <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]} />
                </View>

                {step === 1 && (
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Request Reset Link</Text>
                        <Text style={styles.subtitle}>Enter your registered email to receive password reset link</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Email address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleRequestOTP}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Send Reset Link</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Enter Reset Token</Text>
                        <Text style={styles.subtitle}>Enter the token from the email you received</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Reset token"
                                value={otp}
                                onChangeText={setOtp}
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleVerifyOTP}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Verify Token</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>New Password</Text>
                        <Text style={styles.subtitle}>Enter your new password</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="New password"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Change Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFC' },
    content: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
    stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
    stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#DDD' },
    stepDotActive: { backgroundColor: COLORS.primary },
    stepLine: { width: 40, height: 2, backgroundColor: '#DDD', marginHorizontal: 8 },
    stepLineActive: { backgroundColor: COLORS.primary },
    formContainer: { flex: 1 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 56, borderWidth: 1, borderColor: '#EEE', marginBottom: 16 },
    input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
    button: { backgroundColor: COLORS.primary, borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
