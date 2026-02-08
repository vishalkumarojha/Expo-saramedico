import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

/**
 * Reusable Error Message Component
 * Displays error messages with optional retry functionality
 */
export default function ErrorMessage({
    error,
    onRetry,
    title = 'Something went wrong',
    showIcon = true
}) {
    const errorMessage = error?.message || error?.toString() || 'An unexpected error occurred';

    return (
        <View style={styles.container}>
            {showIcon && <Ionicons name="alert-circle" size={64} color="#EF4444" />}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{errorMessage}</Text>
            {onRetry && (
                <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                    <Ionicons name="refresh" size={20} color="#FFFFFF" style={styles.retryIcon} />
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFC',
        padding: 32,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    retryIcon: {
        marginRight: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
