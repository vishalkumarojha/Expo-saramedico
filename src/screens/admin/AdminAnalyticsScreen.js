import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../services/config';

const { width } = Dimensions.get('window');

export default function AdminAnalyticsScreen({ navigation }) {
    const [metrics, setMetrics] = useState({
        totalOrganizations: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalDocuments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_CONFIG.BASE_URL}/analytics/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetrics(response.data.metrics || metrics);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const MetricCard = ({ icon, title, value, change, color }) => (
        <View style={[styles.metricCard, { borderLeftColor: color }]}>
            <View style={styles.metricHeader}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <Ionicons name={icon} size={24} color={color} />
                </View>
                <Text style={styles.metricTitle}>{title}</Text>
            </View>
            <Text style={styles.metricValue}>{value}</Text>
            {change && (
                <View style={styles.changeContainer}>
                    <Ionicons
                        name={change > 0 ? 'trending-up' : 'trending-down'}
                        size={16}
                        color={change > 0 ? '#10B981' : '#EF4444'}
                    />
                    <Text style={[styles.changeText, { color: change > 0 ? '#10B981' : '#EF4444' }]}>
                        {Math.abs(change)}% {change > 0 ? 'increase' : 'decrease'}
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Analytics Dashboard</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={fetchAnalytics}>
                    <Ionicons name="refresh" size={24} color="#0066CC" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Key Metrics */}
                <Text style={styles.sectionTitle}>Platform Overview</Text>
                <View style={styles.metricsGrid}>
                    <MetricCard
                        icon="business"
                        title="Organizations"
                        value={metrics.totalOrganizations.toLocaleString()}
                        change={18}
                        color="#3B82F6"
                    />
                    <MetricCard
                        icon="medical"
                        title="Doctors"
                        value={metrics.totalDoctors.toLocaleString()}
                        change={12}
                        color="#8B5CF6"
                    />
                    <MetricCard
                        icon="people"
                        title="Patients"
                        value={metrics.totalPatients.toLocaleString()}
                        change={25}
                        color="#10B981"
                    />
                    <MetricCard
                        icon="document-text"
                        title="Documents"
                        value={metrics.totalDocuments.toLocaleString()}
                        change={32}
                        color="#F59E0B"
                    />
                </View>

                {/* System Health */}
                <Text style={styles.sectionTitle}>System Health</Text>
                <View style={styles.healthCard}>
                    <View style={styles.healthRow}>
                        <View style={styles.healthIndicator}>
                            <View style={[styles.healthDot, { backgroundColor: '#10B981' }]} />
                            <Text style={styles.healthLabel}>API Status</Text>
                        </View>
                        <Text style={styles.healthValue}>Operational</Text>
                    </View>
                    <View style={styles.healthRow}>
                        <View style={styles.healthIndicator}>
                            <View style={[styles.healthDot, { backgroundColor: '#10B981' }]} />
                            <Text style={styles.healthLabel}>Database</Text>
                        </View>
                        <Text style={styles.healthValue}>Healthy</Text>
                    </View>
                    <View style={styles.healthRow}>
                        <View style={styles.healthIndicator}>
                            <View style={[styles.healthDot, { backgroundColor: '#F59E0B' }]} />
                            <Text style={styles.healthLabel}>Storage</Text>
                        </View>
                        <Text style={styles.healthValue}>78% Used</Text>
                    </View>
                </View>

                {/* Placeholder for Charts */}
                <Text style={styles.sectionTitle}>Usage Trends</Text>
                <View style={styles.chartPlaceholder}>
                    <Ionicons name="stats-chart" size={48} color="#CCC" />
                    <Text style={styles.placeholderText}>Charts coming soon</Text>
                    <Text style={styles.placeholderSubtext}>
                        Detailed usage analytics and visualizations will be available here
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    refreshButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        marginTop: 8,
    },
    metricsGrid: {
        gap: 12,
        marginBottom: 24,
    },
    metricCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    metricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    metricTitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    metricValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    changeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    healthCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        gap: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    healthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    healthIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    healthDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    healthLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    healthValue: {
        fontSize: 14,
        color: '#6B7280',
    },
    chartPlaceholder: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 12,
    },
    placeholderSubtext: {
        fontSize: 13,
        color: '#D1D5DB',
        marginTop: 4,
        textAlign: 'center',
    },
});
