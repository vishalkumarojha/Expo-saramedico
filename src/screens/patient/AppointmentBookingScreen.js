import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput, Card, Checkbox, Avatar } from 'react-native-paper';
import { patientAPI } from '../../services/api';
import ErrorHandler from '../../services/errorHandler';

/**
 * Appointment Booking Screen
 * 
 * Allows patients to book appointments with selected doctor
 */
export default function AppointmentBookingScreen({ route, navigation }) {
    const { doctor } = route.params;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [reason, setReason] = useState('');
    const [grantAccess, setGrantAccess] = useState(false);
    const [loading, setLoading] = useState(false);

    /**
     * Handle date change
     */
    const onDateChange = (event, date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
        }
    };

    /**
     * Handle appointment booking
     */
    const handleBookAppointment = async () => {
        if (!reason.trim()) {
            Alert.alert('Reason Required', 'Please provide a reason for your visit');
            return;
        }

        setLoading(true);

        try {
            const appointmentData = {
                doctor_id: doctor.id,
                requested_date: selectedDate.toISOString(),
                reason: reason.trim(),
                grant_access_to_history: grantAccess,
            };

            const response = await patientAPI.requestAppointment(appointmentData);

            Alert.alert(
                'Appointment Requested',
                `Your appointment request has been sent to Dr. ${doctor.name}. You will be notified once it is approved.`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('PatientDashboard'),
                    },
                ]
            );
        } catch (error) {
            console.error('Booking error:', error);
            const errorInfo = ErrorHandler.handleError(error);
            Alert.alert('Booking Failed', errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        {/* Doctor Info */}
                        <View style={styles.doctorHeader}>
                            <Avatar.Image
                                size={80}
                                source={
                                    doctor.photo_url
                                        ? { uri: doctor.photo_url }
                                        : { uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(doctor.name || 'Doctor') + '&background=random' }
                                }
                            />
                            <View style={styles.doctorInfo}>
                                <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
                                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Appointment Details</Text>

                        {/* Date Picker - Simple Text Input */}
                        <View style={styles.dateContainer}>
                            <Text style={styles.label}>Preferred Date & Time</Text>
                            <TextInput
                                mode="outlined"
                                value={selectedDate.toLocaleString()}
                                editable={false}
                                right={<TextInput.Icon icon="calendar" />}
                                style={styles.input}
                            />
                            <Text style={styles.helperText}>
                                Default: {selectedDate.toLocaleDateString()} at {selectedDate.toLocaleTimeString()}
                            </Text>
                        </View>

                        {/* Reason Input */}
                        <TextInput
                            label="Reason for Visit *"
                            value={reason}
                            onChangeText={setReason}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            style={styles.input}
                            placeholder="e.g., Chest pain consultation, Follow-up visit, etc."
                        />

                        {/* Grant Access Checkbox */}
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={grantAccess ? 'checked' : 'unchecked'}
                                onPress={() => setGrantAccess(!grantAccess)}
                            />
                            <Text style={styles.checkboxLabel}>
                                Grant access to my medical history
                            </Text>
                        </View>
                        <Text style={styles.checkboxInfo}>
                            By checking this box, you allow the doctor to view your uploaded medical
                            documents for this consultation.
                        </Text>

                        {/* Book Button */}
                        <Button
                            mode="contained"
                            onPress={handleBookAppointment}
                            disabled={loading}
                            loading={loading}
                            style={styles.bookButton}
                        >
                            {loading ? 'Requesting...' : 'Request Appointment'}
                        </Button>

                        {/* Info Text */}
                        <Text style={styles.infoText}>
                            Your appointment request will be sent to the doctor for approval. You will
                            receive a notification once the doctor confirms the appointment and provides
                            a meeting link.
                        </Text>
                    </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    card: {
        margin: 16,
    },
    doctorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    doctorInfo: {
        marginLeft: 16,
        flex: 1,
    },
    doctorName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    doctorSpecialty: {
        fontSize: 16,
        color: '#666',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    dateContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    dateButton: {
        justifyContent: 'center',
    },
    input: {
        marginBottom: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkboxLabel: {
        fontSize: 16,
        marginLeft: 8,
    },
    checkboxInfo: {
        fontSize: 12,
        color: '#666',
        marginLeft: 40,
        marginBottom: 24,
        lineHeight: 18,
    },
    bookButton: {
        marginBottom: 16,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 18,
    },
});
