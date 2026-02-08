import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

/**
 * Reusable Loading Spinner Component
 * Displays a centered loading indicator with optional message
 */
export default function LoadingSpinner({ message = 'Loading...', size = 'large', color = COLORS.primary }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFC',
        padding: 20,
    },
    message: {
        marginTop: 16,
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
});
