import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const calculatePasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '#E0E0E0' };

    let strength = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    // Calculate strength score
    if (checks.length) strength += 1;
    if (checks.uppercase) strength += 1;
    if (checks.lowercase) strength += 1;
    if (checks.number) strength += 1;
    if (checks.special) strength += 1;

    // Determine label and color
    if (strength <= 2) {
        return { strength: 1, label: 'Weak', color: '#FF3B30' };
    } else if (strength <= 3) {
        return { strength: 2, label: 'Medium', color: '#FF9500' };
    } else {
        return { strength: 3, label: 'Strong', color: '#34C759' };
    }
};

export default function PasswordStrengthIndicator({ password }) {
    const { strength, label, color } = calculatePasswordStrength(password);

    if (!password) return null;

    return (
        <View style={styles.container}>
            <View style={styles.barsContainer}>
                {[1, 2, 3].map((level) => (
                    <View
                        key={level}
                        style={[
                            styles.bar,
                            level <= strength && { backgroundColor: color },
                        ]}
                    />
                ))}
            </View>
            <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 10,
    },
    barsContainer: {
        flexDirection: 'row',
        flex: 1,
        gap: 5,
    },
    bar: {
        flex: 1,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 10,
        minWidth: 60,
    },
});
