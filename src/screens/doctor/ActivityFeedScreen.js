import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    Linking,
} from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { doctorAPI } from '../../services/api';
import ErrorHandler from '../../services/errorHandler';

/**
 * Activity Feed Screen
 * 
 * Displays recent activity for the doctor (appointments, consultations, team invites)
 */
export default function ActivityFeedScreen({ navigation }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivityFeed();
    }, []);

    /**
     * Load activity feed
     */
    const loadActivityFeed = async () => {
        setLoading(true);
        try {
            const response = await doctorAPI.getActivityFeed();
            setActivities(response.data);
        } catch (error) {
            console.error('Load error:', error);
            const errorInfo = ErrorHandler.handleError(error);
            Alert.alert('Load Failed', errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get activity icon
     */
    const getActivityIcon = (type) => {
        const icons = {
            'Appointment Scheduled': '📅',
            'Appointment Completed': '✅',
            'Consultation Created': '💬',
            'Team Invite Sent': '👥',
            'Document Uploaded': '📄',
            'AI Analysis Complete': '🤖',
        };
        return icons[type] || '📌';
    };

    /**
     * Get status color
     */
    const getStatusColor = (status) => {
        const colors = {
            completed: '#4caf50',
            pending: '#ff9800',
            failed: '#f44336',
            cancelled: '#9e9e9e',
        };
        return colors[status] || '#2196f3';
    };

    /**
     * Handle activity press (e.g., open Zoom link)
     */
    const handleActivityPress = async (activity) => {
        if (activity.extra_data?.zoom_link) {
            try {
                const canOpen = await Linking.canOpenURL(activity.extra_data.zoom_link);
                if (canOpen) {
                    await Linking.openURL(activity.extra_data.zoom_link);
                } else {
                    Alert.alert('Error', 'Cannot open Zoom link');
                }
            } catch (error) {
                console.error('Open link error:', error);
                Alert.alert('Error', 'Failed to open Zoom link');
            }
        }
    };

    /**
     * Render activity card
     */
    const renderActivityCard = ({ item }) => {
        const createdDate = new Date(item.created_at);
        const hasZoomLink = item.extra_data?.zoom_link;

        return (
            <Card
                style={styles.card}
                onPress={() => handleActivityPress(item)}
            >
                <Card.Content>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>{getActivityIcon(item.activity_type)}</Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.activityType}>{item.activity_type}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                            <Text style={styles.timestamp}>
                                {createdDate.toLocaleString()}
                            </Text>
                        </View>
                        <Chip
                            mode="flat"
                            style={[
                                styles.statusChip,
                                { backgroundColor: getStatusColor(item.status) + '20' },
                            ]}
                            textStyle={[
                                styles.statusChipText,
                                { color: getStatusColor(item.status) },
                            ]}
                        >
                            {item.status}
                        </Chip>
                    </View>

                    {hasZoomLink && (
                        <Chip
                            icon="video"
                            mode="outlined"
                            style={styles.zoomChip}
                            textStyle={styles.zoomChipText}
                        >
                            Zoom Meeting Available
                        </Chip>
                    )}

                    {item.extra_data && Object.keys(item.extra_data).length > 1 && (
                        <View style={styles.extraDataContainer}>
                            <Text style={styles.extraDataTitle}>Additional Info:</Text>
                            {Object.entries(item.extra_data).map(([key, value]) => {
                                if (key === 'zoom_link') return null;
                                return (
                                    <Text key={key} style={styles.extraDataText}>
                                        • {key}: {JSON.stringify(value)}
                                    </Text>
                                );
                            })}
                        </View>
                    )}
                </Card.Content>
            </Card>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading activity feed...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={activities}
                renderItem={renderActivityCard}
                keyExtractor={(item, index) => `${item.created_at}-${index}`}
                contentContainerStyle={styles.listContainer}
                refreshing={loading}
                onRefresh={loadActivityFeed}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No recent activity</Text>
                        <Text style={styles.emptySubtext}>
                            Your activity feed will appear here
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
        marginBottom: 12,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
        marginRight: 8,
    },
    activityType: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    statusChip: {
        height: 28,
    },
    statusChipText: {
        fontSize: 12,
        fontWeight: '600',
    },
    zoomChip: {
        alignSelf: 'flex-start',
        marginTop: 12,
        borderColor: '#2196f3',
    },
    zoomChipText: {
        color: '#2196f3',
    },
    extraDataContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
    },
    extraDataTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    extraDataText: {
        fontSize: 11,
        color: '#666',
        lineHeight: 16,
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
