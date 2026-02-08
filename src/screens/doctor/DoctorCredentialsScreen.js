import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { getUserData } from '../../services/api';

export default function DoctorCredentialsScreen({ route, navigation }) {
    const [licenseNumber, setLicenseNumber] = useState(route.params?.licenseNumber || 'Loading...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCredentials();
    }, []);

    const loadCredentials = async () => {
        try {
            const userData = await getUserData();
            if (userData && userData.license_number) {
                setLicenseNumber(userData.license_number);
            } else {
                setLicenseNumber('Not provided');
            }
        } catch (error) {
            console.error('Error loading credentials:', error);
            setLicenseNumber('Not provided');
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
                    <Text style={styles.headerTitle}>Credentials</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="school" size={40} color={COLORS.primary} />
                        </View>
                        <Text style={styles.title}>Medical License Number</Text>
                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <Text style={styles.licenseNumber}>{licenseNumber}</Text>
                        )}
                        <Text style={styles.note}>This was registered during your sign-up process</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Verification Status</Text>
                        <View style={styles.statusRow}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                            <Text style={styles.statusText}>Verified</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFC' },
    content: { flex: 1, padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
    card: { backgroundColor: 'white', borderRadius: 16, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: '#EEE', alignItems: 'center' },
    iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 16, color: '#666', marginBottom: 8 },
    licenseNumber: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    note: { fontSize: 12, color: '#999', textAlign: 'center' },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12, alignSelf: 'flex-start' },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusText: { fontSize: 16, color: '#4CAF50', fontWeight: '600' }
});
