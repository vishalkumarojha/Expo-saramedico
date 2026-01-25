import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Card, Button, Chip, TextInput } from 'react-native-paper';
import { doctorAPI } from '../../services/api';
import { APPOINTMENT_STATUS } from '../../services/config';
import ErrorHandler from '../../services/errorHandler';

/**
 * Appointment Approval Screen
 * 
 * Allows doctors to review and approve/reject pending appointments
 */
export default function AppointmentApprovalScreen({ navigation }) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        loadPendingAppointments();
    }, []);

    /**
     * Load pending appointments
     */
    const loadPendingAppointments = async () => {
        setLoading(true);
        try {
            const response = await doctorAPI.getAppointments(APPOINTMENT_STATUS.PENDING);
            setAppointments(response.data);
        } catch (error) {
            console.error('Load error:', error);
            const errorInfo = ErrorHandler.handleError(error);
            Alert.alert('Load Failed', errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Approve appointment
     */
    const handleApprove = async (appointment) => {
        Alert.prompt(
            'Approve Appointment',
            'Add notes for the patient (optional):',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Approve',
                    onPress: async (notes) => {
                        setProcessingId(appointment.id);
                        try {
                            const approvalData = {
                                appointment_time: appointment.requested_date,
                                doctor_notes: notes || 'Please bring any relevant medical records.',
                            };

                            const response = await doctorAPI.approveAppointment(
                                appointment.id,
                                approvalData
                            );

                            Alert.alert(
                                'Appointment Approved',
                                `Zoom meeting created!\nJoin URL: ${response.data.join_url}`,
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => loadPendingAppointments(),
                                    },
                                ]
                            );
                        } catch (error) {
                            console.error('Approve error:', error);
                            const errorInfo = ErrorHandler.handleError(error);
                            Alert.alert('Approval Failed', errorInfo.message);
                        } finally {
                            setProcessingId(null);
                        }
                    },
                },
            ],
            'plain-text'
        );
    };

    /**
     * Reject appointment
     */
    const handleReject = async (appointment) => {
        Alert.prompt(
            'Reject Appointment',
            'Reason for rejection (optional):',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: async (reason) => {
                        setProcessingId(appointment.id);
                        try {
                            await doctorAPI.updateAppointmentStatus(
                                appointment.id,
                                APPOINTMENT_STATUS.DECLINED,
                                reason || 'Unable to accommodate at this time.'
                            );

                            Alert.alert('Appointment Rejected', 'The patient has been notified.', [
                                {
                                    text: 'OK',
                                    onPress: () => loadPendingAppointments(),
                                },
                            ]);
                        } catch (error) {
                            console.error('Reject error:', error);
                            const errorInfo = ErrorHandler.handleError(error);
                            Alert.alert('Rejection Failed', errorInfo.message);
                        } finally {
                            setProcessingId(null);
                        }
                    },
                },
            ],
            'plain-text'
        );
    };

    /**
     * View patient documents
     */
    const handleViewDocuments = (appointment) => {
        navigation.navigate('PatientDocuments', { patientId: appointment.patient_id });
    };

    /**
     * Render appointment card
     */
    const renderAppointmentCard = ({ item }) => {
        const isProcessing = processingId === item.id;
        const requestedDate = new Date(item.requested_date);

        return (
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Text style={styles.patientName}>
                            Patient: {item.patient?.full_name || 'Unknown'}
                        </Text>
                        <Chip mode="outlined">{item.status}</Chip>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Requested Date:</Text>
                        <Text style={styles.value}>{requestedDate.toLocaleString()}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Reason:</Text>
                        <Text style={styles.value}>{item.reason}</Text>
                    </View>

                    {item.grant_access_to_history && (
                        <Chip
                            icon="check-circle"
                            mode="flat"
                            style={styles.accessChip}
                            textStyle={styles.accessChipText}
                        >
                            Medical history access granted
                        </Chip>
                    )}

                    <View style={styles.buttonContainer}>
                        <Button
                            mode="outlined"
                            onPress={() => handleViewDocuments(item)}
                            style={styles.button}
                            disabled={isProcessing}
                        >
                            View Documents
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() => handleApprove(item)}
                            style={styles.button}
                            loading={isProcessing}
                            disabled={isProcessing}
                        >
                            Approve
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleReject(item)}
                            style={[styles.button, styles.rejectButton]}
                            disabled={isProcessing}
                            textColor="#d32f2f"
                        >
                            Reject
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading appointments...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={appointments}
                renderItem={renderAppointmentCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                refreshing={loading}
                onRefresh={loadPendingAppointments}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No pending appointments</Text>
                        <Text style={styles.emptySubtext}>
                            You're all caught up!
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    detailRow: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    accessChip: {
        alignSelf: 'flex-start',
        marginVertical: 8,
        backgroundColor: '#e8f5e9',
    },
    accessChipText: {
        color: '#2e7d32',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
    },
    rejectButton: {
        borderColor: '#d32f2f',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 48,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
});
