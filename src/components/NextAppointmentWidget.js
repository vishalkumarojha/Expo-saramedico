import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking,
} from 'react-native';
import { Card, Avatar, Chip, Button } from 'react-native-paper';
import { doctorAPI } from '../services/api';
import ErrorHandler from '../services/errorHandler';

/**
 * Next Appointment Widget
 * 
 * Displays the next upcoming appointment on doctor dashboard
 */
export default function NextAppointmentWidget({ navigation }) {
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNextAppointment();
    }, []);

    /**
     * Load next appointment
     */
    const loadNextAppointment = async () => {
        setLoading(true);
        try {
            const response = await doctorAPI.getNextAppointment();
            setAppointment(response.data);
        } catch (error) {
            console.error('Load error:', error);
            // Don't show alert for 404 (no upcoming appointments)
            if (error.response?.status !== 404) {
                const errorInfo = ErrorHandler.handleError(error);
                console.error('Failed to load next appointment:', errorInfo.message);
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Open meeting link
     */
    const handleJoinMeeting = async () => {
        if (!appointment?.meeting_link) {
            Alert.alert('No Meeting Link', 'Meeting link is not available yet');
            return;
        }

        try {
            const canOpen = await Linking.canOpenURL(appointment.meeting_link);
            if (canOpen) {
                await Linking.openURL(appointment.meeting_link);
            } else {
                Alert.alert('Error', 'Cannot open meeting link');
            }
        } catch (error) {
            console.error('Open link error:', error);
            Alert.alert('Error', 'Failed to open meeting link');
        }
    };

    if (loading) {
        return (
            <Card style={styles.card}>
                <Card.Content style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#6200ee" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </Card.Content>
            </Card>
        );
    }

    if (!appointment) {
        return (
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Next Appointment</Text>
                    <Text style={styles.emptyText}>No upcoming appointments</Text>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.title}>Next Appointment</Text>

                <View style={styles.appointmentContainer}>
                    {/* Patient Info */}
                    <View style={styles.patientInfo}>
                        <Avatar.Image
                            size={50}
                            source={
                                appointment.patient_photo
                                    ? { uri: appointment.patient_photo }
                                    : { uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(appointment.patient_name || 'Patient') + '&background=random' }
                            }
                        />
                        <View style={styles.patientDetails}>
                            <Text style={styles.patientName}>{appointment.patient_name}</Text>
                            <Text style={styles.time}>{appointment.time}</Text>
                        </View>
                    </View>

                    {/* Visit Tags */}
                    {appointment.visit_tags && appointment.visit_tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {appointment.visit_tags.map((tag, index) => (
                                <Chip key={index} mode="outlined" style={styles.tag}>
                                    {tag}
                                </Chip>
                            ))}
                        </View>
                    )}

                    {/* Reason */}
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Reason:</Text>
                        <Text style={styles.value}>{appointment.reason}</Text>
                    </View>

                    {/* Last Visit */}
                    {appointment.last_visit && (
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Last Visit:</Text>
                            <Text style={styles.value}>{appointment.last_visit}</Text>
                        </View>
                    )}

                    {/* Meeting Link Button */}
                    <Button
                        mode="contained"
                        onPress={handleJoinMeeting}
                        style={styles.meetingButton}
                        icon="video"
                    >
                        Join Meeting
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 16,
        elevation: 3,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    loadingText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#666',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        paddingVertical: 16,
    },
    appointmentContainer: {
        paddingTop: 8,
    },
    patientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    patientDetails: {
        marginLeft: 12,
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    time: {
        fontSize: 14,
        color: '#666',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tag: {
        marginRight: 8,
        marginBottom: 8,
        height: 28,
    },
    detailRow: {
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        color: '#333',
    },
    meetingButton: {
        marginTop: 16,
    },
});
