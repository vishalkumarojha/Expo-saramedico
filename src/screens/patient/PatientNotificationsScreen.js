import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { patientAPI } from '../../services/api';

export default function PatientNotificationsScreen({ navigation }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const appointmentsRes = await patientAPI.getMyAppointments();
            const appointments = appointmentsRes.data || [];

            // Create notifications for approved appointments
            const notifs = appointments
                .filter(apt => apt.status === 'accepted')
                .map(apt => ({
                    id: apt.id,
                    type: 'appointment_approved',
                    title: 'Appointment Approved',
                    message: `Your appointment with Dr. ${apt.doctor?.full_name || 'Doctor'} has been approved`,
                    timestamp: apt.updated_at || apt.created_at,
                    read: false,
                    data: apt
                }));

            setNotifications(notifs);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'appointment_approved':
                return { name: 'checkmark-circle', color: '#4CAF50' };
            case 'appointment_reminder':
                return { name: 'time', color: '#FF9800' };
            case 'message':
                return { name: 'mail', color: '#2196F3' };
            default:
                return { name: 'notifications', color: '#666' };
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="notifications-off-outline" size={60} color="#DDD" />
                    <Text style={styles.emptyText}>No notifications yet</Text>
                    <Text style={styles.emptySubtext}>You'll see updates about your appointments here</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {notifications.map((notif) => {
                        const icon = getNotificationIcon(notif.type);
                        return (
                            <TouchableOpacity
                                key={notif.id}
                                style={[styles.notifCard, !notif.read && styles.unreadCard]}
                                onPress={() => {
                                    if (notif.type === 'appointment_approved') {
                                        navigation.navigate('ScheduleScreen');
                                    }
                                }}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
                                    <Ionicons name={icon.name} size={24} color={icon.color} />
                                </View>
                                <View style={styles.notifContent}>
                                    <Text style={styles.notifTitle}>{notif.title}</Text>
                                    <Text style={styles.notifMessage}>{notif.message}</Text>
                                    <Text style={styles.notifTime}>{formatTime(notif.timestamp)}</Text>
                                </View>
                                {!notif.read && <View style={styles.unreadDot} />}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFC' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyText: { fontSize: 16, fontWeight: '600', color: '#666', marginTop: 15 },
    emptySubtext: { fontSize: 13, color: '#999', marginTop: 5, textAlign: 'center' },
    scrollView: { flex: 1 },
    notifCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        marginHorizontal: 15,
        marginTop: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2
    },
    unreadCard: {
        backgroundColor: '#F5F9FF',
        borderColor: COLORS.primary + '20'
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    notifContent: { flex: 1 },
    notifTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    notifMessage: { fontSize: 13, color: '#666', marginBottom: 6 },
    notifTime: { fontSize: 11, color: '#999' },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        position: 'absolute',
        top: 18,
        right: 15
    }
});
