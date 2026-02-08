import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { CustomInput, CustomButton } from '../../components/CustomComponents';
import { authAPI } from '../../services/api';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await authAPI.forgotPassword(email);
            Alert.alert(
                'Check Your Email',
                'We have sent a password reset link to your email address. Please check your inbox.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('OTP', { email })
                    }
                ]
            );
        } catch (error) {
            console.error('Forgot password error:', error);
            const errorMessage = error.response?.data?.detail || 'Failed to send reset email. Please try again.';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
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
                        <Ionicons name="lock-closed" size={35} color="#333" />
                    </View>

                    {/* Text */}
                    <Text style={styles.heading}>Forgot Password?</Text>
                    <Text style={styles.subText}>
                        No worries! Enter your email address and we'll send you a reset code.
                    </Text>

                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Email Address</Text>
                        <CustomInput
                            placeholder="Enter your email"
                            icon="mail-outline"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Send OTP Button */}
                    <View style={styles.buttonWrapper}>
                        <CustomButton
                            title={loading ? "Sending..." : "Send Reset Code"}
                            onPress={handleSendOTP}
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

                    {/* Back to Login */}
                    <TouchableOpacity
                        style={styles.backToLogin}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Ionicons name="arrow-back" size={16} color="#333" style={{ marginRight: 6 }} />
                        <Text style={styles.backToLoginText}>Back to Login</Text>
                    </TouchableOpacity>

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
    subText: { color: '#555', textAlign: 'center', fontSize: 14, marginBottom: 25, lineHeight: 22, paddingHorizontal: 20 },

    inputWrapper: { width: '100%', marginBottom: 20 },
    label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '500' },

    buttonWrapper: {
        width: '100%',
        marginTop: 10,
    },

    backToLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        padding: 10,
    },
    backToLoginText: { color: '#333', fontSize: 14, fontWeight: '500' },
});
